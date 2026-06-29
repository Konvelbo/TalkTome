import { createServerFn } from '@tanstack/react-start'
import Groq from 'groq-sdk'

export const transcribeAudio = createServerFn({ method: 'POST' })
    .validator(
        (data: unknown) => data as { audioBase64: string; mimeType: string; language?: string },
    )
    .handler(async ({ data }) => {
        const apiKey = process.env.GROQ_API_KEY
        if (!apiKey) throw new Error('GROQ_API_KEY is not set')

        const groq = new Groq({ apiKey })

        // Convert base64 to Buffer then to File
        const buffer = Buffer.from(data.audioBase64, 'base64')
        const blob = new Blob([buffer], { type: data.mimeType || 'audio/webm' })
        const file = new File([blob], 'audio.webm', { type: data.mimeType || 'audio/webm' })

        const params: Parameters<typeof groq.audio.transcriptions.create>[0] = {
            file,
            model: 'whisper-large-v3',
            response_format: 'json',
        }

        if (data.language && data.language !== 'auto') {
            params.language = data.language
        }

        const result = await groq.audio.transcriptions.create(params)
        return { text: result.text }
    })
