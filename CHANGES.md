# Security and reliability fixes

## Security
- Preview iframes no longer use `allow-same-origin` (LivePreview, BuilderWorkspace x2). AI-generated code can no longer read the app's localStorage.
- Real accounts: `POST /api/auth/register|login|logout`, `GET /api/auth/me`. Passwords are hashed with scrypt, sessions are HMAC-signed `httpOnly` cookies (`src/server/security.ts`).
- Every AI endpoint (`build`, `targeted-update`, `revise`, `plan`, `validate`, `test-connection`) now requires login. The expensive ones (Gemini calls) are also rate limited: `AI_RATE_LIMIT` per user per 10 minutes (default 30).
- Projects belong to their owner (`ownerId`). Nobody can list, read, edit or delete another user's projects.
- Same-origin check on all state-changing `/api` requests, request body limit 50 MB -> 10 MB, prompt length capped at 4000 characters.
- GitHub and Vercel tokens are kept in `sessionStorage` (cleared when the tab closes) instead of `localStorage`.
- Cloudflare account id is validated before it is placed in a URL.
- User input in generated demo apps is escaped before `innerHTML`.

## Honesty / reliability
- AI fallback: when Gemini fails, `/api/ai/build` now returns `fallback: true`, `modelUsed: 'template-fallback'` and a clear message, instead of pretending the AI built it.
- Removed fake integrations: no fake GitHub/Vercel user, no always-green "Verify" buttons. Supabase check calls the real REST endpoint. Firebase is saved but not verified. GitHub push and Vercel deploy are labelled as demos.
- Removed the fake "Google Identity" login button and the hard-coded `plan: 'pro'` and credits.

## Production
- `npm start` now sets `NODE_ENV=production` (cross-env) so it serves `dist/` instead of the Vite dev server. Run `npm run build` first.
- `SESSION_SECRET` is required in production (see `.env.example`).
- `esbuild` and `tsx` moved to `dependencies` (the server needs them at runtime).
- Data now lives in `.data/` (git-ignored), written atomically and debounced. Old `.fursad_projects_db.json` data has no owner and is not loaded.
- Removed unused `clsx` and `tailwind-merge`, removed dead `getAiClient`.

## Not changed (needs your decision)
- GitHub push and Vercel deploy are still simulations (labelled).
- `src/lib/ai/api.ts` calls `/api/ai/generate-file`, which does not exist on the server.
- `framer-motion` and `motion` are both installed, `mockApi.ts` is unused, and `AuthScreen.tsx` and `components/LandingPage.tsx` look unused (duplicates).
- JSON file storage is not suitable for multiple servers or serverless hosting; use a real database.
- Password reset by email is not implemented.

## OpenRouter (added)
- New provider `openrouter` (types, adapter, test-connection, JSON dispatcher) in `src/server/aiAdapters.ts`.
- `GET /api/ai/openrouter/models` returns every model OpenRouter offers (live list, cached 1 hour). Both model pickers (create screen and AI settings) show the full list, with search in the settings panel.
- The key is read from `OPENROUTER_API_KEY` in your local `.env` (server-side only, never sent to the browser) or entered by the user as BYOK.
- `agenticEngine.ts`: any provider other than Gemini now runs a single-shot JSON workflow, so OpenRouter/OpenAI/Groq/Anthropic/Cloudflare builds and edits no longer get sent to Gemini with the wrong key.

## Prompt-understanding fixes (added)
- The Gemini agent had a 3.5 second timeout per turn, so almost every real build timed out and silently fell back to a template. It is now 90 seconds.
- The explanation language now follows the `language` setting (it was hard-coded to Somali), and the website text follows the language of the user's prompt.
- When the engine falls back to a template it now says so (`fallback: true`, `modelUsed: 'template-fallback'`, warning in the message).

## Still open
- The keyword matcher in `src/data/projectGenerator.ts` (fallback only) still uses substring matching (for example "booking" matches "book" and becomes a bookshop).
- Never commit `.env`. If a key was ever pasted in a chat or ticket, rotate it at https://openrouter.ai/keys.

## No templates (added)
- Removed every template and every silent fallback: `domainTemplates.ts`, `projectGenerator.ts`, `initialProject.ts`, `mockApi.ts`, the Templates page and its menu entries, the server-side "resilient synthesizer", the engine's template website and the deterministic regex patcher.
- New projects start empty (`src/lib/newProject.ts`) and the AI writes a real website for the exact request. If the AI fails you now get a clear error message instead of a fake website.
- The first build now sends the project's chosen provider/model (`aiConfig`); before, it was ignored.
- With only `OPENROUTER_API_KEY` set (no Gemini key), the server uses OpenRouter automatically (`OPENROUTER_DEFAULT_MODEL`, default `openrouter/auto`).
- Check the connection: server log at startup (`[OpenRouter] OK ...`) and `GET /api/ai/openrouter/status` (signed in).
- `.env` is included in this zip for local testing. It is git-ignored. Remove or replace the key before sharing the zip or deploying, and rotate it at https://openrouter.ai/keys.

## Automatic provider choice (added)
- You can choose Gemini (built-in key) or any OpenRouter model in the model selector (grouped: Gemini / OpenRouter) and in AI Settings.
- If the chosen one does not respond, the other is used automatically: chosen model -> the other built-in provider -> OpenRouter Auto Router. The chat message says which one answered. If all fail you get one clear error listing every reason (no template).
- A provider is only tried if a key exists for it (`GEMINI_API_KEY` or `OPENROUTER_API_KEY` in `.env`, or the user's own key). The user's own key is never sent to a different provider.
- Applies to creating, editing and targeted updates (`getProviderCandidates` in `src/server/aiAdapters.ts`, `executeAgenticWorkflow` in `src/server/agenticEngine.ts`).

## Model lists (added)
- New shared hook `src/lib/useModelCatalog.ts` loads the Gemini models and every OpenRouter model once and shares them.
- All three places that show models now list the same groups: Gemini, your own key (OpenAI, Claude, Cloudflare) and OpenRouter (all models): the create screen, the builder's Chat settings drawer, and AI Settings (provider cards with search).
