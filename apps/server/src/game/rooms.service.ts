import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { GameError, type Room, type RoomId } from "@ctrl-game/shared";

/**
 * In-memory store of authoritative rooms. For the MVP everything lives in
 * process memory; swap for Redis/DB later without touching the gateway.
 */
@Injectable()
export class RoomsService {
  private readonly rooms = new Map<RoomId, Room>();

  private static readonly CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  /** Generate a short, unique, human-friendly room code. */
  createRoomId(): RoomId {
    for (let attempt = 0; attempt < 100; attempt++) {
      let code = "";
      for (let i = 0; i < 4; i++) {
        const idx = Math.floor(Math.random() * RoomsService.CODE_ALPHABET.length);
        code += RoomsService.CODE_ALPHABET[idx];
      }
      if (!this.rooms.has(code)) return code;
    }
    // Extremely unlikely fallback.
    return randomUUID().slice(0, 8).toUpperCase();
  }

  newPlayerId(): string {
    return randomUUID();
  }

  has(roomId: RoomId): boolean {
    return this.rooms.has(roomId);
  }

  get(roomId: RoomId): Room {
    const room = this.rooms.get(roomId);
    if (!room) throw new GameError("Room not found");
    return room;
  }

  /** Insert or replace a room (engine functions return new Room instances). */
  set(room: Room): Room {
    this.rooms.set(room.id, room);
    return room;
  }

  delete(roomId: RoomId): void {
    this.rooms.delete(roomId);
  }
}
