import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AppState,
  DayEntry,
  DayType,
  Settings,
  TrainingSession,
  TrainingType,
  WeekMilestoneAnswer,
  WeeklyReport,
} from '../types'

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
    weeklyReports: {},
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
  addTraining: (date: string, type: TrainingType) => void
  updateTraining: (date: string, id: string, patch: Partial<TrainingSession>) => void
  removeTraining: (date: string, id: string) => void
  setWeekMilestone: (weekKey: string, itemId: string, value: boolean | string) => void
  updateWeeklyReport: (weekKey: string, patch: Partial<WeeklyReport>) => void
  setWeeklyMilestone: (weekKey: string, itemId: string, value: boolean | string) => void
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

      addTraining: (date, type) =>
        set((s) => {
          const entry = s.state.entries[date] ?? emptyEntry(date)
          const trainings = [...(entry.trainings ?? []), { id: newId(), type }]
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              entries: { ...s.state.entries, [date]: { ...entry, trainings } },
            },
          }
        }),

      updateTraining: (date, id, patch) =>
        set((s) => {
          const entry = s.state.entries[date] ?? emptyEntry(date)
          const trainings = (entry.trainings ?? []).map((t) => (t.id === id ? { ...t, ...patch } : t))
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              entries: { ...s.state.entries, [date]: { ...entry, trainings } },
            },
          }
        }),

      removeTraining: (date, id) =>
        set((s) => {
          const entry = s.state.entries[date] ?? emptyEntry(date)
          const trainings = (entry.trainings ?? []).filter((t) => t.id !== id)
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              entries: { ...s.state.entries, [date]: { ...entry, trainings } },
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

      updateWeeklyReport: (weekKey, patch) =>
        set((s) => {
          const current = s.state.weeklyReports[weekKey] ?? {}
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              weeklyReports: { ...s.state.weeklyReports, [weekKey]: { ...current, ...patch } },
            },
          }
        }),

      setWeeklyMilestone: (weekKey, itemId, value) =>
        set((s) => {
          const current = s.state.weeklyReports[weekKey] ?? {}
          const milestones = { ...(current.milestones ?? {}), [itemId]: value }
          return {
            state: {
              ...s.state,
              updatedAt: Date.now(),
              weeklyReports: { ...s.state.weeklyReports, [weekKey]: { ...current, milestones } },
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

      replaceState: (next) =>
        set({
          state: {
            ...defaultAppState(),
            ...next,
            weekMilestones: next.weekMilestones ?? {},
            weeklyReports: next.weeklyReports ?? {},
          },
        }),

      resetAll: () => set({ state: defaultAppState() }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({ state: s.state }),
      merge: (persisted, current) => {
        const p = persisted as { state?: Partial<AppState> } | undefined
        if (!p?.state) return current
        return {
          ...current,
          state: {
            ...defaultAppState(),
            ...p.state,
            weekMilestones: p.state.weekMilestones ?? {},
            weeklyReports: p.state.weeklyReports ?? {},
          },
        }
      },
    },
  ),
)
