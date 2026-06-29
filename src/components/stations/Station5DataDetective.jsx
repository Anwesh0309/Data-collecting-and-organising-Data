import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.js'
import { narrate, celebrate, encourage } from '../../utils/audio.js'
import { station5Narration } from '../../utils/narration.js'
import confetti from 'canvas-confetti'

const FRUIT_EMOJI = { Apples: '🍎', Mangoes: '🥭', Oranges: '🍊', Bananas: '🍌' }
const COL_COLORS = ['#FF6B9D', '#5B4FCF', '#00B5B2', '#FFD600']

function generateQuestions(data) {
  const fruits = Object.keys(data).filter(f => data[f] > 0)
  const entries = Object.entries(data).filter(([, v]) => v > 0)
  const maxEntry = entries.reduce((a, b) => a[1] > b[1] ? a : b)
  const minEntry = entries.reduce((a, b) => a[1] < b[1] ? a : b)
  const [f1, f2] = fruits.slice(0, 2)
  const diff = Math.abs(data[f1] - data[f2])

  return [
    {
      q: `Which fruit is the MOST popular?`,
      type: 'column',
      correct: maxEntry[0],
      options: fruits,
      explanation: `${maxEntry[0]} has the most icons: ${maxEntry[1]}.`,
    },
    {
      q: `Which fruit is the LEAST popular?`,
      type: 'column',
      correct: minEntry[0],
      options: fruits,
      explanation: `${minEntry[0]} has the fewest icons: ${minEntry[1]}.`,
    },
    {
      q: `How many MORE ${data[f1] > data[f2] ? f1 : f2} are there than ${data[f1] > data[f2] ? f2 : f1}?`,
      type: 'mcq',
      correct: String(diff),
      options: [String(diff), String(diff + 1), String(diff + 2), String(Math.abs(diff - 1) > 0 ? diff - 1 : diff + 3)].sort(() => Math.random() - 0.5),
      explanation: `${Math.max(data[f1], data[f2])} − ${Math.min(data[f1], data[f2])} = ${diff}.`,
    },
  ]
}

export default function Station5DataDetective({ onComplete }) {
  const { surveyData, addXP, awardStars, audioEnabled } = useGameStore()
  const fruits = Object.keys(surveyData).filter(f => surveyData[f] > 0)
  const [questions] = useState(() => generateQuestions(surveyData))
  const [qi, setQi] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (audioEnabled) narrate(station5Narration(), true)
  }, [])

  const q = questions[qi]

  function handleAnswer(ans) {
    if (selected !== null) return
    setSelected(ans)
    const isCorrect = ans === q.correct
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 }, colors: ['#5B4FCF', '#FFD600', '#00B5B2'] })
      if (audioEnabled) narrate([celebrate('Excellent! That is correct!')])
    } else {
      if (audioEnabled) narrate([encourage('Not quite! Look at the graph again.')])
    }

    setTimeout(() => {
      const newCorrect = correct + (isCorrect ? 1 : 0)
      if (qi < questions.length - 1) {
        setQi(qi + 1)
        setSelected(null)
        setFeedback(null)
        if (isCorrect) setCorrect(newCorrect)
      } else {
        const finalCorrect = newCorrect
        const stars = finalCorrect === 3 ? 3 : finalCorrect === 2 ? 2 : 1
        awardStars('station-5', stars)
        addXP(50)
        setCorrect(finalCorrect)
        setCompleted(true)
      }
    }, 1800)
  }

  const maxVal = Math.max(...Object.values(surveyData).filter(Boolean))

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E40AF, #5B4FCF)',
        borderRadius: 20, padding: '12px 16px', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <span style={{ fontSize: 28 }}>🔍</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>STATION 5 OF 5</div>
          <div style={{ fontSize: 19, fontWeight: 900, fontFamily: 'var(--font-display)' }}>Data Detective</div>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>
            Answer questions about the graph! (Q{qi + 1}/3)
          </div>
        </div>
      </div>

      {/* Graph display */}
      <div style={{
        background: '#fff', borderRadius: 18, padding: '12px',
        border: '3px solid #BFDBFE',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#1E40AF', textAlign: 'center', marginBottom: 8 }}>
          📊 Picture Graph — Favourite Fruits
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', justifyContent: 'center' }}>
          {fruits.map((fruit, ci) => {
            const n = surveyData[fruit]
            const isHighlight = q.type === 'column' && feedback !== null && fruit === q.correct
            const color = COL_COLORS[ci % COL_COLORS.length]
            return (
              <motion.div
                key={fruit}
                whileHover={q.type === 'column' && !feedback ? { scale: 1.06 } : {}}
                onClick={() => q.type === 'column' && !feedback && handleAnswer(fruit)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  flex: 1, maxWidth: 70, cursor: q.type === 'column' && !feedback ? 'pointer' : 'default',
                  background: isHighlight ? `${color}18` : 'transparent',
                  borderRadius: 10,
                  padding: '4px',
                  border: isHighlight ? `3px solid ${color}` : '3px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                {Array.from({ length: n }).map((_, si) => (
                  <motion.div
                    key={si}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: si * 0.04, type: 'spring', stiffness: 400 }}
                    style={{
                      fontSize: 22,
                      padding: 1,
                    }}
                  >{FRUIT_EMOJI[fruit] || '🍎'}</motion.div>
                ))}
                <div style={{
                  marginTop: 4, padding: '3px 6px', background: color,
                  borderRadius: 6, fontSize: 10, fontWeight: 800, color: '#fff',
                  textAlign: 'center', width: '100%',
                }}>
                  {fruit.slice(0, 5)}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 15, color: color, marginTop: 2 }}>
                  {n}
                </div>
              </motion.div>
            )
          })}
        </div>
        <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#555577', marginTop: 4 }}>
          🔑 Each {FRUIT_EMOJI[fruits[0]]} = 1 student
        </div>
      </div>

      {/* Question */}
      {!completed && (
        <AnimatePresence mode="wait">
          <motion.div
            key={qi}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            style={{
              background: 'linear-gradient(135deg, #1E40AF, #5B4FCF)',
              borderRadius: 18, padding: '14px 16px', color: '#fff', flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, marginBottom: 3 }}>
              Question {qi + 1} of {questions.length}
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, lineHeight: 1.4 }}>{q.q}</div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* MCQ Options */}
      {!completed && q.type === 'mcq' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flexShrink: 0 }}>
          {q.options.map((opt, i) => {
            const isCorrect = opt === q.correct
            const isSel = opt === selected
            let bg = '#fff', border = '#E2E8F0', color = '#1E1B3A'
            if (feedback) {
              if (isCorrect) { bg = '#DCFCE7'; border = '#00C853'; color = '#166534' }
              else if (isSel && !isCorrect) { bg = '#FEE2E2'; border = '#FF3B30'; color = '#991B1B' }
            }
            return (
              <motion.button
                key={i}
                whileHover={!feedback ? { scale: 1.04, y: -2 } : {}}
                whileTap={!feedback ? { scale: 0.97 } : {}}
                animate={isSel && feedback === 'wrong' ? { x: [-5, 5, -4, 4, 0] } : {}}
                onClick={() => handleAnswer(opt)}
                style={{
                  background: bg, border: `2.5px solid ${border}`, borderRadius: 14,
                  padding: '12px', fontSize: 20, fontWeight: 900,
                  color, cursor: feedback ? 'default' : 'pointer',
                  fontFamily: 'var(--font-mono)',
                  transition: 'all 0.2s',
                }}
              >{opt}</motion.button>
            )
          })}
        </div>
      )}

      {/* Column tap hint */}
      {!completed && q.type === 'column' && !feedback && (
        <div style={{
          background: '#EFF6FF', borderRadius: 10, padding: '8px 12px',
          fontSize: 13, fontWeight: 700, color: '#1E40AF',
          border: '1.5px solid #BFDBFE', textAlign: 'center', flexShrink: 0,
        }}>
          👆 Tap the correct column in the graph above!
        </div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {feedback && !completed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: feedback === 'correct' ? '#DCFCE7' : '#FEE2E2',
              borderRadius: 12, padding: '10px 14px',
              border: `2px solid ${feedback === 'correct' ? '#00C853' : '#FF3B30'}`,
              fontSize: 14, fontWeight: 800,
              color: feedback === 'correct' ? '#166534' : '#991B1B',
              flexShrink: 0,
            }}
          >
            {feedback === 'correct'
              ? `✅ Correct! ${q.explanation}`
              : `💡 The answer is: ${q.correct}. ${q.explanation}`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'linear-gradient(135deg, #EFF6FF, #F0EEFF)',
              borderRadius: 20, padding: '16px',
              border: '3px solid #5B4FCF', textAlign: 'center', flex: 1,
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10,
            }}
          >
            <div style={{ fontSize: 40 }}>🏆</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#5B4FCF' }}>
              Station 5 Complete!
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#555577' }}>
              You got {correct}/3 questions correct!
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
              {[1,2,3].map(i => (
                <span key={i} style={{ fontSize: 30, opacity: i <= correct ? 1 : 0.25 }}>⭐</span>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={onComplete}
              style={{
                background: 'linear-gradient(135deg, #5B4FCF, #00B5B2)',
                color: '#fff', borderRadius: 16, padding: '14px',
                fontSize: 18, fontWeight: 900, border: 'none', cursor: 'pointer',
                marginTop: 8,
              }}
            >
              🎉 See Your Results!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
