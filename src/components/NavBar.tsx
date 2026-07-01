// import { UserCircle, LogOut } from 'lucide-react'
import { useConvexAuth } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import React, { useEffect, useState } from 'react'
import gsap from 'gsap'

interface NavBarProps {
  onLoginClick?: () => void
  setFeatureShoice: (i: string) => void
}

// Tableau des fonctionnalités pour gérer facilement l'affichage dynamique
const FEATURES = [
  { id: 'spreeshToText', label: 'Spreesh To Text' },
  { id: 'denoiser', label: 'Denoiser' },
  // Décommente ces lignes pour tester l'overflow desktop (> 4) et le scroll mobile
  // { id: 'feat3', label: 'Feature 3' },
  // { id: 'feat4', label: 'Feature 4' },
  // { id: 'feat5', label: 'Feature 5' },
  // { id: 'feat6', label: 'Feature 6' },
]

export function NavBar({ onLoginClick, setFeatureShoice }: NavBarProps) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signOut } = useAuthActions()
  const [isMounted, setIsMounted] = useState(false)

  // États pour les menus
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleFeatureClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    feature: string,
  ) => {
    const target = e.currentTarget
    gsap.killTweensOf(target)

    const tl = gsap.timeline()
    tl.to(target, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.out',
    }).to(target, {
      scale: 1,
      duration: 0.3,
      ease: 'back.out(1.7)',
    })

    setFeatureShoice(feature)
    setIsMobileDrawerOpen(false)
    setIsDesktopDropdownOpen(false)
  }

  // Séparation pour le desktop
  const visibleFeatures = FEATURES.slice(0, 4)
  const dropdownFeatures = FEATURES.slice(4)

  return (
    <>
      <nav className="navbar w-full">
        {/* Logo */}
        <a
          href="/"
          className="navbar-logo flex items-center gap-2 flex-shrink-0"
        >
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

        {/* =========================================
            NAVIGATION DESKTOP
        ========================================= */}
        <div className="navbar-desktop-only flex-1 justify-center gap-2 mx-4">
          {visibleFeatures.map((feat) => (
            <button
              key={feat.id}
              className="Navbar-features-btn whitespace-nowrap"
              onClick={(e) => handleFeatureClick(e, feat.id)}
            >
              {feat.label}
            </button>
          ))}

          {/* Bouton flèche + Dropdown si > 4 boutons */}
          {dropdownFeatures.length > 0 && (
            <div className="relative">
              <button
                className="Navbar-features-btn flex items-center justify-center p-2"
                onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
              >
                <svg
                  className={`w-5 h-5 transition-transform ${isDesktopDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDesktopDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 p-2 bg-[#1c1c1e] border border-gray-700/50 rounded-xl shadow-xl flex flex-col gap-2 min-w-[200px]">
                  {dropdownFeatures.map((feat) => (
                    <button
                      key={feat.id}
                      className="Navbar-features-btn w-full text-left"
                      onClick={(e) => handleFeatureClick(e, feat.id)}
                    >
                      {feat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section Auth (Desktop) */}
        <div className="navbar-desktop-only navbar-right flex-shrink-0">
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

        {/* Bouton Burger (Mobile) */}
        <button
          className="navbar-burger focus:outline-none"
          onClick={() => setIsMobileDrawerOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* =========================================
          DRAWER MOBILE (Bottom Sheet)
      ========================================= */}
      {/* Overlay sombre en arrière-plan */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* Le Drawer en lui-même */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#1c1c1e] z-50 md:hidden rounded-t-3xl border-t border-gray-700/50 transition-transform duration-300 ease-in-out ${
          isMobileDrawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '60vh' }} // Hauteur fixe
      >
        {/* Petit trait indicateur de glissement en haut du drawer */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-gray-600 rounded-full"></div>
        </div>

        <div className="flex flex-col h-full p-5 pb-8">
          {/* Zone de navigation scrollable */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-4 px-1">
              Fonctionnalités
            </h3>
            <div className="flex flex-wrap gap-3">
              {FEATURES.map((feat) => (
                <button
                  key={feat.id}
                  className="Navbar-features-btn flex-grow !text-gray-200 !bg-white/10 hover:!bg-white/20 hover:!text-white"
                  onClick={(e) => handleFeatureClick(e, feat.id)}
                >
                  {feat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zone statique d'authentification en bas */}
          <div className="mt-4 pt-4 border-t border-gray-700/50 shrink-0">
            {isAuthenticated ? (
              <button
                className="navBar-button w-full text-center py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                onClick={() => {
                  void signOut()
                  setIsMobileDrawerOpen(false)
                }}
              >
                Sign out
              </button>
            ) : (
              <button
                className="navBar-button w-full text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                onClick={() => {
                  onLoginClick?.()
                  setIsMobileDrawerOpen(false)
                }}
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
