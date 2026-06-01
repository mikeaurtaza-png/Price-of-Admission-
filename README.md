# The Price of Admission — Version 2 Chaos Update

A premium TV + phone party game for up to 8 players.

## What changed in Version 2
- Pristine TV stage layout with no sidebars during play
- Bigger cinematic dilemma cards
- Goofy NSFW personality and host lines
- Animated card reveal, shimmer, reactions, and reveal takeover
- Phone controller now uses a 3-step flow
- Slider replaced with tap-to-predict numbers
- Predict the most likely menace
- Player dock with lock-in status
- Floating live reactions
- Funny archetypes and scoreboard reveal
- 400 generated cards across Party, Late Night, Chaos, and Apocalypse modes

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

## Real phone multiplayer
The app supports Firebase Realtime Database. Add these environment variables in Vercel:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Without Firebase, the demo still works in one browser, but separate phones need Firebase turned on.

## Firebase database rules for private testing
Use locked-down rules later. For private testing only, you can temporarily use:

```json
{
  "rules": {
    "rooms": {
      "$room": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

## Content packs
Cards are generated in `src/data/cards.js`. Edit the reward and consequence arrays to change the tone.

Keep this private and adult-only.
