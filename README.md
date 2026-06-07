# ctrl_game — «Секретні слова»

Monorepo for the improv word game **«Секретні слова» (Secret Words)**: a web client
(React), a mobile client (React Native CLI) and a realtime server (NestJS), all
sharing the game domain model. Managed with **pnpm workspaces**.

> Goal of the game: the active player must naturally weave 3 secret words into a
> short story within 60 seconds; the host marks which words were used; spectators
> only see the timer and status until the round ends. Full rules drove the domain
> model in `packages/shared`.

## Structure

```
ctrl_game/
├── apps/
│   ├── web/        # React + Vite + Redux Toolkit       (@ctrl-game/web)
│   ├── mobile/     # React Native CLI + Redux Toolkit    (@ctrl-game/mobile)
│   └── server/     # NestJS + socket.io realtime API     (@ctrl-game/server)
├── packages/
│   ├── shared/     # Domain model, engine & protocol      (@ctrl-game/shared)
│   └── client/     # Redux Toolkit store + socket client  (@ctrl-game/client)
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

All apps depend on `@ctrl-game/shared` via `workspace:*`; both clients also share
`@ctrl-game/client`.

### `packages/client`

The shared client state layer, used by both web and mobile:

- A **Redux Toolkit** store (`createGameStore(url)`) with a `game` slice.
- A **socket.io middleware** that opens the connection, translates incoming
  server events into actions (`roomStateReceived`, `roomJoined`, …) and outgoing
  command actions (`createRoom`, `startRound`, `markWord`, …) into socket emits.
- Selectors (`selectRoom`, `isHost`, `displayRemainingSec`, …).

Each app provides its own thin React-Redux binding (so web's React 18 and mobile's
React 19 stay independent) and its own UI.

### `packages/shared`

The framework-agnostic core, consumed by every app:

- **`types.ts`** — domain types (`Room`, `Player`, `Round`, `SecretWord`,
  `RoomSettings`), roles, game modes, difficulty tiers, mode presets & MVP defaults.
- **`engine.ts`** — pure, immutable game logic: room/round lifecycle, timer math,
  scoring, and `projectRoom()` which hides secret words from everyone except the
  host and active player until the round is finished (rules §12).
- **`words.ts`** — sample Ukrainian word banks per difficulty + `generateWords()`.
- **`protocol.ts`** — WebSocket message types (`ClientMessage` / `ServerMessage`)
  and the per-viewer `ClientRoom` projection.

The server owns the authoritative `Room` and applies the engine; clients reuse the
same types and may reuse the engine for optimistic UI.

## Requirements

- Node >= 20 (mobile requires >= 22.11)
- pnpm 11
- For mobile: Xcode / Android Studio per the
  [React Native environment setup](https://reactnative.dev/docs/environment-setup)

## Getting started

```bash
pnpm install
pnpm build:shared    # the server consumes the compiled shared dist
```

### Run the full prototype

Three terminals:

```bash
pnpm server   # NestJS realtime API on http://localhost:3001
pnpm web      # web client on http://localhost:5173
pnpm mobile   # Metro bundler (then run iOS/Android, see below)
```

Open the web app in two browser tabs: in the first, enter a name and **Створити
кімнату** (create room) — you are the host. Copy the 4-letter room code, open the
second tab, enter a name + the code and **Увійти** (join). The host picks the
active player and starts a round; secret words stay hidden from non-host/non-active
players until the round is finished.

### Web

```bash
pnpm web            # vite dev server on http://localhost:5173
pnpm --filter @ctrl-game/web build
```

### Mobile (React Native CLI)

```bash
pnpm mobile         # start Metro bundler
# in another terminal:
pnpm --filter @ctrl-game/mobile ios
pnpm --filter @ctrl-game/mobile android
```

> iOS also needs CocoaPods installed once: `cd apps/mobile/ios && bundle install && bundle exec pod install`.

### Server (NestJS realtime)

```bash
pnpm build:shared   # the server consumes the compiled shared dist
pnpm server         # nest start --watch on http://localhost:3001 (PORT to override)
```

socket.io events follow `ClientMessage["type"]` (`create_room`, `join_room`,
`start_round`, `mark_word`, `finish_round`, …); the server replies with
`room_joined`, per-viewer `room_state`, and `error`.

### Shared package

```bash
pnpm build:shared   # compile packages/shared to dist/ (CommonJS, for the server)
```

> The shared package ships its TypeScript **source** to the bundler clients
> (Vite / Metro read `src`) and a compiled **CommonJS `dist`** to the Node server
> (resolved via the `node` export condition). Run `pnpm build:shared` before
> starting the server. `pnpm build` does this automatically in dependency order.

## Useful root scripts

| Command            | What it does                                  |
| ------------------ | --------------------------------------------- |
| `pnpm typecheck`   | Type-check every workspace package            |
| `pnpm build`       | Run `build` in every package that defines it  |
| `pnpm clean`       | Remove `dist/` and `node_modules` everywhere  |

## Monorepo notes

- `.npmrc` uses `node-linker=hoisted` so React Native / Metro resolve native
  dependencies correctly.
- `apps/mobile/metro.config.js` watches the monorepo root and resolves the
  hoisted root `node_modules`, so changes in `packages/*` are picked up live.
- The mobile app points at `http://10.0.2.2:3001` on Android (emulator → host)
  and `http://localhost:3001` on iOS — see `apps/mobile/src/config.ts`. For a
  physical device, set your machine's LAN IP there.
