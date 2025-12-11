# custom-form-next

This is a scaffolded Next.js app intended to be the migration target for the Vite React app in `frontend/custom-form`.

Quick start (run from this folder):

```powershell
npm install
npm run dev
```

Notes:
- Global CSS and Tailwind tokens were copied from the existing Vite app's `src/index.css` into `src/styles/globals.css`.
- Interactive pages (Home, Dashboard, FormBuilder, FormRenderer, Auth) will be kept client-side. Mark interactive components with `"use client"` when copying.
- After running `npm install`, configure any additional components in `src/components` and update imports as needed.

Environment and Tailwind notes
- **Environment variables**: Create a `.env.local` in this folder or set environment variables. Example in `.env.example` shows the API base URL used by the app:

```text
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

- **Tailwind**: Tailwind is already configured. The global stylesheet is `src/styles/globals.css` and includes `@tailwind base`, `@tailwind components`, and `@tailwind utilities` — no extra build step is required beyond `npm run dev`.

Running locally (PowerShell)
```powershell
cd "D:\BCA Sem 6\custom-forms\frontend\custom-form-next"
npm install
npm run dev
```

Debugging tips
- If you see API-related errors, confirm `NEXT_PUBLIC_API_URL` in `.env.local` points to your backend (e.g. `http://localhost:5000/api`).
- If Tailwind utilities don't appear, ensure `tailwind.config.js` `content` paths include `./src/pages` and `./src/components` (already configured).

If you'd like, I can run the dev server here and fix errors as they appear — say `run here` and I'll start the server.
