import { useState } from 'react'
import { useConvexAuth } from 'convex/react'
import { X, LogOut, User } from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'

interface AuthModalProps {
  onClose: () => void
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { isAuthenticated } = useConvexAuth()
  const { signIn, signOut } = useAuthActions()

  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await signIn('password', { email, password, flow: 'signIn' })
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await signIn('password', { email, password, name, role, flow: 'signUp' })
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  // If already authenticated, show sign-out option
  if (isAuthenticated) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="modal-content auth-custom"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
          <div
            className="auth-form-wrapper"
            style={{ textAlign: 'center', padding: '2rem 1rem' }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <User size={40} style={{ opacity: 0.6, margin: '0 auto' }} />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>You're signed in</h3>
            <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>
              Your transcriptions are being saved automatically.
            </p>
            <button
              className="btn-primary w-full"
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content auth-custom"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="auth-form-wrapper">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setTab('login')
                setError('')
              }}
              type="button"
            >
              Log In
            </button>
            <button
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => {
                setTab('register')
                setError('')
              }}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {error && <p className="auth-error">{error}</p>}

          {tab === 'login' ? (
            <form onSubmit={handleSignIn} className="auth-form">
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
              <button
                className="btn-primary w-full mt-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Log In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="auth-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                />
              </div>
              <div className="form-group">
                <select
                  className="auth-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select your role...
                  </option>
                  <option value="student">Student</option>
                  <option value="developer">Developer</option>
                  <option value="professor">Professor</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>
              <button
                className="btn-primary w-full mt-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
