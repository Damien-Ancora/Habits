import type { DayEntry } from '../types'
import { ALL_HABIT_IDS, HABIT_CATEGORIES, NUTRITION_TARGETS } from '../data/habits'

export function dailyCompletionPct(entry: DayEntry | undefined): number {
  if (!entry) return 0
  const done = ALL_HABIT_IDS.filter((id) => entry.checks[id]).length
  return (done / ALL_HABIT_IDS.length) * 100
}

export function categoryCompletionPct(entry: DayEntry | undefined, categoryId: string): number {
  const cat = HABIT_CATEGORIES.find((c) => c.id === categoryId)
  if (!cat || !entry) return 0
  const done = cat.items.filter((i) => entry.checks[i.id]).length
  return (done / cat.items.length) * 100
}

export function averageCategoryCompletion(
  entries: Record<string, DayEntry>,
  dateKeys: string[],
): { id: string; title: string; color: string; pct: number }[] {
  return HABIT_CATEGORIES.map((cat) => {
    const withData = dateKeys.filter((k) => entries[k])
    const pct =
      withData.length === 0
        ? 0
        : withData.reduce((sum, k) => sum + categoryCompletionPct(entries[k], cat.id), 0) / withData.length
    return { id: cat.id, title: cat.title, color: cat.color, pct }
  })
}

export function computeStreaks(
  dateKeysAscending: string[],
  entries: Record<string, DayEntry>,
  threshold = 70,
): { current: number; best: number } {
  let best = 0
  let running = 0
  let current = 0

  for (const key of dateKeysAscending) {
    const pct = dailyCompletionPct(entries[key])
    if (pct >= threshold) {
      running += 1
      best = Math.max(best, running)
    } else {
      running = 0
    }
  }

  // current streak = trailing run ending at the last date that has data
  for (let i = dateKeysAscending.length - 1; i >= 0; i--) {
    const key = dateKeysAscending[i]
    if (!entries[key]) continue
    const pct = dailyCompletionPct(entries[key])
    if (pct >= threshold) {
      current += 1
    } else {
      break
    }
  }

  return { current, best }
}

export function macroAdherencePct(entry: DayEntry | undefined): number | null {
  if (!entry || entry.calories == null) return null
  const target = NUTRITION_TARGETS[entry.dayType]
  return (entry.calories / target.calories) * 100
}

function avg(values: number[]): number | null {
  const v = values.filter((n) => Number.isFinite(n))
  if (v.length === 0) return null
  return v.reduce((a, b) => a + b, 0) / v.length
}

export function buildShareText(
  entries: Record<string, DayEntry>,
  dateKeysAscending: string[],
  label: string,
): string {
  const withData = dateKeysAscending.filter((k) => entries[k])
  const completion = avg(withData.map((k) => dailyCompletionPct(entries[k])))
  const weights = withData.map((k) => entries[k].weightKg).filter((w): w is number => w != null)
  const sleep = avg(withData.map((k) => entries[k].sleepHours).filter((v): v is number => v != null))
  const energy = avg(withData.map((k) => entries[k].energy).filter((v): v is number => v != null))
  const mental = avg(withData.map((k) => entries[k].mental).filter((v): v is number => v != null))
  const confidence = avg(withData.map((k) => entries[k].confidence).filter((v): v is number => v != null))
  const notes = withData
    .map((k) => entries[k].sundayBilan)
    .filter((n): n is string => !!n && n.trim().length > 0)

  const lines: string[] = []
  lines.push(`DiSIMpline — ${label}`)
  lines.push('')
  lines.push(`Jours suivis : ${withData.length}/${dateKeysAscending.length}`)
  if (completion != null) lines.push(`Complétion moyenne : ${Math.round(completion)}%`)
  if (weights.length > 0) {
    lines.push(`Poids : ${weights[0]} kg → ${weights[weights.length - 1]} kg`)
  }
  if (sleep != null) lines.push(`Sommeil moyen : ${sleep.toFixed(1)} h`)
  if (energy != null) lines.push(`Énergie moyenne : ${energy.toFixed(1)}/5`)
  if (mental != null) lines.push(`Mental moyen : ${mental.toFixed(1)}/5`)
  if (confidence != null) lines.push(`Confiance moyenne : ${confidence.toFixed(1)}/5`)
  if (notes.length > 0) {
    lines.push('')
    lines.push('Bilans :')
    notes.forEach((n) => lines.push(`- ${n}`))
  }
  lines.push('')
  lines.push('No excuses, just results.')
  return lines.join('\n')
}
