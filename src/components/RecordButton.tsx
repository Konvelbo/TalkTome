import { Mic, Square } from 'lucide-react'

interface RecordButtonProps {
  isRecording: boolean
  isLoading: boolean
  duration: number
  onStart: () => void
  onStop: () => void
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function RecordButton({
  isRecording,
  isLoading,
  duration,
  onStart,
  onStop,
}: RecordButtonProps) {
  return (
    <div className="record-wrapper">
      <button
        className={`record-btn ${isRecording ? 'recording' : ''} ${isLoading ? 'loading' : ''}`}
        onClick={isRecording ? onStop : onStart}
        disabled={isLoading}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        aria-pressed={isRecording}
      >
        {isLoading ? (
          <span className="record-spinner" />
        ) : isRecording ? (
          <Square size={28} strokeWidth={2.5} />
        ) : (
          <Mic size={28} strokeWidth={2.5} />
        )}

        {isRecording && <span className="record-pulse" />}
      </button>

      <p className="record-label">
        {isLoading
          ? 'Transcribing…'
          : isRecording
            ? `Recording ${formatDuration(duration)}`
            : 'Tap to record'}
      </p>
    </div>
  )
}
