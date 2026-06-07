/**
 * Pure, framework-agnostic game engine for «Секретні слова».
 *
 * Every mutator returns a NEW {@link Room} (immutable updates) and throws
 * {@link GameError} on invalid transitions. The server owns the authoritative
 * Room and applies these functions; clients may reuse them for optimistic UI.
 */

import {
  DEFAULT_SETTINGS,
  MODE_PRESETS,
  type GameMode,
  type Player,
  type PlayerId,
  type Role,
  type Room,
  type RoomId,
  type RoomSettings,
  type Round,
} from "./types";
import { generateWords, type Rng } from "./words";
import { generateTopic } from "./topics";
import type { ClientRoom, ClientRound, ClientSecretWord } from "./protocol";

/** Thrown on an illegal action (not host, room full, no active round, …). */
export class GameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameError";
  }
}

/* ------------------------------------------------------------------ */
/* Room lifecycle                                                      */
/* ------------------------------------------------------------------ */

export function settingsForMode(mode: GameMode): RoomSettings {
  return { ...DEFAULT_SETTINGS, mode, ...MODE_PRESETS[mode] };
}

export function createRoom(
  id: RoomId,
  hostId: PlayerId,
  hostName: string,
  now: number = Date.now(),
): Room {
  const host: Player = {
    id: hostId,
    name: hostName,
    role: "host",
    score: 0,
    connected: true,
  };
  return {
    id,
    hostId,
    players: [host],
    settings: { ...DEFAULT_SETTINGS },
    round: null,
    createdAt: now,
  };
}

export function findPlayer(room: Room, id: PlayerId): Player | undefined {
  return room.players.find((p) => p.id === id);
}

function replacePlayer(room: Room, id: PlayerId, patch: Partial<Player>): Room {
  return {
    ...room,
    players: room.players.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  };
}

export function addPlayer(
  room: Room,
  id: PlayerId,
  name: string,
  role: Role = "player",
): Room {
  if (findPlayer(room, id)) return room;
  if (room.players.length >= room.settings.maxPlayers) {
    throw new GameError("Room is full");
  }
  const player: Player = { id, name, role, score: 0, connected: true };
  return { ...room, players: [...room.players, player] };
}

export function removePlayer(room: Room, id: PlayerId): Room {
  return { ...room, players: room.players.filter((p) => p.id !== id) };
}

export function setConnected(room: Room, id: PlayerId, connected: boolean): Room {
  return replacePlayer(room, id, { connected });
}

export function updateSettings(room: Room, patch: Partial<RoomSettings>): Room {
  return { ...room, settings: { ...room.settings, ...patch } };
}

export function setMode(room: Room, mode: GameMode): Room {
  return { ...room, settings: { ...settingsForMode(mode), maxPlayers: room.settings.maxPlayers } };
}

/* ------------------------------------------------------------------ */
/* Round lifecycle                                                     */
/* ------------------------------------------------------------------ */

export interface StartRoundOptions {
  activePlayerId: PlayerId;
  /** Manual words (host_input mode); otherwise generated from difficulty. */
  words?: string[];
  /** Manual topic; otherwise a random one is generated. */
  topic?: string;
  rng?: Rng;
}

export function startRound(
  room: Room,
  options: StartRoundOptions,
  now: number = Date.now(),
): Room {
  if (room.round && room.round.status !== "finished") {
    throw new GameError("A round is already in progress");
  }
  if (!findPlayer(room, options.activePlayerId)) {
    throw new GameError("Active player is not in the room");
  }

  const words =
    options.words && options.words.length > 0
      ? options.words.map((text) => ({ text, used: false }))
      : generateWords(room.settings.difficulty, room.settings.wordsPerRound, options.rng);

  const round: Round = {
    activePlayerId: options.activePlayerId,
    topic: options.topic?.trim() || generateTopic(options.rng),
    words,
    durationSec: room.settings.roundDurationSec,
    status: "running",
    startedAt: now,
    elapsedBeforeSec: 0,
  };
  return { ...room, round };
}

function requireRound(room: Room): Round {
  if (!room.round) throw new GameError("No active round");
  return room.round;
}

export function pauseRound(room: Room, now: number = Date.now()): Room {
  const round = requireRound(room);
  if (round.status !== "running") throw new GameError("Round is not running");
  return {
    ...room,
    round: {
      ...round,
      status: "paused",
      startedAt: null,
      elapsedBeforeSec: elapsedSeconds(round, now),
    },
  };
}

export function resumeRound(room: Room, now: number = Date.now()): Room {
  const round = requireRound(room);
  if (round.status !== "paused") throw new GameError("Round is not paused");
  return { ...room, round: { ...round, status: "running", startedAt: now } };
}

export function markWord(room: Room, index: number, used: boolean): Room {
  const round = requireRound(room);
  if (round.status === "finished") throw new GameError("Round is finished");
  if (index < 0 || index >= round.words.length) {
    throw new GameError("Invalid word index");
  }
  const words = round.words.map((w, i) => (i === index ? { ...w, used } : w));
  return { ...room, round: { ...round, words } };
}

export function finishRound(room: Room, now: number = Date.now()): Room {
  const round = requireRound(room);
  if (round.status === "finished") return room;

  const score = computeRoundScore(round, room.settings);
  const active = findPlayer(room, round.activePlayerId);
  const scored = active
    ? replacePlayer(room, round.activePlayerId, { score: active.score + score })
    : room;

  return {
    ...scored,
    round: { ...round, status: "finished", startedAt: null, elapsedBeforeSec: elapsedSeconds(round, now) },
  };
}

/* ------------------------------------------------------------------ */
/* Timing & scoring                                                    */
/* ------------------------------------------------------------------ */

export function elapsedSeconds(round: Round, now: number = Date.now()): number {
  const running =
    round.status === "running" && round.startedAt !== null
      ? (now - round.startedAt) / 1000
      : 0;
  return round.elapsedBeforeSec + running;
}

export function remainingSeconds(round: Round, now: number = Date.now()): number {
  return Math.max(0, round.durationSec - elapsedSeconds(round, now));
}

export function isExpired(round: Round, now: number = Date.now()): boolean {
  return remainingSeconds(round, now) <= 0;
}

/** Score for the active player this round (rules section 6). */
export function computeRoundScore(round: Round, settings: RoomSettings): number {
  const used = round.words.filter((w) => w.used).length;
  let score = used * settings.pointsPerWord;
  if (settings.bonusForAll && used === round.words.length && round.words.length > 0) {
    score += 1;
  }
  return score;
}

/* ------------------------------------------------------------------ */
/* Per-viewer projection (visibility rules, section 12)                */
/* ------------------------------------------------------------------ */

/** Whether `viewerId` is allowed to see the secret word texts in `round`. */
export function canSeeWords(room: Room, round: Round, viewerId: PlayerId): boolean {
  if (round.status === "finished") return true; // revealed to all
  return viewerId === room.hostId || viewerId === round.activePlayerId;
}

/** Build the room snapshot a specific viewer is allowed to see. */
export function projectRoom(
  room: Room,
  viewerId: PlayerId,
  now: number = Date.now(),
): ClientRoom {
  const viewer = findPlayer(room, viewerId);
  const role: Role = viewer?.role ?? "spectator";

  let round: ClientRound | null = null;
  if (room.round) {
    const reveal = canSeeWords(room, room.round, viewerId);
    const words: ClientSecretWord[] = room.round.words.map((w) => ({
      text: reveal ? w.text : null,
      used: w.used,
    }));
    round = {
      activePlayerId: room.round.activePlayerId,
      topic: room.round.topic,
      words,
      durationSec: room.round.durationSec,
      status: room.round.status,
      remainingSec: Math.ceil(remainingSeconds(room.round, now)),
    };
  }

  return {
    id: room.id,
    hostId: room.hostId,
    players: room.players,
    settings: room.settings,
    difficulty: room.settings.difficulty,
    round,
    you: { id: viewerId, role },
  };
}
