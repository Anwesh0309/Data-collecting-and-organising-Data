import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.js'
import { narrate } from '../../utils/audio.js'
import { station3Narration } from '../../utils/narration.js'

const FRUIT_EMOJI = { Apples: '🍎', Mangoes: '🥭', Oranges: '🍊', Bananas: '🍌' }

export default function Station3TableBuilder({ onComplete }) {
  const { surveyData, addXP, awardStars, audioEnabled } = useGameStore()
  const fruits = Object.keys(surveyData).filter(f => surveyData[f] > 0)

  // Cells: each fruit → placed number (null = not yet)
  const [cells, setCells] = useState(() => {
    const obj = {}
    fruits.forEach(f => { obj[f] = null })
    return obj
  })

  // Number pool (all correct values, shuffled)
  const [pool] = useState(() => {
    const vals = fruits.map(f => surveyData[f])
    for (let i = vals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [vals[i], vals[j]] = [vals[j], vals[i]]
    }
    return vals
  })

  const [selected, setSelected]   = useState(null)   // number selected from pool
  const [wrongRow, setWrongRow]   = useState(null)   // fruit key that got wrong placement
  const [usedNums, setUsedNums]   = useState([])     // placed numbers (to hide from pool)
  const [completed, setCompleted] = useState(false)
  const [errors, setErrors]       = useState(0)

  useEffect(() => {
    if (audioEnabled) narrate(station3Narration(), true)
  }, [])

  function pickNumber(num) {
    // Toggle selection
    setSelected(prev => prev === num ? null : num)
  }

  function placeInRow(fruit) {
    if (selected === null) return
    if (cells[fruit] !== null) return   // row already filled

    const correct = surveyData[fruit]
    if (selected === correct) {
      // ✅ Correct
      const newCells = { ...cells, [fruit]: selected }
      setCells(newCells)
      setUsedNums(prev => [...prev, selected])
      setSelected(null)

      // Check all filled
      if (fruits.every(f => newCells[f] !== null)) {
        setTimeout(() => {
          setCompleted(true)
          addXP(50)
          const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1
          awardStars('station-3', stars)
        }, 300)
      }
    } else {
      // ❌ Wrong
      setErrors(e => e + 1)
      setWrongRow(fruit)
      setTimeout(() => { setWrongRow(null) }, 700)
    }
  }

  const availablePool = pool.filter(n => !usedNums.includes(n))

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #00B5B2, #1E40AF)',
        borderRadius: 20, padding: '12px 16px', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <span style={{ fontSize: 28 }}>📋</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>STATION 3 OF 5</div>
          <div style={{ fontSize: 19, fontWeight: 900, fontFamily: 'var(--font-display)' }}>Table Builder</div>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>
            Tap a number → tap the correct fruit row!
          </div>
        </div>
      </div>

      {/* Number pool */}
      <div style={{
        background: '#EFF6FF', borderRadius: 14, padding: '10px 14px',
        border: `2px solid ${selected !== null ? '#5B4FCF' : '#BFDBFE'}`,
        transition: 'border-color 0.2s', flexShrink: 0,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#1E40AF', marginBottom: 8 }}>
          {selected !== null
            ? `✅ Selected: ${selected} — now tap the correct fruit row below!`
            : '📦 Tap a number to select it:'}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {availablePool.map((num, i) => (
            <motion.button
              key={`${num}-${i}`}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => pickNumber(num)}
              style={{
                width: 52, height: 52, borderRadius: 14,
                background: selected === num ? '#5B4FCF' : '#fff',
                border: `3px solid ${selected === num ? '#5B4FCF' : '#BFDBFE'}`,
                fontSize: 22, fontWeight: 900,
                color: selected === num ? '#fff' : '#1E40AF',
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
                boxShadow: selected === num ? '0 6px 20px rgba(91,79,207,0.5)' : '0 2px 8px rgba(0,0,0,0.07)',
                transition: 'all 0.18s',
              }}
            >
              {num}
            </motion.button>
          ))}
          {availablePool.length === 0 && (
            <span style={{ fontSize: 14, fontWeight: 700, color: '#00C853' }}>All numbers placed! ✓</span>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: 18, overflow: 'hidden',
        border: '3px solid #BFDBFE', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
      }}>
        {/* Header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 130px 80px',
          background: '#1E40AF', padding: '10px 14px', flexShrink: 0,
        }}>
          {['Fruit', 'Tally Marks', 'Number'].map(h => (
            <div key={h} style={{ fontSize: 14, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)' }}>
              {h}
            </div>
          ))}
        </div>

        {/* Data rows */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {fruits.map((fruit, ri) => {
            const isDone  = cells[fruit] !== null
            const isWrong = wrongRow === fruit
            const n = surveyData[fruit]
            const groups = Math.floor(n / 5)
            const rem    = n % 5
            const tallyStr = '𝄔 '.repeat(groups) + '|'.repeat(rem)

            return (
              <motion.div
                key={fruit}
                animate={isWrong ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
                transition={{ duration: 0.35 }}
                onClick={() => !isDone && placeInRow(fruit)}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 130px 80px',
                  padding: '10px 14px',
                  background: isDone ? '#DCFCE7' : isWrong ? '#FEE2E2' : ri % 2 === 0 ? '#F8FAFF' : '#fff',
                  borderBottom: '1.5px solid #E2E8F0',
                  cursor: selected !== null && !isDone ? 'pointer' : 'default',
                  border: isWrong ? '2px solid #FF3B30'
                    : isDone ? '2px solid #00C853'
                    : selected !== null && !isDone ? '2px dashed #5B4FCF'
                    : '2px solid transparent',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                {/* Fruit label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{FRUIT_EMOJI[fruit] || '🍎'}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#1E1B3A' }}>{fruit}</span>
                </div>

                {/* Tally */}
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 14,
                  color: '#1E40AF', fontWeight: 700,
                  display: 'flex', alignItems: 'center',
                  letterSpacing: 1,
                }}>
                  {tallyStr || '—'}
                </div>

                {/* Number cell */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: '#00C853', color: '#fff',
                        fontSize: 22, fontWeight: 900,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >{cells[fruit]}</motion.div>
                  ) : (
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: selected !== null ? '#EFF6FF' : '#F1F5F9',
                      border: `2px dashed ${selected !== null ? '#5B4FCF' : '#CBD5E1'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, color: '#94A3B8',
                      transition: 'all 0.2s',
                    }}>?</div>
                  )}
                </div>
              </motion.div>
            )
          })}

          {/* Total row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 130px 80px',
            background: '#F0EEFF', padding: '10px 14px',
            borderTop: '2px solid #D4CEFC',
          }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#5B4FCF' }}>TOTAL</div>
            <div />
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 900, color: '#5B4FCF',
              textAlign: 'center',
            }}>
              {Object.values(surveyData).reduce((a, b) => a + b, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Complete */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #DCFCE7, #D1FAE5)',
              borderRadius: 18, padding: '14px 16px',
              border: '3px solid #00C853', textAlign: 'center', flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 900, color: '#166534', marginBottom: 8 }}>
              📋 Table complete! +50 XP 🎉
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={onComplete}
              style={{
                background: 'linear-gradient(135deg, #00B5B2, #1E40AF)',
                color: '#fff', borderRadius: 14, padding: '12px 28px',
                fontSize: 16, fontWeight: 900, border: 'none', cursor: 'pointer',
              }}
            >
              Create the Picture Graph →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
