# Blog

Персональный блог на [Astro](https://astro.build/).

## Локальная разработка

```bash
docker compose -f docker-compose.dev.yml up
```

Открой [localhost:4321](http://localhost:4321).

## Деплой

Пуш в `main` — GitHub Actions автоматически билдит и деплоит на сервер.

## Структура

```
blog/
├── src/content/posts/   # Посты (Markdown/MDX)
├── src/pages/           # Страницы
├── src/components/      # Компоненты
└── astro.config.ts      # Конфиг Astro
```

## Добавление поста

Создай `.md` / `.mdx` файл в `blog/src/content/posts/`:

```text
---
title: "Заголовок"
description: "Описание"
pubDate: 2026-05-19
---

Текст поста...
```

## Команды

```bash
cd blog && pnpm install     # установка зависимостей
pnpm run build              # билд для прода
pnpm run lint               # проверка кода
pnpm run format:check        # проверка форматирования
pnpm run format             # автоформатирование
```

## Стек

Astro 6 + TypeScript + TailwindCSS + Shiki + Pagefind + MDX
