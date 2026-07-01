import { createServerFn } from '@tanstack/react-start'

// Maps a few common input mime types to a file extension. Not load-bearing —
// ffmpeg on the DeepFilterNet API side auto-detects the format from the
// file's content, the extension is just a hint.
function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    'audio/webm': '.webm',
    'audio/mp4': '.mp4',
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'audio/x-wav': '.wav',
    'audio/ogg': '.ogg',
    'audio/flac': '.flac',
    'audio/m4a': '.m4a',
  }
  return map[mime] ?? ''
}

export const denoiseAudio = createServerFn({ method: 'POST' })
  .validator(
    (data: unknown) => data as { audioBase64: string; mimeType: string },
  )
  .handler(async ({ data }) => {
    const apiUrl = process.env.DEEPFILTER_API_URL
    if (!apiUrl) throw new Error('DEEPFILTER_API_URL is not set')

    const buffer = Buffer.from(data.audioBase64, 'base64')
    const mimeType = data.mimeType || 'audio/webm'
    const blob = new Blob([buffer], { type: mimeType })
    const file = new File([blob], `audio${extFromMime(mimeType)}`, {
      type: mimeType,
    })

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${apiUrl}/enhance`, {
      method: 'POST',
      body: formData,
      // Denoising a few minutes of audio on CPU can take a little while —
      // don't let the default fetch timeout cut it off.
      signal: AbortSignal.timeout(60_000),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new Error(
        `Denoising service error (${response.status}): ${detail.slice(0, 200)}`,
      )
    }

    const cleanedBuffer = Buffer.from(await response.arrayBuffer())
    return {
      audioBase64: cleanedBuffer.toString('base64'),
      mimeType: 'audio/mpeg', // MODIFIÉ ICI : 'audio/wav' devient 'audio/mpeg'
    }
  })
