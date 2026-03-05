<!-- Copilot instructions for AI coding agents working on the Gear_Up repo -->

## Summary

- This is a Next.js (app-router) TypeScript project using Tailwind, Redux Toolkit, React Query, and NextAuth.
- Primary source tree: `src/` — app pages & API routes under `src/app`, UI under `src/components`, shared logic under `src/lib`, providers under `src/provider`, and utilities under `src/utils`.

## What to know up front

- App router: pages and API routes live in `src/app`. Be aware of server vs client components — look for `"use client"` at the top of files.
- Authentication flow: token handling and refresh logic is central. See `src/app/api/auth/*`, `src/app/auth/helper.ts`, and helpers in `src/utils` such as `parseSetCookieHeader.ts`, `getRefreshToken.ts` and `getClientCookie.ts`.
- Providers: the app wraps with `src/provider/NextAuthSessionProvider.tsx` and `src/provider/ReactQueryProvider.tsx`. Use these rather than adding ad-hoc providers.
- State: global state is via Redux Toolkit. Key slices live in `src/lib/Features/authSlice.ts` and `src/store/auth/authSlice.tsx`.
- Data fetching: Prefer React Query (`@tanstack/react-query`). See `src/lib/hooks.ts` and `src/provider/ReactQueryProvider.tsx` for patterns.

## Developer workflows & commands

- Start dev server: `npm run dev` (script uses Turbopack). Other package managers supported: `yarn dev`, `pnpm dev`, `bun dev`.
- Build: `npm run build` (uses Turbopack flags). Start production: `npm run start`.
- Lint: `npm run lint`.
- Tests: `npm run test` (Jest). For TDD: `npm run test:watch`.

## Project-specific conventions

- Components folder structure: grouped by feature (e.g., `src/components/Admin`, `src/components/Car`, `src/components/Navbar`). Follow existing folder/module layouts.
- Actions & forms: server-side actions are in `src/app/.../action.ts` (see `src/app/auth/register/action.ts` and `src/app/auth/login/action.ts`). Keep action logic co-located with the page.
- Hooks: custom hooks live under `src/app/hooks` and `src/lib/hooks.ts` — prefer these for shared behavior (e.g., `useToast.tsx`, `useFormData.ts`).
- Types: central TypeScript types are under `src/app/types` and `src/app/types/*.ts`. Import these rather than redefining types.
- Utilities: HTTP and cookie helpers are in `src/utils` (e.g., `FetchAPI.ts`, `parseSetCookieHeader.ts`). Use these to keep cookie/token handling consistent.

## Auth & token flow (important)

- The project uses access + refresh tokens with middleware-like logic (see README notes). When access token is missing but a refresh token exists, the app regenerates access tokens via API endpoints under `src/app/api/auth`.
- Key files: `src/app/api/auth/*`, `src/app/auth/helper.ts`, `src/utils/getRefreshToken.ts`, `src/utils/parseSetCookieHeader.ts`.
- When modifying auth flows, ensure cookies set by server endpoints are parsed by `parseSetCookieHeader.ts` and that providers (`NextAuthSessionProvider`) remain consistent.

## Patterns & examples (copyable snippets)

- Data fetching with React Query: use hooks and `QueryClient` provided in `src/provider/ReactQueryProvider.tsx`.
- Login action example: `src/app/auth/login/action.ts` — follow its pattern for server actions (validate input, call API util, set cookies via helper).

## Integration & external dependencies

- NextAuth: configured and wrapped in `NextAuthSessionProvider.tsx`.
- Redux Toolkit and React Query are both used; prefer React Query for server state and RTK for client UI state.
- Tailwind + PostCSS configured; keep classes consistent with existing UI.

## Testing & safety

- Jest is configured (`jest.config.ts`). Tests live alongside components when present — follow current conventions if you add tests.

## When editing code

- Preserve existing directory structure and naming. Follow the example files for patterns rather than introducing new paradigms.
- For UI changes, prefer reusing components in `src/components/*`.
- For auth/cookie changes, update `src/utils/*` helpers and `NextAuthSessionProvider.tsx` together.

## Files to inspect for context

- `src/app` — pages, api routes, and auth flows
- `src/components` — reusable UI components
- `src/lib/Features/authSlice.ts` and `src/store/auth/authSlice.tsx` — Redux state
- `src/provider/NextAuthSessionProvider.tsx`, `src/provider/ReactQueryProvider.tsx`
- `src/utils/FetchAPI.ts`, `src/utils/parseSetCookieHeader.ts`, `src/utils/getRefreshToken.ts`
- `package.json`, `README.md`, `jest.config.ts`, `next.config.ts`

## If unclear, ask the maintainer

- Ask about intended client vs server component boundaries when in doubt.
- Confirm token cookie names or domain/secure policy before changing cookie helpers.

End of instructions
