import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { connectSocket, createGameStore, type GameSession } from "@ctrl-game/client";
import { App } from "./App";
import { SERVER_URL } from "./config";
import "./index.css";

const SESSION_STORAGE_KEY = "ctrl-game-session";

function readSession(): GameSession | undefined {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<GameSession>;
    return parsed.roomId && parsed.playerId
      ? { roomId: parsed.roomId, playerId: parsed.playerId }
      : undefined;
  } catch {
    return undefined;
  }
}

const store = createGameStore(SERVER_URL, readSession());
store.subscribe(() => {
  const { roomId, playerId } = store.getState().game;
  if (roomId && playerId) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ roomId, playerId }));
  } else {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }
});
store.dispatch(connectSocket());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
