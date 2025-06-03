
# Architecture KIADISA

## 🏗️ Vue d'ensemble

KIADISA est une application React moderne utilisant Supabase comme backend, conçue pour des jeux multijoueurs en temps réel.

## 🎣 Hooks principaux

### `useAuth`
- Gère l'authentification Supabase
- Fournit : `user`, `session`, `signIn`, `signOut`, `signUp`

### `useGameStateFromSupabase`
- Synchronisation du gameState complet + realtime
- Écoute les changements en temps réel sur les tables de jeu

### `useGameData`
- Accès rapide et typé aux données courantes d'une partie
- Optimisé avec des indexes Supabase

### `useCurrentPlayer`
- Données du joueur courant dans une partie
- Lien entre auth.user et game_players

### `useGameActions`
- Actions de jeu : envoi de réponses, votes, avancement de phase
- Gestion des erreurs et validation

### `useJoinGame`
- Processus complet pour rejoindre une partie
- Validation du code de partie et des permissions

### `usePlayerStats`
- Stats sécurisées et optimisées par utilisateur
- XP, niveaux, coins, achievements

### `useRealtimeUpdates`
- Centralisation des subscriptions realtime
- Gestion optimisée des channels Supabase

### `useErrorMonitoring`
- Monitoring d'erreurs centralisé
- Intégration Sentry/LogSnag

## 🗄️ Tables Supabase et relations

### Tables principales

```sql
auth.users (Supabase géré)
├── profiles (1:1) - Données utilisateur étendues
└── user_stats (1:1) - Statistiques joueur

games
├── game_players (1:N) - Joueurs dans une partie
├── rounds (1:N) - Tours de jeu
└── game_history (1:1) - Historique fin de partie

rounds
├── answers (1:N) - Réponses des joueurs
└── votes (1:N) - Votes sur les réponses

shop_items
└── user_purchases (N:M via user_id)

achievements (référentiel)
```

### Relations importantes

- Un **game** contient plusieurs **rounds**
- Un **round** contient plusieurs **answers** et **votes**
- Un **user** peut avoir plusieurs **game_players** (historique)
- Les **votes** sont liés aux **answers** du même round

## 🔐 Sécurité RLS

Chaque table protégée par Row Level Security :

```sql
-- Exemple pour answers
CREATE POLICY "Players can insert own answers" 
  ON answers FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Players can view round answers" 
  ON answers FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM game_players gp 
    JOIN rounds r ON r.game_id = gp.game_id 
    WHERE gp.user_id = auth.uid() 
    AND r.id = round_id
  ));
```

## 🚪 Points d'entrée de l'app

### Routes principales

- `/` - Page d'accueil
- `/auth` - Connexion/Inscription
- `/dashboard` - Tableau de bord joueur
- `/create-game` - Création de partie
- `/join-game` - Rejoindre une partie
- `/lobby/:code` - Salle d'attente
- `/game/:code` - Partie en cours

### Navigation & Auth

```typescript
// Protection des routes
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
};

// Redirection automatique selon l'état
useEffect(() => {
  if (user && location.pathname === '/auth') {
    navigate('/dashboard');
  }
}, [user, location]);
```

## 🔄 Flux de jeu typique

1. **Connexion** (`/auth`)
2. **Dashboard** (`/dashboard`) - Stats, historique
3. **Création/Rejoindre** (`/create-game`, `/join-game`)
4. **Lobby** (`/lobby/:code`) - Attente des joueurs
5. **Jeu** (`/game/:code`) - Cycles intro → answer → vote → reveal → results
6. **Résultats** - Scores, XP, retour dashboard

## 📱 Composants principaux

### Structure modulaire

```
components/
├── ui/              # shadcn/ui components
├── games/           # Composants de jeu spécifiques
│   ├── KiKaDiGame.tsx
│   ├── KiDiVraiGame.tsx
│   └── GameResults.tsx
├── GlassCard.tsx    # Card avec effet glassmorphism
└── AccessibleButton.tsx # Bouton accessible
```

### Réutilisabilité

- `GlassCard` : Container principal avec effet verre
- `AccessibleButton` : Bouton avec support clavier/screen reader
- Composants de jeu modulaires et interchangeables

## ⚡ Performance

### Optimisations Supabase

- Indexes optimisés sur `code`, `user_id`, `game_id`
- Subscriptions realtime ciblées
- Queries optimisées avec `select` spécifiques

### React

- Hooks personnalisés pour éviter la duplication
- `useCallback` / `useMemo` sur les fonctions coûteuses
- Lazy loading des composants de jeu

## 🧪 Tests

### Structure des tests

```
src/__tests__/
├── components/      # Tests composants
├── hooks/          # Tests hooks personnalisés
├── e2e/            # Tests end-to-end Playwright
└── setup.ts        # Configuration tests
```

### Couverture

- Hooks critiques : `useGameActions`, `useCurrentPlayer`
- Composants UI : `GlassCard`, boutons
- Flow E2E : connexion → jeu → résultats

## 🔧 Configuration système

### Variables par défaut

```typescript
const systemConfig = {
  maxPlayersPerGame: 8,
  defaultGameSettings: {
    mode: "classique",
    ambiance: "safe",
    rounds: 5,
    maxPlayers: 6
  },
  xpPerPoint: 25,
  coinsPerPoint: 10,
  phaseTimers: {
    intro: 5,
    answer: 60,
    vote: 45,
    reveal: 3,
    results: 5
  }
};
```

## 🚀 Déploiement

### Build de production

```bash
npm run build
# Optimisations Vite automatiques
# Tree-shaking, minification, chunks
```

### Variables d'environnement

- `VITE_SUPABASE_URL` : URL du projet Supabase
- `VITE_SUPABASE_ANON_KEY` : Clé publique Supabase

## 📈 Monitoring

### Erreurs et événements

- `useErrorMonitoring` : Capture et log automatique
- Console logs détaillés pour le développement
- Intégration Sentry/LogSnag en production

### Métriques business

- Parties créées/terminées
- Temps de session moyen
- Taux de rétention
- Achats boutique
