import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'

interface FileUploadProps {
  onFileSelected: (file: File) => void
  disabled?: boolean
  showUploadinput?: boolean
}

export function FileUpload({
  onFileSelected,
  disabled,
  showUploadinput,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (file) onFileSelected(file)
  }

  return (
    <div
      className={`file-upload-wrapper ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        if (!disabled) handleFiles(e.dataTransfer.files)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*,video/*,.flac,.mp3,.mp4,.mpeg,.mpga,.m4a,.ogg,.wav,.webm"
        className="file-upload-input"
        placeholder=""
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
        disabled={showUploadinput}
      />

      <button
        type="button"
        className="file-upload-btn"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Upload an audio file or drag and drop a file here
        <Upload size={16} strokeWidth={2.5} />
      </button>
    </div>
  )
}
