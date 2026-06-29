// Vercel serverless proxy — protects ElevenLabs API key in production
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'
const VOICE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.18, similarity_boost: 0.52, style: 0.55, use_speaker_boost: true },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { text, style } = req.body
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Missing text' })

  const settings = VOICE_SETTINGS[style] ?? VOICE_SETTINGS.statement
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'No API key' })

  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: settings }),
    })
    if (!r.ok) return res.status(r.status).json({ error: await r.text() })
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    const buf = await r.arrayBuffer()
    res.send(Buffer.from(buf))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
