import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import './App.css'

dayjs.extend(utc)
dayjs.extend(timezone)

const WEDDING_DATE = '2026-12-06 00:00:00'
const SEOUL_TIMEZONE = 'Asia/Seoul'
const weddingDay = dayjs.tz(WEDDING_DATE, SEOUL_TIMEZONE)

type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const getCountdown = (): Countdown => {
  const totalSeconds = Math.max(weddingDay.diff(dayjs(), 'second'), 0)

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  }
}

const units: Array<{ key: keyof Countdown; label: string }> = [
  { key: 'days', label: 'DAYS' },
  { key: 'hours', label: 'HOURS' },
  { key: 'minutes', label: 'MINUTES' },
  { key: 'seconds', label: 'SECONDS' },
]

function CountdownTimer() {
  const [countdown, setCountdown] = useState(getCountdown)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown())
    }, 1_000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="countdown" role="timer" aria-live="off">
      {units.map(({ key, label }, index) => (
        <div className="countdown-segment" key={key}>
          <div className="countdown-unit">
            <span className="countdown-value" aria-label={`${countdown[key]} ${label}`}>
              {key === 'days'
                ? String(countdown[key]).padStart(3, '0')
                : String(countdown[key]).padStart(2, '0')}
            </span>
            <span className="countdown-label" aria-hidden="true">
              {label}
            </span>
          </div>
          {index < units.length - 1 && (
            <span className="countdown-divider" aria-hidden="true">
              ·
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function LinkArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 7l5 5-5 5" />
    </svg>
  )
}

function App() {
  return (
    <main className="wedding-page">
      <div className="line-motif" aria-hidden="true">
        <svg viewBox="0 0 1440 150" preserveAspectRatio="none">
          <path d="M-20 34c202 106 454 118 634 61 92-29 109-91 54-103-53-12-76 68-4 100 42 19 85 19 127-2 67-34 36-111-22-96-54 14-34 75 56 103 183 57 427 38 615-64" />
        </svg>
      </div>

      <section className="hero" aria-labelledby="couple-names">
        <h1 id="couple-names">JIEUN &amp; JAEJUN</h1>
        <div className="title-rule" aria-hidden="true" />
        <p className="date">2026. 12. 06. SUNDAY</p>

        <div className="countdown-section">
          <p className="countdown-intro">우리의 결혼식까지</p>
          <CountdownTimer />
        </div>

        <div className="venue">
          <div className="venue-rule" aria-hidden="true" />
          <p className="venue-name">THE MERRIDEN</p>
          <a href="http://themerriden.com/" target="_blank" rel="noreferrer">
            <span>예식장 홈페이지</span>
            <LinkArrow />
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
