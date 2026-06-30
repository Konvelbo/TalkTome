import { useEffect, useRef } from 'react'

interface AdBannerProps {
  variant?: 'footer' | 'loading'
}

export function AdBanner({ variant = 'footer' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    try {
      if (
        adRef.current &&
        !adRef.current.hasAttribute('data-adsbygoogle-status')
      ) {
        // @ts-expect-error - adsbygoogle est injecté globalement par le script externe
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('Erreur AdSense:', err)
    }
  }, [])

  return (
    <div
      className={`ad-banner ad-banner--${variant} flex justify-center w-full overflow-hidden`}
      style={{
        maxHeight: '100px',
      }} /* Sécurité supplémentaire pour bloquer la hauteur */
      aria-label="Advertisement"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        /* On force une hauteur de 90px (standard pour les bannières) */
        style={{ display: 'block', width: '100%', height: '180px' }}
        data-ad-client="ca-pub-1336851208490667"
        // data-ad-slot="1234567890"
        data-ad-format="horizontal" /* ICI : On demande explicitement une bannière horizontale */
        data-full-width-responsive="true"
      />
    </div>
  )
}
