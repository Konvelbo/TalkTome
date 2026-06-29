interface AdBannerProps {
    variant?: 'footer' | 'loading'
}

export function AdBanner({ variant = 'footer' }: AdBannerProps) {
    return (
        <div className={`ad-banner ad-banner--${variant}`} aria-label="Advertisement">
            <span className="ad-label">Advertisement</span>
        </div>
    )
}
