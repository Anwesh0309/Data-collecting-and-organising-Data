import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.js'
import { narrate, stopNarration } from '../../utils/audio.js'
import {
  station1Narration, station2Narration, station3Narration,
  station4Narration, station5Narration,
  station1SuccessNarration, station2SuccessNarration, station3SuccessNarration,
  station4SuccessNarration,
} from '../../utils/narration.js'

const TABS = [
  { key: 'A', label: 'Survey',     icon: '🧑‍🤝‍🧑', color: '#f97316' },
  { key: 'B', label: 'Tally',      icon: '✏️',       color: '#a855f7' },
  { key: 'C', label: 'Table',      icon: '📋',        color: '#f5c518' },
  { key: 'D', label: 'Pictograph', icon: '🖼️',       color: '#22c55e' },
  { key: 'E', label: 'Detective',  icon: '🔍',        color: '#3b82f6' },
]

const FRUITS_A = ['Apples', 'Mangoes', 'Oranges', 'Bananas']
const EMOJI_A  = { Apples:'🍎', Mangoes:'🥭', Oranges:'🍊', Bananas:'🍌' }
const COL_COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6']

// Required fixed simulation values (applies to ALL simulation stations)
const TARGET_SURVEY_DATA = { Apples: 5, Mangoes: 4, Oranges: 3, Bananas: 2 }

const FRIENDS = [
  { name:'Amir',  avatar:'👦🏽', choice:'Apples'  },
  { name:'Mei',   avatar:'👧🏻', choice:'Apples'  },
  { name:'Priya', avatar:'👧🏾', choice:'Apples'  },
  { name:'Rajan', avatar:'👦🏻', choice:'Apples'  },
  { name:'Sara',  avatar:'🧒🏽', choice:'Apples'  },
  { name:'Dev',   avatar:'👦🏿', choice:'Mangoes' },
  { name:'Zara',  avatar:'👧🏽', choice:'Mangoes' },
  { name:'Omar',  avatar:'👦🏻', choice:'Mangoes' },
  { name:'Lena',  avatar:'👩🏽', choice:'Mangoes' },
  { name:'Arjun', avatar:'👦🏾', choice:'Oranges' },
  { name:'Aisha', avatar:'👧🏾', choice:'Oranges' },
  { name:'Noah',  avatar:'👦🏻', choice:'Oranges' },
  { name:'Ivy',   avatar:'👧🏻', choice:'Bananas' },
  { name:'Kai',   avatar:'👦🏽', choice:'Bananas' },
]

// ── Station A ─────────────────────────────────────────────────────────────
function StationA({ onDone }) {
  const { setSurveyData, addXP, audioEnabled } = useGameStore()
  const [tapped, setTapped] = useState(new Set())
  const [showResult, setShowResult] = useState(false)
  useEffect(() => {
    narrate(station1Narration())
    return () => stopNarration()
  }, [])

  const counts = Object.fromEntries(FRUITS_A.map(f => [f, 0]))
  tapped.forEach(i => { counts[FRIENDS[i].choice]++ })
  const allTapped = tapped.size === FRIENDS.length

  function tap(i) {
    if (tapped.has(i)) return
    const next = new Set([...tapped, i])
    setTapped(next)
    if (next.size === FRIENDS.length) {
      const c = Object.fromEntries(FRUITS_A.map(f => [f, 0]))
      next.forEach(id => { c[FRIENDS[id].choice]++ })
      setSurveyData({ ...TARGET_SURVEY_DATA })
      setTimeout(() => {
        setShowResult(true)
        if (audioEnabled) narrate(station1SuccessNarration())
      }, 400)
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.8)' }}>
        Tap each student to ask their favourite fruit! ({tapped.size}/{FRIENDS.length})
      </div>
      <div style={{ height:6, background:'rgba(255,255,255,0.1)', borderRadius:3, overflow:'hidden' }}>
        <motion.div animate={{ width:`${(tapped.size/FRIENDS.length)*100}%` }}
          style={{ height:'100%', background:'#f97316', borderRadius:3 }} transition={{ type:'spring', stiffness:100, damping:15 }} />
      </div>
      {!showResult && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
          {FRIENDS.map((f, i) => (
            <motion.button key={i}
              whileHover={!tapped.has(i)?{scale:1.08,y:-3}:{}}
              whileTap={!tapped.has(i)?{scale:0.92}:{}}
              onClick={() => tap(i)}
              style={{
                background: tapped.has(i) ? 'rgba(245,197,24,0.18)' : 'rgba(255,255,255,0.06)',
                borderRadius:12, padding:'8px 4px',
                border:`2px solid ${tapped.has(i)?'#f5c518':'rgba(255,255,255,0.12)'}`,
                cursor: tapped.has(i) ? 'default' : 'pointer',
                textAlign:'center', position:'relative',
              }}
            >
              <div style={{fontSize:24}}>{f.avatar}</div>
              <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.7)',marginTop:2}}>{f.name}</div>
              {tapped.has(i) && (
                <div style={{
                  position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)',
                  background:'#1a1040', border:'1.5px solid #f5c518',
                  borderRadius:6, padding:'1px 5px', fontSize:14,
                }}>{EMOJI_A[f.choice]}</div>
              )}
            </motion.button>
          ))}
        </div>
      )}
      {tapped.size > 0 && !showResult && (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {FRUITS_A.map(f => (
            <div key={f} style={{
              background:'rgba(255,255,255,0.07)', borderRadius:8, padding:'5px 10px',
              display:'flex', alignItems:'center', gap:6, border:'1px solid rgba(255,255,255,0.12)',
            }}>
              <span style={{fontSize:16}}>{EMOJI_A[f]}</span>
              <span style={{fontSize:12,fontWeight:700,color:'#fff'}}>{f}</span>
              <span style={{fontFamily:'var(--font-mono)',fontWeight:900,fontSize:16,color:'#f5c518'}}>{counts[f]}</span>
            </div>
          ))}
        </div>
      )}
      {showResult && (
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
          style={{
            background:'rgba(34,197,94,0.1)', borderRadius:16, padding:'14px 16px',
            border:'2px solid rgba(34,197,94,0.4)', display:'flex', flexDirection:'column', gap:8,
          }}
        >
          <div style={{fontSize:16,fontWeight:900,color:'#86efac',textAlign:'center',marginBottom:4}}>
            🎉 Survey Complete! {FRIENDS.length} students surveyed!
          </div>
          {FRUITS_A.map(f => (
            <div key={f} style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:20,width:26}}>{EMOJI_A[f]}</span>
              <span style={{fontSize:13,fontWeight:700,color:'#fff',width:72}}>{f}</span>
              <div style={{flex:1,background:'rgba(255,255,255,0.1)',borderRadius:4,height:18,overflow:'hidden'}}>
                <motion.div initial={{width:0}} animate={{width:`${(counts[f]/FRIENDS.length)*100}%`}}
                  transition={{delay:0.2,duration:0.5,ease:'easeOut'}}
                  style={{height:'100%',background:'#22c55e',borderRadius:4}} />
              </div>
              <span style={{fontFamily:'var(--font-mono)',fontWeight:900,fontSize:16,color:'#22c55e',width:20}}>{counts[f]}</span>
            </div>
          ))}
        </motion.div>
      )}
      {showResult && (
        <motion.button initial={{opacity:0}} animate={{opacity:1}} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
          onClick={onDone} className="btn-yellow" style={{fontSize:16,padding:'12px'}}>
          ✏️ Record with Tally Marks →
        </motion.button>
      )}
      {!showResult && (
        <motion.button
          whileHover={allTapped?{scale:1.03}:{}} whileTap={allTapped?{scale:0.97}:{}}
          onClick={allTapped ? () => {
            setSurveyData({ ...TARGET_SURVEY_DATA })
            setShowResult(true)
            if (audioEnabled) narrate(station1SuccessNarration())
          } : undefined}
          disabled={!allTapped}
          className="btn-yellow"
          style={{fontSize:16,padding:'12px',opacity:allTapped?1:0.45,cursor:allTapped?'pointer':'not-allowed'}}>
          {allTapped ? '📊 See Results!' : `Tap ${FRIENDS.length - tapped.size} more...`}
        </motion.button>
      )}
    </div>
  )
}

// ── Station B ─────────────────────────────────────────────────────────────
function TallyMark({ count }) {
  const g = Math.floor(count/5), r = count%5
  return (
    <div style={{display:'flex',gap:8,alignItems:'center'}}>
      {Array.from({length:g}).map((_,gi)=>(
        <div key={gi} style={{position:'relative',width:34,height:26}}>
          {[0,1,2,3].map(li=>(
            <div key={li} style={{position:'absolute',left:li*8+1,top:0,width:2.5,height:25,background:'rgba(255,255,255,0.85)',borderRadius:2}}/>
          ))}
          <div style={{position:'absolute',left:-2,top:10,width:38,height:2.5,background:'#f5c518',borderRadius:2,transform:'rotate(-18deg)'}}/>
        </div>
      ))}
      {Array.from({length:r}).map((_,ri)=>(
        <div key={ri} style={{width:2.5,height:25,background:'rgba(255,255,255,0.85)',borderRadius:2}}/>
      ))}
      {count===0 && <span style={{color:'rgba(255,255,255,0.3)',fontSize:11}}>tap + to add</span>}
    </div>
  )
}

function StationB({ onDone }) {
  const { surveyData, addXP, audioEnabled } = useGameStore()
  const fruits = Object.keys(surveyData).filter(f=>surveyData[f]>0)
  const [rec, setRec] = useState(() => Object.fromEntries(fruits.map(f=>[f,0])))
  const [done, setDone] = useState(false)
  useEffect(() => {
    narrate(station2Narration())
    return () => stopNarration()
  }, [])

  function add(f) {
    if(rec[f]>=surveyData[f]) return
    setRec(prev=>{
      const next={...prev,[f]:prev[f]+1}
      if(fruits.every(k=>next[k]>=surveyData[k])) {
        setTimeout(()=>{
          addXP(50)
          setDone(true)
          if (audioEnabled) narrate(station2SuccessNarration())
        },400)
      }
      return next
    })
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div style={{background:'rgba(255,255,255,0.06)',borderRadius:12,padding:'8px 12px',border:'1px solid rgba(255,255,255,0.12)'}}>
        <div style={{fontSize:12,fontWeight:800,color:'#f5c518',marginBottom:8}}>📖 Tally Guide (each group = 5):</div>
        <div style={{display:'flex',gap:14,flexWrap:'wrap',justifyContent:'center'}}>
          {[1,2,3,4,5,6,7,8,9,10].map(n=>(
            <div key={n} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,minWidth:36}}>
              <div style={{height:26,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <TallyMark count={n} />
              </div>
              <div style={{fontSize:11,fontWeight:800,color:'#a855f7'}}>{n}</div>
            </div>
          ))}
        </div>
      </div>
      {fruits.map(f=>(
        <div key={f} style={{
          background:rec[f]>=surveyData[f]?'rgba(34,197,94,0.1)':'rgba(255,255,255,0.05)',
          borderRadius:14,padding:'10px 12px',display:'flex',alignItems:'center',gap:10,
          border:`1.5px solid ${rec[f]>=surveyData[f]?'rgba(34,197,94,0.4)':'rgba(255,255,255,0.1)'}`,
        }}>
          <span style={{fontSize:20,width:26}}>{EMOJI_A[f]||'🍎'}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:800,color:'#fff',marginBottom:5}}>
              {f} <span style={{color:'rgba(255,255,255,0.4)',fontSize:10}}>({rec[f]}/{surveyData[f]})</span>
            </div>
            <TallyMark count={rec[f]} />
          </div>
          <motion.button whileHover={rec[f]<surveyData[f]?{scale:1.12}:{}} whileTap={rec[f]<surveyData[f]?{scale:0.88}:{}}
            onClick={()=>add(f)} disabled={rec[f]>=surveyData[f]}
            style={{
              width:38,height:38,borderRadius:'50%',fontSize:20,fontWeight:900,
              background:rec[f]>=surveyData[f]?'rgba(255,255,255,0.08)':'#f5c518',
              color:rec[f]>=surveyData[f]?'rgba(255,255,255,0.3)':'#1a1040',
              border:'none',cursor:rec[f]>=surveyData[f]?'default':'pointer',
            }}>{rec[f]>=surveyData[f]?'✓':'+'}</motion.button>
        </div>
      ))}
      {done && (
        <motion.button initial={{opacity:0}} animate={{opacity:1}} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
          onClick={onDone} className="btn-yellow" style={{fontSize:16,padding:'12px'}}>
          📋 Build the Table →
        </motion.button>
      )}
    </div>
  )
}

// ── Station C ─────────────────────────────────────────────────────────────
function StationC({ onDone }) {
  const { surveyData, addXP, audioEnabled } = useGameStore()
  const fruits = Object.keys(surveyData).filter(f=>surveyData[f]>0)
  const [poolOrder] = useState(()=>[...fruits].sort(()=>Math.random()-0.5))
  const [cells, setCells] = useState(()=>Object.fromEntries(fruits.map(f=>[f,null])))
  const [selFruit, setSelFruit] = useState(null)
  const [placed, setPlaced] = useState([])
  const [done, setDone] = useState(false)
  const [shake, setShake] = useState(null)
  useEffect(() => {
    narrate(station3Narration())
    return () => stopNarration()
  }, [])

  function placeInRow(rowFruit) {
    if(selFruit===null || cells[rowFruit]!==null) return
    if(selFruit===rowFruit) {
      const nc={...cells,[rowFruit]:surveyData[rowFruit]}
      setCells(nc); setPlaced(p=>[...p,selFruit]); setSelFruit(null)
      if(fruits.every(k=>nc[k]!==null)) {
        setTimeout(()=>{
          addXP(50)
          setDone(true)
          if (audioEnabled) narrate(station3SuccessNarration())
        },300)
      }
    } else {
      setShake(rowFruit); setTimeout(()=>setShake(null),700)
    }
  }

  const avail = poolOrder.filter(f=>!placed.includes(f))

  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div style={{
        background:'rgba(255,255,255,0.06)',borderRadius:12,padding:'10px 12px',
        border:`1px solid ${selFruit?'rgba(245,197,24,0.4)':'rgba(255,255,255,0.12)'}`,
        transition:'border-color 0.2s',
      }}>
        <div style={{fontSize:12,fontWeight:800,color:selFruit?'#f5c518':'rgba(255,255,255,0.65)',marginBottom:6}}>
          {selFruit
            ? `✅ ${EMOJI_A[selFruit]||'🍎'} ${selFruit} (${surveyData[selFruit]}) — tap its row below!`
            : '📦 Tap a card to select it, then tap the matching fruit row:'}
        </div>
        <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
          {avail.map(fruit=>(
            <motion.button key={fruit} whileHover={{scale:1.1,y:-2}} whileTap={{scale:0.92}}
              onClick={()=>setSelFruit(p=>p===fruit?null:fruit)}
              style={{
                minWidth:48,height:48,borderRadius:12,fontSize:18,fontWeight:900,padding:'0 10px',
                background:selFruit===fruit?'#f5c518':'rgba(255,255,255,0.08)',
                color:selFruit===fruit?'#1a1040':'#fff',
                border:`2px solid ${selFruit===fruit?'#f5c518':'rgba(255,255,255,0.15)'}`,
                cursor:'pointer',fontFamily:'var(--font-mono)',
                display:'flex',alignItems:'center',gap:5,transition:'all 0.15s',
              }}>
              <span>{EMOJI_A[fruit]||'🍎'}</span><span>{surveyData[fruit]}</span>
            </motion.button>
          ))}
          {avail.length===0 && <span style={{fontSize:12,fontWeight:700,color:'#22c55e'}}>All placed ✓</span>}
        </div>
      </div>
      {/* Table */}
      <div style={{background:'rgba(255,255,255,0.04)',borderRadius:12,overflow:'hidden',border:'1px solid rgba(255,255,255,0.12)'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 110px 64px',background:'rgba(255,255,255,0.1)',padding:'8px 12px'}}>
          {['Fruit','Tally Marks','Count'].map(h=>(
            <div key={h} style={{fontSize:12,fontWeight:800,color:'rgba(255,255,255,0.65)',fontFamily:'var(--font-heading)'}}>{h}</div>
          ))}
        </div>
        {fruits.map((f,ri)=>{
          const isDone=cells[f]!==null, isShake=shake===f
          const n=surveyData[f],g=Math.floor(n/5),r=n%5
          return (
            <motion.div key={f} animate={isShake?{x:[-5,5,-4,4,0]}:{}} transition={{duration:0.3}}
              onClick={()=>!isDone&&placeInRow(f)}
              style={{
                display:'grid',gridTemplateColumns:'1fr 110px 64px',padding:'9px 12px',
                background:isDone?'rgba(34,197,94,0.1)':isShake?'rgba(239,68,68,0.08)':ri%2===0?'rgba(255,255,255,0.03)':'transparent',
                borderBottom:'1px solid rgba(255,255,255,0.07)',
                border:isShake?'1px solid rgba(239,68,68,0.45)':isDone?'1px solid rgba(34,197,94,0.3)':
                  selFruit&&!isDone?'1px dashed rgba(245,197,24,0.4)':'1px solid transparent',
                cursor:selFruit&&!isDone?'pointer':'default',transition:'all 0.2s',
              }}>
              <div style={{display:'flex',alignItems:'center',gap:7}}>
                <span style={{fontSize:18}}>{EMOJI_A[f]||'🍎'}</span>
                <span style={{fontSize:13,fontWeight:700,color:'#fff'}}>{f}</span>
              </div>
              <div style={{display:'flex',alignItems:'center'}}>
                <TallyMark count={n} />
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                {isDone ? (
                  <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:400,damping:16}}
                    style={{width:38,height:38,borderRadius:9,background:'#22c55e',color:'#fff',fontSize:18,fontWeight:900,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-mono)'}}>
                    {cells[f]}
                  </motion.div>
                ) : (
                  <div style={{width:38,height:38,borderRadius:9,background:selFruit?'rgba(245,197,24,0.1)':'rgba(255,255,255,0.05)',border:`2px dashed ${selFruit?'rgba(245,197,24,0.5)':'rgba(255,255,255,0.18)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:'rgba(255,255,255,0.25)'}}>?</div>
                )}
              </div>
            </motion.div>
          )
        })}
        <div style={{display:'grid',gridTemplateColumns:'1fr 110px 64px',background:'rgba(245,197,24,0.08)',padding:'9px 12px',borderTop:'1px solid rgba(245,197,24,0.2)'}}>
          <div style={{fontSize:13,fontWeight:900,color:'#f5c518'}}>TOTAL</div><div/>
          <div style={{fontFamily:'var(--font-mono)',fontSize:17,fontWeight:900,color:'#f5c518',textAlign:'center'}}>
            {Object.values(surveyData).reduce((a,b)=>a+b,0)}
          </div>
        </div>
      </div>
      {done && (
        <motion.button initial={{opacity:0}} animate={{opacity:1}} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
          onClick={onDone} className="btn-yellow" style={{fontSize:16,padding:'12px'}}>
          🖼️ Create Pictograph →
        </motion.button>
      )}
    </div>
  )
}

// ── Station D ─────────────────────────────────────────────────────────────
function StationD({ onDone }) {
  const { surveyData, addXP, audioEnabled } = useGameStore()
  const fruits = Object.keys(surveyData).filter(f=>surveyData[f]>0)
  const total = Object.values(surveyData).reduce((a,b)=>a+b,0)
  const [placed, setPlaced] = useState(()=>Object.fromEntries(fruits.map(f=>[f,0])))
  const [sel, setSel] = useState(null)
  const [wrongCol, setWrongCol] = useState(null)
  const [done, setDone] = useState(false)
  const [tray] = useState(()=>{
    const items=[]
    fruits.forEach(f=>{ for(let i=0;i<(surveyData[f]||0);i++) items.push(f) })
    for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]]}
    return items
  })
  useEffect(() => {
    narrate(station4Narration())
    return () => stopNarration()
  }, [])
  const totalPlaced = Object.values(placed).reduce((a,b)=>a+b,0)
  const remaining = tray.slice(totalPlaced)

  function placeInCol(f) {
    if(sel===null || placed[f]>=surveyData[f]) return
    if(sel===f) {
      setPlaced(prev=>{
        const next={...prev,[f]:prev[f]+1}
        if(fruits.every(k=>next[k]>=surveyData[k])) {
          setTimeout(()=>{
            addXP(50)
            setDone(true)
            if (audioEnabled) narrate(station4SuccessNarration())
          },400)
        }
        return next
      }); setSel(null)
    } else { setWrongCol(f); setTimeout(()=>setWrongCol(null),700) }
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div style={{
        background:'rgba(255,255,255,0.06)',borderRadius:12,padding:'8px 10px',
        border:`1px solid ${sel?'rgba(245,197,24,0.4)':'rgba(255,255,255,0.12)'}`,transition:'border-color 0.2s',
      }}>
        <div style={{fontSize:12,fontWeight:700,color:sel?'#f5c518':'rgba(255,255,255,0.6)',marginBottom:5}}>
          {sel?`✅ ${EMOJI_A[sel]||'🍎'} selected — tap its column!`:'Tap icon → tap its column:'}
          <span style={{color:'rgba(255,255,255,0.4)',marginLeft:8,fontSize:11}}>({totalPlaced}/{total})</span>
        </div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {remaining.map((f,i)=>(
            <motion.button key={i} whileHover={{scale:1.1,y:-3}} whileTap={{scale:0.9}}
              onClick={()=>setSel(p=>p===f?null:f)}
              style={{
                width:42,height:42,borderRadius:11,fontSize:22,
                background:sel===f?'rgba(245,197,24,0.2)':'rgba(255,255,255,0.07)',
                border:`2px solid ${sel===f?'#f5c518':'rgba(255,255,255,0.12)'}`,
                cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s',
              }}>{EMOJI_A[f]||'🍎'}</motion.button>
          ))}
          {remaining.length===0&&!done&&<span style={{fontSize:12,color:'#22c55e',fontWeight:700}}>All placed ✓</span>}
        </div>
      </div>
      <div style={{background:'rgba(255,255,255,0.04)',borderRadius:12,padding:'10px',border:'1px solid rgba(255,255,255,0.12)'}}>
        <div style={{fontSize:12,fontWeight:800,color:'rgba(255,255,255,0.65)',textAlign:'center',marginBottom:8}}>
          📊 Pictograph (each icon = 1 student)
        </div>
        <div style={{display:'flex',gap:6,alignItems:'flex-end',justifyContent:'center',minHeight:100}}>
          {fruits.map((f,ci)=>{
            const target=surveyData[f], filled=placed[f], color=COL_COLORS[ci%COL_COLORS.length]
            const isWrong=wrongCol===f, isTarget=sel!==null&&placed[f]<target
            return (
              <motion.div key={f} animate={isWrong?{x:[-5,5,-4,4,0]}:{}} transition={{duration:0.3}}
                onClick={()=>placeInCol(f)}
                style={{
                  display:'flex',flexDirection:'column',alignItems:'center',flex:1,maxWidth:72,
                  cursor:isTarget?'pointer':'default',padding:3,borderRadius:8,
                  background:isTarget?`${color}12`:'transparent',
                  border:isWrong?`2px solid #ef4444`:isTarget?`2px dashed ${color}`:'2px solid transparent',
                  transition:'all 0.2s',
                }}>
                {Array.from({length:target}).map((_,si)=>(
                  <motion.div key={si}
                    initial={si===filled-1?{scale:0,y:-8}:false} animate={{scale:1,y:0}}
                    transition={{type:'spring',stiffness:400,damping:20}}
                    style={{
                      width:30,height:30,borderRadius:6,margin:'1px 0',
                      background:si<filled?`${color}28`:'rgba(255,255,255,0.05)',
                      border:`1.5px ${si<filled?'solid':'dashed'} ${si<filled?color:'rgba(255,255,255,0.15)'}`,
                      display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,
                    }}>
                    {si<filled?(EMOJI_A[f]||'🍎'):''}
                  </motion.div>
                ))}
                <div style={{marginTop:3,padding:'2px 5px',background:color,borderRadius:5,fontSize:9,fontWeight:800,color:'#fff',textAlign:'center',width:'100%'}}>
                  {EMOJI_A[f]} {f.slice(0,5)}
                </div>
                <div style={{fontFamily:'var(--font-mono)',fontWeight:900,fontSize:14,color:color,marginTop:1}}>{filled}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
      {done && (
        <motion.button initial={{opacity:0}} animate={{opacity:1}} whileHover={{scale:1.03}} whileTap={{scale:0.97}}
          onClick={onDone} className="btn-yellow" style={{fontSize:16,padding:'12px'}}>
          🔍 Be a Data Detective! →
        </motion.button>
      )}
    </div>
  )
}

// ── Station E ─────────────────────────────────────────────────────────────
function StationE({ onDone }) {
  const { surveyData, addXP, awardStars, audioEnabled } = useGameStore()
  const fruits = Object.keys(surveyData).filter(f=>surveyData[f]>0)
  const entries = Object.entries(surveyData).filter(([,v])=>v>0)
  const maxE = entries.reduce((a,b)=>a[1]>b[1]?a:b)
  const minE = entries.reduce((a,b)=>a[1]<b[1]?a:b)
  const [f1,f2] = fruits.slice(0,2)
  const diff = Math.abs((surveyData[f1]||0)-(surveyData[f2]||0))
  const qs = [
    { q:'Which fruit did the MOST students choose?',  type:'col', correct:maxE[0], exp:`${maxE[0]} has the most: ${maxE[1]} votes.` },
    { q:'Which fruit did the FEWEST students choose?', type:'col', correct:minE[0], exp:`${minE[0]} has the least: ${minE[1]} votes.` },
    {
      q:`How many MORE ${(surveyData[f1]||0)>(surveyData[f2]||0)?f1:f2} than ${(surveyData[f1]||0)>(surveyData[f2]||0)?f2:f1}?`,
      type:'mcq',
      correct: String(diff),
      options: [String(diff),String(diff+1),String(diff+2),String(Math.max(1,diff-1))].sort(()=>Math.random()-0.5),
      exp: `${Math.max(surveyData[f1]||0,surveyData[f2]||0)} − ${Math.min(surveyData[f1]||0,surveyData[f2]||0)} = ${diff}.`,
    },
  ]
  const [qi,setQi] = useState(0)
  const [sel,setSel] = useState(null)
  const [fb,setFb] = useState(null)
  const [correctCount,setCorrectCount] = useState(0)
  const [allDone,setAllDone] = useState(false)
  useEffect(() => {
    narrate(station5Narration())
    return () => stopNarration()
  }, [])
  const q = qs[qi]

  function answer(ans) {
    if(sel!==null) return
    setSel(ans)
    const ok = ans===q.correct
    setFb(ok?'correct':'wrong')
    setTimeout(()=>{
      const nc = correctCount+(ok?1:0)
      if(qi<qs.length-1) { setQi(i=>i+1); setSel(null); setFb(null); if(ok) setCorrectCount(nc) }
      else { setCorrectCount(nc); addXP(50); awardStars('station-5',nc===3?3:nc===2?2:1); setAllDone(true) }
    },1500)
  }

  if(allDone) return (
    <div style={{textAlign:'center',padding:'24px 0'}}>
      <div style={{fontSize:48,marginBottom:8}}>🏆</div>
      <div style={{fontSize:22,fontWeight:900,color:'#f5c518',fontFamily:'var(--font-heading)',marginBottom:6}}>All 5 Stations Done!</div>
      <div style={{fontSize:14,color:'rgba(255,255,255,0.65)',marginBottom:12}}>{correctCount}/3 detective questions correct!</div>
      <div style={{display:'flex',gap:6,justifyContent:'center',marginBottom:18}}>
        {[1,2,3].map(i=><span key={i} style={{fontSize:30,opacity:i<=correctCount?1:0.2}}>⭐</span>)}
      </div>
      <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.97}} onClick={onDone}
        className="btn-yellow" style={{fontSize:18,padding:'14px 36px'}}>
        🎮 Play the Games! →
      </motion.button>
    </div>
  )

  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {/* Pictograph reference */}
      <div style={{background:'rgba(255,255,255,0.04)',borderRadius:12,padding:'10px 10px',border:'1px solid rgba(255,255,255,0.1)'}}>
        <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.45)',marginBottom:6}}>Your Pictograph — tap the correct column:</div>
        <div style={{display:'flex',gap:5,alignItems:'flex-end',justifyContent:'center'}}>
          {fruits.map((f,ci)=>{
            const n=surveyData[f]||0, color=COL_COLORS[ci%COL_COLORS.length]
            return (
              <div key={f} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',
                cursor:q.type==='col'&&!fb?'pointer':'default'}}
                onClick={()=>q.type==='col'&&!fb&&answer(f)}>
                {Array.from({length:n}).map((_,si)=>(
                  <div key={si} style={{fontSize:14,lineHeight:1.1}}>{EMOJI_A[f]||'🍎'}</div>
                ))}
                <div style={{marginTop:2,padding:'2px 4px',background:color,borderRadius:4,fontSize:8,fontWeight:800,color:'#fff',textAlign:'center',width:'100%'}}>{f.slice(0,5)}</div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:12,fontWeight:900,color:color}}>{n}</div>
              </div>
            )
          })}
        </div>
      </div>
      {/* Question */}
      <div style={{background:'rgba(255,255,255,0.07)',borderRadius:14,padding:'14px',textAlign:'center',border:'1px solid rgba(255,255,255,0.15)'}}>
        <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.4)',marginBottom:4}}>QUESTION {qi+1}/{qs.length}</div>
        <div style={{fontSize:17,fontWeight:900,color:'#fff',fontFamily:'var(--font-heading)',lineHeight:1.4}}>{q.q}</div>
      </div>
      {q.type==='col'&&!fb&&(
        <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.4)',textAlign:'center'}}>👆 Tap a column above to answer!</div>
      )}
      {q.type==='mcq'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {(q.options||[]).map((opt,i)=>{
            const isC=opt===q.correct, isS=opt===sel
            return (
              <motion.button key={i} whileHover={!fb?{scale:1.03}:{}} whileTap={!fb?{scale:0.97}:{}}
                animate={isS&&fb==='wrong'?{x:[-4,4,-3,3,0]}:{}} transition={{duration:0.3}}
                onClick={()=>!fb&&answer(opt)}
                style={{
                  background:fb&&isC?'rgba(34,197,94,0.2)':fb&&isS&&!isC?'rgba(239,68,68,0.2)':'rgba(255,255,255,0.07)',
                  border:`2px solid ${fb&&isC?'#22c55e':fb&&isS&&!isC?'#ef4444':'rgba(255,255,255,0.15)'}`,
                  borderRadius:12,padding:'14px',fontSize:20,fontWeight:900,color:'#fff',
                  cursor:fb?'default':'pointer',fontFamily:'var(--font-mono)',
                }}>{opt}</motion.button>
            )
          })}
        </div>
      )}
      {fb&&(
        <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}
          style={{
            background:fb==='correct'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)',
            borderRadius:10,padding:'9px 12px',
            border:`1px solid ${fb==='correct'?'rgba(34,197,94,0.4)':'rgba(239,68,68,0.4)'}`,
            fontSize:12,fontWeight:700,color:fb==='correct'?'#86efac':'#fca5a5',
          }}>
          {fb==='correct'?'✅ Correct! ':'❌ '}{q.exp}
        </motion.div>
      )}
    </div>
  )
}

// ── Main SimulatePhase ────────────────────────────────────────────────────
const STATIONS = [StationA, StationB, StationC, StationD, StationE]

export default function SimulatePhase() {
  const { setPhase, addXP } = useGameStore()
  const [active, setActive] = useState(0)
  const [completed, setCompleted] = useState(new Set())
  const allDone = completed.size >= TABS.length

  function completeStation(idx) {
    setCompleted(prev => {
      const next = new Set([...prev, idx])
      return next
    })
    if (idx < TABS.length - 1) setTimeout(() => setActive(idx + 1), 350)
  }

  const Station = STATIONS[active]

  return (
    <div className="phase-wrap" style={{ background:'#1a1040', padding:'0 16px 12px' }}>
      {/* Header */}
      <div style={{ textAlign:'center', padding:'8px 0 5px', flexShrink:0 }}>
        <div style={{ fontSize:16, fontWeight:900, color:'#fff', fontFamily:'var(--font-heading)' }}>✏️ Simulate</div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Complete each station to unlock the next</div>
      </div>

      {/* Locked station tabs — display only, no skipping */}
      <div style={{ display:'flex', gap:4, marginBottom:10, flexShrink:0, overflowX:'auto' }}>
        {TABS.map((tab,i) => {
          const isCurrent = i===active, isDone = completed.has(i), isLocked = i > completed.size
          return (
            <div key={tab.key} style={{
              display:'flex', alignItems:'center', gap:4,
              padding:'5px 10px', borderRadius:9, flexShrink:0,
              background: isCurrent ? tab.color : isDone ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
              border:`2px solid ${isCurrent?tab.color:isDone?'rgba(34,197,94,0.3)':'rgba(255,255,255,0.08)'}`,
              color: isCurrent ? '#1a1040' : isDone ? '#86efac' : 'rgba(255,255,255,0.4)',
              fontSize:11, fontWeight:800, opacity:isLocked?0.3:1, cursor:'default',
            }}>
              <span style={{fontSize:9,fontWeight:900}}>{isDone?'✓':isLocked?'🔒':tab.key}</span>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </div>
          )
        })}
      </div>

      {/* Station content — no bottom nav */}
      <div className="phase-scroll" style={{ flex:1 }}>
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{opacity:0,x:28}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-28}}
            transition={{type:'spring',stiffness:320,damping:30}}
          >
            {allDone ? (
              <div style={{textAlign:'center',padding:'32px 0'}}>
                <div style={{fontSize:50,marginBottom:8}}>🎉</div>
                <div style={{fontSize:20,fontWeight:900,color:'#f5c518',fontFamily:'var(--font-heading)',marginBottom:6}}>
                  All Simulations Complete!
                </div>
                <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',marginBottom:18}}>
                  Amazing! You mastered all 5 data stations.
                </div>
                <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.97}}
                  onClick={()=>{ addXP(20); setPhase('play') }}
                  className="btn-yellow" style={{fontSize:20,padding:'15px 40px'}}>
                  🎮 Play the Games!
                </motion.button>
              </div>
            ) : (
              <Station onDone={()=>completeStation(active)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
