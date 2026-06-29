import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.js'
import { narrate } from '../../utils/audio.js'
import { station1Narration } from '../../utils/narration.js'
import { FRUITS } from '../../data/questions.js'

const FRUITS_POOL = FRUITS.slice(0, 4)
const FRUIT_EMOJI = { Apples: '🍎', Mangoes: '🥭', Oranges: '🍊', Bananas: '🍌' }
const FRIEND_NAMES = ['Amir', 'Mei', 'Priya', 'Rajan', 'Sara', 'Dev', 'Zara', 'Omar', 'Lena', 'Arjun']
const FRIEND_AVATARS = ['👦🏽','👧🏻','👧🏾','👦🏻','🧒🏽','👦🏿','👧🏽','👦🏻','👩🏽','👦🏾']
const FRIEND_COLORS = ['#5B4FCF','#FF6B9D','#00B5B2','#FFD600','#FF9800','#9C27B0','#00C853','#1E40AF','#EA580C','#0D9488']

function generateFriends() {
  return FRIEND_NAMES.map((name, i) => ({
    id: i,
    name,
    avatar: FRIEND_AVATARS[i],
    color: FRIEND_COLORS[i],
    choice: FRUITS_POOL[Math.floor(Math.random() * FRUITS_POOL.length)],
  }))
}

export default function Station1DataCollector({ onComplete }) {
  const { addXP, awardStars, setSurveyData, audioEnabled } = useGameStore()
  const [friends] = useState(generateFriends)
  const [tapped, setTapped] = useState(new Set())
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (audioEnabled) narrate(station1Narration(), true)
  }, [])

  function tapFriend(id) {
    if (tapped.has(id)) return
    setTapped(prev => new Set([...prev, id]))
  }

  const counts = {}
  FRUITS_POOL.forEach(f => { counts[f] = 0 })
  tapped.forEach(id => { counts[friends[id].choice]++ })

  const allTapped = tapped.size === friends.length

  function handleReveal() {
    setShowResult(true)
    const stars = tapped.size >= 10 ? 3 : tapped.size >= 7 ? 2 : 1
    awardStars('station-1', stars)
    addXP(50)
    setSurveyData({ ...counts })
  }

  function handleNext() {
    onComplete()
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FF9800, #FF6B9D)',
        borderRadius: 20,
        padding: '12px 16px',
        color: '#fff',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <span style={{ fontSize: 28 }}>🧑‍🤝‍🧑</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>STATION 1 OF 5</div>
          <div style={{ fontSize: 19, fontWeight: 900, fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
            Data Collector
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>
            Tap each friend to ask their favourite fruit! ({tapped.size}/{friends.length})
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 10, background: '#E2E8F0', borderRadius: 5, overflow: 'hidden', flexShrink: 0 }}>
        <motion.div
          animate={{ width: `${(tapped.size / friends.length) * 100}%` }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #FF9800, #FF6B9D)', borderRadius: 5 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>

      {/* Friends grid */}
      {!showResult && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 8,
          flex: 1,
          minHeight: 0,
        }}>
          {friends.map(f => (
            <motion.button
              key={f.id}
              whileHover={!tapped.has(f.id) ? { scale: 1.08, y: -4 } : {}}
              whileTap={!tapped.has(f.id) ? { scale: 0.92 } : {}}
              onClick={() => tapFriend(f.id)}
              style={{
                background: tapped.has(f.id) ? `${f.color}22` : '#fff',
                borderRadius: 16,
                padding: '8px 4px',
                border: `2.5px solid ${tapped.has(f.id) ? f.color : '#E2E8F0'}`,
                cursor: tapped.has(f.id) ? 'default' : 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: 26 }}>{f.avatar}</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#334155', marginTop: 2 }}>{f.name}</div>
              <AnimatePresence>
                {tapped.has(f.id) && (
                  <motion.div
                    initial={{ scale: 0, y: -8 }}
                    animate={{ scale: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      top: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#fff',
                      borderRadius: 8,
                      padding: '2px 6px',
                      fontSize: 18,
                      boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
                      border: `2px solid ${f.color}`,
                      zIndex: 10,
                    }}
                  >
                    {FRUIT_EMOJI[f.choice] || '🍎'}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      )}

      {/* Live tally */}
      {tapped.size > 0 && !showResult && (
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          borderRadius: 16,
          padding: '10px 14px',
          border: '2px solid #FFD600',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#FF9800', marginBottom: 6 }}>📊 Survey so far:</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {FRUITS_POOL.map(f => (
              <div key={f} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#FFF8E1', borderRadius: 10, padding: '4px 10px',
                border: '1.5px solid #FFD600',
              }}>
                <span style={{ fontSize: 18 }}>{FRUIT_EMOJI[f]}</span>
                <span style={{ fontWeight: 800, fontSize: 13, color: '#1E1B3A' }}>{f}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 900,
                  fontSize: 18,
                  color: '#FF9800',
                }}>{counts[f]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Survey results */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'linear-gradient(135deg, #DCFCE7, #D1FAE5)',
              borderRadius: 20,
              padding: '14px 16px',
              border: '3px solid #00C853',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 900, color: '#166534', textAlign: 'center' }}>
              🎉 Survey Complete! Here are your results:
            </div>
            {FRUITS_POOL.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22, width: 28 }}>{FRUIT_EMOJI[f]}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#1E1B3A', width: 80 }}>{f}</span>
                {/* Bar */}
                <div style={{ flex: 1, background: '#A7F3D0', borderRadius: 6, height: 20, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(counts[f] / friends.length) * 100}%` }}
                    transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                    style={{ height: '100%', background: '#00C853', borderRadius: 6 }}
                  />
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 900, fontSize: 18, color: '#00C853', width: 24, textAlign: 'right',
                }}>{counts[f]}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      {!showResult ? (
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={allTapped ? handleReveal : undefined}
          disabled={!allTapped}
          style={{
            background: allTapped ? 'linear-gradient(135deg, #FF9800, #FF6B9D)' : '#94A3B8',
            color: '#fff', borderRadius: 16, padding: '14px', fontSize: 18, fontWeight: 900,
            border: 'none', cursor: allTapped ? 'pointer' : 'not-allowed', flexShrink: 0,
          }}
        >
          {allTapped ? '📊 See the Results!' : `Tap ${friends.length - tapped.size} more friend${friends.length - tapped.size !== 1 ? 's' : ''}...`}
        </motion.button>
      ) : (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          style={{
            background: 'linear-gradient(135deg, #00C853, #00B5B2)',
            color: '#fff', borderRadius: 16, padding: '14px', fontSize: 18, fontWeight: 900,
            border: 'none', cursor: 'pointer', flexShrink: 0,
          }}
        >
          ✏️ Now Record with Tally Marks →
        </motion.button>
      )}
    </div>
  )
}
