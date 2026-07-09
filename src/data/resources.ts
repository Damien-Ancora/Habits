// Contenu de référence, tiré des deux documents DiSIMpline (Le Système + Mois 1).
// Présenté en accordéons dans l'onglet Ressources — informatif, pas à cocher.

export interface ResourceSection {
  id: string
  group: string
  title: string
  icon: string
  points: string[]
  note?: string
}

export const RESOURCE_GROUPS = [
  'Le matin',
  'Nutrition',
  'Entraînement & récup',
  'Le soir',
  'Mental & environnement',
  'La carte du mois',
]

export const RESOURCE_SECTIONS: ResourceSection[] = [
  // ---------- LE MATIN ----------
  {
    id: 'reveil',
    group: 'Le matin',
    title: 'Que faire au réveil (5 premières minutes)',
    icon: '☀️',
    points: [
      'Pas de téléphone pendant la 1ère heure — aucune exception',
      "Grand verre d'eau + citron + pincée de sel (hydratation cellulaire)",
      '5 grandes respirations profondes avant de se lever',
      "5-10 minutes d'étirements légers",
      "Douche chaude terminée par 30 secondes d'eau froide — entraîner ton cerveau à choisir l'inconfort",
    ],
  },
  {
    id: 'shot',
    group: 'Le matin',
    title: 'Le shot santé',
    icon: '🫚',
    points: [
      "Gingembre + curcuma + citron + sel + huile d'olive",
      'À jeun, avant tout autre chose',
      'Anti-inflammatoire, activation digestive, boost métabolique',
    ],
  },
  {
    id: 'cafe',
    group: 'Le matin',
    title: 'Café & dopamine du matin',
    icon: '☕',
    points: [
      'Pas de café dans la 1ère heure — attendre 90 min après le réveil',
      'Le cortisol est au max au réveil (6h-9h) : ajouter de la caféine = pic artificiel puis crash',
      'Pas de scroll Instagram au réveil — pic de dopamine qui sabote la concentration pour 2h',
    ],
  },
  {
    id: 'organiser',
    group: 'Le matin',
    title: 'Organiser sa journée (10 min)',
    icon: '📝',
    points: [
      '3 tâches prioritaires maximum — pas 10',
      'Commencer par la tâche la moins aimée en premier',
      'Un plan écrit chaque jour — pas dans ta tête',
    ],
    note: "Tu peux écrire ces 3 tâches dans le bloc « Organisation de la journée » de l'onglet Aujourd'hui.",
  },

  // ---------- NUTRITION ----------
  {
    id: 'macros',
    group: 'Nutrition',
    title: 'Tes cibles (Mois 1)',
    icon: '🎯',
    points: [
      "Jour d'entraînement : ~2750 kcal · 195g protéines · 250-300g glucides (autour des séances) · 80g lipides",
      'Jour calme / repos : ~2300 kcal · 195g protéines · 160g glucides · 95g lipides',
      'Glucides jour training recalibrés de 310g → 250-300g',
    ],
    note: 'La saisie et le suivi se font dans l’onglet Nutrition.',
  },
  {
    id: 'avant-entrainement',
    group: 'Nutrition',
    title: "Repas autour de l'entraînement",
    icon: '🍚',
    points: [
      'Pré-séance : avoine + banane + baies + whey + miel',
      'Post-entraînement : poulet ou bœuf maigre + riz blanc + légumes',
      'Dîner : bœuf 5% ou poulet + patate douce + grosse portion de légumes',
      'Snacks : yaourt grec + fruits, poignée d’amandes',
      'Glucides collés à l’effort : autour des grosses sessions',
    ],
  },
  {
    id: 'principes-nutrition',
    group: 'Nutrition',
    title: 'Les principes',
    icon: '🥗',
    points: [
      'Ne jamais faire les courses en ayant faim — liste préparée à l’avance',
      "Ordre dans l'assiette : protéines + légumes d'abord, glucides ensuite",
      'Grand verre d’eau avant chaque repas — souvent la « faim » est de la déshydratation',
      'Meal prep 1-2x/semaine — 30 min de prépa = 7 jours de bonnes décisions',
      'Repas à l’extérieur : protéines + légumes en priorité. 1 repas libre/semaine, assumé',
      'Analyser ses macros : une conscience, pas une obsession (Yazio / MyFitnessPal)',
    ],
  },
  {
    id: 'cuisine-pere',
    group: 'Nutrition',
    title: 'La cuisine de ton père (au retour)',
    icon: '👨‍🍳',
    points: [
      'Pas besoin de te couper de ses plats — garde-les, mais ajuste',
      'Parle-lui de tes objectifs : augmente protéines et légumes, réduis sauces et glucides',
      'Ajoute ta propre source de protéine si besoin',
      'On simplifie, on ne crée pas une corvée de courses quotidienne',
    ],
  },

  // ---------- ENTRAÎNEMENT & RÉCUP ----------
  {
    id: 'volume',
    group: 'Entraînement & récup',
    title: 'Ton problème : le trop, pas le trop peu',
    icon: '🏋️',
    points: [
      'Tu fais déjà énormément (2x/jour en camp) — on n’ajoute rien, on optimise et on protège',
      'Garde tes 2 renfos sur les gros mouvements (squat, charnière, tirage, poussée), charges progressives, jamais à l’échec',
      '1 matinée de Muay Thai en moins/semaine + 1 vraie journée de repos complet',
      'Volume : Mois 1 = 3 séances min · Mois 2 = 4 · Mois 3 = 4-5 en autonomie',
    ],
  },
  {
    id: 'y-aller',
    group: 'Entraînement & récup',
    title: 'La règle du « y aller quand même »',
    icon: '🔥',
    points: [
      'Pas envie ≠ excuse. Séance allégée si besoin, mais tu y vas',
      'L’envie de bouger vient en bougeant — comme la faim vient en mangeant',
      'Marche en pente, étirements, un seul groupe musculaire, séries légères : ça compte',
    ],
  },
  {
    id: 'exceptions',
    group: 'Entraînement & récup',
    title: 'Les seules exceptions valables',
    icon: '🛑',
    points: [
      'Grosses courbatures → repos actif (marche légère, étirements)',
      'Manque de sommeil sérieux → récupération prioritaire',
      'Blessure → adapter, pas supprimer',
      'La récupération fait partie de l’entraînement. Ce n’est pas de la faiblesse',
    ],
  },
  {
    id: 'pas',
    group: 'Entraînement & récup',
    title: 'Les 10 000 pas',
    icon: '🚶',
    points: [
      'Marche après chaque repas principal — 10 min minimum',
      'Aide la digestion, stabilise la glycémie, ancre une habitude de mouvement',
    ],
  },
  {
    id: 'sommeil',
    group: 'Entraînement & récup',
    title: 'Sommeil & récupération (levier n°1)',
    icon: '😴',
    points: [
      'Viser 8h — non négociable. Le sommeil, c’est ta vraie séance de récupération',
      'Avec ton volume, c’est ce qui décide si tu progresses ou si tu te crames',
      'Tu n’arrives pas à faire de sieste : la nuit doit tout compenser',
    ],
  },

  // ---------- LE SOIR ----------
  {
    id: 'coucher',
    group: 'Le soir',
    title: 'Avant d’aller dormir',
    icon: '🌙',
    points: [
      'Pas d’alcool — non négociable',
      'Pas de repas lourd après 20h',
      'Pas d’écrans 30 min avant de dormir, pas de scroll',
      'Bilan rapide : sport fait ? nutrition correcte ? 3 tâches cochées ?',
      'Préparer le lendemain : tenues, repas, planning',
      'Lecture ou podcast 20-30 min',
      'Heure de coucher fixe',
    ],
  },
  {
    id: 'instruire',
    group: 'Le soir',
    title: 'S’instruire chaque jour',
    icon: '📚',
    points: [
      'Podcast, lecture, contenu utile — 15-20 min minimum',
      'Ça compose sur 90 jours',
    ],
  },

  // ---------- MENTAL & ENVIRONNEMENT ----------
  {
    id: 'mental',
    group: 'Mental & environnement',
    title: 'Reprendre confiance',
    icon: '🧠',
    points: [
      'Ton point faible n’est pas le physique — c’est la régularité et la confiance',
      'La confiance vient des petites victoires répétées, pas d’un déclic. Chaque jour tenu = une preuve',
      'Tu es déjà quelqu’un de discipliné qui s’ignore : tu t’entraînes 2x/jour dans un camp thaï',
      'Quand tu veux craquer : tu écris. Le but est que tu aies les outils pour tenir seul',
    ],
  },
  {
    id: 'environnement',
    group: 'Mental & environnement',
    title: 'L’environnement et le cercle',
    icon: '👥',
    points: [
      'Tu es la moyenne des 5 personnes avec qui tu passes le plus de temps',
      'Personnes qui te tirent vers le haut → augmenter le temps avec elles',
      'Personnes qui ancrent dans le négatif → réduire progressivement',
      'Construire un cercle privé : gens qui ont des projets, qui bougent. Prioriser la famille proche',
    ],
  },
  {
    id: 'dopamine',
    group: 'Mental & environnement',
    title: 'La dopamine',
    icon: '⚡',
    points: [
      'Le cerveau cherche le plaisir rapide (scroll = pics de dopamine qui réduisent l’appréciation de l’effort long)',
      'Remplacer progressivement la dopamine rapide par de la dopamine méritée : sport, progression, construction',
      'Pas d’interdiction brutale — substitution progressive et consciente',
    ],
  },

  // ---------- LA CARTE DU MOIS ----------
  {
    id: 'phase-thailande',
    group: 'La carte du mois',
    title: '1 → 17 juillet — Thaïlande (camp)',
    icon: '🇹🇭',
    points: [
      'Le problème ici : le TROP, pas le trop peu',
      '1 matinée de Muay Thai en moins/semaine + 1 jour de repos complet',
      'Sommeil 8h prioritaire',
      'Nutrition cadrée malgré le volume : protéines à chaque repas, glucides autour des sessions',
    ],
  },
  {
    id: 'phase-italie',
    group: 'La carte du mois',
    title: '17 → 29 juillet — Italie (famille)',
    icon: '🇮🇹',
    points: [
      'Le risque ici : tout lâcher',
      'Objectif : maintenir, pas performer',
      '1 activité physique par jour minimum, même légère',
      'Repas famille : protéines + légumes en priorité, zéro culpabilité',
    ],
  },
  {
    id: 'phase-retour',
    group: 'La carte du mois',
    title: 'Fin juillet — Retour',
    icon: '🏠',
    points: [
      'Transition vers une prépa structurée et durable',
      'Nutrition à la maison, autonomie',
      'On cale le Mois 2 ensemble, sur tes résultats réels',
    ],
  },
  {
    id: 'semaines',
    group: 'La carte du mois',
    title: 'Semaine par semaine',
    icon: '🗓️',
    points: [
      'S1 (Thaïlande) — Audit & rupture : appel de lancement, supprimer 1 habitude qui freine, réveil à heure fixe, check-in J3',
      'S2 (Thaïlande) — Stabilisation : photo de 3 repas, bilan écrit du dimanche (5 lignes)',
      'S3 (Italie) — Le vrai test : identifier ton déclencheur de relâche n°1, repas famille sans culpabilité',
      'S4 (retour) — Bilan & transition : photo avant/après (même cadrage que J1), bilan complet (poids, énergie, sommeil, mental, confiance)',
    ],
  },
]

export const DISCIPLINE_QUOTE =
  'La discipline ce n’est pas faire ce qu’on veut quand on veut. C’est faire ce qu’on a décidé même quand on n’en a pas envie.'
