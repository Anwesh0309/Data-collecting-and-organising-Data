/**
 * DataQuest SG — Audio Engine
 * Generation-counter approach: every narrate() call increments the generation.
 * Any in-flight async with an old generation is silently discarded.
 * NO circular imports — does not import from store.
 *
 * Subtitle/caption system: subscribers can listen to currentText changes.
 */
import audioMap from './audioMap.js'

// Segment factories
export const say       = (t) => ({ text: t, style: 'statement' })
export const ask       = (t) => ({ text: t, style: 'question' })
export const cheer     = (t) => ({ text: t, style: 'celebration' })
export const emphasize = (t) => ({ text: t, style: 'emphasis' })
export const think     = (t) => ({ text: t, style: 'thinking' })
export const celebrate = (t) => ({ text: t, style: 'celebration' })
export const instruct  = (t) => ({ text: t, style: 'instruction' })
export const encourage = (t) => ({ text: t, style: 'encouragement' })

// ── Internal state ──────────────────────────────────────────────────────────
let _enabled       = true
let _currentAudio  = null
let _generation    = 0
let _currentText   = ''          // currently speaking text
let _currentStyle  = ''          // currently speaking style
const _subscribers = new Set()   // Set of listener callbacks

// ── Subtitle subscriber API ─────────────────────────────────────────────────
/**
 * Subscribe to narration text changes.
 * Callback receives { text, style } when a new segment starts, or null when narration ends.
 * Returns an unsubscribe function.
 */
export function onNarrationChange(cb) {
  _subscribers.add(cb)
  return () => _subscribers.delete(cb)
}

function emit(text, style) {
  _currentText  = text  ?? ''
  _currentStyle = style ?? ''
  _subscribers.forEach(cb => {
    try { cb(text ? { text, style } : null) } catch (_) {}
  })
}

export function getCurrentNarration() {
  return _currentText ? { text: _currentText, style: _currentStyle } : null
}

// ── Audio enabled ────────────────────────────────────────────────────────────
export function setAudioEnabled(val) {
  _enabled = val
  if (!val) stopNarration()
}

export function isAudioEnabled() { return _enabled }

// ── URL resolution — static pre-generated assets only ───────────────────────
async function getUrl(text) {
  if (audioMap[text]) return `/assets/audio/${audioMap[text]}`
  if (import.meta.env.DEV) {
    console.warn(`[audio] No pre-generated MP3 for: "${text.slice(0, 60)}"`)
  }
  return ''
}

// ── Core engine ──────────────────────────────────────────────────────────────
export function stopNarration() {
  _generation++
  if (_currentAudio) {
    _currentAudio.pause()
    try { _currentAudio.src = '' } catch (_) {}
    _currentAudio = null
  }
  emit(null, null)   // clear subtitle
}

export async function narrate(segments) {
  if (!segments?.length) return
  stopNarration()                       // kills previous, increments generation
  const myGen = _generation

  for (const seg of segments) {
    if (_generation !== myGen || !_enabled) {
      emit(null, null)
      return
    }

    // Show subtitle immediately when segment starts
    emit(seg.text, seg.style)

    try {
      const url = await getUrl(seg.text)
      if (!url || _generation !== myGen || !_enabled) {
        continue   // still show subtitle, just no audio
      }
      await new Promise((resolve) => {
        const audio = new Audio(url)
        _currentAudio = audio
        audio.onended  = () => { _currentAudio = null; resolve() }
        audio.onerror  = () => { _currentAudio = null; resolve() }
        audio.play().catch(() => { _currentAudio = null; resolve() })
      })
    } catch (_) { /* skip audio, subtitle still shown */ }
  }

  if (_generation === myGen) {
    emit(null, null)   // clear subtitle when done
  }
}
