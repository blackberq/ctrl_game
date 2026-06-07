import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { connectSocket, createGameStore } from "@ctrl-game/client";
import { App } from "./App";
import { SERVER_URL } from "./config";
import "./index.css";

const store = createGameStore(SERVER_URL);
store.dispatch(connectSocket());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
