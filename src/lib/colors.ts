export interface ColorSet {
  bg: string
  bgSoft: string
  text: string
  ring: string
  border: string
  fill: string // hex used in charts
}

export const CATEGORY_COLORS: Record<string, ColorSet> = {
  rose: {
    bg: 'bg-rose-500',
    bgSoft: 'bg-rose-50 dark:bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-500',
    border: 'border-rose-200 dark:border-rose-500/30',
    fill: '#f43f5e',
  },
  amber: {
    bg: 'bg-amber-500',
    bgSoft: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500',
    border: 'border-amber-200 dark:border-amber-500/30',
    fill: '#f59e0b',
  },
  sky: {
    bg: 'bg-sky-500',
    bgSoft: 'bg-sky-50 dark:bg-sky-500/10',
    text: 'text-sky-600 dark:text-sky-400',
    ring: 'ring-sky-500',
    border: 'border-sky-200 dark:border-sky-500/30',
    fill: '#0ea5e9',
  },
  emerald: {
    bg: 'bg-emerald-500',
    bgSoft: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-500/30',
    fill: '#10b981',
  },
  indigo: {
    bg: 'bg-indigo-500',
    bgSoft: 'bg-indigo-50 dark:bg-indigo-500/10',
    text: 'text-indigo-600 dark:text-indigo-400',
    ring: 'ring-indigo-500',
    border: 'border-indigo-200 dark:border-indigo-500/30',
    fill: '#6366f1',
  },
}

export function colorFor(color: string): ColorSet {
  return CATEGORY_COLORS[color] ?? CATEGORY_COLORS.sky
}
