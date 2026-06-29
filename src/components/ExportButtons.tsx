import { useState } from 'react'
import { FileText, FileDown, FileType } from 'lucide-react'
import { exportTxt, exportPdf, exportDocx } from '../lib/exportUtils'

interface ExportButtonsProps {
    text: string
}

export function ExportButtons({ text }: ExportButtonsProps) {
    const [loading, setLoading] = useState<string | null>(null)

    const handle = async (format: string, fn: () => Promise<void> | void) => {
        setLoading(format)
        try {
            await fn()
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="export-buttons">
            <span className="export-label">Export as</span>

            <button
                className="btn-export"
                disabled={!!loading}
                onClick={() => handle('txt', () => exportTxt(text))}
            >
                <FileText size={14} />
                {loading === 'txt' ? '…' : 'TXT'}
            </button>

            <button
                className="btn-export"
                disabled={!!loading}
                onClick={() => handle('pdf', () => exportPdf(text))}
            >
                <FileDown size={14} />
                {loading === 'pdf' ? '…' : 'PDF'}
            </button>

            <button
                className="btn-export"
                disabled={!!loading}
                onClick={() => handle('docx', () => exportDocx(text))}
            >
                <FileType size={14} />
                {loading === 'docx' ? '…' : 'DOCX'}
            </button>
        </div>
    )
}
