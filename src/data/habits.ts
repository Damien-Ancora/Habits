import type { TrainingType } from '../types'

export interface HabitItem {
  id: string
  label: string
  infoRef?: string // id of a Ressources section that details this item
}

export interface HabitCategory {
  id: string
  title: string
  subtitle: string
  color: string // tailwind color token base, e.g. 'emerald'
  items: HabitItem[]
}

// Daily checklist kept deliberately short — the "how to" details live in the
// Ressources tab, not as checkboxes.
export const HABIT_CATEGORIES: HabitCategory[] = [
  {
    id: 'nonNeg',
    title: 'Non-négociables',
    subtitle: 'Chaque jour, sans exception',
    color: 'rose',
    items: [
      { id: 'nn_sleep', label: 'Sommeil : viser ~8h' },
      { id: 'nn_protein', label: 'Protéines ~195g, réparties à chaque repas' },
      { id: 'nn_phone', label: "Pas de téléphone la 1ère heure, pas de scroll au lit" },
      { id: 'nn_alcohol', label: "Pas d'alcool" },
      { id: 'nn_move', label: 'Bougé un minimum — marche après les repas' },
    ],
  },
  {
    id: 'routines',
    title: 'Routines',
    subtitle: 'Le détail est dans Ressources',
    color: 'amber',
    items: [
      { id: 'r_morning', label: 'Routine du matin faite', infoRef: 'reveil' },
      { id: 'r_evening', label: 'Routine du soir faite', infoRef: 'coucher' },
    ],
  },
]

export const ALL_HABIT_IDS: string[] = HABIT_CATEGORIES.flatMap((c) => c.items.map((i) => i.id))

export interface MacroTarget {
  calories: number
  protein: number
  carbs: number
  carbsRange: [number, number]
  fat: number
}

type DayTypeKey = 'entrainement' | 'repos'

export const NUTRITION_TARGETS: Record<DayTypeKey, MacroTarget> = {
  entrainement: {
    calories: 2750,
    protein: 195,
    carbs: 275,
    carbsRange: [250, 300],
    fat: 80,
  },
  repos: {
    calories: 2300,
    protein: 195,
    carbs: 160,
    carbsRange: [160, 160],
    fat: 95,
  },
}

export const TRAINING_TYPES: { id: TrainingType; label: string; icon: string; color: string }[] = [
  { id: 'musculation', label: 'Musculation', icon: '🏋️', color: 'sky' },
  { id: 'mma', label: 'MMA', icon: '🥋', color: 'rose' },
  { id: 'muaythai', label: 'Muay Thaï', icon: '🥊', color: 'amber' },
  { id: 'course', label: 'Course', icon: '🏃', color: 'emerald' },
  { id: 'autre', label: 'Autre', icon: '💪', color: 'indigo' },
]

export function trainingMeta(type: TrainingType) {
  return TRAINING_TYPES.find((t) => t.id === type) ?? TRAINING_TYPES[4]
}
