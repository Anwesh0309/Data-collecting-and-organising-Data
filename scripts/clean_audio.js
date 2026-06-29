/**
 * DataQuest SG — Clean Audio Script
 * Removes orphaned MP3s not in audioMap.js
 * Usage: node scripts/clean_audio.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const AUDIO_DIR = path.join(ROOT, 'public', 'assets', 'audio')
const MAP_PATH  = path.join(ROOT, 'src', 'utils', 'audioMap.js')

async function main() {
  if (!fs.existsSync(MAP_PATH)) {
    console.log('❌ audioMap.js not found. Run generate_audio.js first.')
    process.exit(1)
  }

  const { default: audioMap } = await import(MAP_PATH)
  const referenced = new Set(Object.values(audioMap))

  if (!fs.existsSync(AUDIO_DIR)) {
    console.log('📁 Audio directory does not exist — nothing to clean.')
    return
  }

  const files = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'))
  let removed = 0

  for (const file of files) {
    if (!referenced.has(file)) {
      fs.unlinkSync(path.join(AUDIO_DIR, file))
      console.log(`🗑️  Removed orphaned: ${file}`)
      removed++
    }
  }

  console.log(`\n✅ Cleaned ${removed} orphaned files. ${files.length - removed} files kept.`)
}

main().catch(console.error)
