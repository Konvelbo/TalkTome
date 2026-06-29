import { useRef } from 'react'
import { Github } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SpeechToTextDemo } from './SpeechToTextDemo'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function AboutSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.from('.about-title', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      })
        .from(
          '.about-text',
          { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' },
          '-=0.4',
        )
        .from(
          '.about-video',
          { opacity: 0, scale: 0.9, duration: 0.6, ease: 'power2.out' },
          '-=0.4',
        )
        .from('.about-github', { opacity: 0, y: 10, duration: 0.4 }, '-=0.2')
    },
    { scope: containerRef },
  )

  return (
    <section ref={containerRef} className="about-section">
      <div className="about-content-wrapper">
        {/* BIG TITLE TOP CENTER */}
        <div className="about-header">
          <h2 className="about-title">Talk to me API</h2>
        </div>

        {/* CONTENT (TEXT OVER VIDEO) */}
        <div className="about-body">
          <div className="about-text-container">
            <p className="about-text">
              Built on top of Groq Whisper v3, this Application provides
              real-time, lightning-fast transcription. Just speak into your
              microphone and get accurate results instantly. Powered by TanStack
              Start, Convex, and NanoBanana themes.
            </p>
          </div>

          <div className="about-video-container">
            {/* Wide Video / Animation placeholder */}
            <div className="about-video">
              <SpeechToTextDemo />
            </div>
          </div>
        </div>

        {/* Footer info centered inside About Section */}
        <div className="about-footer-info">
          © {new Date().getFullYear()} Talk to me — powered by Groq Whisper
        </div>
      </div>

      {/* GITHUB ICON BOTTOM RIGHT */}
      <a
        href="https://github.com/your-username/talk-to-me"
        target="_blank"
        rel="noopener noreferrer"
        className="about-github"
        title="View on GitHub"
      >
        <Github size={24} />
      </a>
    </section>
  )
}
