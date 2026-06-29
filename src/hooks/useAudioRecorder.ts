import { useState, useRef, useCallback } from 'react'

export type AudioRecorderState = {
    isRecording: boolean
    audioBlob: Blob | null
    error: string | null
    duration: number
    start: () => Promise<void>
    stop: () => void
    reset: () => void
}

export function useAudioRecorder(): AudioRecorderState {
    const [isRecording, setIsRecording] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [duration, setDuration] = useState(0)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const start = useCallback(async () => {
        try {
            setError(null)
            setAudioBlob(null)
            setDuration(0)
            chunksRef.current = []

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : MediaRecorder.isTypeSupported('audio/webm')
                    ? 'audio/webm'
                    : 'audio/mp4'

            const recorder = new MediaRecorder(stream, { mimeType })
            mediaRecorderRef.current = recorder

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType })
                setAudioBlob(blob)
                stream.getTracks().forEach((t) => t.stop())
                if (timerRef.current) clearInterval(timerRef.current)
            }

            recorder.start(250)
            setIsRecording(true)

            timerRef.current = setInterval(() => {
                setDuration((d) => d + 1)
            }, 1000)
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Microphone access denied'
            setError(msg)
        }
    }, [])

    const stop = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }, [isRecording])

    const reset = useCallback(() => {
        setAudioBlob(null)
        setError(null)
        setDuration(0)
    }, [])

    return { isRecording, audioBlob, error, duration, start, stop, reset }
}
