import { Globe } from 'lucide-react'

export const LANGUAGES = [
    { code: 'auto', label: 'Auto-detect' },
    { code: 'af', label: 'Afrikaans' },
    { code: 'ar', label: 'Arabic (عربي)' },
    { code: 'zh', label: 'Chinese (中文)' },
    { code: 'nl', label: 'Dutch' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'French (Français)' },
    { code: 'de', label: 'German (Deutsch)' },
    { code: 'el', label: 'Greek' },
    { code: 'hi', label: 'Hindi (हिन्दी)' },
    { code: 'id', label: 'Indonesian' },
    { code: 'it', label: 'Italian (Italiano)' },
    { code: 'ja', label: 'Japanese (日本語)' },
    { code: 'ko', label: 'Korean (한국어)' },
    { code: 'ms', label: 'Malay' },
    { code: 'fa', label: 'Persian (فارسی)' },
    { code: 'pl', label: 'Polish' },
    { code: 'pt', label: 'Portuguese (Português)' },
    { code: 'ru', label: 'Russian (Русский)' },
    { code: 'es', label: 'Spanish (Español)' },
    { code: 'sv', label: 'Swedish' },
    { code: 'tr', label: 'Turkish (Türkçe)' },
    { code: 'uk', label: 'Ukrainian' },
    { code: 'ur', label: 'Urdu (اردو)' },
    { code: 'vi', label: 'Vietnamese' },
]

interface LanguageSelectorProps {
    value: string
    onChange: (lang: string) => void
    disabled?: boolean
}

export function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
    const selected = LANGUAGES.find((l) => l.code === value) ?? LANGUAGES[0]

    return (
        <div className="language-selector-wrapper">
            <Globe size={15} className="language-icon" />
            <select
                className="language-selector"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                aria-label="Speech language"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.label}
                    </option>
                ))}
            </select>
            <span className="language-selected-label">{selected.label}</span>
        </div>
    )
}
