import {
  configureStore,
  createAction,
  createSlice,
  type Middleware,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { io, type Socket } from "socket.io-client";
import type {
  ClientRoom,
  GameMode,
  PlayerId,
  RoomSettings,
  ServerMessage,
} from "@ctrl-game/shared";

export type ConnectionStatus = "disconnected" | "connecting" | "connected";

export interface GameState {
  status: ConnectionStatus;
  roomId: string | null;
  playerId: PlayerId | null;
  room: ClientRoom | null;
  /** Local epoch ms when `room` was last received (for smooth countdown). */
  receivedAt: number;
  error: string | null;
}

const initialState: GameState = {
  status: "disconnected",
  roomId: null,
  playerId: null,
  room: null,
  receivedAt: 0,
  error: null,
};

/* ------------------------------------------------------------------ */
/* Slice — state updated from incoming socket events                   */
/* ------------------------------------------------------------------ */

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    connecting: (state) => {
      state.status = "connecting";
      state.error = null;
    },
    connected: (state) => {
      state.status = "connected";
    },
    disconnected: (state, action: PayloadAction<string | undefined>) => {
      state.status = "disconnected";
      if (action.payload) state.error = action.payload;
    },
    roomJoined: (state, action: PayloadAction<{ roomId: string; playerId: PlayerId }>) => {
      state.roomId = action.payload.roomId;
      state.playerId = action.payload.playerId;
      state.error = null;
    },
    roomStateReceived: (
      state,
      action: PayloadAction<{ room: ClientRoom; receivedAt: number }>,
    ) => {
      state.room = action.payload.room;
      state.receivedAt = action.payload.receivedAt;
    },
    errorReceived: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    reset: () => initialState,
  },
});

export const { clearError } = gameSlice.actions;

/* ------------------------------------------------------------------ */
/* Command actions — intercepted by the socket middleware (no reducer) */
/* ------------------------------------------------------------------ */

export const connectSocket = createAction("game/connectSocket");
export const disconnectSocket = createAction("game/disconnectSocket");

export const createRoom = createAction<{ name: string }>("game/cmd/create_room");
export const joinRoom =
  createAction<{ roomId: string; name: string; asSpectator?: boolean }>("game/cmd/join_room");
export const setMode = createAction<{ mode: GameMode }>("game/cmd/set_mode");
export const updateSettings =
  createAction<{ settings: Partial<RoomSettings> }>("game/cmd/update_settings");
export const startRound =
  createAction<{ activePlayerId: PlayerId; words?: string[] }>("game/cmd/start_round");
export const pauseRound = createAction("game/cmd/pause_round");
export const resumeRound = createAction("game/cmd/resume_round");
export const markWord = createAction<{ index: number; used: boolean }>("game/cmd/mark_word");
export const finishRound = createAction("game/cmd/finish_round");

/** Maps a command action type to its socket.io event name. */
const COMMAND_EVENTS: Record<string, string> = {
  [createRoom.type]: "create_room",
  [joinRoom.type]: "join_room",
  [setMode.type]: "set_mode",
  [updateSettings.type]: "update_settings",
  [startRound.type]: "start_round",
  [pauseRound.type]: "pause_round",
  [resumeRound.type]: "resume_round",
  [markWord.type]: "mark_word",
  [finishRound.type]: "finish_round",
};

/* ------------------------------------------------------------------ */
/* Socket middleware                                                   */
/* ------------------------------------------------------------------ */

function createSocketMiddleware(url: string): Middleware {
  return (store) => {
    let socket: Socket | null = null;

    return (next) => (action) => {
      const { connecting, connected, disconnected, roomJoined, roomStateReceived, errorReceived, reset } =
        gameSlice.actions;

      if (connectSocket.match(action)) {
        if (!socket) {
          store.dispatch(connecting());
          socket = io(url, { transports: ["websocket"], forceNew: true });
          socket.on("connect", () => store.dispatch(connected()));
          socket.on("disconnect", () => store.dispatch(disconnected(undefined)));
          socket.on("connect_error", () =>
            store.dispatch(disconnected("Не вдалося під'єднатися до сервера")),
          );
          socket.on("room_joined", (m: Extract<ServerMessage, { type: "room_joined" }>) =>
            store.dispatch(roomJoined({ roomId: m.roomId, playerId: m.playerId })),
          );
          socket.on("room_state", (m: Extract<ServerMessage, { type: "room_state" }>) =>
            store.dispatch(roomStateReceived({ room: m.room, receivedAt: Date.now() })),
          );
          socket.on("error", (m: Extract<ServerMessage, { type: "error" }>) =>
            store.dispatch(errorReceived(m.message)),
          );
        }
        return next(action);
      }

      if (disconnectSocket.match(action)) {
        socket?.close();
        socket = null;
        store.dispatch(reset());
        return next(action);
      }

      const event = COMMAND_EVENTS[(action as { type: string }).type];
      if (event) {
        if (socket?.connected) {
          const payload = (action as { payload?: Record<string, unknown> }).payload ?? {};
          socket.emit(event, { type: event, ...payload });
        } else {
          store.dispatch(errorReceived("Немає з'єднання з сервером"));
        }
        return next(action);
      }

      return next(action);
    };
  };
}

/* ------------------------------------------------------------------ */
/* Store factory + typed helpers                                       */
/* ------------------------------------------------------------------ */

export function createGameStore(url: string) {
  return configureStore({
    reducer: { game: gameSlice.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(createSocketMiddleware(url)),
  });
}

export type GameStore = ReturnType<typeof createGameStore>;
export type RootState = ReturnType<GameStore["getState"]>;
export type AppDispatch = GameStore["dispatch"];
