export interface HabitItem {
  id: string
  label: string
}

export interface HabitCategory {
  id: string
  title: string
  subtitle: string
  color: string // tailwind color token base, e.g. 'emerald'
  items: HabitItem[]
}

export const HABIT_CATEGORIES: HabitCategory[] = [
  {
    id: 'nonNeg',
    title: 'Non-négociables',
    subtitle: 'Tout le mois, sans exception',
    color: 'rose',
    items: [
      { id: 'nn_sleep', label: 'Sommeil : viser 8h cette nuit' },
      { id: 'nn_protein', label: 'Protéines ~195g réparties à chaque repas' },
      { id: 'nn_phone', label: "Pas de téléphone la 1ère heure, pas de scroll au lit" },
      { id: 'nn_move', label: 'Bouger un minimum (même en vacances)' },
    ],
  },
  {
    id: 'matin',
    title: 'Routine matinale',
    subtitle: 'Bloc 1',
    color: 'amber',
    items: [
      { id: 'm_phone', label: 'Pas de téléphone pendant la 1ère heure — aucune exception' },
      { id: 'm_water', label: "Grand verre d'eau + citron + pincée de sel au réveil" },
      { id: 'm_breath', label: '5 grandes respirations profondes avant de se lever' },
      { id: 'm_stretch', label: "5-10 min d'étirements légers" },
      { id: 'm_shower', label: "Douche chaude terminée par 30 sec d'eau froide" },
      { id: 'm_shot', label: "Shot santé (gingembre, curcuma, citron, sel, huile d'olive) à jeun" },
      { id: 'm_coffee', label: 'Pas de café dans la 1ère heure (attendre 90 min)' },
      { id: 'm_instagram', label: 'Pas de scroll Instagram au réveil' },
      { id: 'm_plan', label: 'Organiser sa journée (10 min) : 3 tâches max, la moins aimée en premier, plan écrit' },
    ],
  },
  {
    id: 'sport',
    title: 'Entraînement',
    subtitle: 'Adapté à ton volume actuel',
    color: 'sky',
    items: [
      { id: 't_renfo', label: "Renfo sur les gros mouvements, charges progressives, jamais à l'échec" },
      { id: 't_steps', label: '10 000 pas — marche 10 min après chaque repas principal' },
      { id: 't_goAnyway', label: 'Règle du « y aller quand même » respectée' },
      { id: 't_recup', label: 'Récupération respectée (1 séance en moins / jour off si prévu)' },
    ],
  },
  {
    id: 'nutrition',
    title: 'Nutrition — comportements',
    subtitle: 'Le détail des macros est dans l\'onglet Nutrition',
    color: 'emerald',
    items: [
      { id: 'n_noHungryShopping', label: 'Pas de courses en ayant faim (liste préparée)' },
      { id: 'n_order', label: "Ordre dans l'assiette : protéines + légumes d'abord, glucides ensuite" },
      { id: 'n_waterMeal', label: "Grand verre d'eau avant chaque repas" },
      { id: 'n_mealprep', label: 'Meal prep respecté (1-2x/semaine)' },
      { id: 'n_freeMeal', label: 'Repas libre assumé, sans culpabilité (si applicable aujourd\'hui)' },
    ],
  },
  {
    id: 'soir',
    title: 'Routine du soir',
    subtitle: 'Bloc 4',
    color: 'indigo',
    items: [
      { id: 'e_noAlcohol', label: "Pas d'alcool" },
      { id: 'e_noHeavyMeal', label: 'Pas de repas lourd après 20h' },
      { id: 'e_noScreens', label: "Pas d'écrans 30 min avant de dormir, pas de scroll" },
      { id: 'e_review', label: 'Bilan rapide : sport fait ? nutrition correcte ? 3 tâches cochées ?' },
      { id: 'e_prep', label: 'Préparer le lendemain (tenue, repas, planning)' },
      { id: 'e_reading', label: 'Lecture/podcast 20-30 min' },
      { id: 'e_fixedBedtime', label: 'Heure de coucher fixe' },
      { id: 'e_learn', label: "S'instruire 15-20 min (podcast, lecture)" },
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
