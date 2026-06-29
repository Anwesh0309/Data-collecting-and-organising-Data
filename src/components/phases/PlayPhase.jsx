import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.js'
import { narrate, celebrate, encourage, stopNarration, ask } from '../../utils/audio.js'
import confetti from 'canvas-confetti'
import { WORLDS, buildWorldQuestions } from '../../data/questions.js'

// Fixed star positions
const STAR_POS = Array.from({ length: 45 }, (_, i) => ({
  x: ((i * 137.5) % 100).toFixed(1), y: ((i * 97.3) % 100).toFixed(1),
  r: i % 3 === 0 ? 1.3 : 0.75, dur: (2 + (i % 4) * 0.55).toFixed(1), delay: ((i * 0.3) % 4).toFixed(1),
}))
function StarBg() {
  return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0 }}>
      {STAR_POS.map((s,i) => (
        <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity="0">
          <animate attributeName="opacity" values="0;0.45;0" dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  )
}

// ── Correct/Wrong popup overlay — exactly like reference ──────────────────
function FeedbackPopup({ type, explanation, onNext }) {
  const isCorrect = type === 'correct'
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onNext}
    >
      <motion.div
        initial={{ y: 30 }} animate={{ y: 0 }}
        style={{
          background: isCorrect ? '#22c55e' : '#ef4444',
          borderRadius: 20, padding: '28px 32px',
          textAlign: 'center', maxWidth: 320, width: '90%',
          boxShadow: `0 20px 60px ${isCorrect ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Big emoji */}
        <div style={{ fontSize: 52, marginBottom: 12 }}>
          {isCorrect ? '🎉' : '😢'}
        </div>
        <div style={{
          fontFamily: 'var(--font-heading)', fontWeight: 900,
          fontSize: 28, color: '#fff', marginBottom: 8,
        }}>
          {isCorrect ? 'Correct! 🎊' : 'Not quite!'}
        </div>
        {explanation && (
          <div style={{
            fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
            lineHeight: 1.5, marginBottom: 16,
          }}>
            {explanation}
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={onNext}
          style={{
            background: 'rgba(255,255,255,0.25)',
            border: '2px solid rgba(255,255,255,0.5)',
            borderRadius: 12, padding: '10px 24px',
            fontSize: 15, fontWeight: 800, color: '#fff',
            cursor: 'pointer', width: '100%', marginTop: 8,
          }}
        >
          Continue →
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ── World chooser ─────────────────────────────────────────────────────────
function WorldChooser({ completedWorlds, scores, onStart }) {
  return (
    <div style={{
      flex:1, display:'flex', flexDirection:'column',
      background:'radial-gradient(ellipse at 50% 30%, #2d1b69 0%, #1a1040 70%)',
      padding:'14px 18px', overflow:'hidden', position:'relative',
    }}>
      <StarBg />
      <div style={{ position:'relative', zIndex:1, flex:1, display:'flex', flexDirection:'column' }}>
        <div style={{ textAlign:'center', marginBottom:10, flexShrink:0 }}>
          <div style={{ fontSize:26, marginBottom:4 }}>🗺️</div>
          <h2 style={{ fontFamily:'var(--font-heading)', fontWeight:900, fontSize:22, color:'#fff', marginBottom:4 }}>
            Choose Your World!
          </h2>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.45)', fontWeight:600, marginBottom:8 }}>
            10 questions per world · Practice arena · Learn & master data!
          </p>
        </div>

        <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:8 }}>
          {WORLDS.map((world, i) => {
            const unlocked = i === 0 || completedWorlds.includes(WORLDS[i-1].id)
            const done     = completedWorlds.includes(world.id)
            const sc       = scores[world.id]
            return (
              <motion.div key={world.id} whileHover={unlocked ? { x: 3 } : {}}
                style={{
                  background: done ? `${world.color}12` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${done ? world.color+'44' : unlocked ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius:14, padding:'12px 14px',
                  display:'flex', alignItems:'center', gap:12,
                  opacity: unlocked ? 1 : 0.4,
                }}
              >
                <div style={{
                  width:42, height:42, borderRadius:'50%', flexShrink:0,
                  background:`${world.color}${unlocked?'22':'0D'}`,
                  border:`2px solid ${world.color}${unlocked?'55':'22'}`,
                  display:'flex', alignItems:'center', justifyCustent:'center', fontSize:20,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {unlocked ? world.icon : '🔒'}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:unlocked?'#fff':'rgba(255,255,255,0.3)', fontFamily:'var(--font-heading)' }}>
                    {world.name}
                    {done && sc && <span style={{ marginLeft:8, fontSize:11, color:world.color, fontWeight:700 }}>✓ {sc.accuracy}%</span>}
                  </div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600, marginTop:1 }}>{world.desc}</div>
                </div>
                {done && sc && (
                  <div style={{ display:'flex', gap:2, flexShrink:0 }}>
                    {[1,2,3].map(n=><span key={n} style={{fontSize:13,opacity:n<=sc.stars?1:0.2}}>⭐</span>)}
                  </div>
                )}
                {unlocked && (
                  <motion.button whileHover={{scale:1.07}} whileTap={{scale:0.93}}
                    onClick={() => onStart(world)}
                    style={{
                      background:world.color, color:'#fff', border:'none',
                      borderRadius:8, padding:'7px 14px', fontSize:12, fontWeight:800,
                      cursor:'pointer', flexShrink:0,
                    }}>
                    ▶ PLAY
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Game session: 10 questions, strict test ────────────────────────────────
function GameSession({ world, onFinish }) {
  const { addXP, audioEnabled } = useGameStore()
  const [questions] = useState(() => buildWorldQuestions(world))
  const [qi, setQi]           = useState(0)
  const [score, setScore]     = useState(0)
  const [wrongCount, setWrong]= useState(0)
  const [streak, setStreak]   = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [popup, setPopup]     = useState(null) // { type:'correct'|'wrong', explanation }
  const [selected, setSelected] = useState(null)
  const [done, setDone]       = useState(false)
  const [showHint, setShowHint] = useState(false)
  const advancing = useRef(false)

  const q     = questions[qi]
  const total = questions.length
  const pct   = Math.round((qi / total) * 100)

  // Narrate the question on change
  useEffect(() => {
    if (q) {
      stopNarration()
      if (audioEnabled) {
        narrate([ask(q.audioText)])
      }
    }
    return () => stopNarration()
  }, [qi, audioEnabled])

  // Reset hint state on question change
  useEffect(() => {
    setShowHint(false)
  }, [qi])

  // No auto-advance — user must tap the popup to continue

  function handleAnswer(opt) {
    if (popup || advancing.current || selected) return
    setSelected(opt)
    const ok = opt === q.correct
    advancing.current = true

    stopNarration()

    if (ok) {
      setScore(s => s + 10)
      setStreak(s => {
        const next = s + 1
        setMaxStreak(m => Math.max(m, next))
        return next
      })
      confetti({ particleCount: 60, spread: 65, origin:{ y:0.65 }, colors:[world.color,'#f5c518','#fff'] })
      if (audioEnabled) narrate([celebrate('Correct! Well done!')])
    } else {
      setWrong(w => w + 1)
      setStreak(0)
      if (audioEnabled) narrate([encourage('Not quite! Keep going.')])
    }
    setPopup({ type: ok ? 'correct' : 'wrong', explanation: q.explanation })
  }

  function handlePopupNext() {
    setPopup(null)
    setSelected(null)
    advancing.current = false
    const next = qi + 1
    if (next >= total) {
      setDone(true)
    } else {
      setQi(next)
    }
  }

  // World complete screen
  if (done) {
    const correct  = score / 10
    const accuracy = Math.round((correct / total) * 100)
    const stars    = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : 1
    const result   = { score, accuracy, stars, correct, total, maxStreak }
    return (
      <div style={{
        flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        background:'radial-gradient(ellipse at 50% 40%, #2d1b69, #1a1040)',
        padding:20, position:'relative', overflow:'hidden',
      }}>
        <StarBg />
        <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
          transition={{type:'spring',stiffness:280,damping:22}}
          style={{
            position:'relative', zIndex:1,
            background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
            borderRadius:24, padding:'28px 22px', textAlign:'center', maxWidth:400, width:'100%',
          }}
        >
          <div style={{fontSize:48,marginBottom:8}}>🏆</div>
          <h2 style={{fontFamily:'var(--font-heading)',fontWeight:900,fontSize:24,color:'#fff',marginBottom:4}}>
            {world.name} Complete!
          </h2>
          {/* Stars */}
          <div style={{display:'flex',gap:8,justifyContent:'center',margin:'12px 0'}}>
            {[1,2,3].map(i=>(
              <motion.span key={i} initial={{scale:0,rotate:-180}} animate={{scale:1,rotate:0}}
                transition={{delay:i*0.2,type:'spring',stiffness:400,damping:14}}
                style={{fontSize:36,filter:i<=stars?'drop-shadow(0 0 8px rgba(245,197,24,0.9))':'grayscale(1)',opacity:i<=stars?1:0.2}}>
                ⭐
              </motion.span>
            ))}
          </div>
          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,margin:'14px 0'}}>
            {[
              {l:'Score',v:`${score}`,e:'🏆',c:world.color},
              {l:'Correct',v:`${correct}/${total}`,e:'✅',c:'#22c55e'},
              {l:'Accuracy',v:`${accuracy}%`,e:'🎯',c:'#a855f7'},
            ].map(s=>(
              <div key={s.l} style={{background:'rgba(255,255,255,0.06)',borderRadius:12,padding:'10px 4px',border:'1px solid rgba(255,255,255,0.1)'}}>
                <div style={{fontSize:18}}>{s.e}</div>
                <div style={{fontSize:18,fontWeight:900,color:s.c,fontFamily:'var(--font-mono)'}}>{s.v}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',fontWeight:600}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{
            background:accuracy>=90?'rgba(34,197,94,0.1)':accuracy>=60?'rgba(245,197,24,0.1)':'rgba(239,68,68,0.1)',
            border:`1px solid ${accuracy>=90?'rgba(34,197,94,0.3)':accuracy>=60?'rgba(245,197,24,0.3)':'rgba(239,68,68,0.3)'}`,
            borderRadius:10,padding:'8px 12px',fontSize:13,fontWeight:700,marginBottom:14,
            color:accuracy>=90?'#86efac':accuracy>=60?'#f5c518':'#fca5a5',
          }}>
            {accuracy>=90?'🌟 Outstanding! Perfect Data Detective!':accuracy>=60?'⭐ Great work! Keep practising!':'💪 Keep going — every attempt improves you!'}
          </div>
          <div style={{display:'flex',gap:10, justifyContent:'center'}}>
            <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.97}}
              onClick={() => onFinish(world.id, result, 'next')}
              className="btn-yellow" style={{fontSize:15,padding:'12px 32px'}}>
              ← Back to Worlds
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#1a1040', padding:'10px 16px 14px' }}>

      {/* World badge */}
      <div style={{textAlign:'center',marginBottom:8,flexShrink:0}}>
        <div style={{
          display:'inline-flex',alignItems:'center',gap:6,
          background:`${world.color}22`,border:`1px solid ${world.color}55`,
          borderRadius:999,padding:'4px 14px',fontSize:13,fontWeight:800,color:world.color,
        }}>
          {world.icon} {world.name}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        display:'flex',alignItems:'center',justifyContent:'space-between',
        background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:12,padding:'8px 14px',marginBottom:8,flexShrink:0,
      }}>
        <div style={{display:'flex',alignItems:'center',gap:5}}>
          <span style={{fontSize:16}}>⭐</span>
          <span style={{fontFamily:'var(--font-mono)',fontWeight:900,fontSize:17,color:'#f5c518'}}>{score}</span>
        </div>
        <div style={{fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.5)'}}>
          Question {qi+1} of {total}
        </div>
      </div>

      {/* Progress */}
      <div style={{height:4,background:'rgba(255,255,255,0.1)',borderRadius:2,overflow:'hidden',marginBottom:10,flexShrink:0}}>
        <motion.div animate={{width:`${pct}%`}} style={{height:'100%',background:world.color,borderRadius:2}} transition={{duration:0.35}}/>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={qi}
          initial={{opacity:0,x:25}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-25}}
          transition={{type:'spring',stiffness:340,damping:30}}
          style={{flex:1,display:'flex',flexDirection:'column',gap:10,minHeight:0}}
        >
          {/* Question card */}
          <div style={{
            background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:16,padding:'16px 18px',textAlign:'center',flexShrink:0,
          }}>
            <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.35)',marginBottom:5,letterSpacing:1}}>
              DATA QUEST · PRACTICE MODE
            </div>
            {q.emoji && <div style={{fontSize:24,marginBottom:4}}>{q.emoji}</div>}
            <p style={{
              fontSize:16,fontWeight:800,color:'#fff',
              fontFamily:'var(--font-heading)',lineHeight:1.4,
              whiteSpace:'pre-line',
              margin: 0,
            }}>
              {q.question}
            </p>

            {/* Hint Box */}
            {q.hint && (
              <div style={{ marginTop: 6 }}>
                <button
                  onClick={() => { stopNarration(); setShowHint(h => !h) }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f5c518',
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
                </button>
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        background: 'rgba(245,197,24,0.08)',
                        border: '1px solid rgba(245,197,24,0.25)',
                        borderRadius: 8,
                        padding: '6px 10px',
                        fontSize: 11,
                        color: '#f5c518',
                        fontStyle: 'italic',
                        marginTop: 4,
                        textAlign: 'center',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                      }}
                    >
                      {q.hint}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Fruit Bar Chart Visual Aid */}
            {q.chartData && (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '10px 12px',
                marginTop: '10px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}>
                {q.chartData.map((item, idx) => {
                  const maxVal = Math.max(...q.chartData.map(d => d.value)) || 1
                  const pct = (item.value / maxVal) * 100
                  const barColor = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6'][idx % 5]
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{item.emoji}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', width: 56, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', height: 10, borderRadius: 3, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: barColor, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', width: 18, fontFamily: 'var(--font-mono)' }}>{item.value}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Answer options — 2×2 dark cards */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,flex:1,alignContent:'start'}}>
            {(q.options||[]).map((opt,i) => {
              const isC  = opt === q.correct
              const isSel= opt === selected
              const showC= isSel && isC
              const showW= isSel && !isC
              return (
                <motion.button key={i}
                  whileHover={!selected?{scale:1.03}:{}}
                  whileTap={!selected?{scale:0.97}:{}}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    background: showC?'rgba(34,197,94,0.2)':showW?'rgba(239,68,68,0.2)':'rgba(255,255,255,0.08)',
                    border:`2px solid ${showC?'#22c55e':showW?'#ef4444':'rgba(255,255,255,0.15)'}`,
                    borderRadius:14, padding:'12px 10px',
                    fontSize:16, fontWeight:800, color:'#fff',
                    cursor:selected?'default':'pointer',
                    fontFamily:'var(--font-heading)', textAlign:'center',
                    transition:'all 0.15s', minHeight:54,
                  }}
                >
                  {opt}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Correct/Wrong popup */}
      <AnimatePresence>
        {popup && (
          <FeedbackPopup
            type={popup.type}
            explanation={popup.explanation}
            onNext={handlePopupNext}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main PlayPhase ─────────────────────────────────────────────────────────
export default function PlayPhase() {
  const { addXP, setPhase, saveWorldScore, playScores, completedWorlds } = useGameStore()
  const [active, setActive] = useState(null)  // null = world chooser, else world object

  function handleFinish(worldId, result, action) {
    saveWorldScore(worldId, result)
    addXP(result.score)

    // Always return to world chooser after finishing — no auto-loop
    setActive(null)

    if (action === 'next') {
      // Auto-open next world if available
      const idx = WORLDS.findIndex(w => w.id === worldId)
      const nextWorld = WORLDS[idx + 1]
      if (nextWorld) {
        setTimeout(() => setActive(nextWorld), 300)
      } else {
        // All worlds done
        setTimeout(() => setPhase('reflect'), 400)
      }
    }
  }

  if (active) {
    return <GameSession key={active.id + '-session'} world={active} onFinish={handleFinish} />
  }

  return <WorldChooser completedWorlds={completedWorlds} scores={playScores} onStart={setActive} />
}
