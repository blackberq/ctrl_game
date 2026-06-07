import { useState } from "react";
import type { GameMode } from "@ctrl-game/shared";
import {
  activePlayer,
  disconnectSocket,
  displayRemainingSec,
  eligiblePlayers,
  finishRound,
  isActivePlayer,
  isHost,
  markWord,
  pauseRound,
  resumeRound,
  selectGame,
  setMode,
  startRound,
} from "@ctrl-game/client";
import { useAppDispatch, useAppSelector, useNow } from "../hooks";

const MODES: { value: GameMode; label: string }[] = [
  { value: "classic", label: "Класичний" },
  { value: "fast", label: "Швидкий" },
  { value: "hard", label: "Складний" },
  { value: "spectator", label: "З глядачами" },
  { value: "team", label: "Командний" },
  { value: "host_input", label: "Слова ведучого" },
];

export function Room() {
  const dispatch = useAppDispatch();
  const game = useAppSelector(selectGame);
  const room = game.room!;
  const round = room.round;

  const host = isHost(room);
  const active = isActivePlayer(room);
  const now = useNow(round?.status === "running");
  const remaining = displayRemainingSec(game, now);

  const [activeId, setActiveId] = useState("");
  const candidates = eligiblePlayers(room);
  const selectedActive = activeId || candidates[0]?.id || room.you.id;

  return (
    <section className="room">
      <div className="room__bar">
        <div>
          <span className="muted">Кімната</span> <strong className="code">{room.id}</strong>
        </div>
        <div className="muted">
          {MODES.find((m) => m.value === room.settings.mode)?.label} · {room.settings.difficulty} ·{" "}
          {room.you.role}
        </div>
        <button className="link" onClick={() => dispatch(disconnectSocket())}>
          Вийти
        </button>
      </div>

      {/* Round area */}
      {round && round.status !== "finished" ? (
        <div className="round">
          <div className={`timer ${remaining <= 10 ? "timer--low" : ""}`}>⏱ {remaining}s</div>
          <p className="muted">
            Розповідає: <strong>{activePlayer(room)?.name}</strong> · {round.status}
          </p>

          <ul className="words">
            {round.words.map((w, i) => (
              <li key={i} className={w.used ? "word word--used" : "word"}>
                {host ? (
                  <label>
                    <input
                      type="checkbox"
                      checked={w.used}
                      onChange={(e) => dispatch(markWord({ index: i, used: e.target.checked }))}
                    />
                    {w.text}
                  </label>
                ) : (
                  <span>{w.text ?? "•••••"}</span>
                )}
              </li>
            ))}
          </ul>

          {!host && active && <p className="hint">Це ваші секретні слова — вплітайте їх у розповідь!</p>}
          {!host && !active && (
            <p className="hint muted">Слова приховані до завершення раунду.</p>
          )}

          {host && (
            <div className="row">
              {round.status === "running" ? (
                <button onClick={() => dispatch(pauseRound())}>Пауза</button>
              ) : (
                <button onClick={() => dispatch(resumeRound())}>Продовжити</button>
              )}
              <button className="primary" onClick={() => dispatch(finishRound())}>
                Завершити раунд
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="lobby">
          {round?.status === "finished" && (
            <div className="reveal">
              <h3>Раунд завершено</h3>
              <p className="muted">Секретні слова:</p>
              <ul className="words">
                {round.words.map((w, i) => (
                  <li key={i} className={w.used ? "word word--used" : "word"}>
                    {w.text} {w.used ? "✓" : "—"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {host ? (
            <div className="host-controls">
              <h3>Налаштування</h3>
              <div className="modes">
                {MODES.map((m) => (
                  <button
                    key={m.value}
                    className={room.settings.mode === m.value ? "chip chip--on" : "chip"}
                    onClick={() => dispatch(setMode({ mode: m.value }))}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <label className="field">
                Активний гравець
                <select value={selectedActive} onChange={(e) => setActiveId(e.target.value)}>
                  {candidates.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.id === room.you.id ? "(ви)" : ""}
                    </option>
                  ))}
                </select>
              </label>

              <button
                className="primary"
                onClick={() => dispatch(startRound({ activePlayerId: selectedActive }))}
              >
                {round ? "Новий раунд" : "Почати раунд"}
              </button>
            </div>
          ) : (
            <p className="muted">Очікуємо, поки ведучий почне раунд…</p>
          )}
        </div>
      )}

      {/* Players */}
      <h3>Учасники ({room.players.length})</h3>
      <ul className="players">
        {room.players.map((p) => (
          <li key={p.id} className={p.connected ? "player" : "player player--offline"}>
            <span>
              {p.name}
              {p.id === room.you.id ? " (ви)" : ""}
              {p.id === room.hostId ? " 👑" : ""}
            </span>
            <span className="score">{p.score}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
