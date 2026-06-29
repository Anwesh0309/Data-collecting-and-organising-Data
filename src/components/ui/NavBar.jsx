import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.js'
import { stopNarration } from '../../utils/audio.js'

const STEPS = [
  { key: 'wonder',   num: '01', label: 'Wonder' },
  { key: 'story',    num: '02', label: 'Story' },
  { key: 'simulate', num: '03', label: 'Simulate' },
  { key: 'play',     num: '04', label: 'Play' },
  { key: 'reflect',  num: '05', label: 'Reflect' },
]

export default function NavBar() {
  const { phase, setPhase, audioEnabled, toggleAudio } = useGameStore()
  const currentIdx = STEPS.findIndex(s => s.key === phase)

  function goHome() {
    stopNarration()
    setPhase('home')
  }

  function handleMute() {
    toggleAudio()
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px 16px',
      flexShrink: 0,
      zIndex: 100,
      position: 'relative',
      gap: 12,
      width: '100%',
    }}>
      {/* HOME — top left (dark capsule) */}
      <motion.button
        whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
        whileTap={{ scale: 0.95 }}
        onClick={goHome}
        style={{
          background: 'rgba(255,255,255,0.05)',
          color: '#fff',
          borderRadius: 12,
          padding: '6px 14px',
          fontSize: 13,
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          border: '1px solid rgba(255,255,255,0.12)',
          cursor: 'pointer',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        🏠 Home
      </motion.button>

      {/* STEP BREADCRUMB — center, flex grows */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 14,
        padding: '6px 14px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
      }}>
        {STEPS.map((step, i) => {
          const current = i === currentIdx
          const completed = i < currentIdx

          let circleBg = 'rgba(0,0,0,0.28)' // upcoming (dark translucent)
          let circleBorder = '1px solid rgba(255,255,255,0.10)'
          let circleColor = 'rgba(255,255,255,0.40)'
          let labelColor = 'rgba(255,255,255,0.35)'

          if (completed) {
            circleBg = '#22c55e'
            circleBorder = 'none'
            circleColor = '#fff'
            labelColor = '#22c55e'
          } else if (current) {
            circleBg = '#f5c518'
            circleBorder = 'none'
            circleColor = '#1a1040'
            labelColor = '#f5c518'
          }

          return (
            <div key={step.key} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                {/* Step Circle */}
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: circleBg,
                  border: circleBorder,
                  color: circleColor,
                  fontSize: 10,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {completed ? '✓' : step.num}
                </div>
                {/* Step Label */}
                <span style={{
                  fontSize: 12,
                  fontWeight: current ? 800 : 600,
                  color: labelColor,
                  fontFamily: 'var(--font-heading)',
                }}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: 20,
                  height: 1,
                  background: 'rgba(255,255,255,0.15)',
                  margin: '0 10px',
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Control buttons — right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* MUTE — fixed top-right in every phase (except Intro which has no NavBar) */}
        <motion.button
          whileHover={{ scale: 1.08, background: 'rgba(255,255,255,0.10)' }}
          whileTap={{ scale: 0.9 }}
          onClick={handleMute}
          aria-label={audioEnabled ? 'Mute' : 'Unmute'}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.12)',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontWeight: 900,
          }}
        >
          {audioEnabled ? '🔊' : '🔇'}
        </motion.button>
      </div>
    </div>
  )
}
