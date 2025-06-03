
# KIADISA 🎮

![CI](https://github.com/fredbal1/qui-a-dit-quoi-51/actions/workflows/ci.yml/badge.svg)

Jeu multijoueur en ligne de type "Qui a dit quoi ? / Bluff / Déduction sociale", basé sur des mini-jeux à tours, avec avatars, votes, réponses, scores, et boutique d'objets virtuels.

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
```

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
npm run test:e2e     # Tests end-to-end
npm run lint         # Linting
npm run format       # Formatage du code
npm run dev:reset    # Reset de l'environnement de dev
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

## 🚢 Déploiement

```bash
npm run build
# Déployer le dossier dist/
```

## 📄 Licence

MIT
