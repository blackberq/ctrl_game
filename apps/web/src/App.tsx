import { GAME_TITLE } from "@ctrl-game/shared";
import { clearError, selectError, selectRoom, selectStatus } from "@ctrl-game/client";
import { useAppDispatch, useAppSelector } from "./hooks";
import { Home } from "./components/Home";
import { Room } from "./components/Room";

export function App() {
  const dispatch = useAppDispatch();
  const room = useAppSelector(selectRoom);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  return (
    <main className="app">
      <header className="header">
        <h1>{GAME_TITLE}</h1>
        <span className={`status status--${status}`}>{status}</span>
      </header>

      {error && (
        <div className="error" onClick={() => dispatch(clearError())} role="alert">
          {error} <span className="error__dismiss">✕</span>
        </div>
      )}

      {room ? <Room /> : <Home />}
    </main>
  );
}
