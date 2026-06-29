import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { onNarrationChange } from '../../utils/audio.js'

// Style → color mapping for the caption pill
const STYLE_COLORS = {
  celebration:   { bg: 'rgba(34,197,94,0.18)',  border: 'rgba(34,197,94,0.45)',  text: '#86efac',  icon: '🎉' },
  encouragement: { bg: 'rgba(251,146,60,0.18)', border: 'rgba(251,146,60,0.45)', text: '#fdba74',  icon: '💪' },
  question:      { bg: 'rgba(168,85,247,0.18)', border: 'rgba(168,85,247,0.45)', text: '#d8b4fe',  icon: '❓' },
  emphasis:      { bg: 'rgba(245,197,24,0.18)', border: 'rgba(245,197,24,0.45)', text: '#fde68a',  icon: '✨' },
  thinking:      { bg: 'rgba(59,130,246,0.18)', border: 'rgba(59,130,246,0.45)', text: '#93c5fd',  icon: '🤔' },
  statement:     { bg: 'rgba(255,255,255,0.10)', border: 'rgba(255,255,255,0.25)', text: '#e2e8f0', icon: '💬' },
  instruction:   { bg: 'rgba(20,184,166,0.18)', border: 'rgba(20,184,166,0.45)', text: '#99f6e4',  icon: '📋' },
}

const DEFAULT_STYLE = STYLE_COLORS.statement

/**
 * NarrationCaption — displays currently-playing narration text on screen.
 * Subscribes to the audio engine's onNarrationChange event.
 * Renders as a fixed bottom bar (or inline if position="inline").
 */
export default function NarrationCaption({ position = 'fixed' }) {
  const [current, setCurrent] = useState(null)  // { text, style } | null

  useEffect(() => {
    const unsub = onNarrationChange(seg => setCurrent(seg))
    return unsub
  }, [])

  const styleInfo = current ? (STYLE_COLORS[current.style] ?? DEFAULT_STYLE) : DEFAULT_STYLE

  if (position === 'fixed') {
    return (
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              bottom: 72,           // above the mute button
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 300,
              maxWidth: 600,
              width: 'calc(100% - 32px)',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              background: styleInfo.bg,
              border: `1.5px solid ${styleInfo.border}`,
              borderRadius: 14,
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
            }}>
              {/* Icon */}
              <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>
                {styleInfo.icon}
              </span>
              {/* Text */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                color: styleInfo.text,
                lineHeight: 1.55,
                margin: 0,
              }}>
                {current.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Inline mode — renders in document flow
  return (
    <AnimatePresence mode="wait">
      {current ? (
        <motion.div
          key={current.text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
            background: styleInfo.bg,
            border: `1.5px solid ${styleInfo.border}`,
            borderRadius: 12,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            width: '100%',
          }}
        >
          <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1.45 }}>
            {styleInfo.icon}
          </span>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 600,
            color: styleInfo.text,
            lineHeight: 1.55,
            margin: 0,
          }}>
            {current.text}
          </p>
        </motion.div>
      ) : (
        <div style={{
          borderRadius: 12,
          padding: '10px 14px',
          border: '1.5px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)',
          width: '100%',
          minHeight: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
            🔊 Narration will appear here...
          </span>
        </div>
      )}
    </AnimatePresence>
  )
}
