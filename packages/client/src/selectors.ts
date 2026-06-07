import type { ClientRoom, Player } from "@ctrl-game/shared";
import type { GameState, RootState } from "./store";

export const selectGame = (state: RootState): GameState => state.game;
export const selectRoom = (state: RootState): ClientRoom | null => state.game.room;
export const selectError = (state: RootState): string | null => state.game.error;
export const selectStatus = (state: RootState) => state.game.status;

export function isHost(room: ClientRoom): boolean {
  return room.you.id === room.hostId;
}

export function isActivePlayer(room: ClientRoom): boolean {
  return room.round?.activePlayerId === room.you.id;
}

export function activePlayer(room: ClientRoom): Player | undefined {
  if (!room.round) return undefined;
  return room.players.find((p) => p.id === room.round!.activePlayerId);
}

/** Players eligible to be the active player (everyone who isn't a spectator). */
export function eligiblePlayers(room: ClientRoom): Player[] {
  return room.players.filter((p) => p.role !== "spectator");
}

/**
 * Seconds left to display, smoothly counted down from the last server snapshot.
 * The server only pushes on events, so we extrapolate locally while running.
 */
export function displayRemainingSec(game: GameState, now: number): number {
  const round = game.room?.round;
  if (!round) return 0;
  if (round.status !== "running") return round.remainingSec;
  const elapsed = (now - game.receivedAt) / 1000;
  return Math.max(0, Math.round(round.remainingSec - elapsed));
}
