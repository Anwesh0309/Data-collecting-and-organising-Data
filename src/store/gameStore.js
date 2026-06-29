import { create } from 'zustand'

export const PHASES = ['home', 'wonder', 'story', 'simulate', 'play', 'reflect']

export const NEXT_PHASE = {
  home:     'wonder',
  wonder:   'story',
  story:    'simulate',
  simulate: 'play',
  play:     'reflect',
  reflect:  'wonder',
}

export const useGameStore = create((set, get) => ({
  // ── Navigation
  phase: 'home',

  // ── Gamification
  xp: 0,
  stars: {},
  badges: [],

  // ── Practice session
  currentQueue: [],
  currentQIndex: 0,
  sessionCorrect: 0,
  sessionAttempts: 0,

  // ── Play phase world scores (persisted so Reflect can show scoreboard)
  playScores: {},       // worldId → { score, accuracy, stars, correct, total }
  completedWorlds: [],  // [worldId, ...]

  // ── Simulation survey data (passed Station A → B → C → D → E)
  surveyData: {},

  // ── Audio
  audioEnabled: true,

  // ── Actions ──────────────────────────────────────────────────────────

  advancePhase: () => {
    const { phase } = get()
    set({ phase: NEXT_PHASE[phase] || 'home' })
  },

  setPhase: (phase) => set({ phase }),

  setSurveyData: (data) => set({ surveyData: data }),

  addXP: (amount) => set(s => ({ xp: s.xp + amount })),

  awardBadge: (id) => set(s => ({
    badges: s.badges.includes(id) ? s.badges : [...s.badges, id],
  })),

  awardStars: (stationId, starCount) => set(s => ({
    stars: { ...s.stars, [stationId]: starCount },
  })),

  saveWorldScore: (worldId, result) => set(s => ({
    playScores: { ...s.playScores, [worldId]: result },
    completedWorlds: s.completedWorlds.includes(worldId)
      ? s.completedWorlds
      : [...s.completedWorlds, worldId],
  })),

  setQueue: (queue) => set({
    currentQueue: queue,
    currentQIndex: 0,
    sessionCorrect: 0,
    sessionAttempts: 0,
  }),

  nextQuestion: () => set(s => ({ currentQIndex: s.currentQIndex + 1 })),

  recordAnswer: (correct) => set(s => ({
    sessionCorrect: correct ? s.sessionCorrect + 1 : s.sessionCorrect,
    sessionAttempts: s.sessionAttempts + 1,
  })),

  toggleAudio: () => set(s => ({ audioEnabled: !s.audioEnabled })),

  reset: () => set({
    phase: 'home',
    xp: 0,
    stars: {},
    badges: [],
    currentQueue: [],
    currentQIndex: 0,
    sessionCorrect: 0,
    sessionAttempts: 0,
    surveyData: {},
    audioEnabled: true,
    playScores: {},
    completedWorlds: [],
  }),
}))
