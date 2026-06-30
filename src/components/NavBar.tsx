// import { UserCircle, LogOut } from 'lucide-react'
import { useConvexAuth } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useEffect, useState } from 'react'

interface NavBarProps {
  onLoginClick?: () => void
}

export function NavBar({ onLoginClick }: NavBarProps) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signOut } = useAuthActions()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // if (!isMounted || isLoading) {
  //   return (
  //     <nav className="navbar">
  //       <a href="/" className="navbar-logo">
  //         <svg
  //           width="20"
  //           height="20"
  //           viewBox="0 0 24 24"
  //           fill="none"
  //           stroke="currentColor"
  //           strokeWidth="2.5"
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //         >
  //           <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
  //           <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
  //         </svg>
  //         Talk to me
  //       </a>

  //       <span className="loading loading-spinner loading-xl"></span>
  //     </nav>
  //   )
  // }

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
