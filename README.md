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

- `VITE_WEBHOOK_URL`: URL del webhook GoHighLevel per il form contatti.
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

## Form contatti (GoHighLevel)

Il form invia un POST al webhook GHL configurato in `VITE_WEBHOOK_URL`.

Per attivarlo:

1. In GoHighLevel creare un workflow con trigger **Inbound Webhook** e copiare l'URL.
2. Impostare l'URL come secret `VITE_WEBHOOK_URL` in *Settings > Secrets and variables > Actions* del repository (il workflow di deploy lo legge da li').
3. Nel workflow GHL mappare i campi e aggiungere l'azione desiderata (Create/Update Contact, notifica email, ecc.).
4. Inviare una richiesta di prova dal sito pubblicato e verificare che il contatto arrivi.

Campi inviati, tutti al primo livello perche' GHL li mappa piu' facilmente:

| Campo | Contenuto |
| --- | --- |
| `first_name` | prima parola del nome digitato |
| `last_name` | parole successive |
| `full_name` | nome completo |
| `email` | email |
| `phone` | telefono (facoltativo) |
| `message` | descrizione di immobile e intervento |
| `consent` | `true` se la privacy e' stata accettata |
| `source` | sempre `melin-landing` |
| `page` | URL della pagina di invio |
| `submitted_at` | timestamp ISO |

Note tecniche:

- La richiesta parte come `Content-Type: text/plain` in `mode: 'no-cors'`. Serve a evitare il preflight CORS, che l'endpoint GHL potrebbe non gestire. Di conseguenza il browser non puo' leggere la risposta: il messaggio di conferma appare se la richiesta e' partita, non se GHL l'ha accettata. Da qui il punto 4.
- Il form ha un campo esca (`azienda`) nascosto: se risulta compilato la richiesta viene scartata in silenzio.

## Note contenuti
- La pagina privacy è una bozza operativa da far validare prima della messa in produzione definitiva.

