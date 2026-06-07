import { useState } from "react";
import { createRoom, joinRoom, selectStatus } from "@ctrl-game/client";
import { useAppDispatch, useAppSelector } from "../hooks";

export function Home() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [asSpectator, setAsSpectator] = useState(false);

  const connected = status === "connected";
  const canSubmit = connected && name.trim().length > 0;

  return (
    <section className="card">
      <label className="field">
        Ваше ім'я
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Напр. Олег"
          maxLength={24}
        />
      </label>

      <div className="row">
        <button disabled={!canSubmit} onClick={() => dispatch(createRoom({ name: name.trim() }))}>
          Створити кімнату
        </button>
      </div>

      <div className="divider">або приєднатися</div>

      <label className="field">
        Код кімнати
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABCD"
          maxLength={6}
        />
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={asSpectator}
          onChange={(e) => setAsSpectator(e.target.checked)}
        />
        Приєднатися як глядач
      </label>

      <button
        disabled={!canSubmit || code.trim().length === 0}
        onClick={() =>
          dispatch(joinRoom({ roomId: code.trim(), name: name.trim(), asSpectator }))
        }
      >
        Увійти
      </button>

      {!connected && <p className="muted">Під'єднання до сервера…</p>}
    </section>
  );
}
