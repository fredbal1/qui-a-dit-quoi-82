
# KIADISA 🎮

![CI](https://github.com/fredbal1/qui-a-dit-quoi-51/actions/workflows/ci.yml/badge.svg)
![Code Quality](https://img.shields.io/badge/code%20quality-automated-brightgreen)
![Husky](https://img.shields.io/badge/husky-configured-blue)

Jeu multijoueur en ligne de type "Qui a dit quoi ? / Bluff / Déduction sociale", basé sur des mini-jeux à tours, avec avatars, votes, réponses, scores, et boutique d'objets virtuels.

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
```

## 🔧 Qualité du code

Ce projet utilise une configuration automatisée pour garantir la qualité :

- **Husky** : Hooks pre-commit automatiques
- **GitHub Actions** : CI/CD complète avec tests E2E
- **ESLint** : Linting automatique
- **Prettier** : Formatage du code
- **Vitest** : Tests unitaires
- **Playwright** : Tests end-to-end

### 🪝 Hooks configurés

- **pre-commit** : formatage, linting, tests unitaires
- **Simulation GitHub** : même validation sur chaque push

## 🎯 Objectif

Permettre à des groupes d'amis ou de joueurs anonymes de rejoindre une salle de jeu (via un code), participer à plusieurs mini-jeux en tour par tour (réponse + vote), accumuler des scores, débloquer des récompenses (titres, avatars...), et suivre leurs stats.

## 🧩 Mini-jeux disponibles

- **KiKaDi** → "Qui a dit ça ?"
- **KiDiVrai** → Bluff / Vérité
- **KiDéjà** → Expérience vécue
- **KiDeNous** → Vote de groupe

## 📊 Stack technique

- **Frontend**: React, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Supabase (Auth, Database, Realtime)
- **Tests**: Vitest, Testing Library, Playwright
- **CI/CD**: GitHub Actions, Husky
- **Monitoring**: Sentry/LogSnag intégré

## 🔧 Variables d'environnement

Créer un fichier `.env.local` :

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Structure du projet

```
src/
├── components/     # Composants UI réutilisables
├── hooks/         # Hooks personnalisés pour la logique métier
├── pages/         # Pages de l'application
├── types/         # Types TypeScript
└── integrations/  # Intégrations Supabase
```

## 🛠️ Scripts utiles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run test         # Tests unitaires
npm run test:e2e     # Tests end-to-end (via Playwright)
npm run lint         # Linting ESLint
npm run format       # Formatage Prettier
npm run format:check # Vérification formatage
npm run dev:reset    # Reset de l'environnement de dev
npm run prepare      # Configuration Husky
```

## 📚 Documentation

- [Architecture](./ARCHITECTURE.md) - Détails techniques
- [Supabase Integration](https://docs.lovable.dev/integrations/supabase/)

## 🔐 Sécurité

- Authentification Supabase
- Row Level Security (RLS) sur toutes les tables
- Validation côté client et serveur

## 🧪 Tests

- Tests unitaires avec Vitest
- Tests E2E avec Playwright
- Coverage automatique
- CI/CD avec GitHub Actions

## 🪝 Workflow de développement

1. **Lovable.dev** : Développement et édition
2. **GitHub Actions** : Validation automatique
3. **Husky** : Hooks locaux (si applicable)
4. **Déploiement** : Automatique sur main

### 🔄 Pipeline CI/CD

- ✅ Formatage (Prettier)
- ✅ Linting (ESLint)  
- ✅ Tests unitaires (Vitest)
- ✅ Tests E2E (Playwright)
- ✅ Build de production
- ✅ Audit de sécurité

## 🚢 Déploiement

```bash
npm run build
# Déployer le dossier dist/
```

## 📄 Licence

MIT
