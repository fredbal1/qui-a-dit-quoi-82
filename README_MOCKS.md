
# Documentation des Données Mockées - KIADISA

## Vue d'ensemble

Ce document détaille toutes les structures de données mockées utilisées dans l'application KIADISA. Ces mocks simulent le comportement d'une base de données réelle et permettent de faire fonctionner l'application en mode démo avant l'intégration Supabase.

## Index des Entités

1. [Player](#player) - Joueur individuel
2. [GameState](#gamestate) - État global d'une partie
3. [GameSettings](#gamesettings) - Configuration d'une partie
4. [MiniGame](#minigame) - Définition d'un mini-jeu
5. [GamePhase](#gamephase) - Phase d'un mini-jeu
6. [Answer](#answer) - Réponse d'un joueur
7. [Vote](#vote) - Vote/accusation d'un joueur
8. [Question](#question) - Question posée aux joueurs
9. [ShopItem](#shopitem) - Objet à acheter en boutique
10. [UserStats](#userstats) - Statistiques utilisateur

---

## Entités Détaillées

### Player

**Description**: Représente un joueur connecté à une partie.

**Fichiers utilisant cette entité**:
- `src/pages/Lobby.tsx` (affichage liste joueurs)
- `src/pages/Game.tsx` (scoring en temps réel)
- `src/components/games/*.tsx` (tous les mini-jeux)

**Structure**:
```typescript
interface Player {
  id: string;           // Identifiant unique (UUID simulé)
  pseudo: string;       // Nom affiché du joueur
  avatar: string;       // Emoji représentant le joueur
  isHost: boolean;      // True si créateur de la partie
  score: number;        // Score actuel dans la partie
  xp: number;          // Points d'expérience totaux
  level: number;       // Niveau calculé depuis XP
  coins: number;       // Monnaie virtuelle pour la boutique
}
```

**Champs obligatoires pour l'UI**:
- `pseudo`: Affiché partout dans l'interface
- `avatar`: Utilisé pour l'identification visuelle
- `isHost`: Détermine qui peut lancer la partie
- `score`: Affiché en temps réel pendant les jeux

**Cycle de vie**:
1. **Création**: Lors de la connexion/création de compte
2. **Modification**: Score mis à jour à chaque fin de manche
3. **Suppression**: Jamais (données persistantes)

**Logique mockée**:
- Score incrémenté automatiquement (+1 à +3 points par manche)
- Avatar choisi aléatoirement parmi une liste d'emojis
- XP et niveau calculés depuis le score total

---

### GameState

**Description**: État global d'une partie multijoueur.

**Fichiers utilisant cette entité**:
- `src/pages/Game.tsx` (gestion principale)
- `src/pages/Lobby.tsx` (affichage état attente)
- Tous les composants de mini-jeux (phase actuelle)

**Structure**:
```typescript
interface GameState {
  id: string;           // ID unique de la partie
  code: string;         // Code à 6 caractères pour rejoindre
  status: 'waiting' | 'playing' | 'finished';  // État de la partie
  currentRound: number; // Manche actuelle (1-based)
  totalRounds: number;  // Nombre total de manches
  currentGame: string;  // ID du mini-jeu actuel
  phase: 'intro' | 'answer' | 'vote' | 'reveal' | 'results'; // Phase actuelle
  host: string;         // ID du joueur hôte
  players: Player[];    // Liste des joueurs connectés
  settings: GameSettings; // Configuration de la partie
  createdAt: Date;      // Date de création
}
```

**Champs obligatoires pour l'UI**:
- `status`: Détermine quelle page afficher
- `phase`: Contrôle l'affichage des composants de jeu
- `currentRound`/`totalRounds`: Progress bar
- `code`: Partage et rejoindre une partie

**Cycle de vie**:
1. **Création**: Lors de "Créer une partie"
2. **Modification**: Progression automatique des phases/manches
3. **Suppression**: Après fin de partie (timeout 24h)

**États réaltime simulés**:
- Changement de phase toutes les 3-5 secondes
- Ajout/suppression de joueurs en temps réel
- Synchronisation des scores entre tous les clients

---

### GameSettings

**Description**: Configuration d'une partie définie à la création.

**Fichiers utilisant cette entité**:
- `src/pages/CreateGame.tsx` (formulaire de création)
- `src/pages/Game.tsx` (rotation des mini-jeux)

**Structure**:
```typescript
interface GameSettings {
  mode: 'classique' | 'bluff' | 'duel' | 'couple';     // Mode de jeu
  ambiance: 'safe' | 'intime' | 'nofilter';           // Niveau de contenu
  miniGames: string[];                                 // Liste des mini-jeux activés
  rounds: number;                                      // Nombre de manches (1-10)
  maxPlayers: number;                                  // Limite de joueurs (2-8)
}
```

**Logique mockée**:
- Rotation automatique des mini-jeux selon l'ordre dans `miniGames[]`
- Filtrage des questions selon `ambiance`
- Adaptation du scoring selon le `mode`

---

### MiniGame

**Description**: Définition d'un type de mini-jeu.

**Fichiers utilisant cette entité**:
- `src/components/games/KiKaDiGame.tsx`
- `src/components/games/KiDiVraiGame.tsx`
- `src/components/games/KiDejaGame.tsx`
- `src/components/games/KiDeNousGame.tsx`

**Structure**:
```typescript
interface MiniGame {
  id: string;                    // Identifiant ('kikadi', 'kidivrai', etc.)
  name: string;                  // Nom affiché
  description: string;           // Description courte
  emoji: string;                 // Emoji représentatif
  type: 'kikadi' | 'kidivrai' | 'kideja' | 'kidenous'; // Type pour le switch
  phases: GamePhase[];           // Séquence des phases
}
```

**Mini-jeux implémentés**:
1. **KiKaDi** 🧠: Deviner qui a écrit quoi
2. **KiDiVrai** 😏: Détecter les bluffs
3. **KiDéjà** 🤭: "Qui a déjà fait ça ?"
4. **KiDeNous** 😱: Voter pour "qui est le plus..."

---

### GamePhase

**Description**: Phase individuelle d'un mini-jeu.

**Structure**:
```typescript
interface GamePhase {
  type: 'intro' | 'answer' | 'vote' | 'reveal' | 'results'; // Type de phase
  duration?: number;                                         // Durée en secondes
  data?: any;                                               // Données spécifiques
}
```

**Séquence standard** (tous les mini-jeux):
1. **Intro** (5s): Animation + règles
2. **Answer** (60s): Saisie des réponses
3. **Vote** (45s): Votes/accusations
4. **Reveal** (3s): Révélation animée
5. **Results** (5s): Scores + transition

---

### Answer

**Description**: Réponse d'un joueur à une question.

**Structure**:
```typescript
interface Answer {
  playerId: string;     // ID du joueur
  roundId: string;      // ID de la manche
  content: string;      // Contenu de la réponse
  isBluff?: boolean;    // True si le joueur bluffe (KiDiVrai)
  timestamp: Date;      // Horodatage
}
```

**Logique mockée**:
- Génération automatique de réponses pour les autres joueurs
- Randomisation du flag `isBluff` dans KiDiVrai
- Validation des réponses (longueur min/max)

---

### Vote

**Description**: Vote ou accusation d'un joueur.

**Structure**:
```typescript
interface Vote {
  playerId: string;         // ID du votant
  targetPlayerId: string;   // ID du joueur visé
  voteType: 'truth' | 'bluff' | 'guess' | 'accusation'; // Type de vote
  roundId: string;          // ID de la manche
  timestamp: Date;          // Horodatage
}
```

**Types de votes par mini-jeu**:
- **KiKaDi**: `guess` (associer réponse à joueur)
- **KiDiVrai**: `truth`/`bluff` (détecter mensonge)
- **KiDéjà**: `guess` (deviner qui a fait quoi)
- **KiDeNous**: `accusation` (élire quelqu'un)

---

### Question

**Description**: Question posée aux joueurs.

**Structure**:
```typescript
interface Question {
  id: string;                               // ID unique
  text: string;                            // Texte de la question
  category: string;                        // Catégorie ('childhood', 'embarrassing', etc.)
  ambiance: 'safe' | 'intime' | 'nofilter'; // Niveau de contenu
  gameType: string;                        // Mini-jeu compatible
}
```

**Questions mockées par mini-jeu**:
- **KiKaDi**: Citations, pensées, opinions
- **KiDiVrai**: Anecdotes personnelles à raconter
- **KiDéjà**: Actions embarrassantes/drôles
- **KiDeNous**: Traits de personnalité à voter

---

### ShopItem

**Description**: Objet achetable en boutique.

**Fichiers utilisant cette entité**:
- `src/pages/Shop.tsx` (affichage boutique)

**Structure**:
```typescript
interface ShopItem {
  id: string;                                    // ID unique
  name: string;                                  // Nom de l'objet
  type: 'avatar' | 'title' | 'effect';          // Type d'objet
  price: number;                                 // Prix en pièces
  emoji: string;                                 // Emoji représentatif
  description: string;                           // Description
  rarity: 'common' | 'rare' | 'epic' | 'legendary'; // Rareté
  owned?: boolean;                               // True si possédé
}
```

**Logique mockée**:
- Prix basé sur la rareté (10-500 pièces)
- Avatars: nouveaux emojis à débloquer
- Titres: badges affichés sous le pseudo
- Effets: animations spéciales (particules, etc.)

---

### UserStats

**Description**: Statistiques cumulées d'un utilisateur.

**Fichiers utilisant cette entité**:
- `src/pages/Stats.tsx` (affichage statistiques)
- `src/pages/Dashboard.tsx` (XP bar, niveau)

**Structure**:
```typescript
interface UserStats {
  gamesPlayed: number;      // Parties jouées
  gamesWon: number;         // Parties gagnées
  bluffsDetected: number;   // Bluffs détectés
  bluffsSuccessful: number; // Bluffs réussis
  bestStreak: number;       // Meilleure série
  totalXP: number;          // XP total
  level: number;            // Niveau actuel
  coins: number;            // Pièces possédées
  titles: string[];         // Titres débloqués
  achievements: string[];   // Succès obtenus
}
```

**Calculs mockés**:
- Niveau = Math.floor(totalXP / 100)
- Ratio victoires = gamesWon / gamesPlayed
- Coins gagnées = score de la partie × 10

---

## Logiques Transversales

### Navigation et États

**Flow principal**:
```
Index → Auth → Dashboard → CreateGame/JoinGame → Lobby → Game → Results → Dashboard
```

**États critiques**:
- `localStorage.kiadisa_user`: Utilisateur connecté
- `gameState.status`: Détermine l'affichage (waiting/playing/finished)
- `gameState.phase`: Contrôle les composants de mini-jeux

### Scoring et Progression

**Règles de scoring mockées**:
- **KiKaDi**: +1 pt par bonne association
- **KiDiVrai**: +2 pts si bluff non détecté, +1 pt si détection correcte
- **KiDéjà**: +1 pt par bonne devinette
- **KiDeNous**: +1 pt pour l'élu + +1 pt pour les bons votants

**Conversion XP/Coins**:
- 1 point de jeu = 10 pièces
- 1 point de jeu = 25 XP
- Bonus de fin de partie selon classement

### Données Realtime Simulées

**Synchronisation mockée**:
- Ajout/suppression de joueurs avec `setTimeout()`
- Progression automatique des phases
- Updates de score diffusées à tous les clients
- Messages de chat en temps réel (si implémenté)

---

## Migration vers Supabase

### Tables à créer

1. **profiles** (extension de auth.users)
2. **games** 
3. **game_players** (relation many-to-many)
4. **rounds**
5. **answers**
6. **votes** 
7. **questions** (données de référence)
8. **shop_items** (données de référence)
9. **user_purchases**
10. **user_stats**

### RLS (Row Level Security)

**Règles essentielles**:
- Les joueurs ne voient que leurs propres données privées
- Les données de partie sont visibles par tous les participants
- Les votes restent anonymes jusqu'à la phase reveal
- L'hôte a des permissions étendues (lancer, kicker)

### Realtime

**Événements à écouter**:
- `game_players`: Joueurs qui rejoignent/quittent
- `games`: Changement de phase/statut
- `answers`: Soumission des réponses
- `votes`: Votes en temps réel

---

## Hooks et Fonctions Clés

### Hooks à créer/adapter

```typescript
// État de jeu global
const useGameState = (gameId: string) => {
  // Remplacer les mocks par queries Supabase
}

// Joueur connecté
const useCurrentPlayer = () => {
  // Utiliser auth.user + profile
}

// Liste des joueurs d'une partie
const useGamePlayers = (gameId: string) => {
  // Query + subscription realtime
}

// Soumission de réponse
const useSubmitAnswer = () => {
  // Insert dans table answers
}

// Soumission de vote
const useSubmitVote = () => {
  // Insert dans table votes
}
```

### Fonctions utilitaires

```typescript
// Génération de code partie
const generateGameCode = () => string;

// Calcul du score d'une manche
const calculateRoundScore = (answers: Answer[], votes: Vote[]) => object;

// Progression vers la phase suivante
const advanceGamePhase = (gameId: string) => Promise<void>;

// Rotation des mini-jeux
const getNextMiniGame = (settings: GameSettings, currentRound: number) => string;
```

---

## Notes Importantes

### Contraintes UI

- **Aucun scroll vertical** : Toutes les données doivent tenir sur une page mobile
- **Animations fluides** : Les transitions entre phases doivent être seamless
- **Feedback temps réel** : Chaque action doit avoir une confirmation visuelle

### Performance

- **Limite 8 joueurs** : Au-delà, l'UI mobile devient illisible
- **Cache des questions** : Précharger pour éviter les latences
- **Batch des updates** : Grouper les mises à jour de score

### Sécurité

- **Validation côté serveur** : Toutes les réponses et votes
- **Rate limiting** : Éviter le spam de votes
- **Anti-cheat** : Un seul vote par joueur par phase

