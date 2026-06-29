// DataQuest SG — 100 Question Static Bank
// Maps exactly to keys in audioMap.js for offline pre-generated audio compatibility

const EMOJIS = {
  Apples: '🍎', Mangoes: '🥭', Oranges: '🍊', Bananas: '🍌', Papayas: '🍈', Grapes: '🍇',
  Dogs: '🐕', Cats: '🐈', Birds: '🐦', Rabbits: '🐇', Fish: '🐟', Hamsters: '🐹',
  Milo: '☕', Ribena: '🧃', 'Pokka Tea': '🍵', 'Coconut Water': '🥥', 'Soya Milk': '🥛',
  Football: '⚽', Badminton: '🏸', Swimming: '🏊', Basketball: '🏀', Running: '🏃'
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── 1. TALLY QUESTIONS (22 items) ───────────────────────────────────────────
const tallyReadQuestions = [
  {
    topic: 'tally', type: 'mcq', emoji: '✏️',
    question: "How many does this tally show?\n\n| | |",
    audioText: "How many does this tally show?",
    options: ['3', '4', '2', '5'], correct: '3',
    explanation: "There are 3 individual vertical lines, which means 3.",
    hint: "Count each vertical line one by one!"
  },
  {
    topic: 'tally', type: 'mcq', emoji: '✏️',
    question: "How many does this tally show?\n\n卌 | |",
    audioText: "How many does this tally show?",
    options: ['7', '6', '8', '5'], correct: '7',
    explanation: "One group of 5 (crossed gate) plus 2 vertical lines equals 7.",
    hint: "The crossed gate is 5. Count on from 5: 6, 7!"
  },
  {
    topic: 'tally', type: 'mcq', emoji: '✏️',
    question: "How many does this tally show?\n\n卌 卌 | | | |",
    audioText: "How many does this tally show?",
    options: ['14', '12', '15', '10'], correct: '14',
    explanation: "Two groups of 5 (10) plus 4 vertical lines equals 14.",
    hint: "Skip count the gates by 5: 5, 10. Then add the 4 single lines: 11, 12, 13, 14."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '✏️',
    question: "How many does this tally show?\n\n卌",
    audioText: "How many does this tally show?",
    options: ['5', '4', '6', '3'], correct: '5',
    explanation: "A completed group of 5 has 4 vertical lines and 1 diagonal line crossing them.",
    hint: "A gate with a diagonal line always represents exactly 5 items."
  }
]

const tallyWriteQuestions = [
  {
    topic: 'tally', type: 'mcq', emoji: '📝',
    question: "Which tally correctly shows the number 1?",
    audioText: "Which tally correctly shows the number 1?",
    options: ['|', '||', '|||', '||||'], correct: '|',
    explanation: "The number 1 is represented by 1 vertical line.",
    hint: "Look for the option with just a single vertical line."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '📝',
    question: "Which tally correctly shows the number 10?",
    audioText: "Which tally correctly shows the number 10?",
    options: ['卌 卌', '卌', '卌 卌 ||', '卌 |'], correct: '卌 卌',
    explanation: "10 is two completed groups of 5 tallies (5 + 5 = 10).",
    hint: "Think about how many gates of 5 make up 10."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '📝',
    question: "Which tally correctly shows the number 4?",
    audioText: "Which tally correctly shows the number 4?",
    options: ['||||', '|||', '卌', '||'], correct: '||||',
    explanation: "The number 4 is represented by 4 vertical lines without a cross line.",
    hint: "Count the vertical lines. There should be four of them."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '📝',
    question: "Which tally correctly shows the number 5?",
    audioText: "Which tally correctly shows the number 5?",
    options: ['卌', '||||', '卌 |', '|||'], correct: '卌',
    explanation: "5 is represented by 4 vertical lines crossed by a diagonal line.",
    hint: "Remember that 5 is represented by a crossed gate."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '📝',
    question: "Which tally correctly shows the number 6?",
    audioText: "Which tally correctly shows the number 6?",
    options: ['卌 |', '卌', '卌 ||', '||||'], correct: '卌 |',
    explanation: "6 is represented by one crossed group of 5 and one extra line (5 + 1 = 6).",
    hint: "Find 5 (the gate) and add 1 more."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '📝',
    question: "Which tally correctly shows the number 9?",
    audioText: "Which tally correctly shows the number 9?",
    options: ['卌 ||||', '卌 |||', '卌 卌', '卌 ||'], correct: '卌 ||||',
    explanation: "9 is represented by one crossed group of 5 and four extra lines (5 + 4 = 9).",
    hint: "Find 5 (the gate) and add 4 more."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '📝',
    question: "Which tally correctly shows the number 12?",
    audioText: "Which tally correctly shows the number 12?",
    options: ['卌 卌 ||', '卌 卌', '卌 ||||', '卌 卌 |||'], correct: '卌 卌 ||',
    explanation: "12 is two crossed groups of 5 and two extra lines (5 + 5 + 2 = 12).",
    hint: "Two gates of 5 make 10, then add 2 more."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '📝',
    question: "Which tally correctly shows the number 7?",
    audioText: "Which tally correctly shows the number 7?",
    options: ['卌 ||', '卌 |', '卌 |||', '卌'], correct: '卌 ||',
    explanation: "7 is one group of 5 plus two extra lines (5 + 2 = 7).",
    hint: "Find 5 (the gate) and add 2 more."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '📝',
    question: "Which tally correctly shows the number 8?",
    audioText: "Which tally correctly shows the number 8?",
    options: ['卌 |||', '卌 ||', '卌 ||||', '卌'], correct: '卌 |||',
    explanation: "8 is one group of 5 plus three extra lines (5 + 3 = 8).",
    hint: "Find 5 (the gate) and add 3 more."
  }
]

const tallyGroupQuestions = [
  {
    topic: 'tally', type: 'mcq', emoji: '🧮',
    question: "How many complete tally groups of 5 can she make from 12 items?",
    audioText: "How many complete tally groups of 5 can she make from 12 items?",
    options: ['2', '3', '1', '4'], correct: '2',
    explanation: "12 divided by 5 is 2 complete groups, with 2 items left over.",
    hint: "Count by 5s: 5, 10... Next is 15 which is too high! So it's 2 groups."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '🧮',
    question: "How many complete tally groups of 5 can she make from 7 items?",
    audioText: "How many complete tally groups of 5 can she make from 7 items?",
    options: ['1', '2', '0', '3'], correct: '1',
    explanation: "7 divided by 5 is 1 complete group, with 2 items left over.",
    hint: "How many times can you count 5 within 7?"
  },
  {
    topic: 'tally', type: 'mcq', emoji: '🧮',
    question: "How many complete tally groups of 5 can she make from 5 items?",
    audioText: "How many complete tally groups of 5 can she make from 5 items?",
    options: ['1', '2', '0', '3'], correct: '1',
    explanation: "5 items make exactly 1 complete tally group of 5.",
    hint: "Exactly 5 items make one crossed group."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '🧮',
    question: "How many complete tally groups of 5 can she make from 16 items?",
    audioText: "How many complete tally groups of 5 can she make from 16 items?",
    options: ['3', '4', '2', '5'], correct: '3',
    explanation: "16 divided by 5 is 3 complete groups (15), with 1 item left over.",
    hint: "Count by 5s: 5, 10, 15. That is 3 groups."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '🧮',
    question: "How many complete tally groups of 5 can she make from 18 items?",
    audioText: "How many complete tally groups of 5 can she make from 18 items?",
    options: ['3', '4', '2', '5'], correct: '3',
    explanation: "18 divided by 5 is 3 complete groups (15), with 3 items left over.",
    hint: "Count by 5s: 5, 10, 15. That is 3 groups."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '🧮',
    question: "How many complete tally groups of 5 can she make from 11 items?",
    audioText: "How many complete tally groups of 5 can she make from 11 items?",
    options: ['2', '1', '3', '0'], correct: '2',
    explanation: "11 divided by 5 is 2 complete groups (10), with 1 item left over.",
    hint: "Count by 5s: 5, 10. That is 2 groups."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '🧮',
    question: "How many complete tally groups of 5 can she make from 10 items?",
    audioText: "How many complete tally groups of 5 can she make from 10 items?",
    options: ['2', '1', '3', '4'], correct: '2',
    explanation: "10 items make exactly 2 complete tally groups of 5 (5 + 5 = 10).",
    hint: "How many 5s make 10?"
  },
  {
    topic: 'tally', type: 'mcq', emoji: '🧮',
    question: "How many complete tally groups of 5 can she make from 17 items?",
    audioText: "How many complete tally groups of 5 can she make from 17 items?",
    options: ['3', '2', '4', '1'], correct: '3',
    explanation: "17 divided by 5 is 3 complete groups (15), with 2 items left over.",
    hint: "Count by 5s: 5, 10, 15. That is 3 groups."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '🧮',
    question: "How many complete tally groups of 5 can she make from 20 items?",
    audioText: "How many complete tally groups of 5 can she make from 20 items?",
    options: ['4', '3', '5', '2'], correct: '4',
    explanation: "20 items make exactly 4 complete tally groups of 5 (5 * 4 = 20).",
    hint: "Count by 5s: 5, 10, 15, 20. That is 4 groups."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '🧮',
    question: "How many complete tally groups of 5 can she make from 15 items?",
    audioText: "How many complete tally groups of 5 can she make from 15 items?",
    options: ['3', '2', '4', '5'], correct: '3',
    explanation: "15 items make exactly 3 complete tally groups of 5 (5 * 3 = 15).",
    hint: "Count by 5s: 5, 10, 15. That is 3 groups."
  },
  {
    topic: 'tally', type: 'mcq', emoji: '🧮',
    question: "How many complete tally groups of 5 can she make from 9 items?",
    audioText: "How many complete tally groups of 5 can she make from 9 items?",
    options: ['1', '2', '0', '3'], correct: '1',
    explanation: "9 divided by 5 is 1 complete group, with 4 items left over.",
    hint: "How many times does 5 fit in 9?"
  },
  {
    topic: 'tally', type: 'mcq', emoji: '🧮',
    question: "How many complete tally groups of 5 can she make from 6 items?",
    audioText: "How many complete tally groups of 5 can she make from 6 items?",
    options: ['1', '2', '0', '3'], correct: '1',
    explanation: "6 divided by 5 is 1 complete group, with 1 item left over.",
    hint: "How many times does 5 fit in 6?"
  }
]

const ALL_TALLY = [...tallyReadQuestions, ...tallyWriteQuestions, ...tallyGroupQuestions]

// ── 2. COLLECTING QUESTIONS (22 items) ──────────────────────────────────────
const surveyMostPopularQuestions = [
  {
    questionText: "The survey results show Bananas: 10, Apples: 8, Grapes: 10, Oranges: 10. Which was MOST popular?",
    correct: "Bananas",
    options: ['Bananas', 'Apples', 'Grapes', 'Oranges'],
    chartData: [
      { label: 'Bananas', value: 10, emoji: '🍌' },
      { label: 'Apples', value: 8, emoji: '🍎' },
      { label: 'Grapes', value: 10, emoji: '🍇' },
      { label: 'Oranges', value: 10, emoji: '🍊' }
    ]
  },
  {
    questionText: "The survey results show Apples: 4, Mangoes: 6, Oranges: 5, Bananas: 2. Which was MOST popular?",
    correct: "Mangoes",
    options: ['Apples', 'Mangoes', 'Oranges', 'Bananas'],
    chartData: [
      { label: 'Apples', value: 4, emoji: '🍎' },
      { label: 'Mangoes', value: 6, emoji: '🥭' },
      { label: 'Oranges', value: 5, emoji: '🍊' },
      { label: 'Bananas', value: 2, emoji: '🍌' }
    ]
  },
  {
    questionText: "The survey results show Apples: 4, Papayas: 5, Mangoes: 9, Bananas: 5. Which was MOST popular?",
    correct: "Mangoes",
    options: ['Apples', 'Papayas', 'Mangoes', 'Bananas'],
    chartData: [
      { label: 'Apples', value: 4, emoji: '🍎' },
      { label: 'Papayas', value: 5, emoji: '🍈' },
      { label: 'Mangoes', value: 9, emoji: '🥭' },
      { label: 'Bananas', value: 5, emoji: '🍌' }
    ]
  },
  {
    questionText: "The survey results show Papayas: 6, Mangoes: 7, Grapes: 10, Apples: 10. Which was MOST popular?",
    correct: "Grapes",
    options: ['Papayas', 'Mangoes', 'Grapes', 'Apples'],
    chartData: [
      { label: 'Papayas', value: 6, emoji: '🍈' },
      { label: 'Mangoes', value: 7, emoji: '🥭' },
      { label: 'Grapes', value: 10, emoji: '🍇' },
      { label: 'Apples', value: 10, emoji: '🍎' }
    ]
  },
  {
    questionText: "The survey results show Grapes: 8, Bananas: 7, Papayas: 10, Oranges: 5. Which was MOST popular?",
    correct: "Papayas",
    options: ['Grapes', 'Bananas', 'Papayas', 'Oranges'],
    chartData: [
      { label: 'Grapes', value: 8, emoji: '🍇' },
      { label: 'Bananas', value: 7, emoji: '🍌' },
      { label: 'Papayas', value: 10, emoji: '🍈' },
      { label: 'Oranges', value: 5, emoji: '🍊' }
    ]
  },
  {
    questionText: "The survey results show Papayas: 4, Bananas: 8, Mangoes: 2, Apples: 3. Which was MOST popular?",
    correct: "Bananas",
    options: ['Papayas', 'Bananas', 'Mangoes', 'Apples'],
    chartData: [
      { label: 'Papayas', value: 4, emoji: '🍈' },
      { label: 'Bananas', value: 8, emoji: '🍌' },
      { label: 'Mangoes', value: 2, emoji: '🥭' },
      { label: 'Apples', value: 3, emoji: '🍎' }
    ]
  },
  {
    questionText: "The survey results show Apples: 5, Papayas: 2, Mangoes: 4, Bananas: 9. Which was MOST popular?",
    correct: "Bananas",
    options: ['Apples', 'Papayas', 'Mangoes', 'Bananas'],
    chartData: [
      { label: 'Apples', value: 5, emoji: '🍎' },
      { label: 'Papayas', value: 2, emoji: '🍈' },
      { label: 'Mangoes', value: 4, emoji: '🥭' },
      { label: 'Bananas', value: 9, emoji: '🍌' }
    ]
  },
  {
    questionText: "The survey results show Mangoes: 2, Oranges: 2, Grapes: 8, Papayas: 2. Which was MOST popular?",
    correct: "Grapes",
    options: ['Mangoes', 'Oranges', 'Grapes', 'Papayas'],
    chartData: [
      { label: 'Mangoes', value: 2, emoji: '🥭' },
      { label: 'Oranges', value: 2, emoji: '🍊' },
      { label: 'Grapes', value: 8, emoji: '🍇' },
      { label: 'Papayas', value: 2, emoji: '🍈' }
    ]
  },
  {
    questionText: "The survey results show Apples: 4, Oranges: 5, Papayas: 7, Mangoes: 5. Which was MOST popular?",
    correct: "Papayas",
    options: ['Apples', 'Oranges', 'Papayas', 'Mangoes'],
    chartData: [
      { label: 'Apples', value: 4, emoji: '🍎' },
      { label: 'Oranges', value: 5, emoji: '🍊' },
      { label: 'Papayas', value: 7, emoji: '🍈' },
      { label: 'Mangoes', value: 5, emoji: '🥭' }
    ]
  },
  {
    questionText: "The survey results show Apples: 4, Mangoes: 3, Bananas: 4, Papayas: 4. Which was MOST popular?",
    correct: "Apples",
    options: ['Apples', 'Mangoes', 'Bananas', 'Papayas'],
    chartData: [
      { label: 'Apples', value: 4, emoji: '🍎' },
      { label: 'Mangoes', value: 3, emoji: '🥭' },
      { label: 'Bananas', value: 4, emoji: '🍌' },
      { label: 'Papayas', value: 4, emoji: '🍈' }
    ]
  },
  {
    questionText: "The survey results show Apples: 9, Papayas: 5, Bananas: 5, Oranges: 4. Which was MOST popular?",
    correct: "Apples",
    options: ['Apples', 'Papayas', 'Bananas', 'Oranges'],
    chartData: [
      { label: 'Apples', value: 9, emoji: '🍎' },
      { label: 'Papayas', value: 5, emoji: '🍈' },
      { label: 'Bananas', value: 5, emoji: '🍌' },
      { label: 'Oranges', value: 4, emoji: '🍊' }
    ]
  },
  {
    questionText: "The survey results show Grapes: 8, Bananas: 5, Oranges: 5, Mangoes: 8. Which was MOST popular?",
    correct: "Grapes",
    options: ['Grapes', 'Bananas', 'Oranges', 'Mangoes'],
    chartData: [
      { label: 'Grapes', value: 8, emoji: '🍇' },
      { label: 'Bananas', value: 5, emoji: '🍌' },
      { label: 'Oranges', value: 5, emoji: '🍊' },
      { label: 'Mangoes', value: 8, emoji: '🥭' }
    ]
  },
  {
    questionText: "The survey results show Apples: 5, Grapes: 7, Mangoes: 2, Oranges: 5. Which was MOST popular?",
    correct: "Grapes",
    options: ['Apples', 'Grapes', 'Mangoes', 'Oranges'],
    chartData: [
      { label: 'Apples', value: 5, emoji: '🍎' },
      { label: 'Grapes', value: 7, emoji: '🍇' },
      { label: 'Mangoes', value: 2, emoji: '🥭' },
      { label: 'Oranges', value: 5, emoji: '🍊' }
    ]
  },
  {
    questionText: "The survey results show Grapes: 4, Apples: 2, Bananas: 3, Mangoes: 6. Which was MOST popular?",
    correct: "Mangoes",
    options: ['Grapes', 'Apples', 'Bananas', 'Mangoes'],
    chartData: [
      { label: 'Grapes', value: 4, emoji: '🍇' },
      { label: 'Apples', value: 2, emoji: '🍎' },
      { label: 'Bananas', value: 3, emoji: '🍌' },
      { label: 'Mangoes', value: 6, emoji: '🥭' }
    ]
  },
  {
    questionText: "The survey results show Apples: 7, Grapes: 5, Papayas: 8, Mangoes: 9. Which was MOST popular?",
    correct: "Mangoes",
    options: ['Apples', 'Grapes', 'Papayas', 'Mangoes'],
    chartData: [
      { label: 'Apples', value: 7, emoji: '🍎' },
      { label: 'Grapes', value: 5, emoji: '🍇' },
      { label: 'Papayas', value: 8, emoji: '🍈' },
      { label: 'Mangoes', value: 9, emoji: '🥭' }
    ]
  },
  {
    questionText: "The survey results show Papayas: 7, Mangoes: 9, Bananas: 6, Apples: 7. Which was MOST popular?",
    correct: "Mangoes",
    options: ['Papayas', 'Mangoes', 'Bananas', 'Apples'],
    chartData: [
      { label: 'Papayas', value: 7, emoji: '🍈' },
      { label: 'Mangoes', value: 9, emoji: '🥭' },
      { label: 'Bananas', value: 6, emoji: '🍌' },
      { label: 'Apples', value: 7, emoji: '🍎' }
    ]
  },
  {
    questionText: "The survey results show Papayas: 3, Oranges: 3, Grapes: 4, Bananas: 3. Which was MOST popular?",
    correct: "Grapes",
    options: ['Papayas', 'Oranges', 'Grapes', 'Bananas'],
    chartData: [
      { label: 'Papayas', value: 3, emoji: '🍈' },
      { label: 'Oranges', value: 3, emoji: '🍊' },
      { label: 'Grapes', value: 4, emoji: '🍇' },
      { label: 'Bananas', value: 3, emoji: '🍌' }
    ]
  },
  {
    questionText: "The survey results show Mangoes: 9, Papayas: 6, Bananas: 7, Oranges: 6. Which was MOST popular?",
    correct: "Mangoes",
    options: ['Mangoes', 'Papayas', 'Bananas', 'Oranges'],
    chartData: [
      { label: 'Mangoes', value: 9, emoji: '🥭' },
      { label: 'Papayas', value: 6, emoji: '🍈' },
      { label: 'Bananas', value: 7, emoji: '🍌' },
      { label: 'Oranges', value: 6, emoji: '🍊' }
    ]
  },
  {
    questionText: "The survey results show Oranges: 8, Mangoes: 8, Papayas: 6, Apples: 6. Which was MOST popular?",
    correct: "Oranges",
    options: ['Oranges', 'Mangoes', 'Papayas', 'Apples'],
    chartData: [
      { label: 'Oranges', value: 8, emoji: '🍊' },
      { label: 'Mangoes', value: 8, emoji: '🥭' },
      { label: 'Papayas', value: 6, emoji: '🍈' },
      { label: 'Apples', value: 6, emoji: '🍎' }
    ]
  },
  {
    questionText: "The survey results show Mangoes: 3, Papayas: 4, Bananas: 9, Apples: 9. Which was MOST popular?",
    correct: "Bananas",
    options: ['Mangoes', 'Papayas', 'Bananas', 'Apples'],
    chartData: [
      { label: 'Mangoes', value: 3, emoji: '🥭' },
      { label: 'Papayas', value: 4, emoji: '🍈' },
      { label: 'Bananas', value: 9, emoji: '🍌' },
      { label: 'Apples', value: 9, emoji: '🍎' }
    ]
  }
].map(q => ({
  topic: 'collecting', type: 'mcq', emoji: '📋',
  question: q.questionText,
  audioText: q.questionText,
  options: q.options, correct: q.correct,
  explanation: `${q.correct} has the highest count in the survey results.`,
  hint: "Look for the item that has the largest number next to it!",
  chartData: q.chartData
}))

const surveyOtherQuestions = [
  {
    topic: 'collecting', type: 'mcq', emoji: '🧮',
    question: "Bananas: 10, Apples: 8, Grapes: 10, Oranges: 10.\nHow many students were surveyed in total?",
    audioText: "How many students were surveyed in total?",
    options: ['38', '36', '40', '34'], correct: '38',
    explanation: "Add all options: 10 + 8 + 10 + 10 = 38 students.",
    hint: "Add the counts together: 10 + 8 + 10 + 10.",
    chartData: [
      { label: 'Bananas', value: 10, emoji: '🍌' },
      { label: 'Apples', value: 8, emoji: '🍎' },
      { label: 'Grapes', value: 10, emoji: '🍇' },
      { label: 'Oranges', value: 10, emoji: '🍊' }
    ]
  },
  {
    topic: 'collecting', type: 'mcq', emoji: '📉',
    question: "Apples: 4, Mangoes: 6, Oranges: 5, Bananas: 2.\nWhich item was the LEAST popular?",
    audioText: "Which item was the LEAST popular?",
    options: ['Apples', 'Mangoes', 'Oranges', 'Bananas'], correct: 'Bananas',
    explanation: "Bananas has the lowest count of 2 in the list.",
    hint: "Look for the item with the smallest number of votes.",
    chartData: [
      { label: 'Apples', value: 4, emoji: '🍎' },
      { label: 'Mangoes', value: 6, emoji: '🥭' },
      { label: 'Oranges', value: 5, emoji: '🍊' },
      { label: 'Bananas', value: 2, emoji: '🍌' }
    ]
  }
]

const ALL_COLLECTING = [...surveyMostPopularQuestions, ...surveyOtherQuestions]

// ── 3. TABLE QUESTIONS (23 items) ───────────────────────────────────────────
const tableFindQuestions = [
  {
    topic: 'tables', type: 'mcq', emoji: '📋',
    question: "The table shows the data. How many Mangoes are there?",
    audioText: "The table shows the data. How many Mangoes are there?",
    options: ['7', '6', '8', '5'], correct: '7',
    explanation: "Looking at the Mangoes row in the table, the value is 7.",
    hint: "Locate 'Mangoes' in the list or table, and read the number next to it.",
    chartData: [
      { label: 'Mangoes', value: 7, emoji: '🥭' },
      { label: 'Apples', value: 4, emoji: '🍎' },
      { label: 'Oranges', value: 5, emoji: '🍊' }
    ]
  },
  {
    topic: 'tables', type: 'mcq', emoji: '📋',
    question: "The table shows the data. How many Bananas are there?",
    audioText: "The table shows the data. How many Bananas are there?",
    options: ['8', '7', '9', '6'], correct: '8',
    explanation: "Looking at the Bananas row in the table, the value is 8.",
    hint: "Find the word 'Bananas' and look at the number right next to it.",
    chartData: [
      { label: 'Bananas', value: 8, emoji: '🍌' },
      { label: 'Apples', value: 3, emoji: '🍎' },
      { label: 'Oranges', value: 6, emoji: '🍊' }
    ]
  },
  {
    topic: 'tables', type: 'mcq', emoji: '📋',
    question: "The table shows the data. How many Grapes are there?",
    audioText: "The table shows the data. How many Grapes are there?",
    options: ['10', '9', '11', '8'], correct: '10',
    explanation: "Looking at the Grapes row in the table, the value is 10.",
    hint: "Find the word 'Grapes' and read the number listed.",
    chartData: [
      { label: 'Grapes', value: 10, emoji: '🍇' },
      { label: 'Apples', value: 5, emoji: '🍎' },
      { label: 'Oranges', value: 4, emoji: '🍊' }
    ]
  },
  {
    topic: 'tables', type: 'mcq', emoji: '📋',
    question: "The table shows the data. How many Oranges are there?",
    audioText: "The table shows the data. How many Oranges are there?",
    options: ['9', '8', '10', '7'], correct: '9',
    explanation: "Looking at the Oranges row in the table, the value is 9.",
    hint: "Look for 'Oranges' in the table and check the count.",
    chartData: [
      { label: 'Oranges', value: 9, emoji: '🍊' },
      { label: 'Apples', value: 4, emoji: '🍎' },
      { label: 'Bananas', value: 5, emoji: '🍌' }
    ]
  },
  {
    topic: 'tables', type: 'mcq', emoji: '📋',
    question: "The table shows the data. How many Apples are there?",
    audioText: "The table shows the data. How many Apples are there?",
    options: ['6', '5', '7', '4'], correct: '6',
    explanation: "Looking at the Apples row in the table, the value is 6.",
    hint: "Locate 'Apples' in the first column and check its count.",
    chartData: [
      { label: 'Apples', value: 6, emoji: '🍎' },
      { label: 'Mangoes', value: 3, emoji: '🥭' },
      { label: 'Oranges', value: 7, emoji: '🍊' }
    ]
  },
  {
    topic: 'tables', type: 'mcq', emoji: '📋',
    question: "The table shows the data. How many Papayas are there?",
    audioText: "The table shows the data. How many Papayas are there?",
    options: ['8', '7', '9', '6'], correct: '8',
    explanation: "Looking at the Papayas row in the table, the value is 8.",
    hint: "Locate 'Papayas' and read its corresponding number.",
    chartData: [
      { label: 'Papayas', value: 8, emoji: '🍈' },
      { label: 'Mangoes', value: 4, emoji: '🥭' },
      { label: 'Apples', value: 5, emoji: '🍎' }
    ]
  }
]

const tableDiffQuestions = [
  {
    question: "How many MORE Papayas than Apples are there?",
    correct: '5', options: ['5', '4', '6', '3'],
    chartData: [{ label: 'Papayas', value: 8, emoji: '🍈' }, { label: 'Apples', value: 3, emoji: '🍎' }]
  },
  {
    question: "How many MORE Grapes than Bananas are there?",
    correct: '6', options: ['6', '5', '7', '4'],
    chartData: [{ label: 'Grapes', value: 10, emoji: '🍇' }, { label: 'Bananas', value: 4, emoji: '🍌' }]
  },
  {
    question: "How many MORE Bananas than Grapes are there?",
    correct: '5', options: ['5', '4', '6', '3'],
    chartData: [{ label: 'Bananas', value: 9, emoji: '🍌' }, { label: 'Grapes', value: 4, emoji: '🍇' }]
  },
  {
    question: "How many MORE Grapes than Grapes are there?",
    correct: '0', options: ['0', '1', '2', '3'],
    chartData: [{ label: 'Grapes', value: 8, emoji: '🍇' }]
  },
  {
    question: "How many MORE Mangoes than Bananas are there?",
    correct: '6', options: ['6', '5', '7', '4'],
    chartData: [{ label: 'Mangoes', value: 10, emoji: '🥭' }, { label: 'Bananas', value: 4, emoji: '🍌' }]
  },
  {
    question: "How many MORE Apples than Bananas are there?",
    correct: '4', options: ['4', '3', '5', '2'],
    chartData: [{ label: 'Apples', value: 9, emoji: '🍎' }, { label: 'Bananas', value: 5, emoji: '🍌' }]
  },
  {
    question: "How many MORE Papayas than Papayas are there?",
    correct: '0', options: ['0', '1', '2', '3'],
    chartData: [{ label: 'Papayas', value: 7, emoji: '🍈' }]
  },
  {
    question: "How many MORE Bananas than Bananas are there?",
    correct: '0', options: ['0', '1', '2', '3'],
    chartData: [{ label: 'Bananas', value: 6, emoji: '🍌' }]
  },
  {
    question: "How many MORE Grapes than Papayas are there?",
    correct: '5', options: ['5', '4', '6', '3'],
    chartData: [{ label: 'Grapes', value: 8, emoji: '🍇' }, { label: 'Papayas', value: 3, emoji: '🍈' }]
  },
  {
    question: "How many MORE Bananas than Papayas are there?",
    correct: '5', options: ['5', '4', '6', '3'],
    chartData: [{ label: 'Bananas', value: 9, emoji: '🍌' }, { label: 'Papayas', value: 4, emoji: '🍈' }]
  },
  {
    question: "How many MORE Papayas than Bananas are there?",
    correct: '7', options: ['7', '6', '8', '5'],
    chartData: [{ label: 'Papayas', value: 10, emoji: '🍈' }, { label: 'Bananas', value: 3, emoji: '🍌' }]
  },
  {
    question: "How many MORE Apples than Mangoes are there?",
    correct: '5', options: ['5', '4', '6', '3'],
    chartData: [{ label: 'Apples', value: 9, emoji: '🍎' }, { label: 'Mangoes', value: 4, emoji: '🥭' }]
  },
  {
    question: "How many MORE Apples than Papayas are there?",
    correct: '6', options: ['6', '5', '7', '4'],
    chartData: [{ label: 'Apples', value: 8, emoji: '🍎' }, { label: 'Papayas', value: 2, emoji: '🍈' }]
  },
  {
    question: "How many MORE Mangoes than Papayas are there?",
    correct: '6', options: ['6', '5', '7', '4'],
    chartData: [{ label: 'Mangoes', value: 10, emoji: '🥭' }, { label: 'Papayas', value: 4, emoji: '🍈' }]
  },
  {
    question: "How many MORE Oranges than Apples are there?",
    correct: '6', options: ['6', '5', '7', '4'],
    chartData: [{ label: 'Oranges', value: 11, emoji: '🍊' }, { label: 'Apples', value: 5, emoji: '🍎' }]
  },
  {
    question: "How many MORE Papayas than Grapes are there?",
    correct: '6', options: ['6', '5', '7', '4'],
    chartData: [{ label: 'Papayas', value: 9, emoji: '🍈' }, { label: 'Grapes', value: 3, emoji: '🍇' }]
  }
].map(q => ({
  topic: 'tables', type: 'mcq', emoji: '➖',
  question: `Table details:\n${q.chartData.map(c => c.label + ': ' + c.value).join(', ')}.\n\n${q.question}`,
  audioText: q.question,
  options: q.options, correct: q.correct,
  explanation: `Subtract the counts: ${q.chartData[0]?.value || 0} - ${q.chartData[1]?.value || 0} = ${q.correct}.`,
  hint: "Find both numbers in the table and subtract the smaller number from the larger number.",
  chartData: q.chartData
}))

const tableTotalQuestion = {
  topic: 'tables', type: 'mcq', emoji: '➕',
  question: "Table details:\nApples: 5, Mangoes: 4, Oranges: 6, Bananas: 5.\n\nWhat is the TOTAL number of items in the table?",
  audioText: "What is the TOTAL number of items in the table?",
  options: ['20', '18', '22', '15'], correct: '20',
  explanation: "Add up all counts: 5 + 4 + 6 + 5 = 20.",
  hint: "Find the sum of all categories in the table.",
  chartData: [
    { label: 'Apples', value: 5, emoji: '🍎' },
    { label: 'Mangoes', value: 4, emoji: '🥭' },
    { label: 'Oranges', value: 6, emoji: '🍊' },
    { label: 'Bananas', value: 5, emoji: '🍌' }
  ]
}

const ALL_TABLES = [...tableFindQuestions, ...tableDiffQuestions, tableTotalQuestion]

// ── 4. PICTOGRAPH QUESTIONS (28 items) ──────────────────────────────────────
const pictoCountQuestions = [
  {
    topic: 'pictograph', type: 'mcq', emoji: '🍊',
    question: "Pictograph has Oranges: 4 symbols.\nHow many Oranges symbols are there?",
    audioText: "How many Oranges symbols are there?",
    options: ['4', '3', '5', '2'], correct: '4',
    explanation: "Count the orange symbols in the pictograph row: 4.",
    hint: "Count the number of orange icons in the row.",
    chartData: [{ label: 'Oranges', value: 4, emoji: '🍊' }]
  },
  {
    topic: 'pictograph', type: 'mcq', emoji: '📊',
    question: "Pictograph shows:\nApples: 6, Mangoes: 2, Oranges: 5, Bananas: 8.\n\nWhich has the FEWEST symbols?",
    audioText: "Which has the FEWEST symbols?",
    options: ['Apples', 'Mangoes', 'Oranges', 'Bananas'], correct: 'Mangoes',
    explanation: "Mangoes row has only 2 symbols, which is the shortest row (fewest).",
    hint: "Which row has the least number of pictures?",
    chartData: [
      { label: 'Apples', value: 6, emoji: '🍎' },
      { label: 'Mangoes', value: 2, emoji: '🥭' },
      { label: 'Oranges', value: 5, emoji: '🍊' },
      { label: 'Bananas', value: 8, emoji: '🍌' }
    ]
  },
  {
    topic: 'pictograph', type: 'mcq', emoji: '🔢',
    question: "Pictograph shows:\nApples: 3, Mangoes: 2, Oranges: 4, Bananas: 1.\n\nHow many symbols are there in TOTAL?",
    audioText: "How many symbols are there in TOTAL?",
    options: ['10', '9', '11', '8'], correct: '10',
    explanation: "Count all the symbols combined: 3 + 2 + 4 + 1 = 10.",
    hint: "Count all the symbols in the entire pictograph.",
    chartData: [
      { label: 'Apples', value: 3, emoji: '🍎' },
      { label: 'Mangoes', value: 2, emoji: '🥭' },
      { label: 'Oranges', value: 4, emoji: '🍊' },
      { label: 'Bananas', value: 1, emoji: '🍌' }
    ]
  },
  {
    topic: 'pictograph', type: 'mcq', emoji: '🍇',
    question: "Pictograph has Grapes: 6 symbols.\nHow many Grapes symbols are there?",
    audioText: "How many Grapes symbols are there?",
    options: ['6', '5', '7', '4'], correct: '6',
    explanation: "Count the grape symbols in the row: 6.",
    hint: "Locate Grapes and count the emojis next to it.",
    chartData: [{ label: 'Grapes', value: 6, emoji: '🍇' }]
  },
  {
    topic: 'pictograph', type: 'mcq', emoji: '🍈',
    question: "Pictograph has Papayas: 5 symbols.\nHow many Papayas symbols are there?",
    audioText: "How many Papayas symbols are there?",
    options: ['5', '4', '6', '3'], correct: '5',
    explanation: "Count the papayas symbols in the row: 5.",
    hint: "Locate Papayas and count the emojis next to it.",
    chartData: [{ label: 'Papayas', value: 5, emoji: '🍈' }]
  },
  {
    topic: 'pictograph', type: 'mcq', emoji: '🍌',
    question: "Pictograph has Bananas: 7 symbols.\nHow many Bananas symbols are there?",
    audioText: "How many Bananas symbols are there?",
    options: ['7', '6', '8', '5'], correct: '7',
    explanation: "Count the banana symbols in the row: 7.",
    hint: "Locate Bananas and count the emojis next to it.",
    chartData: [{ label: 'Bananas', value: 7, emoji: '🍌' }]
  },
  {
    topic: 'pictograph', type: 'mcq', emoji: '🥭',
    question: "Pictograph has Mangoes: 8 symbols.\nHow many Mangoes symbols are there?",
    audioText: "How many Mangoes symbols are there?",
    options: ['8', '7', '9', '6'], correct: '8',
    explanation: "Count the mango symbols in the row: 8.",
    hint: "Locate Mangoes and count the emojis next to it.",
    chartData: [{ label: 'Mangoes', value: 8, emoji: '🥭' }]
  },
  {
    topic: 'pictograph', type: 'mcq', emoji: '🍎',
    question: "Pictograph has Apples: 9 symbols.\nHow many Apples symbols are there?",
    audioText: "How many Apples symbols are there?",
    options: ['9', '8', '10', '7'], correct: '9',
    explanation: "Count the apple symbols in the row: 9.",
    hint: "Locate Apples and count the emojis next to it.",
    chartData: [{ label: 'Apples', value: 9, emoji: '🍎' }]
  }
]

const pictoMostQuestions = [
  {
    questionText: "The pictograph shows Papayas: 1, Bananas: 2, Oranges: 4, Mangoes: 2. Which has the MOST symbols?",
    correct: "Oranges",
    options: ['Papayas', 'Bananas', 'Oranges', 'Mangoes'],
    chartData: [
      { label: 'Papayas', value: 1, emoji: '🍈' },
      { label: 'Bananas', value: 2, emoji: '🍌' },
      { label: 'Oranges', value: 4, emoji: '🍊' },
      { label: 'Mangoes', value: 2, emoji: '🥭' }
    ]
  },
  {
    questionText: "The pictograph shows Apples: 4, Mangoes: 4, Papayas: 8, Oranges: 8. Which has the MOST symbols?",
    correct: "Papayas",
    options: ['Apples', 'Mangoes', 'Papayas', 'Oranges'],
    chartData: [
      { label: 'Apples', value: 4, emoji: '🍎' },
      { label: 'Mangoes', value: 4, emoji: '🥭' },
      { label: 'Papayas', value: 8, emoji: '🍈' },
      { label: 'Oranges', value: 8, emoji: '🍊' }
    ]
  },
  {
    questionText: "The pictograph shows Bananas: 2, Oranges: 10, Mangoes: 5, Apples: 2. Which has the MOST symbols?",
    correct: "Oranges",
    options: ['Bananas', 'Oranges', 'Mangoes', 'Apples'],
    chartData: [
      { label: 'Bananas', value: 2, emoji: '🍌' },
      { label: 'Oranges', value: 10, emoji: '🍊' },
      { label: 'Mangoes', value: 5, emoji: '🥭' },
      { label: 'Apples', value: 2, emoji: '🍎' }
    ]
  },
  {
    questionText: "The pictograph shows Mangoes: 9, Grapes: 9, Apples: 5, Oranges: 4. Which has the MOST symbols?",
    correct: "Mangoes",
    options: ['Mangoes', 'Grapes', 'Apples', 'Oranges'],
    chartData: [
      { label: 'Mangoes', value: 9, emoji: '🥭' },
      { label: 'Grapes', value: 9, emoji: '🍇' },
      { label: 'Apples', value: 5, emoji: '🍎' },
      { label: 'Oranges', value: 4, emoji: '🍊' }
    ]
  },
  {
    questionText: "The pictograph shows Apples: 8, Grapes: 1, Bananas: 5, Mangoes: 6. Which has the MOST symbols?",
    correct: "Apples",
    options: ['Apples', 'Grapes', 'Bananas', 'Mangoes'],
    chartData: [
      { label: 'Apples', value: 8, emoji: '🍎' },
      { label: 'Grapes', value: 1, emoji: '🍇' },
      { label: 'Bananas', value: 5, emoji: '🍌' },
      { label: 'Mangoes', value: 6, emoji: '🥭' }
    ]
  },
  {
    questionText: "The pictograph shows Oranges: 9, Mangoes: 7, Apples: 8, Grapes: 7. Which has the MOST symbols?",
    correct: "Oranges",
    options: ['Oranges', 'Mangoes', 'Apples', 'Grapes'],
    chartData: [
      { label: 'Oranges', value: 9, emoji: '🍊' },
      { label: 'Mangoes', value: 7, emoji: '🥭' },
      { label: 'Apples', value: 8, emoji: '🍎' },
      { label: 'Grapes', value: 7, emoji: '🍇' }
    ]
  },
  {
    questionText: "The pictograph shows Bananas: 5, Papayas: 9, Oranges: 6, Grapes: 2. Which has the MOST symbols?",
    correct: "Papayas",
    options: ['Bananas', 'Papayas', 'Oranges', 'Grapes'],
    chartData: [
      { label: 'Bananas', value: 5, emoji: '🍌' },
      { label: 'Papayas', value: 9, emoji: '🍈' },
      { label: 'Oranges', value: 6, emoji: '🍊' },
      { label: 'Grapes', value: 2, emoji: '🍇' }
    ]
  },
  {
    questionText: "The pictograph shows Apples: 1, Bananas: 3, Grapes: 7, Papayas: 5. Which has the MOST symbols?",
    correct: "Grapes",
    options: ['Apples', 'Bananas', 'Grapes', 'Papayas'],
    chartData: [
      { label: 'Apples', value: 1, emoji: '🍎' },
      { label: 'Bananas', value: 3, emoji: '🍌' },
      { label: 'Grapes', value: 7, emoji: '🍇' },
      { label: 'Papayas', value: 5, emoji: '🍈' }
    ]
  },
  {
    questionText: "The pictograph shows Bananas: 4, Oranges: 4, Grapes: 5, Mangoes: 2. Which has the MOST symbols?",
    correct: "Grapes",
    options: ['Bananas', 'Oranges', 'Grapes', 'Mangoes'],
    chartData: [
      { label: 'Bananas', value: 4, emoji: '🍌' },
      { label: 'Oranges', value: 4, emoji: '🍊' },
      { label: 'Grapes', value: 5, emoji: '🍇' },
      { label: 'Mangoes', value: 2, emoji: '🥭' }
    ]
  },
  {
    questionText: "The pictograph shows Apples: 1, Mangoes: 8, Oranges: 10, Bananas: 8. Which has the MOST symbols?",
    correct: "Oranges",
    options: ['Apples', 'Mangoes', 'Oranges', 'Bananas'],
    chartData: [
      { label: 'Apples', value: 1, emoji: '🍎' },
      { label: 'Mangoes', value: 8, emoji: '🥭' },
      { label: 'Oranges', value: 10, emoji: '🍊' },
      { label: 'Bananas', value: 8, emoji: '🍌' }
    ]
  },
  {
    questionText: "The pictograph shows Grapes: 7, Mangoes: 5, Bananas: 6, Papayas: 5. Which has the MOST symbols?",
    correct: "Grapes",
    options: ['Grapes', 'Mangoes', 'Bananas', 'Papayas'],
    chartData: [
      { label: 'Grapes', value: 7, emoji: '🍇' },
      { label: 'Mangoes', value: 5, emoji: '🥭' },
      { label: 'Bananas', value: 6, emoji: '🍌' },
      { label: 'Papayas', value: 5, emoji: '🍈' }
    ]
  },
  {
    questionText: "The pictograph shows Apples: 8, Mangoes: 10, Oranges: 4, Papayas: 1. Which has the MOST symbols?",
    correct: "Mangoes",
    options: ['Apples', 'Mangoes', 'Oranges', 'Papayas'],
    chartData: [
      { label: 'Apples', value: 8, emoji: '🍎' },
      { label: 'Mangoes', value: 10, emoji: '🥭' },
      { label: 'Oranges', value: 4, emoji: '🍊' },
      { label: 'Papayas', value: 1, emoji: '🍈' }
    ]
  },
  {
    questionText: "The pictograph shows Bananas: 2, Oranges: 3, Mangoes: 8, Apples: 2. Which has the MOST symbols?",
    correct: "Mangoes",
    options: ['Bananas', 'Oranges', 'Mangoes', 'Apples'],
    chartData: [
      { label: 'Bananas', value: 2, emoji: '🍌' },
      { label: 'Oranges', value: 3, emoji: '🍊' },
      { label: 'Mangoes', value: 8, emoji: '🥭' },
      { label: 'Apples', value: 2, emoji: '🍎' }
    ]
  },
  {
    questionText: "The pictograph shows Mangoes: 6, Bananas: 2, Grapes: 2, Papayas: 3. Which has the MOST symbols?",
    correct: "Mangoes",
    options: ['Mangoes', 'Bananas', 'Grapes', 'Papayas'],
    chartData: [
      { label: 'Mangoes', value: 6, emoji: '🥭' },
      { label: 'Bananas', value: 2, emoji: '🍌' },
      { label: 'Grapes', value: 2, emoji: '🍇' },
      { label: 'Papayas', value: 3, emoji: '🍈' }
    ]
  },
  {
    questionText: "The pictograph shows Papayas: 7, Mangoes: 4, Oranges: 1, Bananas: 7. Which has the MOST symbols?",
    correct: "Papayas",
    options: ['Papayas', 'Mangoes', 'Oranges', 'Bananas'],
    chartData: [
      { label: 'Papayas', value: 7, emoji: '🍈' },
      { label: 'Mangoes', value: 4, emoji: '🥭' },
      { label: 'Oranges', value: 1, emoji: '🍊' },
      { label: 'Bananas', value: 7, emoji: '🍌' }
    ]
  },
  {
    questionText: "The pictograph shows Papayas: 6, Oranges: 7, Bananas: 1, Mangoes: 5. Which has the MOST symbols?",
    correct: "Oranges",
    options: ['Papayas', 'Oranges', 'Bananas', 'Mangoes'],
    chartData: [
      { label: 'Papayas', value: 6, emoji: '🍈' },
      { label: 'Oranges', value: 7, emoji: '🍊' },
      { label: 'Bananas', value: 1, emoji: '🍌' },
      { label: 'Mangoes', value: 5, emoji: '🥭' }
    ]
  },
  {
    questionText: "The pictograph shows Oranges: 10, Grapes: 5, Bananas: 4, Papayas: 1. Which has the MOST symbols?",
    correct: "Oranges",
    options: ['Oranges', 'Grapes', 'Bananas', 'Papayas'],
    chartData: [
      { label: 'Oranges', value: 10, emoji: '🍊' },
      { label: 'Grapes', value: 5, emoji: '🍇' },
      { label: 'Bananas', value: 4, emoji: '🍌' },
      { label: 'Papayas', value: 1, emoji: '🍈' }
    ]
  },
  {
    questionText: "The pictograph shows Bananas: 7, Papayas: 5, Grapes: 1, Oranges: 1. Which has the MOST symbols?",
    correct: "Bananas",
    options: ['Bananas', 'Papayas', 'Grapes', 'Oranges'],
    chartData: [
      { label: 'Bananas', value: 7, emoji: '🍌' },
      { label: 'Papayas', value: 5, emoji: '🍈' },
      { label: 'Grapes', value: 1, emoji: '🍇' },
      { label: 'Oranges', value: 1, emoji: '🍊' }
    ]
  },
  {
    questionText: "The pictograph shows Mangoes: 2, Bananas: 1, Grapes: 1, Papayas: 9. Which has the MOST symbols?",
    correct: "Papayas",
    options: ['Mangoes', 'Bananas', 'Grapes', 'Papayas'],
    chartData: [
      { label: 'Mangoes', value: 2, emoji: '🥭' },
      { label: 'Bananas', value: 1, emoji: '🍌' },
      { label: 'Grapes', value: 1, emoji: '🍇' },
      { label: 'Papayas', value: 9, emoji: '🍈' }
    ]
  },
  {
    questionText: "The pictograph shows Mangoes: 10, Papayas: 3, Grapes: 1, Apples: 5. Which has the MOST symbols?",
    correct: "Mangoes",
    options: ['Mangoes', 'Papayas', 'Grapes', 'Apples'],
    chartData: [
      { label: 'Mangoes', value: 10, emoji: '🥭' },
      { label: 'Papayas', value: 3, emoji: '🍈' },
      { label: 'Grapes', value: 1, emoji: '🍇' },
      { label: 'Apples', value: 5, emoji: '🍎' }
    ]
  }
].map(q => ({
  topic: 'pictograph', type: 'mcq', emoji: '📊',
  question: q.questionText,
  audioText: q.questionText,
  options: q.options, correct: q.correct,
  explanation: `${q.correct} has the most symbols in the pictograph.`,
  hint: "Look for the category that has the longest line of icons!",
  chartData: q.chartData
}))

const ALL_PICTOGRAPH = [...pictoCountQuestions, ...pictoMostQuestions]

// ── 5. COMPARING QUESTIONS (3 items) ────────────────────────────────────────
const ALL_COMPARING = [
  {
    topic: 'comparing', type: 'mcq', emoji: '🔍',
    question: "Comparing details:\nOranges: 8 votes, Mangoes: 3 votes.\n\nHow many more did the more popular option get than the less popular one?",
    audioText: "How many more did the more popular option get than the less popular one?",
    options: ['5', '4', '6', '3'], correct: '5',
    explanation: "Subtract counts: 8 - 3 = 5.",
    hint: "Subtract the smaller vote count from the larger vote count.",
    chartData: [
      { label: 'Oranges', value: 8, emoji: '🍊' },
      { label: 'Mangoes', value: 3, emoji: '🥭' }
    ]
  },
  {
    topic: 'comparing', type: 'mcq', emoji: '⚖️',
    question: "Is it TRUE or FALSE that the most popular option has the tallest bar?",
    audioText: "Is it TRUE or FALSE that the most popular option has the tallest bar?",
    options: ['True', 'False'], correct: 'True',
    explanation: "Yes, in a bar chart or graph, the category with the most votes has the tallest bar.",
    hint: "Popular items have higher counts, which means they stand taller on charts.",
    chartData: [
      { label: 'Oranges', value: 10, emoji: '🍊' },
      { label: 'Apples', value: 4, emoji: '🍎' }
    ]
  },
  {
    topic: 'comparing', type: 'mcq', emoji: '🔍',
    question: "Comparing details:\nApples: 5 votes, Bananas: 7 votes.\n\nWhat is the combined total for both options?",
    audioText: "What is the combined total for both options?",
    options: ['12', '10', '14', '9'], correct: '12',
    explanation: "Combined total means adding them together: 5 + 7 = 12.",
    hint: "Add the count of Apples and Bananas together.",
    chartData: [
      { label: 'Apples', value: 5, emoji: '🍎' },
      { label: 'Bananas', value: 7, emoji: '🍌' }
    ]
  }
]

// ── 6. WHAT IS DATA QUESTIONS (2 items) ──────────────────────────────────────
const ALL_WHAT_IS_DATA = [
  {
    topic: 'whatIsData', type: 'mcq', emoji: '📊',
    question: "What is DATA?",
    audioText: "What is DATA?",
    options: ['Information we collect', 'A type of food', 'A school subject', 'A game rule'], correct: 'Information we collect',
    explanation: "Data is facts, numbers, or details that we gather and record about the world.",
    hint: "Think about why we ask questions and record tally marks."
  },
  {
    topic: 'whatIsData', type: 'mcq', emoji: '📊',
    question: "Which is an example of collecting data?",
    audioText: "Which is an example of collecting data?",
    options: ['Counting how many students like mangoes', 'Drawing a picture', 'Running a race', 'Eating lunch'], correct: 'Counting how many students like mangoes',
    explanation: "Counting and recording student preferences is a form of collecting data.",
    hint: "Look for an action that involves counting, surveying, or writing down records."
  }
]

// ── 10 Game Worlds ───────────────────────────────────────────────────────────
export const WORLDS = [
  {
    id: 'tally-town',
    name: 'Tally Town',
    desc: 'Master tally marks — counting in groups of 5',
    color: '#22c55e',
    icon: '✏️',
    questionsList: ALL_TALLY
  },
  {
    id: 'survey-square',
    name: 'Survey Square',
    desc: 'Collect data through surveys and questions',
    color: '#f97316',
    icon: '📋',
    questionsList: ALL_COLLECTING
  },
  {
    id: 'data-den',
    name: 'Data Den',
    desc: 'What is data? Understand the basics',
    color: '#a855f7',
    icon: '📊',
    questionsList: [...ALL_WHAT_IS_DATA, ...ALL_TALLY.slice(0, 4), ...ALL_COLLECTING.slice(0, 4)]
  },
  {
    id: 'table-temple',
    name: 'Table Temple',
    desc: 'Organise data in rows and columns',
    color: '#3b82f6',
    icon: '📋',
    questionsList: ALL_TABLES
  },
  {
    id: 'picto-park',
    name: 'Picto Park',
    desc: 'Read and interpret pictographs',
    color: '#ec4899',
    icon: '🖼️',
    questionsList: ALL_PICTOGRAPH
  },
  {
    id: 'compare-canyon',
    name: 'Compare Canyon',
    desc: 'Compare data — most, least, difference',
    color: '#f5c518',
    icon: '🔍',
    questionsList: [...ALL_COMPARING, ...ALL_TABLES.slice(0, 3), ...ALL_PICTOGRAPH.slice(0, 4)]
  },
  {
    id: 'mixed-mountain',
    name: 'Mixed Mountain',
    desc: 'All topics — tally, tables, pictographs',
    color: '#ef4444',
    icon: '🏔️',
    questionsList: [...ALL_TALLY.slice(0, 2), ...ALL_COLLECTING.slice(0, 2), ...ALL_TABLES.slice(0, 2), ...ALL_PICTOGRAPH.slice(0, 2), ...ALL_COMPARING.slice(0, 2)]
  },
  {
    id: 'data-dome',
    name: 'Data Dome',
    desc: 'Hard mixed challenge — all skills required',
    color: '#06b6d4',
    icon: '🔮',
    questionsList: [...ALL_TABLES.slice(4, 8), ...ALL_PICTOGRAPH.slice(4, 8), ...ALL_COMPARING]
  },
  {
    id: 'speed-stadium',
    name: 'Speed Stadium',
    desc: 'Quick-fire tally and counting — race against time',
    color: '#84cc16',
    icon: '⚡',
    questionsList: [...ALL_TALLY.slice(8, 18)]
  },
  {
    id: 'detective-peak',
    name: 'Detective Peak',
    desc: 'Ultimate test — all 6 topics, hardest questions',
    color: '#8b5cf6',
    icon: '🕵️',
    questionsList: [...ALL_COMPARING, ...ALL_TABLES.slice(8, 11), ...ALL_PICTOGRAPH.slice(8, 12)]
  }
]

export { EMOJIS }

/** Build 10 questions for a given world */
export function buildWorldQuestions(world) {
  const w = WORLDS.find(x => x.id === world.id) || WORLDS[0]
  // Shuffle list and slice 10. If not enough questions, repeat.
  let pool = shuffle([...w.questionsList])
  while (pool.length < 10) {
    pool = pool.concat(shuffle([...w.questionsList]))
  }
  return pool.slice(0, 10).map((q, idx) => ({
    ...q,
    id: `${w.id}-q${idx}-${Math.random().toString(36).slice(2)}`
  }))
}

/** Build a flat 20-question session */
export function buildPracticeSession(n = 20) {
  const allList = [...ALL_TALLY, ...ALL_COLLECTING, ...ALL_TABLES, ...ALL_PICTOGRAPH, ...ALL_COMPARING, ...ALL_WHAT_IS_DATA]
  let pool = shuffle(allList)
  while (pool.length < n) {
    pool = pool.concat(shuffle(allList))
  }
  return pool.slice(0, n).map((q, idx) => ({
    ...q,
    id: `practice-q${idx}-${Math.random().toString(36).slice(2)}`
  }))
}
