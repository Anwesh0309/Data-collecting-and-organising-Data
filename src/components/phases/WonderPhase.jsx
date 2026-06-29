import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.js'
import { narrate, stopNarration } from '../../utils/audio.js'
import { wonderSlideNarration } from '../../utils/narration.js'
import { WONDER_SLIDES } from '../../data/wonderSlides.js'
import NarrationCaption from '../ui/NarrationCaption.jsx'

function SukiAvatar({ size = 48, mood = 'wonder' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#f5c518',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5, flexShrink: 0,
      boxShadow: '0 0 0 3px rgba(245,197,24,0.3)',
    }}>
      {mood === 'wonder' ? '🤔' : mood === 'excited' ? '🎉' : '🔍'}
    </div>
  )
}

function Stars() {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.8, delay: Math.random() * 3, dur: 2 + Math.random() * 2,
  }))
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      {dots.map((d, i) => (
        <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.size} fill="white" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur={`${d.dur}s`} begin={`${d.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  )
}

export default function WonderPhase() {
  const { setPhase, addXP, audioEnabled } = useGameStore()
  const [qIndex, setQIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    stopNarration()
    if (audioEnabled) {
      narrate(wonderSlideNarration(qIndex, revealed))
    }
    return () => stopNarration()
  }, [qIndex, revealed, audioEnabled])

  const q = WONDER_SLIDES[qIndex]

  function handleInvestigate() {
    if (!revealed) {
      stopNarration()
      setRevealed(true)
    } else if (qIndex < WONDER_SLIDES.length - 1) {
      stopNarration()
      setQIndex(i => i + 1)
      setRevealed(false)
    } else {
      stopNarration()
      addXP(20)
      setPhase('story')
    }
  }

  return (
    <div className="phase-wrap" style={{
      background: 'radial-gradient(ellipse at 50% 30%, #2d1b69 0%, #1a1040 70%)',
      padding: '0 20px 20px',
    }}>
      <Stars />

      <div style={{
        position: 'relative', zIndex: 1,
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 20,
        maxWidth: 560, margin: '0 auto', width: '100%',
      }}>

        {/* Suki + speech bubble — top */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, alignSelf: 'flex-start' }}
        >
          <SukiAvatar size={52} mood="wonder" />
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '0 12px 12px 12px',
            padding: '8px 16px',
            fontSize: 14, fontWeight: 700, color: '#fff',
          }}>
            Hmm… I wonder... 🤔
          </div>
        </motion.div>

        {/* Mystery card — exactly like reference */}
        <AnimatePresence mode="wait">
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 20,
              padding: '32px 28px',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {/* Big question mark circle */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#2d1b69',
              border: '2px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: 36, fontWeight: 900, color: '#a855f7',
            }}>
              ?
            </div>

            {/* Question */}
            <p style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.5,
              marginBottom: 12,
              fontFamily: 'var(--font-heading)',
            }}>
              {q.question}
            </p>

            {/* Hint */}
            <p style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.55)',
              fontStyle: 'italic',
              marginBottom: revealed ? 20 : 0,
            }}>
              {q.hint}
            </p>

            {/* Revealed insight */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: 'rgba(245,197,24,0.12)',
                    border: '1px solid rgba(245,197,24,0.35)',
                    borderRadius: 10,
                    padding: '12px 20px',
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#f5c518',
                    marginTop: 4,
                  }}
                >
                  {q.insightDisplay || q.insight}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Question counter dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {WONDER_SLIDES.map((_, i) => (
            <div key={i} style={{
              width: i === qIndex ? 24 : 8, height: 8,
              borderRadius: 4,
              background: i === qIndex ? '#f5c518' : i < qIndex ? 'rgba(245,197,24,0.4)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* On-screen narration caption — inline in card */}
        <NarrationCaption position="inline" />

        {/* CTA button */}
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={handleInvestigate}
          className="btn-yellow"
          style={{ fontSize: 18, padding: '14px 40px', width: '100%' }}
        >
          {!revealed ? '🔍 Let\'s Investigate!' : qIndex < WONDER_SLIDES.length - 1 ? 'Next Wonder →' : '📖 See the Story!'}
        </motion.button>
      </div>
    </div>
  )
}
