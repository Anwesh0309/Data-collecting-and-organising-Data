import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGameStore } from '../../store/gameStore.js'
import { narrate, stopNarration } from '../../utils/audio.js'
import { reflectNarration } from '../../utils/narration.js'
import { WORLDS } from '../../data/questions.js'

export default function ReflectPhase() {
  const { setPhase, xp, playScores, completedWorlds, audioEnabled } = useGameStore()
  const fired = useRef(false)

  // Calculations
  const totalCorrect = Object.values(playScores).reduce((sum, s) => sum + (s.correct || 0), 0)
  const totalQuestions = Object.values(playScores).reduce((sum, s) => sum + (s.total || 0), 0)
  const safeTotalQuestions = totalQuestions || 1
  const percentage = Math.round((totalCorrect / safeTotalQuestions) * 100)
  const maxStreakOverall = Object.values(playScores).reduce((m, s) => Math.max(m, s.maxStreak || 0), 0)

  // Stars count based on overall percentage
  const starsCount = percentage >= 90 ? 3 : percentage >= 60 ? 2 : percentage >= 15 ? 1 : 0

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    stopNarration()   // clear any lingering audio first
    setTimeout(() => confetti({ particleCount:180, spread:120, origin:{y:0.45}, colors:['#a855f7','#f5c518','#22c55e','#3b82f6'] }), 400)
    setTimeout(() => {
      confetti({ particleCount:80, spread:80, origin:{x:0.15,y:0.6} })
      confetti({ particleCount:80, spread:80, origin:{x:0.85,y:0.6} })
    }, 900)
    if (audioEnabled) {
      narrate(reflectNarration())
    }
    return () => stopNarration()
  }, [audioEnabled])

  // Show all world sub-scores (completed first)
  const displayWorlds = [
    ...completedWorlds.map(id => WORLDS.find(w => w.id === id)).filter(Boolean),
    ...WORLDS.filter(w => !completedWorlds.includes(w.id)),
  ]

  // Speech bubble feedback text
  let feedbackText = "Good start! Try again to improve! 📚"
  if (percentage >= 90) {
    feedbackText = "Incredible work, Data Detective! You are a master! 🏆"
  } else if (percentage >= 60) {
    feedbackText = "Superb job! You did great! Try again to get 100%! 🌟"
  }

  // Circular Progress Ring SVG Calculations
  const sqSize = 130
  const strokeWidth = 10
  const radius = (sqSize - strokeWidth) / 2
  const viewBox = `0 0 ${sqSize} ${sqSize}`
  const dashArray = radius * Math.PI * 2
  const dashOffset = dashArray - (dashArray * Math.max(percentage, 1)) / 100 // keep a visible ring even at 0%

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'radial-gradient(ellipse at 50% 30%, #2d1b69 0%, #1a1040 70%)',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      minHeight: 0,
    }}>
      {/* Centered Glassmorphic Scoreboard Card */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(245, 197, 24, 0.65)',
          borderRadius: '32px',
          padding: '24px 28px',
          width: '100%',
          maxWidth: '430px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.02)',
          zIndex: 10,
        }}
      >
        {/* Trophy icon */}
        <motion.div
          animate={{ rotate: [0, 8, -6, 4, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{ fontSize: 44, marginBottom: 4 }}
        >
          🏆
        </motion.div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 900,
          fontSize: '24px',
          color: '#fff',
          margin: '0 0 2px 0',
          textAlign: 'center',
        }}>
          Journey Complete!
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.5)',
          margin: '0 0 16px 0',
          textAlign: 'center',
          fontWeight: 600,
        }}>
          You finished all 5 phases!
        </p>

        {/* Circular Progress Ring */}
        <div style={{ position: 'relative', width: sqSize, height: sqSize, marginBottom: 10 }}>
          <svg width={sqSize} height={sqSize} viewBox={viewBox}>
            <circle
              cx={sqSize / 2}
              cy={sqSize / 2}
              r={radius}
              strokeWidth={`${strokeWidth}px`}
              stroke="rgba(255,255,255,0.08)"
              fill="transparent"
            />
            <motion.circle
              initial={{ strokeDashoffset: dashArray }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              cx={sqSize / 2}
              cy={sqSize / 2}
              r={radius}
              strokeWidth={`${strokeWidth}px`}
              stroke="#f5c518"
              fill="transparent"
              strokeLinecap="round"
              style={{
                strokeDasharray: dashArray,
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
              }}
            />
          </svg>
          {/* Inner Text */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{
              fontSize: '26px',
              fontWeight: 950,
              color: '#f5c518',
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.1,
            }}>
              {percentage}%
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 1,
            }}>
              {totalCorrect}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* 3 Stars Achievement Graphics */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          {[1, 2, 3].map(n => {
            const active = n <= starsCount
            return (
              <motion.span
                key={n}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 15, delay: 0.4 + n * 0.15 }}
                style={{
                  fontSize: '32px',
                  filter: active ? 'drop-shadow(0 0 8px rgba(245,197,24,0.75))' : 'grayscale(1)',
                  opacity: active ? 1 : 0.2,
                }}
              >
                ⭐
              </motion.span>
            )
          })}
        </div>

        {/* Stats Row (3 Columns) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          width: '100%',
          marginBottom: 16,
        }}>
          {/* Box 1: XP */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '10px 8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {xp}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: 700, marginTop: 2 }}>
              XP Earned
            </div>
          </div>

          {/* Box 2: Max Streak */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '10px 8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#ff5a5a', fontFamily: 'var(--font-mono)' }}>
              🔥 {maxStreakOverall}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: 700, marginTop: 2 }}>
              Max Streak
            </div>
          </div>

          {/* Box 3: Total questions */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '10px 8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>
              {totalQuestions}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: 700, marginTop: 2 }}>
              Total Questions
            </div>
          </div>
        </div>

        {/* Category-Level Data Capsules */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          marginBottom: 18,
          maxHeight: 180,
          overflowY: 'auto',
          paddingRight: 2,
        }}>
          {displayWorlds.map((world) => {
            const sc = playScores[world.id] || { correct: 0, total: 10, stars: 0 }
            return (
              <div key={world.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.045)',
                borderRadius: '12px',
                padding: '6px 12px',
                border: '1px solid rgba(255,255,255,0.10)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '14px' }}>{world.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: 750, color: 'rgba(255,255,255,0.85)' }}>
                    {world.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)' }}>
                    {sc.correct}/{sc.total}
                  </span>
                  <div style={{ display: 'flex', gap: 1.5 }}>
                    {[1, 2, 3].map(n => (
                      <span key={n} style={{ fontSize: '11px', opacity: n <= sc.stars ? 1 : 0.2 }}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Character Dialogue bubble */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          marginBottom: 18,
        }}>
          {/* Bear character badge */}
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#ff7a00',
            border: '2px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}>
            🐻
          </div>
          {/* Speech bubble */}
          <div style={{
            flex: 1,
            background: '#fff',
            color: '#1a1040',
            borderRadius: '14px',
            padding: '10px 14px',
            position: 'relative',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            fontSize: '12px',
            fontWeight: 700,
            lineHeight: 1.35,
          }}>
            {/* Triangle pointing to the bear */}
            <div style={{
              position: 'absolute',
              left: -6,
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)',
              width: 10,
              height: 10,
              background: '#fff',
            }} />
            {feedbackText}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase('play')}
            style={{
              flex: 1,
              background: '#f5c518',
              color: '#000',
              border: 'none',
              borderRadius: '14px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 4px 15px rgba(245,197,24,0.35)',
            }}
          >
            🔄 Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase('home')}
            style={{
              flex: 1,
              background: '#fff',
              color: '#1a1040',
              border: 'none',
              borderRadius: '14px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 4px 15px rgba(255,255,255,0.2)',
            }}
          >
            🏠 Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
