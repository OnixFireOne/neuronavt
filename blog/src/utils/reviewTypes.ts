export const reviewTypeKeys = [
  "practical_case", "tutorial", "tool_release", "research", "opinion", "hype_news", "other",
] as const;
export type ReviewType = (typeof reviewTypeKeys)[number];
export const reviewTypes: Record<ReviewType, string> = {
  practical_case: "Кейс", tutorial: "Туториал", tool_release: "Инструмент",
  research: "Исследование", opinion: "Мнение", hype_news: "Новость", other: "Другое",
};
