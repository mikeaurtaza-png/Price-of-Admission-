# The Price of Admission — V3 Neon Junk Drawer

A goofy, chaotic, NSFW-adjacent TV + phone party game built with React, Vite, and Firebase-ready realtime hooks.

## What this version includes

- Neon Junk Drawer visual redesign
- Jackbox / Adult Swim / MTV sticker energy
- Landing page, lobby, TV game card, reveal screen, phone controller, damage report
- 8-player demo mode
- Tap-to-predict phone flow
- Floating reactions
- Host roast lines
- Funny player archetypes
- 450 generated starter cards across goofy decks
- Firebase-ready service layer
- Vercel-ready setup

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the GitHub repo into Vercel.
3. Keep default settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy.

## Firebase multiplayer setup

The game currently runs in local/demo mode so it works immediately. To turn on true phone-to-TV multiplayer:

1. Create a Firebase project.
2. Enable Firestore Database.
3. Add these environment variables in Vercel:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

4. Wire `subscribeRoom`, `createRoom`, and `updateRoom` from `src/services/firebase.js` into `App.jsx` state updates.

## Important note

This version is intentionally loud, goofy, and NSFW-adjacent. It avoids explicit sexual content in the starter card library, but the structure supports adding your own private adult-only decks.
