/**
 * DataQuest SG — Wonder & Story Phase Audio Generator
 * Generates all missing MP3s for Wonder and Story narrations
 * Appends new entries to audioMap.js
 * Usage: node scripts/generate_wonder_story_audio.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const AUDIO_DIR = path.join(ROOT, 'public', 'assets', 'audio')
const MAP_PATH  = path.join(ROOT, 'src', 'utils', 'audioMap.js')
const API_KEY   = process.env.ELEVENLABS_API_KEY || 'sk_7ef27dccb32144843f8ee5068dfd4223a85326c56c14b00a'
const VOICE_ID  = 'Xb7hH8MSUJpSbSDYk0k2'  // Alice

const SETTINGS = {
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  instruction:   { stability: 0.18, similarity_boost: 0.52, style: 0.55, use_speaker_boost: true },
}

// ── Wonder slide data (matches src/data/wonderSlides.js) ──────────────────
const WONDER_SLIDES = [
  {
    question: 'Suki surveyed 24 students about their favourite fruit. How can she show this information clearly?',
    hint: 'What if she could draw pictures to represent each vote?',
    insight: 'She could use a pictograph!',
  },
  {
    question: 'The school canteen needs to know which drink sells most. How can they count and record the orders quickly?',
    hint: 'Is there a quick way to mark each item as it is counted?',
    insight: 'Tally marks can help!',
  },
  {
    question: 'A class voted for their favourite animal. How can the teacher compare the results at a glance?',
    hint: 'What if the numbers were arranged in rows and columns?',
    insight: 'A data table makes it easy!',
  },
]

// ── Story slide data (matches src/data/storySlides.js) ────────────────────
const STORY_SLIDES = [
  {
    title:     "Suki's Survey at the Canteen",
    body:      'Suki visits the school canteen and wants to know which drink is most popular. She decides to ask every student and count the answers. This is called collecting data!',
    math:      'Collecting data means asking questions and recording every answer.',
    character: "Let's write it out and organise the data!",
  },
  {
    title:     'Asking Questions — The Survey',
    body:      "Suki goes classroom to classroom asking: What is your favourite drink? She marks each answer carefully. After 30 students, she has lots of information to organise!",
    math:      'A survey means asking each person one question and recording their answer.',
    character: 'I need a better way to count all these answers!',
  },
  {
    title:     'Tally Marks — Counting Made Easy!',
    body:      'Suki uses tally marks to record each answer quickly. Every 4th line is crossed by a 5th — making groups of 5! This makes counting totals very fast.',
    math:      'Tally marks count in groups of 5. Four lines, then one diagonal crossing line equals 5.',
    character: 'Five tally marks make one gate — easy to count!',
  },
  {
    title:     'The Pictograph — Data Comes Alive!',
    body:      "Now Suki draws a pictograph — one symbol for each student's vote. At a glance, anyone can see which fruit is most popular. Oranges win with 9 votes!",
    math:      'In a pictograph, each icon represents 1 item in our data.',
    character: 'The longer the row, the more popular the item!',
  },
]

// ── All segments to generate ──────────────────────────────────────────────
const ALL_SEGMENTS = [
  // Shared intro to Wonder
  { text: 'Hmm, I wonder...', style: 'thinking' },

  // Wonder slides
  ...WONDER_SLIDES.flatMap((slide, i) => [
    { text: slide.question, style: 'question' },
    { text: slide.hint,     style: 'thinking' },
    { text: slide.insight,  style: 'celebration' },
  ]),

  // Story slides
  ...STORY_SLIDES.flatMap((slide, i) => [
    { text: slide.title,     style: 'statement' },
    { text: slide.body,      style: 'statement' },
    { text: slide.math,      style: 'emphasis' },
    { text: slide.character, style: 'encouragement' },
  ]),
]

console.log(`\n🎙️  Wonder & Story Audio Generator`)
console.log(`📦 Segments to generate: ${ALL_SEGMENTS.length}`)

// ── Helpers ───────────────────────────────────────────────────────────────
function slugify(text, index) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 55) + '_ws' + index + '.mp3'
}

async function generateMp3(text, style, filename) {
  const settings = SETTINGS[style] ?? SETTINGS.statement
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: settings,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HTTP ${res.status}: ${err.slice(0, 120)}`)
  }
  const buf = await res.arrayBuffer()
  fs.writeFileSync(path.join(AUDIO_DIR, filename), Buffer.from(buf))
}

// ── Load existing audioMap ────────────────────────────────────────────────
async function loadExistingMap() {
  try {
    const content = fs.readFileSync(MAP_PATH, 'utf8')
    const match = content.match(/const audioMap = ({[\s\S]*?})\nexport default/)
    if (match) {
      // eslint-disable-next-line no-eval
      return eval('(' + match[1] + ')')
    }
  } catch (e) {
    console.warn('Could not parse existing audioMap:', e.message)
  }
  return {}
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(AUDIO_DIR, { recursive: true })

  const existingMap = await loadExistingMap()
  const newMap = { ...existingMap }
  const errors = []
  let generated = 0
  let skipped   = 0

  for (let i = 0; i < ALL_SEGMENTS.length; i++) {
    const { text, style } = ALL_SEGMENTS[i]

    // Skip if already in map
    if (newMap[text]) {
      const filepath = path.join(AUDIO_DIR, newMap[text])
      if (fs.existsSync(filepath)) {
        console.log(`  ⏭️  [${i+1}/${ALL_SEGMENTS.length}] Already exists — skipped`)
        skipped++
        continue
      }
    }

    const filename = slugify(text, i)
    console.log(`\n[${i+1}/${ALL_SEGMENTS.length}] Generating (${style}):`)
    console.log(`  "${text.slice(0, 70)}${text.length > 70 ? '...' : ''}"`)

    try {
      await generateMp3(text, style, filename)
      newMap[text] = filename
      generated++
      console.log(`  ✅ ${filename}`)
    } catch (err) {
      console.error(`  ❌ ${err.message}`)
      errors.push({ text, style, error: err.message })
    }

    // Rate limit: 500ms between requests
    if (i < ALL_SEGMENTS.length - 1) {
      await new Promise(r => setTimeout(r, 500))
    }
  }

  // Write updated audioMap.js
  const mapContent = `// Auto-generated by scripts/generate_audio.js — DO NOT EDIT\nconst audioMap = ${JSON.stringify(newMap, null, 2)}\nexport default audioMap\n`
  fs.writeFileSync(MAP_PATH, mapContent)

  console.log('\n' + '='.repeat(58))
  console.log(`✅ Generated: ${generated} new MP3 files`)
  console.log(`⏭️  Skipped:   ${skipped} (already existed)`)
  console.log(`❌ Failed:    ${errors.length}`)
  console.log(`📝 audioMap.js updated`)

  if (errors.length > 0) {
    console.log('\nFailed segments:')
    errors.forEach(e => console.log(`  • (${e.style}) "${e.text.slice(0, 50)}" → ${e.error}`))
  }

  console.log('\n🎉 Done! Run "npm run build" to bundle the updated audioMap.')
}

main().catch(console.error)
