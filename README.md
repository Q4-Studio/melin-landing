# Melin Landing

Landing page statica per Melin Group, costruita con `Vite + React` e pensata per deploy gratuito su GitHub Pages o Cloudflare Pages.

## Requisiti

- Node.js 18+
- npm

## Avvio locale

```bash
npm install
npm run dev
```

## Variabili ambiente

Copia `.env.example` in `.env.local` e configura:

- `VITE_WEBHOOK_URL`: endpoint del webhook per il form contatti.
- `VITE_SITE_BASE`: base path del sito. Usa `/` in locale e su Cloudflare Pages, `/melin-landing/` su GitHub Pages.

## Build

Cloudflare Pages o hosting statico generico:

```bash
VITE_SITE_BASE=/ npm run build
```

GitHub Pages:

```bash
VITE_SITE_BASE=/melin-landing/ npm run build
```

## Deploy GitHub Pages

Il workflow in `.github/workflows/deploy.yml` pubblica automaticamente il contenuto di `dist/` su GitHub Pages a ogni push su `main`.

## Note contenuti

- Il form invia un payload JSON al webhook configurato.
- La pagina privacy è una bozza operativa da far validare prima della messa in produzione definitiva.

