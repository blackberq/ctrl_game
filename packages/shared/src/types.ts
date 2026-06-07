/**
 * Domain model for «Секретні слова» (Secret Words).
 * Pure data types shared by the web client, the mobile client and the server.
 */

export type PlayerId = string;
export type RoomId = string;

/** Role of a participant within a room. */
export type Role = "host" | "player" | "spectator";

/** Game modes from the rules (section 9). */
export type GameMode =
  | "classic"
  | "fast"
  | "hard"
  | "spectator"
  | "team"
  | "host_input";

/** Word difficulty tiers (section 8). */
export type Difficulty = "easy" | "medium" | "hard";

/** Lifecycle of a single round. */
export type RoundStatus = "running" | "paused" | "finished";

/** A secret word the active player must use; `used` is toggled by the host. */
export interface SecretWord {
  text: string;
  used: boolean;
}

export interface Player {
  id: PlayerId;
  name: string;
  role: Role;
  score: number;
  connected: boolean;
  /** Team label, only meaningful in `team` mode. */
  team?: string;
}

/** Tunable room settings. Defaults follow the MVP recommendations (section 13). */
export interface RoomSettings {
  mode: GameMode;
  difficulty: Difficulty;
  /** Number of secret words per round. */
  wordsPerRound: number;
  /** Round length in seconds. */
  roundDurationSec: number;
  /** Points awarded per word counted by the host. */
  pointsPerWord: number;
  /** Optional bonus point when all words are used (section 6). */
  bonusForAll: boolean;
  /** Whether inflected forms count (section 11). */
  allowInflections: boolean;
  /** Hard cap on participants in a room (section 13). */
  maxPlayers: number;
}

export interface Round {
  activePlayerId: PlayerId;
  /** The theme/question the active player tells a story about (visible to all). */
  topic: string;
  words: SecretWord[];
  durationSec: number;
  status: RoundStatus;
  /** Epoch ms when the current running segment started; `null` while paused/finished. */
  startedAt: number | null;
  /** Seconds elapsed in previous running segments (accumulates across pauses). */
  elapsedBeforeSec: number;
}

export interface Room {
  id: RoomId;
  hostId: PlayerId;
  players: Player[];
  settings: RoomSettings;
  round: Round | null;
  createdAt: number;
}

export const GAME_TITLE = "Секретні слова";

/** Per-mode overrides applied on top of {@link DEFAULT_SETTINGS}. */
export const MODE_PRESETS: Record<
  GameMode,
  Pick<RoomSettings, "wordsPerRound" | "roundDurationSec" | "difficulty">
> = {
  classic: { wordsPerRound: 3, roundDurationSec: 60, difficulty: "medium" },
  fast: { wordsPerRound: 3, roundDurationSec: 30, difficulty: "medium" },
  hard: { wordsPerRound: 5, roundDurationSec: 90, difficulty: "hard" },
  spectator: { wordsPerRound: 3, roundDurationSec: 60, difficulty: "medium" },
  team: { wordsPerRound: 3, roundDurationSec: 60, difficulty: "medium" },
  host_input: { wordsPerRound: 3, roundDurationSec: 60, difficulty: "medium" },
};

export const DEFAULT_SETTINGS: RoomSettings = {
  mode: "classic",
  difficulty: "medium",
  wordsPerRound: 3,
  roundDurationSec: 60,
  pointsPerWord: 1,
  bonusForAll: false,
  allowInflections: true,
  maxPlayers: 20,
};
