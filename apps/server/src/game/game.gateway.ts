import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket, type DefaultEventsMap } from "socket.io";
import {
  GameError,
  addPlayer,
  createRoom,
  finishRound as finishRoundNow,
  markWord,
  pauseRound,
  projectRoom,
  remainingSeconds,
  resumeRound,
  setConnected,
  setMode,
  startRound,
  updateSettings,
  type CreateRoomMessage,
  type JoinRoomMessage,
  type MarkWordMessage,
  type Room,
  type SetModeMessage,
  type StartRoundMessage,
  type UpdateSettingsMessage,
} from "@ctrl-game/shared";
import { RoomsService } from "./rooms.service";

/** Data we attach to each connected socket. */
interface SocketData {
  roomId?: string;
  playerId?: string;
}

type GameSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;

@WebSocketGateway({ cors: { origin: "*" } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(GameGateway.name);
  private readonly roundTimers = new Map<string, ReturnType<typeof setTimeout>>();

  handleConnection(client: GameSocket): void {
    this.logger.debug(`Socket connected: ${client.id}`);
  }

  async handleDisconnect(client: GameSocket): Promise<void> {
    const { roomId, playerId } = client.data;
    if (!roomId || !playerId || !this.rooms.has(roomId)) return;

    const room = setConnected(this.rooms.get(roomId), playerId, false);
    this.rooms.set(room);
    await this.broadcast(roomId);
  }

  constructor(private readonly rooms: RoomsService) {}

  /* ------------------------- client → server ------------------------ */

  @SubscribeMessage("create_room")
  async createRoom(
    @ConnectedSocket() client: GameSocket,
    @MessageBody() body: CreateRoomMessage,
  ): Promise<void> {
    await this.handle(client, async () => {
      const roomId = this.rooms.createRoomId();
      const playerId = this.rooms.newPlayerId();
      const room = createRoom(roomId, playerId, body.name?.trim() || "Host");
      this.rooms.set(room);
      await this.join(client, roomId, playerId);
    });
  }

  @SubscribeMessage("join_room")
  async joinRoom(
    @ConnectedSocket() client: GameSocket,
    @MessageBody() body: JoinRoomMessage,
  ): Promise<void> {
    await this.handle(client, async () => {
      const roomId = body.roomId?.toUpperCase();
      if (!roomId || !this.rooms.has(roomId)) throw new GameError("Room not found");

      const playerId = this.rooms.newPlayerId();
      const room = addPlayer(
        this.rooms.get(roomId),
        playerId,
        body.name?.trim() || "Player",
        body.asSpectator ? "spectator" : "player",
      );
      this.rooms.set(room);
      await this.join(client, roomId, playerId);
    });
  }

  @SubscribeMessage("update_settings")
  async updateSettings(
    @ConnectedSocket() client: GameSocket,
    @MessageBody() body: UpdateSettingsMessage,
  ): Promise<void> {
    await this.hostAction(client, (room) => updateSettings(room, body.settings ?? {}));
  }

  @SubscribeMessage("set_mode")
  async setMode(
    @ConnectedSocket() client: GameSocket,
    @MessageBody() body: SetModeMessage,
  ): Promise<void> {
    await this.hostAction(client, (room) => setMode(room, body.mode));
  }

  @SubscribeMessage("start_round")
  async startRound(
    @ConnectedSocket() client: GameSocket,
    @MessageBody() body: StartRoundMessage,
  ): Promise<void> {
    await this.hostAction(client, (room) =>
      startRound(room, {
        activePlayerId: body.activePlayerId,
        words: body.words,
        topic: body.topic,
      }),
      (room) => this.scheduleRoundTimer(room),
    );
  }

  @SubscribeMessage("pause_round")
  async pauseRound(@ConnectedSocket() client: GameSocket): Promise<void> {
    await this.hostAction(client, (room) => pauseRound(room), (room) => this.clearRoundTimer(room.id));
  }

  @SubscribeMessage("resume_round")
  async resumeRound(@ConnectedSocket() client: GameSocket): Promise<void> {
    await this.hostAction(client, (room) => resumeRound(room), (room) => this.scheduleRoundTimer(room));
  }

  @SubscribeMessage("mark_word")
  async markWord(
    @ConnectedSocket() client: GameSocket,
    @MessageBody() body: MarkWordMessage,
  ): Promise<void> {
    await this.hostAction(client, (room) => markWord(room, body.index, body.used));
  }

  @SubscribeMessage("finish_round")
  async finishRound(@ConnectedSocket() client: GameSocket): Promise<void> {
    await this.hostAction(client, (room) => finishRoundNow(room), (room) => this.clearRoundTimer(room.id));
  }

  /* ----------------------------- helpers ---------------------------- */

  /** Run a host-only mutation: validate caller is the host, apply, broadcast. */
  private async hostAction(
    client: GameSocket,
    mutate: (room: Room) => Room,
    afterUpdate?: (room: Room) => void,
  ): Promise<void> {
    await this.handle(client, async () => {
      const { roomId, playerId } = client.data;
      if (!roomId || !playerId) throw new GameError("Not in a room");

      const current = this.rooms.get(roomId);
      if (current.hostId !== playerId) throw new GameError("Only the host can do that");

      const updated = mutate(current);
      this.rooms.set(updated);
      afterUpdate?.(updated);
      await this.broadcast(roomId);
    });
  }

  private clearRoundTimer(roomId: string): void {
    const timer = this.roundTimers.get(roomId);
    if (!timer) return;
    clearTimeout(timer);
    this.roundTimers.delete(roomId);
  }

  private scheduleRoundTimer(room: Room): void {
    this.clearRoundTimer(room.id);
    if (!room.round || room.round.status !== "running") return;

    const delayMs = Math.max(0, Math.ceil(remainingSeconds(room.round) * 1000) + 50);
    const timer = setTimeout(() => {
      void this.finishExpiredRound(room.id);
    }, delayMs);
    this.roundTimers.set(room.id, timer);
  }

  private async finishExpiredRound(roomId: string): Promise<void> {
    this.roundTimers.delete(roomId);
    if (!this.rooms.has(roomId)) return;

    const room = this.rooms.get(roomId);
    if (!room.round || room.round.status !== "running") return;

    if (remainingSeconds(room.round) > 0) {
      this.scheduleRoundTimer(room);
      return;
    }

    this.rooms.set(finishRoundNow(room));
    await this.broadcast(roomId);
  }

  /** Attach socket to a room, acknowledge, and broadcast the new state. */
  private async join(client: GameSocket, roomId: string, playerId: string): Promise<void> {
    client.data.roomId = roomId;
    client.data.playerId = playerId;
    await client.join(roomId);
    client.emit("room_joined", { type: "room_joined", roomId, playerId });
    await this.broadcast(roomId);
  }

  /** Emit a per-viewer `room_state` to every socket currently in the room. */
  private async broadcast(roomId: string): Promise<void> {
    if (!this.rooms.has(roomId)) return;
    const room = this.rooms.get(roomId);
    const now = Date.now();

    const sockets = await this.server.in(roomId).fetchSockets();
    for (const socket of sockets) {
      const viewerId = (socket.data as SocketData).playerId;
      if (!viewerId) continue;
      socket.emit("room_state", { type: "room_state", room: projectRoom(room, viewerId, now) });
    }
  }

  private async handle(client: GameSocket, fn: () => Promise<void>): Promise<void> {
    try {
      await fn();
    } catch (err) {
      if (err instanceof GameError) {
        client.emit("error", { type: "error", message: err.message });
        return;
      }
      this.logger.error(err);
      client.emit("error", { type: "error", message: "Internal server error" });
    }
  }
}
