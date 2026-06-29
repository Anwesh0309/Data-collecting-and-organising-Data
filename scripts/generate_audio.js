/**
 * DataQuest SG — Full Audio Pre-generation
 * Generates MP3 for all narration + all 100 question stems
 * Usage: node scripts/generate_audio.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const AUDIO_DIR = path.join(ROOT, 'public', 'assets', 'audio')
const MAP_PATH  = path.join(ROOT, 'src', 'utils', 'audioMap.js')
const API_KEY   = process.env.ELEVENLABS_API_KEY || 'sk_7ef27dccb32144843f8ee5068dfd4223a85326c56c14b00a'
const VOICE_ID  = 'Xb7hH8MSUJpSbSDYk0k2'

const SETTINGS = {
  celebration:   { stability:0.12, similarity_boost:0.45, style:0.75, use_speaker_boost:true },
  encouragement: { stability:0.16, similarity_boost:0.50, style:0.65, use_speaker_boost:true },
  question:      { stability:0.20, similarity_boost:0.55, style:0.55, use_speaker_boost:true },
  emphasis:      { stability:0.16, similarity_boost:0.50, style:0.60, use_speaker_boost:true },
  thinking:      { stability:0.24, similarity_boost:0.60, style:0.35, use_speaker_boost:true },
  statement:     { stability:0.20, similarity_boost:0.55, style:0.50, use_speaker_boost:true },
  instruction:   { stability:0.18, similarity_boost:0.52, style:0.55, use_speaker_boost:true },
}

// ── Phase narrations (47) ──────────────────────────────────────────────────
const NARRATION = [
  // Intro
  { text:'Hi there! I am Suki, your Data Detective!', style:'statement' },
  { text:'Today, we are going on a super fun adventure.', style:'statement' },
  { text:'We are going to learn how to collect and organize data!', style:'statement' },
  { text:'Data is just information that we gather about the world.', style:'statement' },
  // Wonder
  { text:'Have you ever wondered which fruit is most popular in your class?', style:'question' },
  { text:'Or how many students walk to school each day?', style:'question' },
  { text:'Data can help us find out the answers!', style:'statement' },
  { text:'And today, you will learn exactly how!', style:'emphasis' },
  // Story
  { text:'Suki went to the school canteen one sunny afternoon.', style:'statement' },
  { text:'She noticed her friends were all buying different drinks.', style:'statement' },
  { text:'Which drink is the most popular? Suki wondered.', style:'thinking' },
  { text:'She decided to collect data to find out the answer!', style:'instruction' },
  { text:'And that is exactly what we are going to do today.', style:'statement' },
  // Station 1
  { text:'Let us survey our friends at the hawker centre.', style:'instruction' },
  { text:'Tap each friend to ask them about their favourite fruit.', style:'instruction' },
  { text:'Great job! You just collected your first set of data!', style:'celebration' },
  // Station 2
  { text:'Now let us record the data using tally marks.', style:'instruction' },
  { text:'Drag a tally mark into the correct box for each fruit.', style:'instruction' },
  { text:'Remember, every fifth tally mark crosses the others!', style:'statement' },
  { text:'Excellent! You have made a tally chart!', style:'celebration' },
  // Station 3
  { text:'Now let us organize the data in a table.', style:'instruction' },
  { text:'Drag each number into the correct cell of the table.', style:'instruction' },
  { text:'A table helps us see the data clearly and neatly.', style:'statement' },
  { text:'Superb! You have built a data table!', style:'celebration' },
  // Station 4
  { text:'Time to create a picture graph!', style:'instruction' },
  { text:'Drag each fruit icon into the correct column of the graph.', style:'instruction' },
  { text:'Each icon represents one item in our data.', style:'statement' },
  { text:'Amazing! You have created a picture graph!', style:'celebration' },
  // Station 5
  { text:'Now you are a real Data Detective!', style:'statement' },
  { text:'Look at the graph carefully. Can you answer these questions?', style:'question' },
  { text:'Tap the correct answer or the correct column on the graph.', style:'instruction' },
  // Reflect
  { text:'Incredible work, Data Detective!', style:'celebration' },
  { text:'Let us remember what we learned today.', style:'statement' },
  { text:'Data is information we collect to understand our world.', style:'emphasis' },
  { text:'Tally marks help us count and record data quickly.', style:'emphasis' },
  { text:'Picture graphs help us see and compare data visually.', style:'emphasis' },
  { text:'You are now ready to tackle any data challenge!', style:'celebration' },
  // Correct/wrong feedback
  { text:'Amazing! That is absolutely correct!', style:'celebration' },
  { text:'Brilliant! You solved that perfectly!', style:'celebration' },
  { text:'Excellent! You are a true Data Detective!', style:'celebration' },
  { text:'Superb! Keep going, you are doing great!', style:'celebration' },
  { text:'Outstanding! You are on fire today!', style:'celebration' },
  { text:'Correct! Well done!', style:'celebration' },
  { text:'Not quite! Look carefully and try again.', style:'encouragement' },
  { text:'Good try! Take another look at the data.', style:'encouragement' },
  { text:'Almost there! You can do it!', style:'encouragement' },
  { text:'Not quite! Keep going.', style:'encouragement' },
]

// ── 100 question narrations ────────────────────────────────────────────────
const FRUITS   = ['Apples','Mangoes','Oranges','Bananas','Papayas','Grapes']
const ANIMALS  = ['Dogs','Cats','Birds','Rabbits','Fish','Hamsters']

function pick(arr) { return arr[Math.floor(Math.random()*arr.length)] }
function randInt(a,b) { return Math.floor(Math.random()*(b-a+1))+a }
function pickN(arr,n) { return [...arr].sort(()=>Math.random()-0.5).slice(0,n) }

const QUESTION_NARRATIONS = []
const seen = new Set()

function addQ(text) {
  if(!seen.has(text)) { seen.add(text); QUESTION_NARRATIONS.push({ text, style:'question' }) }
}

// 100 representative question texts
for(let i=0;i<20;i++) {
  const n = randInt(1,15)
  addQ(`How many does this tally show?`)
  addQ(`Which tally correctly shows the number ${randInt(1,12)}?`)
  addQ(`How many complete tally groups of 5 can she make from ${randInt(5,20)} items?`)
}
for(let i=0;i<20;i++) {
  const cats = pickN(FRUITS,4)
  const vals = cats.map(()=>randInt(2,10))
  const maxI = vals.indexOf(Math.max(...vals))
  addQ(`The survey results show ${cats.map((c,j)=>c+': '+vals[j]).join(', ')}. Which was MOST popular?`)
  addQ(`How many students were surveyed in total?`)
  addQ(`Which item was the LEAST popular?`)
}
for(let i=0;i<20;i++) {
  const cats = pickN(FRUITS,4)
  addQ(`The table shows the data. How many ${pick(cats)} are there?`)
  addQ(`What is the TOTAL number of items in the table?`)
  addQ(`How many MORE ${pick(FRUITS)} than ${pick(FRUITS)} are there?`)
}
for(let i=0;i<20;i++) {
  const cats = pickN(FRUITS,4)
  const vals = cats.map(()=>randInt(1,10))
  const maxI = vals.indexOf(Math.max(...vals))
  addQ(`The pictograph shows ${cats.map((c,j)=>c+': '+vals[j]).join(', ')}. Which has the MOST symbols?`)
  addQ(`How many ${pick(cats)} symbols are there?`)
  addQ(`Which has the FEWEST symbols?`)
  addQ(`How many symbols are there in TOTAL?`)
}
for(let i=0;i<20;i++) {
  const va = randInt(3,14), vb = randInt(3,14)
  addQ(`How many more did the more popular option get than the less popular one?`)
  addQ(`Is it TRUE or FALSE that the most popular option has the tallest bar?`)
  addQ(`What is the combined total for both options?`)
}
// Add more generic Qs to reach 100
const GENERIC = [
  'What is DATA?',
  'Which is an example of collecting data?',
  'What is a SURVEY?',
  'What do tally marks help us do?',
  'A pictograph uses _____ to show data.',
  'Which method helps us count in groups of 5?',
  'What does each symbol in a pictograph represent?',
  'How do we find the most popular item from a table?',
  'What does the tallest column in a graph show?',
  'Why do we organise data in a table?',
]
GENERIC.forEach(t => addQ(t))

// Trim to 100
const FINAL_QS = QUESTION_NARRATIONS.slice(0,100)

const ALL_SEGMENTS = [...NARRATION, ...FINAL_QS]

// ── helpers ────────────────────────────────────────────────────────────────
function slugify(text, index) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,'_').substring(0,55)+'_'+index+'.mp3'
}

async function generate(text, style, filename) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method:'POST',
    headers:{'xi-api-key':API_KEY,'Content-Type':'application/json','Accept':'audio/mpeg'},
    body:JSON.stringify({ text, model_id:'eleven_multilingual_v2', voice_settings:SETTINGS[style]??SETTINGS.statement }),
  })
  if(!r.ok) throw new Error(`${r.status}: ${await r.text()}`)
  fs.writeFileSync(path.join(AUDIO_DIR,filename), Buffer.from(await r.arrayBuffer()))
}

async function main() {
  console.log(`🎙️  DataQuest SG — Full Audio Generation`)
  console.log(`📦 Total segments: ${ALL_SEGMENTS.length}\n`)
  fs.mkdirSync(AUDIO_DIR, { recursive:true })
  const map={}, errors=[]

  for(let i=0;i<ALL_SEGMENTS.length;i++) {
    const {text,style} = ALL_SEGMENTS[i]
    const filename = slugify(text,i)
    const full = path.join(AUDIO_DIR,filename)
    if(fs.existsSync(full)) { console.log(`  ⏭️  ${filename}`); map[text]=filename; continue }
    console.log(`[${i+1}/${ALL_SEGMENTS.length}] "${text.slice(0,55)}..."`)
    try { await generate(text,style,filename); map[text]=filename; console.log(`  ✅`) }
    catch(e) { console.error(`  ❌ ${e.message}`); errors.push({text,error:e.message}) }
    if(i<ALL_SEGMENTS.length-1) await new Promise(r=>setTimeout(r,520))
  }

  fs.writeFileSync(MAP_PATH,
    `// Auto-generated by scripts/generate_audio.js — DO NOT EDIT\nconst audioMap = ${JSON.stringify(map,null,2)}\nexport default audioMap\n`)

  console.log(`\n${'='.repeat(52)}`)
  console.log(`✅ Generated: ${Object.keys(map).length}`)
  console.log(`❌ Failed:    ${errors.length}`)
  console.log(`📝 audioMap.js updated`)
  if(errors.length) errors.forEach(e=>console.log(`  • "${e.text.slice(0,45)}" — ${e.error}`))
  console.log('\n🎉 Done!')
}

main().catch(console.error)
