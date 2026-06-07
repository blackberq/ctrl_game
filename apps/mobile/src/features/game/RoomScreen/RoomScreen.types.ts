import type { GameMode } from '@ctrl-game/shared';

// RoomScreen reads everything from the store; it takes no props.
export interface RoomScreenProps {
  _?: never;
}

export interface ModeOption {
  value: GameMode;
  label: string;
}
