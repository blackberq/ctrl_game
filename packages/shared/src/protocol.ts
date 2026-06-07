/**
 * Wire protocol shared by clients and the server.
 *
 * `ClientMessage` — sent by a client to the server (one socket.io event per `type`).
 * `ServerMessage` — sent by the server back to clients.
 * `ClientRoom`    — the per-viewer projection of a room (secret words are hidden
 *                   from everyone except the host and the active player until the
 *                   round is finished — see rules section 12).
 */

import type {
  Difficulty,
  GameMode,
  PlayerId,
  Player,
  RoomId,
  RoomSettings,
  RoundStatus,
  Role,
} from "./types";

/* ------------------------------------------------------------------ */
/* Client → Server                                                     */
/* ------------------------------------------------------------------ */

export interface CreateRoomMessage {
  type: "create_room";
  name: string;
}

export interface JoinRoomMessage {
  type: "join_room";
  roomId: RoomId;
  name: string;
  asSpectator?: boolean;
}

export interface UpdateSettingsMessage {
  type: "update_settings";
  settings: Partial<RoomSettings>;
}

export interface SetModeMessage {
  type: "set_mode";
  mode: GameMode;
}

export interface StartRoundMessage {
  type: "start_round";
  activePlayerId: PlayerId;
  /** Optional manual words (host_input mode); otherwise generated from difficulty. */
  words?: string[];
}

export interface PauseRoundMessage {
  type: "pause_round";
}

export interface ResumeRoundMessage {
  type: "resume_round";
}

export interface MarkWordMessage {
  type: "mark_word";
  index: number;
  used: boolean;
}

export interface FinishRoundMessage {
  type: "finish_round";
}

export type ClientMessage =
  | CreateRoomMessage
  | JoinRoomMessage
  | UpdateSettingsMessage
  | SetModeMessage
  | StartRoundMessage
  | PauseRoundMessage
  | ResumeRoundMessage
  | MarkWordMessage
  | FinishRoundMessage;

export type ClientMessageType = ClientMessage["type"];

/* ------------------------------------------------------------------ */
/* Server → Client                                                     */
/* ------------------------------------------------------------------ */

/** A secret word as seen by a particular viewer; `text` is `null` when hidden. */
export interface ClientSecretWord {
  text: string | null;
  used: boolean;
}

export interface ClientRound {
  activePlayerId: PlayerId;
  words: ClientSecretWord[];
  durationSec: number;
  status: RoundStatus;
  /** Whole seconds left, already computed server-side for this snapshot. */
  remainingSec: number;
}

export interface ClientRoom {
  id: RoomId;
  hostId: PlayerId;
  players: Player[];
  settings: RoomSettings;
  difficulty: Difficulty;
  round: ClientRound | null;
  /** Identity of the viewer this projection was built for. */
  you: { id: PlayerId; role: Role };
}

export interface RoomJoinedMessage {
  type: "room_joined";
  roomId: RoomId;
  playerId: PlayerId;
}

export interface RoomStateMessage {
  type: "room_state";
  room: ClientRoom;
}

export interface ErrorMessage {
  type: "error";
  message: string;
}

export type ServerMessage =
  | RoomJoinedMessage
  | RoomStateMessage
  | ErrorMessage;

export type ServerMessageType = ServerMessage["type"];
