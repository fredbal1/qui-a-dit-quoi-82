
# 📁 Structure du Projet KIADISA

## Architecture Générale

```
src/
├── components/          # Composants UI réutilisables
│   ├── ui/             # Composants shadcn/ui
│   ├── games/          # Composants spécifiques aux mini-jeux
│   └── AnimatedBackground.tsx, GlassCard.tsx
├── pages/              # Pages principales de l'application
│   ├── Index.tsx       # Page d'accueil
│   ├── Auth.tsx        # Authentification
│   ├── Dashboard.tsx   # Tableau de bord
│   ├── CreateGame.tsx  # Création de partie
│   ├── JoinGame.tsx    # Rejoindre une partie
│   ├── Lobby.tsx       # Salon d'attente
│   └── Game.tsx        # Interface de jeu
├── hooks/              # Hooks React personnalisés
├── lib/                # Utilitaires et helpers
├── types/              # Définitions TypeScript
└── __tests__/          # Tests unitaires et d'intégration
```

## Domaines Fonctionnels

### 🎮 **Games** (`src/components/games/`)
- `KiKaDiGame.tsx` - Mini-jeu "Qui a dit ça ?"
- `KiDiVraiGame.tsx` - Mini-jeu bluff/vérité
- `KiDejaGame.tsx` - Mini-jeu "Qui a déjà..."
- `KiDeNousGame.tsx` - Mini-jeu votes/élections
- `GameResults.tsx` - Affichage des résultats

### 🎨 **UI Core** (`src/components/`)
- `AnimatedBackground.tsx` - Arrière-plans animés
- `GlassCard.tsx` - Cartes avec effet glassmorphism
- `ui/` - Composants shadcn/ui (buttons, inputs, toasts...)

### 📱 **Pages** (`src/pages/`)
- Navigation et flux utilisateur principal
- Chaque page correspond à une route spécifique
- Logique métier concentrée dans les pages

### 🔧 **Utilitaires** (`src/lib/`, `src/hooks/`)
- `utils.ts` - Helpers génériques (cn, etc.)
- `use-toast.ts` - Gestion des notifications
- `use-mobile.tsx` - Détection mobile

## Conventions de Nommage

- **Composants** : PascalCase (`GlassCard.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useGameState.ts`)
- **Types** : PascalCase avec suffix approprié (`GameState`, `PlayerInfo`)
- **Utilitaires** : camelCase (`formatGameCode.ts`)

## Standards Techniques

- **React 18** + **TypeScript**
- **Vite** pour le build
- **Tailwind CSS** + **shadcn/ui** pour le styling
- **React Router** pour la navigation
- **Framer Motion** pour les animations
- **Supabase** pour le backend (auth, realtime, database)

## Intégration Lovable

- Composants générés automatiquement dans `src/components/`
- Synchronisation bidirectionnelle avec GitHub
- PWA-ready avec CapacitorJS
- Mobile-first responsive design
