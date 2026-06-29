import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, useEffect, useRef } from 'react'
import { useMutation as useConvexMutation, useConvexAuth } from 'convex/react'
import { api } from '../../convex/_generated/api'

import { NavBar } from '../components/NavBar'
import { RecordButton } from '../components/RecordButton'
import { LanguageSelector } from '../components/LanguageSelector'
import { TranscriptionCard } from '../components/TranscriptionCard'
import { AdBanner } from '../components/AdBanner'
import { AboutSection } from '../components/AboutSection'
import { AuthModal } from '../components/AuthModal'

import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { transcribeAudio } from '../lib/transcribeAudio'

export const Route = createFileRoute('/')({ component: Home })

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

  const { isAuthenticated } = useConvexAuth()

  const saveTranscription = useConvexMutation(api.transcriptions.save)

  // Trigger transcription when a new audioBlob is produced
  useEffect(() => {
    if (!recorder.audioBlob || recorder.audioBlob === processedBlobRef.current)
      return
    processedBlobRef.current = recorder.audioBlob

    const blob = recorder.audioBlob
    setIsLoading(true)
    setError(null)

    const run = async () => {
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

        const text = result.text?.trim() ?? ''
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
    }

    run()
  }, [recorder.audioBlob])

  const handleStart = useCallback(async () => {
    processedBlobRef.current = null
    setTranscription('')
    setError(null)
    await recorder.start()
  }, [recorder, setTranscription])

  const handleStop = useCallback(() => {
    recorder.stop()
  }, [recorder])

  const handleClear = useCallback(() => {
    setTranscription('')
    recorder.reset()
    setError(null)
    processedBlobRef.current = null
  }, [recorder, setTranscription])

  if (!isAuthenticated) {
    return <AuthModal onClose={() => setShowAuth(false)} />
  }

  return (
    <div className="page">
      <NavBar onLoginClick={() => setShowAuth(true)} />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <main className="main">
        {/* Hero */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Speak. Transcribe. Export.</h1>
            <p className="hero-subtitle">
              Convert your voice into text instantly — in any language.
            </p>

            <div className="hero-controls">
              <LanguageSelector
                value={language}
                onChange={setLanguage}
                disabled={recorder.isRecording || isLoading}
              />

              <RecordButton
                isRecording={recorder.isRecording}
                isLoading={isLoading}
                duration={recorder.duration}
                onStart={handleStart}
                onStop={handleStop}
              />
            </div>

            {(recorder.error || error) && (
              <p className="error-msg" role="alert">
                {recorder.error ?? error}
              </p>
            )}
          </div>
        </section>

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
      </main>

      <AboutSection />
    </div>
  )
}
