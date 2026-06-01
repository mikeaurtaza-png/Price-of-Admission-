# The Price of Admission — Premium Party Game MVP

A private TV + phone party game for up to 8 players.

## Run locally
```bash
npm install
npm run dev
```

## Deploy on Vercel
1. Push this folder to GitHub.
2. Import the repo in Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.

## Firebase realtime upgrade
The app ships with a local demo mode. Add these Vercel environment variables to enable Firebase:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Content packs
Cards live in `src/data/cards.js`. Add as many as you want. The game already supports Party, NSFW, Chaos, and Apocalypse modes.

## Notes
Keep this private and adult-only. Add an age gate before sharing widely.
