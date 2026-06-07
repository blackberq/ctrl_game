import type { Difficulty, SecretWord } from "./types";

/**
 * Sample Ukrainian word banks per difficulty (examples drawn from the rules,
 * sections 7 & 8). These are placeholder banks for the MVP — extend freely.
 */
export const WORD_BANKS: Record<Difficulty, readonly string[]> = {
  easy: [
    "кава",
    "школа",
    "собака",
    "парасолька",
    "таксі",
    "яблуко",
    "вікно",
    "автобус",
    "дощ",
    "телефон",
  ],
  medium: [
    "космонавт",
    "батарейка",
    "весілля",
    "акула",
    "золотий",
    "підозрілий",
    "стрибати",
    "зникнути",
    "червона кнопка",
    "нічний поїзд",
  ],
  hard: [
    "екскаватор",
    "філармонія",
    "паралелепіпед",
    "сусід знизу",
    "меланхолія",
    "карбюратор",
    "амбівалентність",
    "трансцендентний",
    "вестибюль",
    "гіпотенуза",
  ],
};

export type Rng = () => number;

/**
 * Pick `count` distinct random words for the given difficulty.
 * Pass a deterministic `rng` (returns [0,1)) to make results reproducible.
 */
export function generateWords(
  difficulty: Difficulty,
  count: number,
  rng: Rng = Math.random,
): SecretWord[] {
  const bank = [...WORD_BANKS[difficulty]];
  const picked: string[] = [];

  while (picked.length < count && bank.length > 0) {
    const index = Math.floor(rng() * bank.length);
    const [word] = bank.splice(index, 1);
    picked.push(word);
  }

  return picked.map((text) => ({ text, used: false }));
}
