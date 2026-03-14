# m.city Digital Media Platform

Multi-lingual, automated content portal for city & football culture.

## Structure

- `apps/web` — Next.js frontend (SSR, i18n, RTL)
- `apps/cms` — Strapi headless CMS
- `apps/automation` — RSS parser, AI translation, cron jobs

## Quick Start

```bash
pnpm install
pnpm dev:web    # Frontend on http://localhost:3000
pnpm dev:cms    # Strapi on http://localhost:1337
```

## Locales

| Code | Language | Direction |
|------|----------|-----------|
| en   | English  | LTR       |
| ar   | Arabic   | RTL       |
| he   | Hebrew   | RTL       |
| es   | Spanish  | LTR       |
