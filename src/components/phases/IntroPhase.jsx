import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.js'
import { narrate, stopNarration } from '../../utils/audio.js'
import { introNarration } from '../../utils/narration.js'

function SukiAvatar({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-label="Suki">
      {/* Yellow circle badge */}
      <circle cx="28" cy="28" r="28" fill="#f5c518" />
      {/* Left Ear */}
      <circle cx="18" cy="20" r="6.5" fill="#8d5b28" />
      <circle cx="18" cy="20" r="3.5" fill="#e2a868" />
      {/* Right Ear */}
      <circle cx="38" cy="20" r="6.5" fill="#8d5b28" />
      <circle cx="38" cy="20" r="3.5" fill="#e2a868" />
      {/* Head */}
      <circle cx="28" cy="28" r="14.5" fill="#8d5b28" />
      {/* Muzzle */}
      <ellipse cx="28" cy="32.5" rx="7" ry="5.5" fill="#e2a868" />
      {/* Nose */}
      <polygon points="28,30.5 25.5,28.5 30.5,28.5" fill="#1a1040" />
      {/* Eyes */}
      <circle cx="22.5" cy="26.5" r="2" fill="#1a1040" />
      <circle cx="33.5" cy="26.5" r="2" fill="#1a1040" />
      <circle cx="23" cy="25.8" r="0.7" fill="#fff" />
      <circle cx="34" cy="25.8" r="0.7" fill="#fff" />
      {/* Mouth */}
      <path d="M28 32.5 Q28 34.5 25.5 34.5 M28 32.5 Q28 34.5 30.5 34.5" stroke="#1a1040" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Static star positions — no Math.random() on re-render
const STAR_DOTS = Array.from({ length: 35 }, (_, i) => ({
  x: ((i * 137.5) % 100).toFixed(1),
  y: ((i * 97.3) % 100).toFixed(1),
  r: i % 3 === 0 ? 1.6 : i % 3 === 1 ? 1.1 : 0.7,
  dur: (2 + (i % 5) * 0.5).toFixed(1),
  delay: ((i * 0.28) % 3.5).toFixed(1),
}))

const FLOATING_NUMBERS = [
  { num: '54', top: '15%', left: '10%', size: 28, delay: 0 },
  { num: '91', top: '25%', left: '80%', size: 34, delay: 1 },
  { num: '11', top: '70%', left: '12%', size: 24, delay: 0.5 },
  { num: '66', top: '80%', left: '75%', size: 30, delay: 1.5 },
  { num: '90', top: '45%', left: '85%', size: 26, delay: 2 },
  { num: '64', top: '60%', left: '8%', size: 22, delay: 1.2 },
  { num: '30', top: '10%', left: '70%', size: 28, delay: 0.8 },
  { num: '59', top: '75%', left: '50%', size: 20, delay: 2.5 },
]

const JOURNEY_STEPS = [
  { icon: '🔍', label: 'Wonder', sub: 'Spark curiosity', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', color: '#3b82f6' },
  { icon: '📖', label: 'Story', sub: 'Hear the tale', bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)', color: '#a855f7' },
  { icon: '🧪', label: 'Simulate', sub: 'Explore & discover', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', color: '#22c55e' },
  { icon: '🎮', label: 'Play', sub: 'Test skills', bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.3)', color: '#ec4899' },
  { icon: '📓', label: 'Reflect', sub: 'Reflect back', bg: 'rgba(245, 197, 24, 0.1)', border: 'rgba(245, 197, 24, 0.3)', color: '#f5c518' },
]

export default function IntroPhase() {
  const { setPhase, awardBadge, addXP } = useGameStore()

  useEffect(() => {
    narrate(introNarration())
    return () => stopNarration()
  }, [])

  function handleStart() {
    awardBadge('data-rookie')
    addXP(20)
    setPhase('wonder')
  }

  function handleClose() {
    // Reload page to reset state safely
    window.location.reload()
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 30%, #2d1b69 0%, #1a1040 70%)',
    }}>
      {/* Star field */}
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0 }}>
        {STAR_DOTS.map((d,i) => (
          <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.r} fill="white" opacity="0">
            <animate attributeName="opacity" values="0;0.55;0" dur={`${d.dur}s`} begin={`${d.delay}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>

      {/* Floating Numbers */}
      {FLOATING_NUMBERS.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0.05, y: 0 }}
          animate={{
            opacity: [0.03, 0.12, 0.03],
            y: [-12, 12, -12],
          }}
          transition={{
            duration: 6 + (idx % 3) * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            fontSize: item.size,
            fontWeight: 900,
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-heading)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {item.num}
        </motion.div>
      ))}

      {/* Transparent main content block */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          position: 'relative', zIndex: 1,
          maxWidth: 640, width: '100%', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
      >
        {/* MOE tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 999, padding: '5px 15px',
          fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.9)', marginBottom: 20,
        }}>
          ✨ Grade 2 Mathematics - Collecting and Organising Data
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{
            fontFamily: 'var(--font-heading)', fontWeight: 900,
            fontSize: 44, lineHeight: 1.15, marginBottom: 16, color: '#fff',
          }}
        >
          Data Collecting &amp;<br />
          <span style={{ color: '#f5c518' }}>Organising Data</span>
        </motion.h1>

        {/* Suki + speech bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 16 }}
        >
          <SukiAvatar size={52} />
          <div style={{
            position: 'relative',
            background: '#fff',
            borderRadius: 24,
            padding: '12px 20px',
            fontSize: 15, fontWeight: 800, color: '#1a1040',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            textAlign: 'left',
          }}>
            {/* Speech bubble tail */}
            <div style={{
              position: 'absolute',
              left: -8, top: 16,
              width: 0, height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderRight: '8px solid #fff',
            }} />
            Ready to become a Data Detective? Let's go! 🔍
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 24, maxWidth: 500 }}
        >
          Join Suki the Data Detective and discover how collecting and organising
          data helps us understand the world — through stories, simulations, and games!
        </motion.p>

        {/* Journey row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24, padding: '20px 24px', marginBottom: 28, width: '100%', maxWidth: 600,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.5, color: '#f5c518', marginBottom: 16 }}>
            YOUR LEARNING JOURNEY
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
            {JOURNEY_STEPS.map((s, i) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 80 }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: s.bg,
                    border: `2px solid ${s.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    marginBottom: 8,
                    color: s.color,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-heading)' }}>{s.label}</span>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2, fontWeight: 600 }}>{s.sub}</span>
                </div>
                {i < JOURNEY_STEPS.length - 1 && (
                  <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 18, fontWeight: 'bold', alignSelf: 'center', marginBottom: 28 }}>→</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.04, boxShadow: '0 10px 36px rgba(245,197,24,0.55)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          className="btn-yellow"
          style={{
            fontSize: 18,
            padding: '14px 48px',
            width: 'fit-content',
            borderRadius: 999,
            marginBottom: 28,
          }}
        >
          🚀 Begin Your Journey!
        </motion.button>

        {/* Feature chips/cards */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center' }}
        >
          {[
            { icon: '📊', label: 'Tally & Tables' },
            { icon: '🧱', label: '5 Simulations' },
            { icon: '🏆', label: '10 Game Worlds' },
          ].map(f => (
            <div key={f.label} style={{
              width: 140,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '14px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, margin: '0 auto 8px',
              }}>
                {f.icon}
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                {f.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
