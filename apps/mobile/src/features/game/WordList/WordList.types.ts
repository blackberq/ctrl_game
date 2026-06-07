import type { ClientSecretWord } from '@ctrl-game/shared';

export interface WordListProps {
  words: ClientSecretWord[];
  editable?: boolean;
  onToggle?: (index: number, used: boolean) => void;
}
