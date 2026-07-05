# DiSIMpline — Suivi d'habitudes

Application de suivi quotidien des habitudes, de la nutrition et de la progression, construite pour suivre le programme DiSIMpline (Mois 1 — Rupture & fondations).

## Fonctionnalités

- **Aujourd'hui** — checklist quotidienne (non-négociables, routine matinale, entraînement, nutrition, routine du soir), poids/sommeil/énergie/mental/confiance, bilan du dimanche, bannière de phase (Thaïlande / Italie / Retour).
- **Nutrition** — cibles macros par type de jour (entraînement vs repos), avec l'ajustement glucides 310g → 250-300g, saisie et suivi du jour.
- **Analytique** — heatmap d'assiduité, complétion par catégorie, courbe de poids, sommeil, énergie/mental/confiance, streaks.
- **Programme** — référence complète du Système DiSIMpline (Blocs 1-6), carte du mois, semaine par semaine avec jalons.
- **Partage** — connexion par lien magique (email) pour synchroniser tes données entre appareils, export/import JSON, génération d'un bilan texte partageable.

## Fonctionnement des données

L'app fonctionne **entièrement en local** (localStorage) sans rien configurer : tu peux l'utiliser tout de suite sur un seul appareil.

Pour **retrouver tes données sur plusieurs appareils**, l'app se connecte à un projet [Supabase](https://supabase.com) (gratuit) :

1. Le projet Supabase est déjà configuré par défaut dans l'app.
2. Exécute une fois le script `supabase/schema.sql` dans l'éditeur SQL de ton projet Supabase (Project → SQL Editor).
3. Dans l'onglet **Partage** de l'app, entre ton email et clique sur « Recevoir le lien magique ». Clique le lien reçu par email pour te connecter.
4. Fais la même chose sur chacun de tes appareils avec le même email : tes données se synchronisent automatiquement (la plus récente gagne à la connexion, puis synchro en continu).

Tes données restent lisibles/inscriptibles uniquement par toi : chaque ligne est protégée par une policy Row Level Security (`auth.uid() = user_id`).

## Développement local

```bash
npm install
npm run dev
```

## Déploiement (GitHub Pages)

Un workflow GitHub Actions (`.github/workflows/deploy.yml`) build et publie automatiquement le site sur GitHub Pages à chaque push sur `main`.

Pour l'activer une fois :
1. Va dans **Settings → Pages** du repo GitHub.
2. Source : **GitHub Actions**.
3. Merge cette branche sur `main` (ou déclenche le workflow manuellement depuis l'onglet Actions).

L'app sera alors accessible depuis n'importe quel appareil à l'URL `https://<ton-org>.github.io/habits/`.
