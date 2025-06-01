
// Types pour les jeux KIADISA

export interface Player {
  id: string;
  pseudo: string;
  avatar: string;
  isHost: boolean;
  score: number;
  xp: number;
  level: number;
  coins: number;
}

export interface GameSettings {
  mode: 'classique' | 'bluff' | 'duel' | 'couple';
  ambiance: 'safe' | 'intime' | 'nofilter';
  miniGames: string[];
  rounds: number;
  maxPlayers: number;
}

export interface GameState {
  id: string;
  code: string;
  status: 'waiting' | 'playing' | 'finished';
  currentRound: number;
  totalRounds: number;
  currentGame: string;
  phase: 'intro' | 'answer' | 'vote' | 'reveal' | 'results';
  host: string;
  players: Player[];
  settings: GameSettings;
  createdAt: Date;
}

export interface MiniGame {
  id: string;
  name: string;
  description: string;
  emoji: string;
  type: 'kikadi' | 'kidivrai' | 'kideja' | 'kidenous';
  phases: GamePhase[];
}

export interface GamePhase {
  type: 'intro' | 'answer' | 'vote' | 'reveal' | 'results';
  duration?: number;
  data?: any;
}

export interface Answer {
  playerId: string;
  roundId: string;
  content: string;
  isBluff?: boolean;
  timestamp: Date;
}

export interface Vote {
  playerId: string;
  targetPlayerId: string;
  voteType: 'truth' | 'bluff' | 'guess' | 'accusation';
  roundId: string;
  timestamp: Date;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  ambiance: 'safe' | 'intime' | 'nofilter';
  gameType: string;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'avatar' | 'title' | 'effect';
  price: number;
  emoji: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned?: boolean;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  bluffsDetected: number;
  bluffsSuccessful: number;
  bestStreak: number;
  totalXP: number;
  level: number;
  coins: number;
  titles: string[];
  achievements: string[];
}
