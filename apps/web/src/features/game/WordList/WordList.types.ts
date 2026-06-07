import type { ClientSecretWord } from "@ctrl-game/shared";

export interface WordListProps {
  words: ClientSecretWord[];
  /** When true, render checkboxes for the host to mark words as used. */
  editable?: boolean;
  onToggle?: (index: number, used: boolean) => void;
}
