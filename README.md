
# 🎮 KIADISA - Qui a dit ça ?

[![Build Status](https://github.com/YOUR_USERNAME/kiadisa/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/YOUR_USERNAME/kiadisa/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code Quality](https://img.shields.io/badge/code%20quality-A-brightgreen.svg)](https://github.com/YOUR_USERNAME/kiadisa)
[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4.svg)](https://lovable.dev)

> Un jeu social multijoueur immersif, fun et stratégique où les révélations se mélangent au bluff ! 😲

## 🚀 Aperçu

KIADISA est une application mobile PWA qui propose 4 mini-jeux originaux pour découvrir les secrets de vos amis tout en s'amusant. Créé avec amour sur [Lovable.dev](https://lovable.dev), ce projet combine design moderne et gameplay addictif.

### ✨ Fonctionnalités

- 🎲 **4 Mini-jeux** : KiKaDi, KiDiVrai, KiDéjà, KiDeNous
- 👥 **Multijoueur** : 2 à 8 joueurs en temps réel
- 🎨 **Design moderne** : Glassmorphism + animations fluides
- 📱 **Mobile-first** : PWA optimisée pour mobile
- 🔒 **Sécurisé** : Authentification Supabase + RLS
- ⚡ **Temps réel** : Synchronisation instantanée entre joueurs

## 🛠️ Stack Technique

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS + shadcn/ui
- **Animations** : Framer Motion + GSAP
- **Backend** : Supabase (Auth + Realtime + Database)
- **Testing** : Vitest + Testing Library
- **CI/CD** : GitHub Actions
- **Deployment** : Lovable.dev + PWA

## 📦 Installation

### Prérequis
- Node.js 18+
- npm ou bun

### Démarrage rapide

```bash
# Cloner le repository
git clone https://github.com/YOUR_USERNAME/kiadisa.git
cd kiadisa

# Installer les dépendances
npm install

# Configurer Husky (hooks Git)
npm run prepare

# Démarrer en développement
npm run dev
```

### Configuration Supabase

1. **Créer un projet Supabase** :
   - Aller sur [supabase.com](https://supabase.com)
   - Créer un nouveau projet
   - Noter l'URL et la clé anon

2. **Variables d'environnement** :
   ```bash
   # Pas besoin de .env avec Lovable - la configuration est automatique
   # Les clés Supabase sont configurées via l'intégration native
   ```

3. **Exécuter les migrations** :
   ```sql
   -- Les tables sont déjà créées via l'interface Lovable
   -- Vérifier dans Supabase Dashboard > Table Editor
   ```

### Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Vérifier le code (ESLint)
npm run format       # Formater le code (Prettier)
npm run format:check # Vérifier le formatage
npm run test         # Lancer les tests
npm run test:watch   # Tests en mode watch
npm run audit        # Audit de sécurité
npm run validate     # Lint + format + test + build
```

## 🎮 Comment jouer

1. **Créer une partie** : Choisissez le mode, l'ambiance et les mini-jeux
2. **Inviter des amis** : Partagez le code de partie (6 caractères)
3. **Jouer ensemble** : Chaque manche = 1 mini-jeu avec 5 phases
4. **Gagner des points** : Bluffez, devinez, accusez pour marquer
5. **Débloquer du contenu** : Utilisez vos pièces dans la boutique

## 📁 Structure du projet

```
src/
├── components/         # Composants UI réutilisables
│   ├── ui/            # shadcn/ui components
│   └── games/         # Composants de mini-jeux
├── pages/             # Pages de l'application
├── hooks/             # Hooks React personnalisés
├── lib/               # Utilitaires et helpers
├── types/             # Définitions TypeScript
└── __tests__/         # Tests unitaires
```

Voir [README_STRUCTURE.md](./README_STRUCTURE.md) pour plus de détails.

## 🧪 Tests

Le projet utilise **Vitest** pour les tests unitaires :

```bash
# Lancer tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Types de tests

- **Hooks** : `src/__tests__/hooks/` - Tests des hooks personnalisés
- **Composants** : `src/__tests__/components/` - Tests des composants UI
- **Intégration** : Tests des flux utilisateur complets

## 🔐 Sécurité

### Row Level Security (RLS)

Toutes les tables Supabase sont sécurisées avec RLS :

- **games** : Visible uniquement aux joueurs participants
- **game_players** : Chaque joueur voit ses propres données
- **answers/votes** : Anonymat respecté jusqu'à la phase "reveal"
- **profiles** : Données publiques limitées

### Bonnes pratiques

- Authentification obligatoire pour toutes les actions
- Validation côté serveur via Supabase
- Chiffrement des données sensibles
- Audit des actions critiques

## ⚡ Performance

- **Lazy loading** des composants
- **Memoization** des calculs coûteux
- **Debouncing** des inputs utilisateur
- **Optimistic updates** pour l'UX
- **Bundle splitting** automatique

## ♿ Accessibilité

Le projet respecte les standards **WCAG 2.1 AA** :

- Contrastes couleurs conformes
- Navigation clavier complète
- Attributs ARIA appropriés
- Support des lecteurs d'écran
- Responsive design inclusif

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Pushez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

### Standards de qualité

- Tests unitaires requis (`npm run test`)
- Code formaté avec Prettier (`npm run format`)
- Lint ESLint sans erreurs (`npm run lint`)
- Build sans erreurs (`npm run build`)

## 🔗 Liens utiles

- 🎨 **Lovable.dev** : [Editeur en ligne](https://lovable.dev)
- 📚 **Documentation** : [README_STRUCTURE.md](./README_STRUCTURE.md)
- 🐛 **Issues** : [GitHub Issues](https://github.com/YOUR_USERNAME/kiadisa/issues)
- 💬 **Discussions** : [GitHub Discussions](https://github.com/YOUR_USERNAME/kiadisa/discussions)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🌟 Remerciements

- [Lovable.dev](https://lovable.dev) pour l'excellent environnement de développement
- [shadcn/ui](https://ui.shadcn.com) pour les composants UI
- [Supabase](https://supabase.com) pour le backend
- La communauté open source pour les outils utilisés

---

**Fait avec ❤️ et [Lovable.dev](https://lovable.dev)**
