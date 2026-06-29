import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.js'
import { narrate } from '../../utils/audio.js'
import { station4Narration } from '../../utils/narration.js'

const FRUIT_EMOJI = { Apples: '🍎', Mangoes: '🥭', Oranges: '🍊', Bananas: '🍌' }
const COL_COLORS = ['#FF6B9D', '#5B4FCF', '#00B5B2', '#FFD600']

export default function Station4GraphMaker({ onComplete }) {
  const { surveyData, addXP, awardStars, audioEnabled } = useGameStore()
  const fruits = Object.keys(surveyData).filter(f => surveyData[f] > 0)
  const total = Object.values(surveyData).reduce((a, b) => a + b, 0)

  const [placed, setPlaced] = useState(() => {
    const obj = {}
    fruits.forEach(f => { obj[f] = 0 })
    return obj
  })
  const [selected, setSelected] = useState(null)   // which fruit type is selected from tray
  const [wrongCol, setWrongCol] = useState(null)
  const [completed, setCompleted] = useState(false)

  // Stable shuffled tray — built once
  const [tray] = useState(() => {
    const items = []
    fruits.forEach(f => {
      for (let i = 0; i < (surveyData[f] || 0); i++) items.push(f)
    })
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]]
    }
    return items
  })

  useEffect(() => {
    if (audioEnabled) narrate(station4Narration(), true)
  }, [])

  const totalPlaced = Object.values(placed).reduce((a, b) => a + b, 0)
  // Items still in tray = tail of tray after removing placed count
  const trayRemaining = tray.slice(totalPlaced)

  function selectFromTray(fruit) {
    setSelected(prev => prev === fruit ? null : fruit)
  }

  function placeIntoColumn(fruit) {
    if (selected === null) return
    if (placed[fruit] >= surveyData[fruit]) return

    if (selected === fruit) {
      // Correct column
      setPlaced(prev => {
        const next = { ...prev, [fruit]: prev[fruit] + 1 }
        if (fruits.every(f => next[f] >= surveyData[f])) {
          setTimeout(() => {
            setCompleted(true)
            addXP(50)
            awardStars('station-4', 3)
          }, 500)
        }
        return next
      })
      setSelected(null)
    } else {
      // Wrong column
      setWrongCol(fruit)
      setTimeout(() => setWrongCol(null), 700)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FF6B9D, #FF9800)',
        borderRadius: 20, padding: '12px 16px', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <span style={{ fontSize: 28 }}>🖼️</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>STATION 4 OF 5</div>
          <div style={{ fontSize: 19, fontWeight: 900, fontFamily: 'var(--font-display)' }}>Graph Maker</div>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>
            Tap an icon → then tap its fruit column! ({totalPlaced}/{total})
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: 10, background: '#E2E8F0', borderRadius: 5, overflow: 'hidden', flexShrink: 0 }}>
        <motion.div
          animate={{ width: `${total > 0 ? (totalPlaced / total) * 100 : 0}%` }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #FF6B9D, #FF9800)', borderRadius: 5 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>

      {/* Icon tray */}
      {!completed && trayRemaining.length > 0 && (
        <div style={{
          background: '#FFF8E1', borderRadius: 14, padding: '8px 12px',
          border: `2px solid ${selected ? '#FF6B9D' : '#FFD600'}`, flexShrink: 0,
          transition: 'border-color 0.2s',
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#FF9800', marginBottom: 6 }}>
            {selected
              ? `✅ Selected ${FRUIT_EMOJI[selected]} ${selected} — now tap its column below!`
              : '🍱 Tap an icon to select it, then tap its column:'}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {trayRemaining.map((fruit, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.12, y: -3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => selectFromTray(fruit)}
                style={{
                  width: 46, height: 46,
                  borderRadius: 12,
                  background: selected === fruit ? '#FF6B9D' : '#fff',
                  border: `3px solid ${selected === fruit ? '#FF6B9D' : '#E2E8F0'}`,
                  fontSize: 26,
                  cursor: 'pointer',
                  boxShadow: selected === fruit ? '0 4px 16px rgba(255,107,157,0.55)' : '0 2px 6px rgba(0,0,0,0.07)',
                  transition: 'all 0.18s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {FRUIT_EMOJI[fruit] || '🍎'}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Picture graph */}
      <div style={{
        flex: 1, minHeight: 0,
        background: '#fff',
        borderRadius: 18,
        border: '3px solid #FFD600',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#FF9800', marginBottom: 8, textAlign: 'center' }}>
          📊 Picture Graph — Favourite Fruits
        </div>

        <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'flex-end', justifyContent: 'center', minHeight: 0 }}>
          {fruits.map((fruit, ci) => {
            const target = surveyData[fruit]
            const filledCount = placed[fruit]
            const colColor = COL_COLORS[ci % COL_COLORS.length]
            const isWrong = wrongCol === fruit
            const isTarget = selected !== null && placed[fruit] < target

            return (
              <div key={fruit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: 80 }}>
                <motion.div
                  animate={isWrong ? { x: [-6, 6, -5, 5, 0] } : {}}
                  transition={{ duration: 0.35 }}
                  onClick={() => placeIntoColumn(fruit)}
                  style={{
                    display: 'flex', flexDirection: 'column-reverse',
                    gap: 3,
                    cursor: isTarget ? 'pointer' : 'default',
                    minHeight: 160,
                    justifyContent: 'flex-start',
                    width: '100%',
                    alignItems: 'center',
                    padding: '4px',
                    borderRadius: 10,
                    background: isTarget ? `${colColor}14` : 'transparent',
                    border: isWrong ? `2px solid #FF3B30`
                      : isTarget ? `2px dashed ${colColor}`
                      : '2px solid transparent',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                >
                  {Array.from({ length: target }).map((_, si) => (
                    <motion.div
                      key={si}
                      initial={si === filledCount - 1 ? { scale: 0, y: -10 } : false}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      style={{
                        width: 34, height: 34,
                        borderRadius: 8,
                        background: si < filledCount ? `${colColor}28` : '#F1F5F9',
                        border: `2px ${si < filledCount ? 'solid' : 'dashed'} ${si < filledCount ? colColor : '#CBD5E1'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20,
                      }}
                    >
                      {si < filledCount ? (FRUIT_EMOJI[fruit] || '🍎') : ''}
                    </motion.div>
                  ))}
                </motion.div>

                <div style={{
                  marginTop: 4,
                  padding: '4px 6px',
                  background: colColor,
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#fff',
                  textAlign: 'center',
                  width: '100%',
                }}>
                  {FRUIT_EMOJI[fruit]} {fruit.slice(0, 5)}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 900,
                  fontSize: 16,
                  color: colColor,
                  marginTop: 2,
                }}>{filledCount}</div>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#555577', marginTop: 4 }}>
          Each icon = 1 student
        </div>
      </div>

      {/* Complete */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #FFF8E1, #FFFBEB)',
              borderRadius: 18, padding: '14px 16px',
              border: '3px solid #FFD600', textAlign: 'center', flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 900, color: '#92400E', marginBottom: 8 }}>
              🖼️ Picture graph complete! +50 XP 🎉
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={onComplete}
              style={{
                background: 'linear-gradient(135deg, #FF6B9D, #5B4FCF)',
                color: '#fff', borderRadius: 14, padding: '12px 28px',
                fontSize: 16, fontWeight: 900, border: 'none', cursor: 'pointer',
              }}
            >
              🔍 Be a Data Detective! →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
