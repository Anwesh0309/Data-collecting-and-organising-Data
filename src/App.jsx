import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './store/gameStore.js'
import NavBar from './components/ui/NavBar.jsx'

const IntroPhase    = lazy(() => import('./components/phases/IntroPhase.jsx'))
const WonderPhase   = lazy(() => import('./components/phases/WonderPhase.jsx'))
const StoryPhase    = lazy(() => import('./components/phases/StoryPhase.jsx'))
const SimulatePhase = lazy(() => import('./components/phases/SimulatePhase.jsx'))
const PlayPhase     = lazy(() => import('./components/phases/PlayPhase.jsx'))
const ReflectPhase  = lazy(() => import('./components/phases/ReflectPhase.jsx'))

const PHASE_MAP = {
  home:     IntroPhase,
  wonder:   WonderPhase,
  story:    StoryPhase,
  simulate: SimulatePhase,
  play:     PlayPhase,
  reflect:  ReflectPhase,
}

// Fixed starfield rendered once
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: ((i * 137.508) % 100).toFixed(2),
  y: ((i * 97.334) % 100).toFixed(2),
  r: i % 3 === 0 ? 1.4 : i % 3 === 1 ? 0.9 : 0.6,
  dur: (2.2 + (i % 5) * 0.55).toFixed(1),
  delay: ((i * 0.29) % 4).toFixed(1),
}))

function Spinner() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1040' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ fontSize: 40 }}>
        🔍
      </motion.div>
    </div>
  )
}

export default function App() {
  const { phase } = useGameStore()
  const PhaseComponent = PHASE_MAP[phase] || IntroPhase
  const isHome = phase === 'home'

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      background: '#1a1040',
      maxWidth: 900,
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Starfield — fixed behind everything */}
      <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        {STARS.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity="0">
            <animate attributeName="opacity" values="0;0.5;0" dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {/* NavBar — shown on all pages EXCEPT home (home has its own layout) */}
      {!isHome && <NavBar />}

      {/* Phase content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } }}
          exit={{ x: '-100%', opacity: 0, transition: { duration: 0.18 } }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, position: 'relative', zIndex: 1 }}
        >
          <Suspense fallback={<Spinner />}>
            <PhaseComponent />
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
