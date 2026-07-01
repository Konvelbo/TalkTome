// import { UserCircle, LogOut } from 'lucide-react'
import { useConvexAuth } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useEffect, useState, MouseEvent } from 'react'
import gsap from 'gsap'

interface NavBarProps {
  onLoginClick?: () => void
  setFeatureShoice: (i: string) => void
}

export function NavBar({ onLoginClick, setFeatureShoice }: NavBarProps) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signOut } = useAuthActions()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fonction pour gérer le clic, animer le bouton, puis changer l'état
  const handleFeatureClick = (
    e: MouseEvent<HTMLButtonElement>,
    feature: string,
  ) => {
    const target = e.currentTarget

    // Stoppe les animations en cours si l'utilisateur spam-clique
    gsap.killTweensOf(target)

    // Timeline de l'animation au clic
    const tl = gsap.timeline()
    tl.to(target, {
      scale: 0.95, // Léger effet d'enfoncement
      duration: 0.1,
      ease: 'power2.out',
    }).to(target, {
      scale: 1, // Retour à la normale avec un petit rebond
      duration: 0.3,
      ease: 'back.out(1.7)',
    })

    // Exécute la logique de navigation
    setFeatureShoice(feature)
  }

  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        </svg>
        Talk to me
      </a>

      <div className="flex gap-2">
        <button
          className="Navbar-features-btn"
          onClick={(e) => handleFeatureClick(e, 'spreeshToText')}
        >
          Spreesh To Text
        </button>
        <button
          className="Navbar-features-btn"
          onClick={(e) => handleFeatureClick(e, 'denoiser')}
        >
          Denoiser
        </button>
      </div>

      <div className="navbar-right">
        {isAuthenticated ? (
          <button className="navBar-button" onClick={() => void signOut()}>
            Sign out
          </button>
        ) : (
          <button className="navBar-button" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </nav>
  )
}
