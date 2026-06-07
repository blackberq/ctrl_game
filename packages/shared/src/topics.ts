import type { Rng } from "./words";

/**
 * Sample Ukrainian story topics/questions the active player speaks about
 * (rules §4 — "розповідь або відповідає на тему"). Placeholder bank for the MVP.
 */
export const TOPICS: readonly string[] = [
  "Найдивніший сон, який тобі снився",
  "Розкажи про свій ідеальний вихідний",
  "Що б ти зробив, якби виграв мільйон?",
  "Найбільша пригода у твоєму житті",
  "Опиши, як минув твій сьогоднішній ранок",
  "Історія про несподівану зустріч",
  "Що б ти взяв із собою на безлюдний острів?",
  "Найсмішніший випадок зі школи чи роботи",
  "Якби ти мав суперсилу — як би ти її використав?",
  "Розкажи про подорож своєї мрії",
  "Найкращий подарунок, який ти отримував",
  "Що б ти змінив, якби міг повернутися в минуле?",
];

/** Pick a random topic. Pass a deterministic `rng` to make it reproducible. */
export function generateTopic(rng: Rng = Math.random): string {
  return TOPICS[Math.floor(rng() * TOPICS.length)];
}
