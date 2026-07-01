import { useState, useCallback, useEffect } from 'react'
import { Download, Loader2, RefreshCw } from 'lucide-react'
import { FileUpload } from '../FileUpload'
import { denoiseAudio } from '#/lib/denoiseAudio'

export const Denoiser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [originalFileName, setOriginalFileName] = useState<string>('audio')

  // Nettoyage de l'URL objet pour éviter les fuites de mémoire
  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [resultUrl])

  const processFile = useCallback(async (file: File) => {
    // Limite optionnelle de 25MB (comme sur ta fonction de transcription)
    if (file.size > 25 * 1024 * 1024) {
      setError('File is too large (max 25MB).')
      return
    }

    setIsLoading(true)
    setError(null)
    setResultUrl(null)

    // Garder le nom d'origine sans l'extension pour le fichier final
    const nameWithoutExt =
      file.name.substring(0, file.name.lastIndexOf('.')) || 'audio'
    setOriginalFileName(nameWithoutExt)

    try {
      // 1. Convertir le fichier en Base64 (même logique que dans ton index.tsx)
      const arrayBuffer = await file.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      let binary = ''
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      const base64 = btoa(binary)

      // 2. Envoyer à l'API DeepFilterNet via le serverFn
      const result = await denoiseAudio({
        data: {
          audioBase64: base64,
          mimeType: file.type || 'audio/webm',
        },
      })

      // 3. Reconvertir le Base64 de la réponse en Blob
      const binaryResponse = atob(result.audioBase64)
      const arrayResponse = new Uint8Array(binaryResponse.length)
      for (let i = 0; i < binaryResponse.length; i++) {
        arrayResponse[i] = binaryResponse.charCodeAt(i)
      }

      const audioBlob = new Blob([arrayResponse], { type: result.mimeType })

      // 4. Créer une URL lisible/téléchargeable pour le navigateur
      const url = URL.createObjectURL(audioBlob)
      setResultUrl(url)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Denoising failed. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleDownload = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl
    // MODIFIÉ ICI : L'extension est maintenant .mp3
    a.download = `${originalFileName}_denoised.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const reset = () => {
    setResultUrl(null)
    setError(null)
  }

  return (
    <section className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-8 p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Remove Background Noise</h2>
        <p className="text-gray-500">
          Upload an audio file and let our AI clean up the background noise
          instantly.
        </p>
      </div>

      {!isLoading && !resultUrl && (
        <div className="w-full">
          <FileUpload onFileSelected={processFile} disabled={isLoading} />
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
          <p className="text-lg font-medium animate-pulse">
            DeepFilterNet is cleaning your audio...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This might take a few moments depending on the file length.
          </p>
        </div>
      )}

      {resultUrl && !isLoading && (
        <div className="w-full flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-xl font-semibold mb-6">Audio Cleaned! ✨</h3>

          <audio src={resultUrl} controls className="w-full mb-8" />

          <div className="flex gap-4">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={18} />
              Process another
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-md"
            >
              <Download size={18} />
              Download Result
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
