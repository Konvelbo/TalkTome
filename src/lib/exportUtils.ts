import { jsPDF } from 'jspdf'
import { Document, Paragraph, TextRun, Packer } from 'docx'
import pkg from 'file-saver'
const { saveAs } = pkg

function downloadText(content: string, filename: string, mime: string) {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

export function exportTxt(text: string, filename = 'transcription.txt') {
    downloadText(text, filename, 'text/plain;charset=utf-8')
}

export function exportPdf(text: string, filename = 'transcription.pdf') {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const margin = 20
    const maxWidth = 210 - margin * 2
    const lineHeight = 8
    let y = margin

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)

    const lines = doc.splitTextToSize(text, maxWidth) as string[]
    for (const line of lines) {
        if (y + lineHeight > 297 - margin) {
            doc.addPage()
            y = margin
        }
        doc.text(line, margin, y)
        y += lineHeight
    }

    doc.save(filename)
}

export async function exportDocx(text: string, filename = 'transcription.docx') {
    const doc = new Document({
        sections: [
            {
                children: text.split('\n').map(
                    (line) =>
                        new Paragraph({
                            children: [new TextRun({ text: line, size: 24, font: 'Calibri' })],
                            spacing: { after: 200 },
                        }),
                ),
            },
        ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, filename)
}
