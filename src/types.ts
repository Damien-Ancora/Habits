export type DayType = 'entrainement' | 'repos'

export interface DayEntry {
  date: string // yyyy-MM-dd
  dayType: DayType
  checks: Record<string, boolean>
  weightKg?: number
  sleepHours?: number
  energy?: number // 1-5
  mental?: number // 1-5
  confidence?: number // 1-5
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  note?: string
  sundayBilan?: string
}

export interface WeekMilestoneAnswer {
  [itemId: string]: boolean | string
}

export interface Settings {
  displayName: string
  programYear: number
  programMonth: number // 1-12
  phase1EndDay: number // e.g. 17
  phase2EndDay: number // e.g. 29
  startWeight?: number
  targetWeight?: number
}

export interface AppState {
  version: number
  updatedAt: number
  settings: Settings
  entries: Record<string, DayEntry>
  weekMilestones: Record<string, WeekMilestoneAnswer>
}
