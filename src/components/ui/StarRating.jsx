import { motion } from 'framer-motion'

export default function StarRating({ stars = 0, max = 3, size = 'md' }) {
  const sz = size === 'lg' ? 42 : size === 'sm' ? 20 : 30
  return (
    <div style={{ display: 'flex', gap: size === 'lg' ? 10 : 5, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: max }, (_, i) => (
        <motion.span key={i}
          initial={i < stars ? { scale: 0, rotate: -180 } : {}}
          animate={i < stars ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: i * 0.18, type: 'spring', stiffness: 400, damping: 14 }}
          style={{
            fontSize: sz,
            filter: i < stars ? 'drop-shadow(0 0 8px rgba(255,214,0,0.9))' : 'grayscale(1) opacity(0.25)',
          }}
        >⭐</motion.span>
      ))}
    </div>
  )
}
