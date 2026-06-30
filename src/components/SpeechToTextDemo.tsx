import { useEffect, useRef, useState } from 'react'

// ─── CSS injected once ──────────────────────────────────────────────────────
const DEMO_STYLES = `
.std-frame {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  background: #FFFFFF;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(20,19,15,0.04), 0 30px 60px -20px rgba(20,19,15,0.18);
  overflow: hidden;
  border: 1px solid #E6E3DC;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #14130F;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
.std-frame * { box-sizing: border-box; }
.std-chrome {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 13px 18px;
  border-bottom: 1px solid #E6E3DC;
  background: #FCFCFA;
}
.std-dots { display: flex; gap: 7px; }
.std-dots span { width: 10px; height: 10px; border-radius: 50%; background: #E3E0D7; }
.std-urlbar {
  flex: 1;
  text-align: center;
  font-size: 12.5px;
  color: #767369;
  background: #F2F0EA;
  border-radius: 7px;
  padding: 5px 0;
  letter-spacing: 0.2px;
  font-family: 'IBM Plex Mono', monospace;
}
.std-ctrl {
  width: 30px; height: 30px; border-radius: 50%;
  border: 1px solid #E6E3DC;
  background: #FFFFFF;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex: none;
}
.std-ctrl svg { width: 13px; height: 13px; }

.std-app {
  padding: clamp(36px, 8vw, 64px) clamp(20px, 6vw, 48px) clamp(32px, 7vw, 56px);
  min-height: 560px;
  position: relative;
  overflow: hidden;
  background: #FAFAF7;
}
.std-app::before {
  content: '';
  position: absolute; top: -160px; left: 50%; transform: translateX(-50%);
  width: 680px; height: 360px;
  background: radial-gradient(closest-side, rgba(20,19,15,0.05), transparent 70%);
  pointer-events: none;
}

.std-topbar {
  display: flex; align-items: center; justify-content: space-between;
  position: relative; z-index: 1;
}
.std-brand {
  display: flex; align-items: center; gap: 9px;
  font-weight: 600; font-size: 15px;
}
.std-brand svg { width: 18px; height: 18px; }
.std-signout {
  font-size: 12.5px; font-weight: 500;
  background: #14130F; color: #fff;
  padding: 8px 16px; border-radius: 99px;
}

.std-hero {
  text-align: center; margin-top: clamp(32px, 8vw, 68px);
  position: relative; z-index: 1;
}
.std-hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700; font-size: clamp(28px, 6vw, 42px);
  line-height: 1.12; letter-spacing: -0.01em;
  margin: 0 0 14px;
}
.std-sub {
  color: #767369; font-size: clamp(14px, 3.4vw, 15.5px); line-height: 1.55;
  margin: 0 auto 30px; max-width: 380px;
  padding: 0 8px;
}
.std-pill {
  display: inline-flex; align-items: center; gap: 7px;
  border: 1px solid #E6E3DC; border-radius: 99px;
  padding: 8px 16px; font-size: 13px; color: #14130F; font-weight: 500;
  margin-bottom: 46px; background: #FFFFFF;
}
.std-pill svg { width: 13px; height: 13px; opacity: 0.6; }

.std-recorder {
  position: relative; display: flex; flex-direction: column;
  align-items: center; height: 130px; justify-content: flex-start;
}
.std-btn-wrap { position: relative; width: 96px; height: 96px; }
.std-ring {
  position: absolute; inset: -14px; border-radius: 50%;
  background: rgba(214,46,58,0.14);
  opacity: 0; transform: scale(0.7);
  transition: opacity .35s ease;
}
.std-ring.show { opacity: 1; animation: stdPulseRing 1.6s ease-out infinite; }
@keyframes stdPulseRing {
  0%  { transform: scale(0.78); opacity: 0.9; }
  100%{ transform: scale(1.28); opacity: 0; }
}
.std-spinner-ring {
  position: absolute; inset: -7px; border-radius: 50%;
  border: 2.5px solid transparent;
  border-top-color: #14130F; border-right-color: #14130F;
  opacity: 0; transition: opacity .25s ease;
}
.std-spinner-ring.show { opacity: 1; animation: stdSpin 0.9s linear infinite; }
@keyframes stdSpin { to { transform: rotate(360deg); } }

.std-record-btn {
  position: relative; z-index: 2;
  width: 96px; height: 96px; border-radius: 50%;
  background: #14130F;
  display: flex; align-items: center; justify-content: center;
  transition: background .3s ease, transform .15s ease;
  cursor: default;
}
.std-record-btn.pressed  { transform: scale(0.92); }
.std-record-btn.recording{ background: #D62E3A; }
.std-record-btn svg { width: 30px; height: 30px; }
.std-icon-stop { display: none; }
.std-record-btn.recording .std-icon-mic  { display: none; }
.std-record-btn.recording .std-icon-stop { display: block; }

.std-status {
  margin-top: 18px; font-size: 13.5px; color: #767369; font-weight: 500;
  height: 18px; display: flex; align-items: center; gap: 7px;
}
.std-status .std-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #D62E3A; display: none;
}
.std-status.is-recording .std-dot {
  display: inline-block; animation: stdBlink 1s steps(2) infinite;
}
@keyframes stdBlink { 50% { opacity: 0.15; } }
.std-status .std-timer { font-family: 'IBM Plex Mono', monospace; }

.std-waveform {
  display: flex; align-items: center; gap: 3px;
  height: 0; overflow: hidden; opacity: 0;
  transition: opacity .3s ease;
}
.std-waveform.show { height: 30px; opacity: 1; margin-top: 14px; }
.std-waveform span {
  width: 3px; border-radius: 2px; background: #D62E3A;
  height: 6px; display: block; animation: none;
}
.std-waveform.animate span { animation: stdWave 0.9s ease-in-out infinite; }
@keyframes stdWave {
  0%, 100% { height: 6px; }
  50%       { height: 26px; }
}

.std-progress-wrap {
  width: 200px; height: 3px; background: rgba(20,19,15,0.06);
  border-radius: 99px; margin-top: 18px;
  opacity: 0; transition: opacity .3s ease; overflow: hidden;
}
.std-progress-wrap.show { opacity: 1; }
.std-progress-bar { height: 100%; width: 0%; background: #14130F; border-radius: 99px; }

.std-card {
  margin: 40px auto 0; max-width: 560px; width: 100%;
  background: #FFFFFF; border: 1px solid #E6E3DC;
  border-radius: 14px; padding: clamp(16px, 4vw, 22px) clamp(16px, 5vw, 26px) clamp(18px, 4.5vw, 24px);
  opacity: 0; transform: translateY(14px);
  transition: opacity .45s ease, transform .45s ease;
  position: relative; z-index: 1; text-align: left;
}
.std-card.show { opacity: 1; transform: translateY(0); }
.std-card-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.std-card-label {
  font-size: 11px; letter-spacing: 0.09em;
  font-weight: 600; color: #767369;
}
.std-card-actions { display: flex; gap: 8px; }
.std-ghost-btn {
  font-size: 12px; font-weight: 500;
  border: 1px solid #E6E3DC; border-radius: 7px;
  padding: 5px 11px; color: #14130F; background: #FFFFFF;
  display: flex; align-items: center; gap: 5px;
}
.std-ghost-btn svg { width: 12px; height: 12px; }

.std-transcript {
  font-size: 15.5px; line-height: 1.6; min-height: 48px; color: #14130F;
}
.std-transcript .std-caret {
  display: inline-block; width: 2px; height: 16px;
  background: #14130F; margin-left: 1px; vertical-align: -3px;
  animation: stdCaretBlink 0.9s steps(2) infinite;
}
@keyframes stdCaretBlink { 50% { opacity: 0; } }

.std-divider { height: 1px; background: #E6E3DC; margin: 18px 0 14px; }

.std-export-row {
  display: flex; align-items: center; gap: 10px;
  flex-wrap: wrap;
  opacity: 0; transform: translateY(6px);
  transition: opacity .35s ease, transform .35s ease;
}
.std-export-row.show { opacity: 1; transform: translateY(0); }
.std-export-label { font-size: 12px; color: #767369; margin-right: 4px; }
.std-ex-btn {
  display: flex; align-items: center; gap: 6px;
  font-size: 12.5px; font-weight: 500;
  border: 1px solid #E6E3DC; border-radius: 8px;
  padding: 7px 12px; background: #FFFFFF; color: #14130F;
  transition: border-color .25s ease, box-shadow .25s ease, background .25s ease;
  position: relative;
}
.std-ex-btn svg { width: 13px; height: 13px; }
.std-ex-btn.active {
  border-color: #14130F;
  box-shadow: 0 0 0 3px rgba(20,19,15,0.06);
  background: #14130F; color: #fff;
}
.std-toast {
  position: absolute; bottom: -26px; left: 0;
  font-size: 11px; color: #767369;
  opacity: 0; transition: opacity .25s ease;
  white-space: nowrap;
}
.std-ex-btn.active .std-toast { opacity: 1; }

.std-badge {
  position: absolute; top: 16px; right: 16px;
  font-size: 10.5px; letter-spacing: 0.06em;
  color: #767369; background: #F2F0EA;
  padding: 4px 9px; border-radius: 99px; z-index: 3;
}

@media (prefers-reduced-motion: reduce) {
  .std-ring, .std-spinner-ring,
  .std-waveform span, .std-status .std-dot,
  .std-transcript .std-caret { animation-duration: 0.001ms !important; }
}

/* ─── Responsive: tablette ───────────────────────────────────────────────── */
@media (max-width: 720px) {
  .std-chrome { padding: 11px 14px; gap: 12px; }
  .std-urlbar { font-size: 11.5px; }
  .std-ctrl { width: 28px; height: 28px; }

  .std-badge {
    position: static;
    display: inline-block;
    margin-bottom: 18px;
  }
  .std-topbar { flex-wrap: wrap; gap: 10px; }
  .std-signout { font-size: 12px; padding: 7px 14px; }

  .std-pill { margin-bottom: 34px; }

  .std-btn-wrap { width: 84px; height: 84px; }
  .std-record-btn { width: 84px; height: 84px; }
  .std-record-btn svg { width: 26px; height: 26px; }

  .std-export-row { justify-content: flex-start; }
  .std-export-label { width: 100%; margin: 0 0 6px; }
}

/* ─── Responsive: mobile ─────────────────────────────────────────────────── */
@media (max-width: 480px) {
  .std-frame { border-radius: 14px; }
  .std-app { padding: 28px 16px 32px; min-height: auto; }

  .std-badge {
    font-size: 9.5px;
    padding: 4px 8px;
  }

  .std-brand { font-size: 13.5px; gap: 7px; }
  .std-brand svg { width: 16px; height: 16px; }
  .std-signout { font-size: 11px; padding: 6px 12px; }

  .std-hero h1 { font-size: 26px; }
  .std-sub { font-size: 13.5px; max-width: 280px; }

  .std-pill {
    font-size: 12px; padding: 7px 13px; gap: 6px;
    margin-bottom: 28px;
  }

  .std-btn-wrap { width: 72px; height: 72px; }
  .std-record-btn { width: 72px; height: 72px; }
  .std-record-btn svg { width: 22px; height: 22px; }
  .std-ring { inset: -10px; }
  .std-spinner-ring { inset: -6px; }

  .std-status { font-size: 12.5px; }

  .std-progress-wrap { width: 75%; max-width: 200px; }

  .std-card { margin-top: 28px; }
  .std-card-head { flex-wrap: wrap; gap: 8px; }
  .std-card-actions { gap: 6px; }
  .std-ghost-btn { font-size: 11.5px; padding: 5px 10px; }

  .std-transcript { font-size: 14px; }

  .std-export-row { gap: 8px; }
  .std-ex-btn {
    font-size: 12px; padding: 7px 10px;
    flex: 1 1 calc(50% - 8px);
    justify-content: center;
  }
  .std-toast {
    position: static;
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 3px;
  }
}

@media (max-width: 360px) {
  .std-hero h1 { font-size: 23px; }
  .std-btn-wrap { width: 64px; height: 64px; }
  .std-record-btn { width: 64px; height: 64px; }
  .std-record-btn svg { width: 20px; height: 20px; }
}
`

// ─── Helpers (no DOM globals, pure functions) ────────────────────────────────
const tick = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

async function pausableWait(ms: number, isPaused: () => boolean) {
  let remaining = ms
  while (remaining > 0) {
    while (isPaused()) await tick(100)
    const chunk = Math.min(100, remaining)
    await tick(chunk)
    remaining -= chunk
  }
}

async function pausableWaitWithProgress(
  ms: number,
  onProgress: (elapsed: number, total: number) => void,
  isPaused: () => boolean,
) {
  let elapsed = 0
  while (elapsed < ms) {
    while (isPaused()) await tick(100)
    const chunk = Math.min(100, ms - elapsed)
    await tick(chunk)
    elapsed += chunk
    onProgress(elapsed, ms)
  }
}

function fmt(sec: number) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${m}:${s}`
}

const TRANSCRIPT =
  'Thanks for trying the demo. Tap the microphone, speak naturally in any language, and our AI turns your voice into clean, accurate text in seconds.'

// ─── Component ───────────────────────────────────────────────────────────────
export function SpeechToTextDemo() {
  const ringRef = useRef<HTMLDivElement>(null)
  const spinnerRef = useRef<HTMLDivElement>(null)
  const recordBtnRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const waveformRef = useRef<HTMLDivElement>(null)
  const progressWrapRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const transcriptRef = useRef<HTMLParagraphElement>(null)
  const exportRowRef = useRef<HTMLDivElement>(null)
  const btnTxtRef = useRef<HTMLDivElement>(null)
  const btnPdfRef = useRef<HTMLDivElement>(null)
  const btnDocxRef = useRef<HTMLDivElement>(null)
  const btnMdRef = useRef<HTMLDivElement>(null)

  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  // AJOUT : Remplacement de la variable locale par un useRef pour éviter l'erreur de l'analyseur statique
  const cancelledRef = useRef(false)

  // Keep ref in sync with state so the async loop can read it
  const handleTogglePause = () => {
    pausedRef.current = !pausedRef.current
    setPaused(pausedRef.current)
  }

  // Inject styles once
  useEffect(() => {
    const id = 'std-demo-styles'
    if (!document.getElementById(id)) {
      const style = document.createElement('style')
      style.id = id
      style.textContent = DEMO_STYLES
      document.head.appendChild(style)
    }
  }, [])

  // Main animation loop
  useEffect(() => {
    // Réinitialisation de la ref au montage de l'effet
    cancelledRef.current = false
    const isPaused = () => pausedRef.current

    const buildWaveform = () => {
      const wf = waveformRef.current
      if (!wf) return
      wf.innerHTML = ''
      for (let i = 0; i < 22; i++) {
        const bar = document.createElement('span')
        bar.style.animationDelay = `${Math.random() * 0.6}s`
        bar.style.animationDuration = `${0.7 + Math.random() * 0.5}s`
        wf.appendChild(bar)
      }
    }

    const resetIdle = () => {
      recordBtnRef.current?.classList.remove('recording')
      ringRef.current?.classList.remove('show')
      spinnerRef.current?.classList.remove('show')
      waveformRef.current?.classList.remove('show', 'animate')
      progressWrapRef.current?.classList.remove('show')
      if (progressBarRef.current) progressBarRef.current.style.width = '0%'
      statusRef.current?.classList.remove('is-recording')
      if (statusRef.current)
        statusRef.current.innerHTML = '<span>Tap to record</span>'
      cardRef.current?.classList.remove('show')
      exportRowRef.current?.classList.remove('show')
      ;[btnTxtRef, btnPdfRef, btnDocxRef, btnMdRef].forEach((r) =>
        r.current?.classList.remove('active'),
      )
      if (transcriptRef.current) transcriptRef.current.innerHTML = ''
    }

    const pressBtn = async () => {
      recordBtnRef.current?.classList.add('pressed')
      await tick(120)
      recordBtnRef.current?.classList.remove('pressed')
    }

    const typeText = async (el: HTMLElement, text: string, speed: number) => {
      el.innerHTML = '<span class="std-caret"></span>'
      let typed = ''
      for (let i = 0; i < text.length; i++) {
        while (isPaused()) await tick(100)
        await tick(speed)
        typed += text[i]
        el.innerHTML = typed + '<span class="std-caret"></span>'
      }
      el.innerHTML = typed
    }

    const runLoop = async () => {
      buildWaveform()

      while (!cancelledRef.current) {
        resetIdle()
        await pausableWait(2000, isPaused)
        if (cancelledRef.current) break

        // — start recording —
        await pressBtn()
        recordBtnRef.current?.classList.add('recording')
        ringRef.current?.classList.add('show')
        waveformRef.current?.classList.add('show', 'animate')
        statusRef.current?.classList.add('is-recording')
        if (statusRef.current)
          statusRef.current.innerHTML =
            '<span class="std-dot"></span><span>Recording <span class="std-timer" id="std-timer">00:00</span></span>'

        await pausableWaitWithProgress(
          4400,
          (el) => {
            const timerEl = document.getElementById('std-timer')
            if (timerEl) timerEl.textContent = fmt(Math.floor(el / 1000))
          },
          isPaused,
        )
        if (cancelledRef.current) break

        // — stop → processing —
        await pressBtn()
        recordBtnRef.current?.classList.remove('recording')
        ringRef.current?.classList.remove('show')
        waveformRef.current?.classList.remove('show', 'animate')
        spinnerRef.current?.classList.add('show')
        statusRef.current?.classList.remove('is-recording')
        if (statusRef.current)
          statusRef.current.innerHTML = '<span>Analyzing with AI…</span>'
        progressWrapRef.current?.classList.add('show')

        await pausableWaitWithProgress(
          2200,
          (el, total) => {
            if (progressBarRef.current)
              progressBarRef.current.style.width = `${(el / total) * 100}%`
          },
          isPaused,
        )
        if (cancelledRef.current) break

        spinnerRef.current?.classList.remove('show')
        progressWrapRef.current?.classList.remove('show')
        if (statusRef.current) statusRef.current.innerHTML = '<span>Done</span>'

        // — reveal result —
        cardRef.current?.classList.add('show')
        await pausableWait(250, isPaused)
        if (transcriptRef.current)
          await typeText(transcriptRef.current, TRANSCRIPT, 22)
        await pausableWait(300, isPaused)
        if (cancelledRef.current) break

        exportRowRef.current?.classList.add('show')
        const exportBtns = [btnTxtRef, btnPdfRef, btnDocxRef, btnMdRef]
        for (const ref of exportBtns) {
          ref.current?.classList.add('active')
          await pausableWait(750, isPaused)
          ref.current?.classList.remove('active')
          await pausableWait(150, isPaused)
          if (cancelledRef.current) break
        }

        await pausableWait(1600, isPaused)
        if (cancelledRef.current) break
        cardRef.current?.classList.remove('show')
        await pausableWait(550, isPaused)
      }
    }

    runLoop()
    return () => {
      cancelledRef.current = true
    }
  }, [])

  return (
    <div className="std-frame">
      {/* ── Chrome bar ── */}
      <div className="std-chrome">
        <div className="std-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="std-urlbar">talktome.app</div>
        <div
          className="std-ctrl"
          title={paused ? 'Resume demo' : 'Pause demo'}
          onClick={handleTogglePause}
        >
          {paused ? (
            /* Play icon */
            <svg viewBox="0 0 24 24" fill="#14130F">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          ) : (
            /* Pause icon */
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#14130F"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="8" y1="5" x2="8" y2="19" />
              <line x1="16" y1="5" x2="16" y2="19" />
            </svg>
          )}
        </div>
      </div>

      {/* ── App body ── */}
      <div className="std-app">
        <span className="std-badge">AUTOPLAY DEMO</span>

        <div className="std-topbar">
          <div className="std-brand">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#14130F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
            Talk to me
          </div>
          <div className="std-signout">Sign out</div>
        </div>

        <div className="std-hero">
          <h1>
            Speak. Transcribe.
            <br />
            Export.
          </h1>
          <p className="std-sub">
            Convert your voice into text instantly — in any language.
          </p>

          <div className="std-pill">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#14130F"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" />
            </svg>
            Auto-detect
          </div>

          {/* ── Recorder ── */}
          <div className="std-recorder">
            <div className="std-btn-wrap">
              <div ref={ringRef} className="std-ring" />
              <div ref={spinnerRef} className="std-spinner-ring" />
              <div ref={recordBtnRef} className="std-record-btn">
                <svg
                  className="std-icon-mic"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                </svg>
                <svg className="std-icon-stop" viewBox="0 0 24 24" fill="#fff">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </div>
            </div>

            <div ref={statusRef} className="std-status">
              <span>Tap to record</span>
            </div>

            <div ref={waveformRef} className="std-waveform" />
            <div ref={progressWrapRef} className="std-progress-wrap">
              <div ref={progressBarRef} className="std-progress-bar" />
            </div>
          </div>

          {/* ── Transcript card ── */}
          <div ref={cardRef} className="std-card">
            <div className="std-card-head">
              <span className="std-card-label">TRANSCRIPTION</span>
              <div className="std-card-actions">
                <div className="std-ghost-btn">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#14130F"
                    strokeWidth="2"
                  >
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                  </svg>
                  Copy
                </div>
                <div className="std-ghost-btn">Clear</div>
              </div>
            </div>

            <p ref={transcriptRef} className="std-transcript" />

            <div className="std-divider" />

            <div ref={exportRowRef} className="std-export-row">
              <span className="std-export-label">Export as</span>

              <div ref={btnTxtRef} className="std-ex-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                TXT
                <span className="std-toast">Saved transcript.txt</span>
              </div>

              <div ref={btnPdfRef} className="std-ex-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                PDF
                <span className="std-toast">Saved transcript.pdf</span>
              </div>

              <div ref={btnDocxRef} className="std-ex-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                DOCX
                <span className="std-toast">Saved transcript.docx</span>
              </div>
              <div ref={btnMdRef} className="std-ex-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                MD
                <span className="std-toast">Saved transcript.md</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
