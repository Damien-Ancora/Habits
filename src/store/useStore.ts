import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, DayEntry, DayType, Settings, WeekMilestoneAnswer } from '../types'

const STORAGE_KEY = 'disimpline-app-state'
const STATE_VERSION = 1

function defaultSettings(): Settings {
  const now = new Date()
  return {
    displayName: 'Damien',
    programYear: now.getFullYear(),
    programMonth: now.getMonth() + 1,
    phase1EndDay: 17,
    phase2EndDay: 29,
    startWeight: 86,
    targetWeight: 83,
  }
}

export function defaultAppState(): AppState {
  return {
    version: STATE_VERSION,
    updatedAt: Date.now(),
    settings: defaultSettings(),
    entries: {},
    weekMilestones: {},
  }
}

function emptyEntry(date: string): DayEntry {
  return {
    date,
    dayType: 'entrainement',
    checks: {},
  }
}

interface Store {
  state: AppState
  getEntry: (date: string) => DayEntry
  toggleCheck: (date: string, habitId: string) => void
  setDayType: (date: string, dayType: DayType) => void
  updateEntry: (date: string, patch: Partial<DayEntry>) => void
  addDayPlanItem: (date: string, text: string) => void
  toggleDayPlanItem: (date: string, itemId: string) => void
  updateDayPlanItemText: (date: string, itemId: string, text: string) => void
  removeDayPlanItem: (date: string, itemId: string) => void
  setWeekMilestone: (weekKey: string, itemId: string, value: boolean | string) => void
  updateSettings: (patch: Partial<Settings>) => void
  replaceState: (next: AppState) => void
  resetAll: () => void
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      state: defaultAppState(),

      getEntry: (date) => {
        return get().state.entries[date] ?? emptyEntry(date)
      },

      toggleCheck: (date, habitId) =>
        set((s) => {
          const entry = s.state.entries[date] ?? emptyEntry(date)
          const checks = { ...entry.checks, [habitId]: !entry.checks[habitId] }
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              entries: { ...s.state.entries, [date]: { ...entry, checks } },
            },
          }
        }),

      setDayType: (date, dayType) =>
        set((s) => {
          const entry = s.state.entries[date] ?? emptyEntry(date)
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              entries: { ...s.state.entries, [date]: { ...entry, dayType } },
            },
          }
        }),

      updateEntry: (date, patch) =>
        set((s) => {
          const entry = s.state.entries[date] ?? emptyEntry(date)
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              entries: { ...s.state.entries, [date]: { ...entry, ...patch } },
            },
          }
        }),

      addDayPlanItem: (date, text) =>
        set((s) => {
          const trimmed = text.trim()
          if (!trimmed) return s
          const entry = s.state.entries[date] ?? emptyEntry(date)
          const dayPlan = [...(entry.dayPlan ?? []), { id: newId(), text: trimmed, done: false }]
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              entries: { ...s.state.entries, [date]: { ...entry, dayPlan } },
            },
          }
        }),

      toggleDayPlanItem: (date, itemId) =>
        set((s) => {
          const entry = s.state.entries[date] ?? emptyEntry(date)
          const dayPlan = (entry.dayPlan ?? []).map((it) =>
            it.id === itemId ? { ...it, done: !it.done } : it,
          )
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              entries: { ...s.state.entries, [date]: { ...entry, dayPlan } },
            },
          }
        }),

      updateDayPlanItemText: (date, itemId, text) =>
        set((s) => {
          const entry = s.state.entries[date] ?? emptyEntry(date)
          const dayPlan = (entry.dayPlan ?? []).map((it) =>
            it.id === itemId ? { ...it, text } : it,
          )
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              entries: { ...s.state.entries, [date]: { ...entry, dayPlan } },
            },
          }
        }),

      removeDayPlanItem: (date, itemId) =>
        set((s) => {
          const entry = s.state.entries[date] ?? emptyEntry(date)
          const dayPlan = (entry.dayPlan ?? []).filter((it) => it.id !== itemId)
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              entries: { ...s.state.entries, [date]: { ...entry, dayPlan } },
            },
          }
        }),

      setWeekMilestone: (weekKey, itemId, value) =>
        set((s) => {
          const current: WeekMilestoneAnswer = s.state.weekMilestones[weekKey] ?? {}
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              weekMilestones: {
                ...s.state.weekMilestones,
                [weekKey]: { ...current, [itemId]: value },
              },
            },
          }
        }),

      updateSettings: (patch) =>
        set((s) => ({
          state: {
            ...s.state,
            updatedAt: Date.now(),
            settings: { ...s.state.settings, ...patch },
          },
        })),

      replaceState: (next) => set({ state: next }),

      resetAll: () => set({ state: defaultAppState() }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({ state: s.state }),
    },
  ),
)
