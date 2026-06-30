import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.js'
import { narrate, stopNarration } from '../../utils/audio.js'
import { storySlideNarration } from '../../utils/narration.js'
import { STORY_SLIDES } from '../../data/storySlides.js'
import NarrationCaption from '../ui/NarrationCaption.jsx'

// Story slides use pre-generated HD illustrations:
// public/assets/images/story_slide_0.png ... story_slide_{n}.png
const SLIDES = STORY_SLIDES

export default function StoryPhase() {
  const { setPhase, addXP } = useGameStore()
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    narrate(storySlideNarration(slide))
    return () => stopNarration()
  }, [slide])

  const s = SLIDES[slide]
  const isLast = slide === SLIDES.length - 1
  const progress = Math.round(((slide + 1) / SLIDES.length) * 100)

  function handleNext() {
    stopNarration()
    if (!isLast) setSlide(i => i + 1)
    else { addXP(20); setPhase('simulate') }
  }
  function handlePrev() {
    stopNarration()
    if (slide > 0) setSlide(i => i - 1)
  }

  return (
    <div className="phase-wrap" style={{
      background: '#1a1040',
      padding: '0 20px 16px',
    }}>
      {/* Progress bar — top, exactly like reference */}
      <div style={{
        height: 4,
        background: 'rgba(255,255,255,0.1)',
        flexShrink: 0,
        marginBottom: 8,
      }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          style={{ height: '100%', background: '#f5c518' }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Slide counter + dots */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 10, flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
          Slide {slide + 1} of {SLIDES.length}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{
              width: i === slide ? 20 : 8, height: 8,
              borderRadius: 4,
              background: i === slide ? '#f5c518' : i < slide ? 'rgba(245,197,24,0.4)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
        <span style={{ fontSize: 12, color: '#f5c518', fontWeight: 700 }}>{progress}%</span>
      </div>

      {/* Slide card */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              background: '#2a1f5e',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 18,
              overflow: 'hidden',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Illustrated image */}
            <div style={{
              background: '#1a1040',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              flexShrink: 0,
              overflow: 'hidden',
              height: '35vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src={`/assets/images/story_slide_${slide}.png`}
                alt={s.title}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Text content */}
            <div style={{ padding: '14px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Title — bold yellow */}
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: 20,
                color: '#f5c518',
                lineHeight: 1.25,
              }}>
                {s.title}
              </h2>

              {/* Body */}
              <p style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.6,
                fontFamily: 'var(--font-body)',
              }}>
                {s.body}
              </p>

              {/* Math highlight */}
              <div style={{
                background: 'rgba(245,197,24,0.1)',
                border: '1px solid rgba(245,197,24,0.3)',
                borderRadius: 10,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 800,
                color: '#f5c518',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
              }}>
                {s.mathDisplay || s.math}
              </div>

              {/* Suki speech */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: '#f5c518',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                }}>🔍</div>
                <div style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '0 10px 10px 10px',
                  padding: '6px 12px',
                  fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)',
                }}>
                  {s.characterDisplay || s.character}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation — prev left, next right exactly like reference */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 12, flexShrink: 0,
      }}>
        {slide > 0 ? (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handlePrev}
            className="btn-ghost"
          >
            ← Back
          </motion.button>
        ) : <div />}

        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          className="btn-yellow"
          style={{ padding: '12px 28px', fontSize: 16 }}
        >
          {isLast ? '✏️ Simulate! →' : 'Next →'}
        </motion.button>
      </div>
    </div>
  )
}
