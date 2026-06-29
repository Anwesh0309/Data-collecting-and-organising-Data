/**
 * DataQuest SG — Audio Engine  v3
 *
 * STRICT SINGLE-STREAM: Only one audio segment plays at any time.
 * stopNarration() kills the current audio object IMMEDIATELY and resolves
 * the in-flight Promise so the segment loop exits on its next iteration.
 *
 * How it works:
 *   - Every narrate() call calls stopNarration() first → increments _generation
 *   - The segment loop stores myGen at start
 *   - After EVERY await it checks _generation === myGen before proceeding
 *   - stopNarration() sets _currentAudio.src = '' AND calls _resolveCurrentSeg()
 *     so the awaited Promise resolves immediately (no waiting for onended)
 *   - Result: no overlap possible, even with rapid Next/Back clicks
 */
import audioMap from './audioMap.js'

// ── Segment factories ────────────────────────────────────────────────────────
export const say       = (t) => ({ text: t, style: 'statement' })
export const ask       = (t) => ({ text: t, style: 'question' })
export const cheer     = (t) => ({ text: t, style: 'celebration' })
export const emphasize = (t) => ({ text: t, style: 'emphasis' })
export const think     = (t) => ({ text: t, style: 'thinking' })
export const celebrate = (t) => ({ text: t, style: 'celebration' })
export const instruct  = (t) => ({ text: t, style: 'instruction' })
export const encourage = (t) => ({ text: t, style: 'encouragement' })

// ── Module state ─────────────────────────────────────────────────────────────
let _enabled            = true
let _generation         = 0       // incremented on every stop — old loops abort
let _currentAudio       = null    // the HTMLAudioElement currently playing
let _resolveCurrentSeg  = null    // resolve fn for the in-flight segment Promise

// ── Subtitle / caption subscribers ──────────────────────────────────────────
let _currentText  = ''
let _currentStyle = ''
const _subscribers = new Set()

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

// ── Audio toggle ─────────────────────────────────────────────────────────────
export function setAudioEnabled(val) {
  _enabled = val
  if (!val) stopNarration()
}
export function isAudioEnabled() { return _enabled }

// ── URL lookup (static pre-generated only) ───────────────────────────────────
async function getUrl(text) {
  if (audioMap[text]) return `/assets/audio/${audioMap[text]}`
  return ''
}

// ── STOP — kills everything immediately ──────────────────────────────────────
export function stopNarration() {
  _generation++                          // all in-flight loops see a stale gen and exit

  // Kill the current audio element RIGHT NOW — don't wait for onended
  if (_currentAudio) {
    _currentAudio.pause()
    try { _currentAudio.src = '' } catch (_) {}
    _currentAudio = null
  }

  // Resolve the awaited segment Promise so the loop iteration unblocks immediately
  if (_resolveCurrentSeg) {
    _resolveCurrentSeg()
    _resolveCurrentSeg = null
  }

  emit(null, null)   // clear subtitle bar
}

// ── NARRATE — the only entry point ───────────────────────────────────────────
export async function narrate(segments) {
  if (!segments?.length) return

  // ① Hard-stop everything — no overlap possible
  stopNarration()
  const myGen = _generation   // snapshot — this loop owns this generation

  for (const seg of segments) {
    // ② Abort if superseded before starting this segment
    if (_generation !== myGen || !_enabled) break

    // ③ Show subtitle immediately
    emit(seg.text, seg.style)

    // ④ Resolve the URL (fast — usually instant cache hit)
    const url = await getUrl(seg.text)

    // ⑤ Re-check after await — user may have navigated away during getUrl
    if (_generation !== myGen || !_enabled) break

    if (url) {
      // ⑥ Play audio, wrapping in a Promise that stopNarration() can resolve early
      await new Promise((resolve) => {
        _resolveCurrentSeg = resolve          // stopNarration can call this

        const audio = new Audio(url)
        _currentAudio = audio

        audio.onended = () => {
          _currentAudio = null
          _resolveCurrentSeg = null
          resolve()
        }
        audio.onerror = () => {
          _currentAudio = null
          _resolveCurrentSeg = null
          resolve()
        }

        audio.play().catch(() => {
          _currentAudio = null
          _resolveCurrentSeg = null
          resolve()
        })
      })
    }
    // no url → subtitle still shown, no audio, move to next segment

    // ⑦ Re-check after audio finishes — another stopNarration may have fired
    if (_generation !== myGen) break
  }

  // ⑧ Clear subtitle when all segments done (only if we're still the active gen)
  if (_generation === myGen) {
    emit(null, null)
  }
}
