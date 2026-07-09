export type DayType = 'entrainement' | 'repos'

export interface DayPlanItem {
  id: string
  text: string
  done: boolean
}

export type TrainingType = 'musculation' | 'mma' | 'muaythai' | 'course' | 'autre'

export interface TrainingSession {
  id: string
  type: TrainingType
  durationMin?: number
  note?: string
}

export interface DayEntry {
  date: string // yyyy-MM-dd
  dayType: DayType
  checks: Record<string, boolean>
  dayPlan?: DayPlanItem[]
  trainings?: TrainingSession[]
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
  sundayBilan?: string // legacy — migrated into WeeklyReport.bilan
}

export interface WeeklyReport {
  restDayTaken?: boolean
  lighterWeek?: boolean
  bilan?: string
  milestones?: Record<string, boolean | string>
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
  weekMilestones: Record<string, WeekMilestoneAnswer> // legacy (program S1-S4)
  weeklyReports: Record<string, WeeklyReport> // keyed by ISO week e.g. 2026-W28
}

export interface WeekMilestoneAnswer {
  [itemId: string]: boolean | string
}
