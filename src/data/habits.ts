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
]

// The two routines stay a single check each ("faite ou pas"), but expose the
// exact steps so you know what "faite" means.
export interface RoutineDef {
  id: string
  label: string
  subtitle: string
  icon: string
  color: string
  infoRef: string // Ressources section
  steps: string[]
}

export const ROUTINES: RoutineDef[] = [
  {
    id: 'r_morning',
    label: 'Routine du matin',
    subtitle: 'Au réveil (Bloc 1)',
    icon: '☀️',
    color: 'amber',
    infoRef: 'reveil',
    steps: [
      'Pas de téléphone pendant la 1ère heure',
      "Grand verre d'eau + citron + pincée de sel",
      '5 grandes respirations avant de se lever',
      "5-10 min d'étirements légers",
      "Douche chaude finie par 30 sec d'eau froide",
      'Shot santé à jeun (gingembre, curcuma, citron, sel, huile d’olive)',
      'Pas de café dans la 1ère heure (attendre 90 min)',
      'Pas de scroll Instagram au réveil',
      'Organiser sa journée : 3 tâches prioritaires, la moins aimée en premier',
    ],
  },
  {
    id: 'r_evening',
    label: 'Routine du soir',
    subtitle: 'Avant de dormir (Bloc 4)',
    icon: '🌙',
    color: 'indigo',
    infoRef: 'coucher',
    steps: [
      'Pas de repas lourd après 20h',
      "Pas d'écrans 30 min avant de dormir, pas de scroll",
      'Bilan rapide : sport fait ? nutrition correcte ? 3 tâches cochées ?',
      'Préparer le lendemain (tenue, repas, planning)',
      'Lecture ou podcast 20-30 min',
      'Heure de coucher fixe',
      "S'instruire 15-20 min",
    ],
  },
]

export const ROUTINE_IDS = ROUTINES.map((r) => r.id)

export const ALL_HABIT_IDS: string[] = [
  ...HABIT_CATEGORIES.flatMap((c) => c.items.map((i) => i.id)),
  ...ROUTINE_IDS,
]

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
