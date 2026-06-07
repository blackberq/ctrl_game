import type { Player, PlayerId } from '@ctrl-game/shared';

export interface PlayerListProps {
  players: Player[];
  youId: PlayerId;
  hostId: PlayerId;
}
