import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function XPBurst({ amount, trigger }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (trigger > 0) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 1200)
      return () => clearTimeout(t)
    }
  }, [trigger])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 0, opacity: 1, scale: 0.6 }}
          animate={{ y: -60, opacity: 0, scale: 1.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #FFD600, #FF9800)',
            borderRadius: 20,
            padding: '10px 22px',
            fontSize: 26,
            fontWeight: 900,
            fontFamily: 'var(--font-display)',
            color: '#1E1B3A',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 6px 24px rgba(255,214,0,0.6)',
            whiteSpace: 'nowrap',
          }}
        >
          +{amount} XP ⚡
        </motion.div>
      )}
    </AnimatePresence>
  )
}
