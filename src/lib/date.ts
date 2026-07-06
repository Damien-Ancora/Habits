import { addDays, addMonths, format, parseISO, startOfMonth, endOfMonth, isSameDay, getDay } from 'date-fns'
import type { Settings } from '../types'

export function toKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function fromKey(key: string): Date {
  return parseISO(key)
}

export function today(): Date {
  return new Date()
}

export function shiftDay(key: string, delta: number): string {
  return toKey(addDays(fromKey(key), delta))
}

export function isTodayKey(key: string): boolean {
  return isSameDay(fromKey(key), today())
}

export function formatHuman(key: string): string {
  return format(fromKey(key), 'EEEE d MMMM')
}

export type Phase = {
  id: 'thailande' | 'italie' | 'retour' | 'hors-periode'
  label: string
  range: string
  focus: string[]
}

export function getPhase(key: string, settings: Settings): Phase {
  const d = fromKey(key)
  const inMonth = d.getFullYear() === settings.programYear && d.getMonth() + 1 === settings.programMonth
  if (!inMonth) {
    return {
      id: 'hors-periode',
      label: 'Hors période définie',
      range: '',
      focus: ['Suis les non-négociables du socle DiSIMpline.'],
    }
  }
  const day = d.getDate()
  if (day <= settings.phase1EndDay) {
    return {
      id: 'thailande',
      label: 'Phase 1 — Camp (le TROP, pas le trop peu)',
      range: `1 → ${settings.phase1EndDay}`,
      focus: [
        'Protéger la récup : 1 matinée en moins/semaine + 1 jour de repos complet',
        'Sommeil 8h prioritaire — la nuit doit tout compenser',
        'Nutrition cadrée malgré le volume : protéines à chaque repas',
      ],
    }
  }
  if (day <= settings.phase2EndDay) {
    return {
      id: 'italie',
      label: 'Phase 2 — Famille (maintenir, pas performer)',
      range: `${settings.phase1EndDay} → ${settings.phase2EndDay}`,
      focus: [
        'Objectif : ne pas exploser, pas perdre',
        '1 activité physique par jour minimum, même légère',
        'Repas famille : protéines + légumes en priorité, zéro culpabilité',
      ],
    }
  }
  return {
    id: 'retour',
    label: 'Phase 3 — Retour (transition)',
    range: `${settings.phase2EndDay + 1} → fin du mois`,
    focus: [
      'Transition vers une prépa structurée et durable',
      'Nutrition à la maison, autonomie',
      'Bilan complet pour caler le Mois 2',
    ],
  }
}

export function weekIndexForKey(key: string, settings: Settings): number {
  const d = fromKey(key)
  const inMonth = d.getFullYear() === settings.programYear && d.getMonth() + 1 === settings.programMonth
  if (!inMonth) return 0
  const day = d.getDate()
  return Math.min(4, Math.ceil(day / 7))
}

export function monthRangeKeys(settings: Settings): string[] {
  const start = startOfMonth(new Date(settings.programYear, settings.programMonth - 1, 1))
  const end = endOfMonth(start)
  const keys: string[] = []
  let cur = start
  while (cur <= end) {
    keys.push(toKey(cur))
    cur = addDays(cur, 1)
  }
  return keys
}

export function isSunday(key: string): boolean {
  return fromKey(key).getDay() === 0
}

export function lastNDaysKeys(n: number, fromDateKey?: string): string[] {
  const end = fromDateKey ? fromKey(fromDateKey) : today()
  const keys: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    keys.push(toKey(addDays(end, -i)))
  }
  return keys
}

// Monday-first month grid. Returns weeks of 7 cells; null = padding day.
export function monthMatrix(year: number, month0: number): (string | null)[][] {
  const first = new Date(year, month0, 1)
  const start = startOfMonth(first)
  const end = endOfMonth(first)
  const leading = (getDay(start) + 6) % 7 // Mon=0 … Sun=6
  const cells: (string | null)[] = []
  for (let i = 0; i < leading; i++) cells.push(null)
  let cur = start
  while (cur <= end) {
    cells.push(toKey(cur))
    cur = addDays(cur, 1)
  }
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (string | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

export function monthLabel(year: number, month0: number): string {
  return format(new Date(year, month0, 1), 'MMMM yyyy')
}

export function shiftMonth(year: number, month0: number, delta: number): { year: number; month0: number } {
  const d = addMonths(new Date(year, month0, 1), delta)
  return { year: d.getFullYear(), month0: d.getMonth() }
}
