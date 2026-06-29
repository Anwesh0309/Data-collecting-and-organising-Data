import { motion } from 'framer-motion'

// Suki — young Singaporean girl Data Detective, built entirely in SVG
export default function SukiCharacter({ size = 120, expression = 'happy', animate = true }) {
  const expressionMouth = {
    happy:     'M38 62 Q50 72 62 62',
    thinking:  'M40 65 Q50 65 60 65',
    excited:   'M36 60 Q50 75 64 60',
    correct:   'M36 60 Q50 76 64 60',
    wrong:     'M40 68 Q50 62 60 68',
  }
  const mouth = expressionMouth[expression] || expressionMouth.happy

  return (
    <motion.div
      animate={animate ? { y: [0, -8, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size * 1.2, display: 'inline-block', flexShrink: 0 }}
    >
      <svg viewBox="0 0 100 120" width={size} height={size * 1.2} aria-label="Suki the Data Detective character">
        {/* Body */}
        <ellipse cx="50" cy="105" rx="28" ry="14" fill="#5B4FCF" />
        <rect x="28" y="84" width="44" height="24" rx="10" fill="#5B4FCF" />
        {/* Shirt stripe */}
        <rect x="34" y="92" width="32" height="5" rx="2.5" fill="#7C6FE3" />
        {/* School badge */}
        <circle cx="50" cy="104" r="7" fill="#FFD600" stroke="#E6BE00" strokeWidth="1.5" />
        <text x="50" y="108" textAnchor="middle" fontSize="8" fill="#1E1B3A">🔍</text>
        {/* Neck */}
        <rect x="44" y="74" width="12" height="12" rx="4" fill="#F5C89E" />
        {/* Head */}
        <circle cx="50" cy="58" r="28" fill="#F5C89E" stroke="#E8A855" strokeWidth="1.5" />
        {/* Hair */}
        <ellipse cx="50" cy="33" rx="29" ry="15" fill="#1E1B3A" />
        <rect x="22" y="40" width="10" height="26" rx="5" fill="#1E1B3A" />
        <rect x="68" y="40" width="10" height="26" rx="5" fill="#1E1B3A" />
        {/* Hair highlights */}
        <ellipse cx="42" cy="30" rx="6" ry="3" fill="#3D3636" opacity="0.5" />
        {/* Eyes */}
        <ellipse cx="40" cy="55" rx="6" ry="7" fill="#fff" />
        <ellipse cx="60" cy="55" rx="6" ry="7" fill="#fff" />
        <circle cx="41" cy="56" r="4" fill="#1E1B3A" />
        <circle cx="61" cy="56" r="4" fill="#1E1B3A" />
        <circle cx="42.5" cy="54.5" r="1.5" fill="#fff" />
        <circle cx="62.5" cy="54.5" r="1.5" fill="#fff" />
        {/* Eyebrows */}
        <path d="M34 46 Q40 42 46 46" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M54 46 Q60 42 66 46" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Mouth */}
        <path d={mouth} stroke="#C0603A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="31" cy="62" r="6" fill="#FFB3A0" opacity="0.5" />
        <circle cx="69" cy="62" r="6" fill="#FFB3A0" opacity="0.5" />
        {/* Detective hat */}
        <rect x="22" y="29" width="56" height="9" rx="4" fill="#00B5B2" />
        <rect x="30" y="12" width="40" height="20" rx="8" fill="#00B5B2" />
        <rect x="36" y="17" width="28" height="8" rx="4" fill="#26D4D1" />
        {/* Magnifier in hand */}
        <circle cx="82" cy="88" r="10" fill="none" stroke="#FFD600" strokeWidth="3.5" />
        <line x1="89" y1="95" x2="96" y2="102" stroke="#FFD600" strokeWidth="3.5" strokeLinecap="round" />
        {/* Arm */}
        <path d="M72 88 Q78 86 82 88" stroke="#F5C89E" strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* Expression sparkle for excited */}
        {expression === 'excited' || expression === 'correct' ? (
          <g>
            <text x="70" y="38" fontSize="10">✨</text>
            <text x="12" y="42" fontSize="8">⭐</text>
          </g>
        ) : null}
        {expression === 'thinking' ? (
          <g>
            <circle cx="72" cy="35" r="3" fill="#FFD600" opacity="0.7" />
            <circle cx="79" cy="28" r="4" fill="#FFD600" opacity="0.5" />
            <circle cx="84" cy="20" r="6" fill="#FFD600" opacity="0.35" />
          </g>
        ) : null}
      </svg>
    </motion.div>
  )
}
