import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { ExportButtons } from './ExportButtons'

interface TranscriptionCardProps {
    text: string
    language?: string
    onClear: () => void
    // Future TTS hook point: add onSpeak prop here
}

export function TranscriptionCard({ text, language, onClear }: TranscriptionCardProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="transcription-card">
            <div className="card-header">
                <div className="card-meta">
                    <span className="card-title">Transcription</span>
                    {language && language !== 'auto' && (
                        <span className="card-lang-badge">{language.toUpperCase()}</span>
                    )}
                </div>
                <div className="card-actions">
                    <button className="btn-ghost btn-sm" onClick={handleCopy} title="Copy text">
                        {copied ? <Check size={15} /> : <Copy size={15} />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button className="btn-ghost btn-sm danger" onClick={onClear} title="Clear">
                        Clear
                    </button>
                </div>
            </div>

            <p className="card-text">{text}</p>

            {/* TTS slot: future <SpeakButton text={text} /> here */}

            <ExportButtons text={text} />
        </div>
    )
}
