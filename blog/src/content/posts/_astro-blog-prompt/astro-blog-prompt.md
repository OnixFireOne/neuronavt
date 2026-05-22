---
author: Ai Ozy
pubDatetime: 2026-05-22T14:00:00.000+03:00
title: "Промпт для Claude Code: собери мне Astro блог с нуля"
description: "Готовый промпт для ИИ-агента — отправь в Claude Code и получи полностью настроенный Astro-блог с Docker и GitHub Actions деплоем."
tags:
  - AI
  - Astro
  - Промпт
  - Claude
---

> **TL;DR**: Один промпт — и ИИ-агент сам настроит тебе Astro-блог на Windows + Docker с деплоем через GitHub Actions. Скопируй и отправь в Claude Code (или любой другой агент с доступом к терминалу).

---

## Как использовать

Скопируй весь текст ниже (кнопка Copy справа вверху блока) и отправь в Claude Code или любой другой ИИ-агент с доступом к терминалу и файлам.

[Статья что расскжает подробнее о промте](/posts/astro-blog-setup)

---

## Промпт

```text
Ты — агент. Твоя задача — полностью настроить Astro-блог на моей машине (Windows + Docker). Делай всё последовательно, не жди подтверждения между шагами если они не требуют моего выбора.

### Что нужно сделать

**1. Уточни у меня перед стартом:**
- Путь к папке проекта (например `C:\myblog`)
- Какую тему Astro использовать — открой https://astro.build/themes и предложи 3 варианта подходящих для блога, жди моего выбора
- Название сайта и описание (для конфига Astro)

**2. Создай структуру папок**

<папка проекта>/
├── blog/                 ← сюда установится Astro
├── .github/
│   └── workflows/
│       └── deploy.yml
└── docker-compose.dev.yml

**3. Установи Astro с выбранной темой через Docker**

Запусти в папке проекта:
docker run --rm -it -v ${PWD}:/app -w /app node:22-alpine sh -c "npx create-astro@latest ./blog -- --template <ВЫБРАННАЯ_ТЕМА>"

Затем установи зависимости:
docker run --rm -it -v ${PWD}/blog:/app -w /app node:22-alpine sh -c "npm install"

**4. Создай `docker-compose.dev.yml`** в корне проекта:

services:
  blog:
    image: node:22-alpine
    working_dir: /app
    ports:
      - "4321:4321"
    volumes:
      - ./blog:/app
    command: sh -c "npm install && npm run dev -- --host"

**5. Создай `.github/workflows/deploy.yml`:**

name: Build & Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install & Build
        working-directory: ./blog
        run: |
          npm install
          npm run build

      - name: Deploy to VPS
        uses: appleboy/scp-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          port: ${{ secrets.SERVER_PORT }}
          source: "blog/dist/"
          target: "~/blog"
          strip_components: 2

      - name: Reload Nginx
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          port: ${{ secrets.SERVER_PORT }}
          script: |
            cp -r ~/blog/. /var/www/html/
            nginx -s reload

**6. Обнови `blog/astro.config.mjs`** — вставь название сайта и домен (если известен):

import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ТВОЙ_ДОМЕН.com', // замени или оставь заглушку
});

**7. Создай `.gitignore`** в корне если его нет:

node_modules/
blog/dist/
blog/.astro/
.env

**8. Добавь `usePolling: true` в Vite server watch astro.config.ts**

vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },

**9. Инициализируй git и сделай первый коммит**

git init
git add .
git commit -m "init: astro blog setup"

**10. После всего — выведи итоговый чеклист:**

✅ Структура папок создана
✅ Astro установлен с темой: <название>
✅ docker-compose.dev.yml готов
✅ GitHub Actions deploy.yml готов
✅ .gitignore создан
✅ Добавил `usePolling: true`
✅ Git инициализирован

Следующие шаги:
1. Запусти локально: docker compose -f docker-compose.dev.yml up
2. Открой http://localhost:4321 — должен работать блог
3. Создай репозиторий на GitHub и запушь: git remote add origin <url> && git push -u origin main
4. Добавь секреты в GitHub: Settings → Secrets → Actions
   - SERVER_HOST
   - SERVER_USER
   - SERVER_SSH_KEY
   - SERVER_PORT
5. Готово — каждый git push будет деплоить блог на сервер

### Важно
- Если какая-то команда упала с ошибкой — покажи вывод и предложи фикс, не останавливайся молча
- Если Docker не запущен — скажи об этом явно
- Версию `node:22-alpine` можно менять если тема требует другую версию Node
```
