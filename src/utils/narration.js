import { say, ask, cheer, emphasize, think, instruct, encourage } from './audio.js'
import { WONDER_SLIDES } from '../data/wonderSlides.js'
import { STORY_SLIDES } from '../data/storySlides.js'

// ── Phase narrations ──────────────────────────────────────────────────────

export function introNarration() {
  return [
    say('Hi there! I am Suki, your Data Detective!'),
    say('Today, we are going on a super fun adventure.'),
    say('We are going to learn how to collect and organize data!'),
    say('Data is just information that we gather about the world.'),
  ]
}

export function wonderSlideNarration(slideIdx, revealed) {
  const slide = WONDER_SLIDES[slideIdx]
  if (!slide) return []
  const out = [
    say('Hmm, I wonder...'),
    ask(slide.question),
    think(slide.hint),
  ]
  if (revealed) out.push(cheer(slide.insight))
  return out
}

export function storySlideNarration(slideIdx) {
  const slide = STORY_SLIDES[slideIdx]
  if (!slide) return []
  return [
    say(slide.title),
    say(slide.body),
    emphasize(slide.math),
    say(slide.character),
  ]
}

export function station1Narration() {
  return [
    instruct('Let us survey our friends at the hawker centre.'),
    instruct('Tap each friend to ask them about their favourite fruit.'),
  ]
}

export function station1SuccessNarration() {
  return [cheer('Great job! You just collected your first set of data!')]
}

export function station2Narration() {
  return [
    instruct('Now let us record the data using tally marks.'),
    instruct('Drag a tally mark into the correct box for each fruit.'),
    say('Remember, every fifth tally mark crosses the others!'),
  ]
}

export function station2SuccessNarration() {
  return [cheer('Excellent! You have made a tally chart!')]
}

export function station3Narration() {
  return [
    instruct('Now let us organize the data in a table.'),
    instruct('Drag each number into the correct cell of the table.'),
    say('A table helps us see the data clearly and neatly.'),
  ]
}

export function station3SuccessNarration() {
  return [cheer('Superb! You have built a data table!')]
}

export function station4Narration() {
  return [
    instruct('Time to create a picture graph!'),
    instruct('Drag each fruit icon into the correct column of the graph.'),
    say('Each icon represents one item in our data.'),
  ]
}

export function station4SuccessNarration() {
  return [cheer('Amazing! You have created a picture graph!')]
}

export function station5Narration() {
  return [
    say('Now you are a real Data Detective!'),
    ask('Look at the graph carefully. Can you answer these questions?'),
    instruct('Tap the correct answer or the correct column on the graph.'),
  ]
}

export function reflectNarration() {
  return [
    cheer('Incredible work, Data Detective!'),
    say('Let us remember what we learned today.'),
    emphasize('Data is information we collect to understand our world.'),
    emphasize('Tally marks help us count and record data quickly.'),
    emphasize('Picture graphs help us see and compare data visually.'),
    say('You are now ready to tackle any data challenge!'),
  ]
}

export function correctFeedback() {
  return [
    [cheer('Amazing! That is absolutely correct!')],
    [cheer('Brilliant! You solved that perfectly!')],
    [cheer('Excellent! You are a true Data Detective!')],
    [cheer('Superb! Keep going, you are doing great!')],
    [cheer('Outstanding! You are on fire today!')],
  ]
}

export function wrongFeedback() {
  return [
    [encourage('Not quite! Look carefully and try again.')],
    [encourage('Good try! Take another look at the data.')],
    [encourage('Almost there! You can do it!')],
    [encourage('Keep going! Every detective makes mistakes.')],
    [encourage('You are so close! Try one more time.')],
  ]
}

// Complete list for audio pre-generation
export const ALL_NARRATION_SEGMENTS = [
  ...introNarration(),
  ...station1Narration(),
  ...station2Narration(),
  ...station3Narration(),
  ...station4Narration(),
  ...station5Narration(),
  ...reflectNarration(),
  ...correctFeedback().flat(),
  ...wrongFeedback().flat(),
]
