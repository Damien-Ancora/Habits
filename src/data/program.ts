export interface BlocRef {
  id: string
  title: string
  points: string[]
}

export const BLOCS: BlocRef[] = [
  {
    id: 'b1',
    title: 'Bloc 1 — La routine matinale',
    points: [
      "Pas de téléphone pendant la 1ère heure — aucune exception",
      "Grand verre d'eau + citron + pincée de sel (hydratation cellulaire)",
      '5 grandes respirations profondes avant de se lever',
      "5-10 minutes d'étirements légers",
      "Douche chaude terminée par 30 secondes d'eau froide — choisir l'inconfort volontairement",
      "Shot santé : gingembre + curcuma + citron + sel + huile d'olive, à jeun",
      'Pas de café dans la 1ère heure — attendre 90 minutes après le réveil (cortisol naturellement au max)',
      'Pas de scroll Instagram au réveil — sabote la concentration pour 2h',
      "Organiser sa journée (10 min) : 3 tâches prioritaires max, la moins aimée en premier, plan écrit",
    ],
  },
  {
    id: 'b2',
    title: 'Bloc 2 — Le sport',
    points: [
      'Idéal le matin (cortisol élevé = performance optimale) ; sinon après le travail, jamais annulé par "fatigué"',
      'La règle du "y aller quand même" : pas envie ≠ excuse. Séance allégée si besoin, mais on y va',
      'Exceptions valables : grosses courbatures (repos actif), manque de sommeil sérieux (récup prioritaire), blessure (adapter, pas supprimer)',
      '10 000 pas/jour — marche 10 min minimum après chaque repas principal',
      'Volume : Mois 1 = 3 séances min, Mois 2 = 4, Mois 3 = 4-5 en autonomie',
    ],
  },
  {
    id: 'b3',
    title: 'Bloc 3 — La nutrition',
    points: [
      'Ne jamais faire les courses en ayant faim — liste préparée à l\'avance',
      "Ordre dans l'assiette : protéines + légumes d'abord, glucides ensuite",
      'Grand verre d\'eau avant chaque repas — la "faim" est souvent de la déshydratation',
      'Meal prep 1-2x/semaine — 30 min de préparation = 7 jours de bonnes décisions',
      'Repas à l\'extérieur : protéines + légumes en priorité. 1 repas libre/semaine, assumé, pas culpabilisé',
      'Analyser ses macros : une conscience, pas une obsession (Yazio / MyFitnessPal)',
    ],
  },
  {
    id: 'b4',
    title: 'Bloc 4 — La routine du soir',
    points: [
      'Pas d\'alcool — non négociable',
      'Pas de repas lourd après 20h',
      'Pas d\'écrans 30 min avant de dormir, pas de scroll',
      'Bilan rapide : sport fait ? nutrition correcte ? 3 tâches cochées ?',
      'Préparer le lendemain : tenues, repas, planning',
      'Lecture ou podcast 20-30 minutes',
      'Heure de coucher fixe — 8h de sommeil non négociables',
      "S'instruire 15-20 min/jour (podcast, lecture) — ça compose sur 90 jours",
    ],
  },
  {
    id: 'b5',
    title: "Bloc 5 — L'environnement et le cercle",
    points: [
      'Tu es la moyenne des 5 personnes avec qui tu passes le plus de temps',
      'Personnes qui tirent vers le haut → augmenter le temps avec elles',
      'Personnes qui ancrent dans le négatif → réduire progressivement',
      'Construire un cercle privé : gens qui ont des projets, qui bougent. Prioriser la famille proche',
      'Choisir ses environnements, c\'est choisir qui on devient',
    ],
  },
  {
    id: 'b6',
    title: 'Bloc 6 — La dopamine',
    points: [
      'Le cerveau cherche le plaisir rapide et facile (scroll = pics de dopamine qui réduisent la capacité à apprécier l\'effort long)',
      'Remplacer progressivement les sources de dopamine rapide par des sources méritées : sport, progression, construction',
      'Pas d\'interdiction brutale — substitution progressive et consciente',
    ],
  },
]

export interface WeekPlan {
  index: 1 | 2 | 3 | 4
  title: string
  subtitle: string
  points: string[]
  milestones: { id: string; label: string; type: 'check' | 'text' }[]
}

export const WEEK_PLANS: WeekPlan[] = [
  {
    index: 1,
    title: 'Semaine 1 — Thaïlande',
    subtitle: 'Audit & rupture',
    points: [
      'Appel de lancement : point de départ fixé, freins identifiés',
      "Tu supprimes UNE habitude qui te freine — une seule, identifiée ensemble",
      "Réveil à heure fixe dès demain. Sommeil 8h. Volume allégé (1 matinée MT + 1 jour off)",
      'Nutrition cadrée. Check-in WhatsApp à J3',
    ],
    milestones: [
      { id: 'w1_call', label: 'Appel de lancement fait', type: 'check' },
      { id: 'w1_habit', label: "Habitude supprimée identifiée", type: 'text' },
      { id: 'w1_checkin', label: 'Check-in WhatsApp J3 envoyé', type: 'check' },
    ],
  },
  {
    index: 2,
    title: 'Semaine 2 — Thaïlande',
    subtitle: 'Stabilisation',
    points: [
      'Régularité nutrition, photo de 3 repas dans la semaine',
      'Tu tiens le volume sans te cramer — la récup prime',
      'Bilan écrit le dimanche : 5 lignes (ce qui a marché, ce qui a merdé, pourquoi)',
    ],
    milestones: [
      { id: 'w2_photos', label: '3 photos de repas envoyées', type: 'check' },
      { id: 'w2_bilan', label: 'Bilan dimanche écrit (5 lignes)', type: 'check' },
    ],
  },
  {
    index: 3,
    title: 'Semaine 3 — Italie',
    subtitle: 'Le vrai test',
    points: [
      'Changement de contexte + vacances famille — la plupart lâchent ici',
      'Objectif : maintenir. 1 activité/jour, repas famille gérés sans culpabilité',
      'Tu identifies ton déclencheur de relâche n°1',
    ],
    milestones: [
      { id: 'w3_trigger', label: 'Déclencheur de relâche n°1 identifié', type: 'text' },
    ],
  },
  {
    index: 4,
    title: 'Semaine 4 — Retour',
    subtitle: 'Bilan & transition',
    points: [
      'Photo avant/après : même cadrage que J1 (fond blanc)',
      'Bilan complet : poids, énergie, sommeil, mental, confiance',
      'Le Mois 2 se définit ensemble — le vrai début de la prépa structurée',
    ],
    milestones: [
      { id: 'w4_photo', label: 'Photo avant/après prise', type: 'check' },
      { id: 'w4_bilan', label: 'Bilan complet du mois rempli', type: 'check' },
    ],
  },
]

export const MONTH_OBJECTIVES = {
  title: 'Mois 1 — Rupture & fondations',
  intro:
    "Juillet est chargé (camp Thaïlande puis vacances famille Italie). On ne chasse pas le poids : on installe des fondations solides et on reprend confiance. La vraie perte régulière démarre au retour.",
  bullets: [
    'Poids : 86 → ~83 kg — surtout de l\'eau, un peu de gras. On ne force pas.',
    'Reprendre la main sur le sommeil et la récupération : avec le volume, c\'est ce qui décide de tout.',
    'Sécuriser la nutrition dans deux contextes très différents : le camp, puis la famille.',
  ],
  priorities: [
    { title: 'Sommeil & récupération', detail: "Levier n°1. Dormir 8h et alléger un peu, ce n'est pas de la faiblesse : c'est ce qui décide si tu progresses ou si tu te crames." },
    { title: 'Discipline mentale & dopamine', detail: "Le défi n'est pas physique, c'est la régularité et la confiance — reconstruites par des petites victoires répétées." },
    { title: 'Nutrition adaptée au contexte', detail: "Camp, vacances, cuisine du père : on ajuste au lieu de se restreindre à mort." },
  ],
}
