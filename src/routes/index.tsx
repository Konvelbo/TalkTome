import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useEffect, useRef } from 'react'
import { useMutation as useConvexMutation, useConvexAuth } from 'convex/react'
import { api } from '../../convex/_generated/api'

import { NavBar } from '../components/NavBar'
import { RecordButton } from '../components/RecordButton'
import { FileUpload } from '../components/FileUpload'
import { LanguageSelector } from '../components/LanguageSelector'
import { TranscriptionCard } from '../components/TranscriptionCard'
import { AdBanner } from '../components/AdBanner'
import { AboutSection } from '../components/AboutSection'
import { AuthModal } from '../components/AuthModal'

import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { transcribeAudio } from '../lib/transcribeAudio'
import { SpreeshToText } from '#/components/heroSectionComps/spreeshToText'
import { Denoiser } from '#/components/heroSectionComps/Denoiser'

export const Route = createFileRoute('/')({ component: Home })

// Formats accepted by Groq's whisper-large-v3 endpoint
const ACCEPTED_EXTENSIONS = [
  '.flac',
  '.mp3',
  '.mp4',
  '.mpeg',
  '.mpga',
  '.m4a',
  '.ogg',
  '.wav',
  '.webm',
]
const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB — Groq's direct-upload limit

function Home() {
  const recorder = useAudioRecorder()

  const [language, setLanguage] = useLocalStorage('ttm_language', 'auto')
  const [transcription, setTranscription] = useLocalStorage(
    'ttm_last_transcription',
    '',
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const processedBlobRef = useRef<Blob | null>(null)
  const [countRecord, setCountRecord] = useState<number>(0)
  const [showUploadinput, setShowUploadinput] = useState<boolean>(true)
  const [featureShoice, setFeatureShoice] = useState<string>('spreeshToText')

  const { isAuthenticated } = useConvexAuth()

  const saveTranscription = useConvexMutation(api.transcriptions.save)

  // Shared logic: send any audio Blob (from the mic or from a file) to the
  // transcription server function.
  const processBlob = useCallback(
    async (blob: Blob) => {
      setIsLoading(true)
      setError(null)

      try {
        const arrayBuffer = await blob.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        const base64 = btoa(binary)

        const result = await transcribeAudio({
          data: {
            audioBase64: base64,
            mimeType: blob.type || 'audio/webm',
            language: language === 'auto' ? undefined : language,
          },
        })

        const text = result.text.trim()
        setTranscription(text)

        if (text) {
          saveTranscription({
            text,
            language: language === 'auto' ? undefined : language,
          }).catch(console.error)
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Transcription failed. Please try again.',
        )
      } finally {
        setIsLoading(false)
      }
    },
    [language, saveTranscription, setTranscription],
  )

  // Trigger transcription when a new audioBlob is produced by the recorder
  useEffect(() => {
    if (!recorder.audioBlob || recorder.audioBlob === processedBlobRef.current)
      return
    processedBlobRef.current = recorder.audioBlob
    processBlob(recorder.audioBlob)
  }, [recorder.audioBlob, processBlob])

  // Anonymous-user usage gate, shared between recording and file upload
  const checkUsageAllowed = useCallback(() => {
    const blocked = !isAuthenticated && countRecord >= 4
    setCountRecord((i) => i + 1)
    if (blocked) {
      setShowAuth(true)
      return false
    }
    return true
  }, [isAuthenticated, countRecord])

  const handleStart = useCallback(async () => {
    if (!checkUsageAllowed()) return
    setShowUploadinput(false)
    processedBlobRef.current = null
    setTranscription('')
    setError(null)
    await recorder.start()
  }, [checkUsageAllowed, recorder, setTranscription])

  const handleStop = useCallback(() => {
    recorder.stop()
  }, [recorder])

  const handleClear = useCallback(() => {
    setTranscription('')
    recorder.reset()
    setError(null)
    processedBlobRef.current = null
  }, [recorder, setTranscription])

  const handleFileSelected = useCallback(
    (file: File) => {
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
      const looksLikeAudio =
        ACCEPTED_EXTENSIONS.includes(ext) ||
        file.type.startsWith('audio/') ||
        file.type.startsWith('video/')

      if (!looksLikeAudio) {
        setError(
          'Unsupported file format. Use mp3, wav, m4a, ogg, flac, or webm.',
        )
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('File is too large (max 25MB).')
        return
      }
      if (!checkUsageAllowed()) return

      processedBlobRef.current = null
      recorder.reset()
      setError(null)
      processBlob(file)
    },
    [checkUsageAllowed, processBlob, recorder],
  )

  return (
    <div className="page">
      <NavBar
        onLoginClick={() => setShowAuth(true)}
        setFeatureShoice={setFeatureShoice}
      />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <main className="main">
        {/* Hero
          language,
          setLanguage,
          recorder,
          isLoading,
          handleFileSelected,
          showUploadinput,
          error,
          */}

        {featureShoice == 'spreeshToText' && (
          <SpreeshToText
            language={language}
            setLanguage={setLanguage}
            recorder={recorder}
            isLoading={isLoading}
            handleFileSelected={handleFileSelected}
            showUploadinput={showUploadinput}
            error={error}
            handleStop={handleStop}
            handleStart={handleStart}
          />
        )}

        {featureShoice == 'denoiser' && <Denoiser />}

        {/* Ad displayed while loading (good impression slot) */}
        {isLoading && (
          <div className="ad-slot">
            <AdBanner variant="loading" />
          </div>
        )}

        {/* Results */}
        {transcription && !isLoading && (
          <section className="results">
            <TranscriptionCard
              text={transcription}
              language={language !== 'auto' ? language : undefined}
              onClear={handleClear}
            />
          </section>
        )}
        <section className="mt-8 mb-4 w-full">
          <AdBanner variant="footer" />
        </section>
      </main>

      <AboutSection />
    </div>
  )
}
