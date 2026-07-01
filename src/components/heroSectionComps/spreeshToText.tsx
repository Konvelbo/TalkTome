import type { AudioRecorderState } from '#/hooks/useAudioRecorder'
import { FileUpload } from '../FileUpload'
import { LanguageSelector } from '../LanguageSelector'
import { RecordButton } from '../RecordButton'

interface SpreeshToTextType {
  language: string
  setLanguage: (value: string | ((val: string) => string)) => void
  recorder: AudioRecorderState
  isLoading: boolean
  handleFileSelected: (file: File) => void
  showUploadinput: boolean
  error: string | null
  handleStop: () => void
  handleStart: () => void
}

export const SpreeshToText = ({
  language,
  setLanguage,
  recorder,
  isLoading,
  handleFileSelected,
  showUploadinput,
  error,
  handleStart,
  handleStop,
}: SpreeshToTextType) => {
  return (
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

          <div className="hero-divider">
            <span>or</span>
          </div>

          <FileUpload
            disabled={recorder.isRecording || isLoading}
            onFileSelected={handleFileSelected}
            showUploadinput={showUploadinput}
          />
        </div>

        {(recorder.error || error) && (
          <p className="error-msg" role="alert">
            {error || recorder.error}
          </p>
        )}
      </div>
    </section>
  )
}
