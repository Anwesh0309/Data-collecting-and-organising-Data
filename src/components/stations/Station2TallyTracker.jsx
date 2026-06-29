import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.js'
import { narrate } from '../../utils/audio.js'
import { station2Narration } from '../../utils/narration.js'

const FRUIT_EMOJI = { Apples: '🍎', Mangoes: '🥭', Oranges: '🍊', Bananas: '🍌' }

function TallyDisplay({ count }) {
  const groups = Math.floor(count / 5)
  const rem = count % 5
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {Array.from({ length: groups }).map((_, gi) => (
        <div key={gi} style={{ position: 'relative', width: 36, height: 32 }}>
          {[0,1,2,3].map(li => (
            <motion.div key={li}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: li * 0.06 }}
              style={{
                position: 'absolute',
                left: li * 8 + 2,
                top: 0,
                width: 3,
                height: 30,
                background: '#1E40AF',
                borderRadius: 2,
                transformOrigin: 'top',
              }}
            />
          ))}
          {/* Crossing line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              position: 'absolute',
              left: -2,
              top: 13,
              width: 40,
              height: 3,
              background: '#EA580C',
              borderRadius: 2,
              transform: 'rotate(-20deg)',
              transformOrigin: 'left',
            }}
          />
        </div>
      ))}
      {Array.from({ length: rem }).map((_, ri) => (
        <motion.div key={`r${ri}`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          style={{
            width: 3,
            height: 30,
            background: '#1E40AF',
            borderRadius: 2,
            transformOrigin: 'top',
          }}
        />
      ))}
      {count === 0 && <span style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700 }}>No marks yet</span>}
    </div>
  )
}

export default function Station2TallyTracker({ onComplete }) {
  const { surveyData, addXP, awardStars, audioEnabled } = useGameStore()
  const fruits = Object.keys(surveyData).filter(f => surveyData[f] > 0)
  const [recorded, setRecorded] = useState(() => {
    const obj = {}
    fruits.forEach(f => { obj[f] = 0 })
    return obj
  })
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (audioEnabled) narrate(station2Narration(), true)
  }, [])

  function addTally(fruit) {
    if (recorded[fruit] >= surveyData[fruit]) return
    setRecorded(prev => {
      const next = { ...prev, [fruit]: prev[fruit] + 1 }
      const done = fruits.every(f => next[f] >= surveyData[f])
      if (done) {
        setTimeout(() => {
          setCompleted(true)
          addXP(50)
          const errors = fruits.reduce((s, f) => s + Math.abs(next[f] - surveyData[f]), 0)
          const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1
          awardStars('station-2', stars)
        }, 400)
      }
      return next
    })
  }

  const total = fruits.reduce((s, f) => s + (surveyData[f] || 0), 0)
  const totalRecorded = Object.values(recorded).reduce((a, b) => a + b, 0)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #5B4FCF, #7C3AED)',
        borderRadius: 20, padding: '12px 16px', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <span style={{ fontSize: 28 }}>✏️</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>STATION 2 OF 5</div>
          <div style={{ fontSize: 19, fontWeight: 900, fontFamily: 'var(--font-display)' }}>Tally Tracker</div>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>
            Tap the ＋ button to add tally marks! ({totalRecorded}/{total})
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: 10, background: '#E2E8F0', borderRadius: 5, overflow: 'hidden', flexShrink: 0 }}>
        <motion.div
          animate={{ width: `${total > 0 ? (totalRecorded / total) * 100 : 0}%` }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #5B4FCF, #7C3AED)', borderRadius: 5 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>

      {/* Tally reference guide */}
      <div style={{
        background: '#F0EEFF', borderRadius: 14, padding: '8px 14px',
        border: '2px solid #D4CEFC', flexShrink: 0,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#5B4FCF', marginBottom: 4 }}>
          📖 Tally Mark Guide:
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontWeight: 900,
                fontSize: 14, color: '#1E40AF', letterSpacing: 1,
              }}>
                {n <= 4 ? '|'.repeat(n) : n === 5 ? '𝄔' : n === 6 ? '𝄔|' : n === 7 ? '𝄔||' : n === 8 ? '𝄔|||' : n === 9 ? '𝄔||||' : '𝄔𝄔'}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED' }}>{n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tally rows */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0, overflow: 'auto' }}>
        {fruits.map(fruit => {
          const target = surveyData[fruit] || 0
          const done = recorded[fruit] >= target
          return (
            <motion.div key={fruit}
              style={{
                background: done ? '#DCFCE7' : '#fff',
                borderRadius: 16,
                padding: '10px 14px',
                border: `2.5px solid ${done ? '#00C853' : '#D4CEFC'}`,
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'all 0.3s',
              }}
            >
              <span style={{ fontSize: 26, flexShrink: 0 }}>{FRUIT_EMOJI[fruit] || '🍎'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1E1B3A', marginBottom: 6 }}>
                  {fruit}
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#555577', marginLeft: 8 }}>
                    ({recorded[fruit]}/{target})
                  </span>
                </div>
                <TallyDisplay count={recorded[fruit]} />
              </div>
              <motion.button
                whileHover={!done ? { scale: 1.12 } : {}}
                whileTap={!done ? { scale: 0.88 } : {}}
                onClick={() => addTally(fruit)}
                disabled={done}
                style={{
                  width: 44, height: 44,
                  borderRadius: '50%',
                  background: done ? '#94A3B8' : '#5B4FCF',
                  color: '#fff',
                  fontSize: 26, fontWeight: 900,
                  border: 'none', cursor: done ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {done ? '✓' : '+'}
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      {/* Complete */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'linear-gradient(135deg, #DCFCE7, #D1FAE5)',
              borderRadius: 18, padding: '12px 16px',
              border: '3px solid #00C853', textAlign: 'center', flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 4 }}>✏️ ✅</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#166534', marginBottom: 4 }}>
              Tally chart complete! +50 XP
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={onComplete}
              style={{
                background: 'linear-gradient(135deg, #5B4FCF, #00B5B2)',
                color: '#fff', borderRadius: 14, padding: '12px 28px',
                fontSize: 16, fontWeight: 900, border: 'none', cursor: 'pointer',
                marginTop: 8,
              }}
            >
              Build the Table →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
