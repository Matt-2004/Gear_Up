# Gear Up — Frontend

The Next.js 16+ frontend for the Gear Up platform. Gear Up connects car buyers, dealers, and administrators in a single marketplace — offering car listings, appointments, community posts, real-time messaging, and a KYC verification workflow.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Environment Variables](#environment-variables)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Architecture Overview](#architecture-overview)
7. [Data Flows](#data-flows)
   - [Authentication Flow](#1-authentication-flow)
   - [Token Refresh Flow](#2-token-refresh-flow)
   - [User Data Flow](#3-user-data-flow)
   - [Route Protection & RBAC Flow](#4-route-protection--rbac-flow)
   - [Form Submission Flow](#5-form-submission-flow)
   - [API Call Flow](#6-api-call-flow)
8. [Roles & Permissions](#roles--permissions)
9. [Key Custom Hooks](#key-custom-hooks)
10. [Cookie Architecture](#cookie-architecture)
11. [Testing](#testing)

---

## Tech Stack

| Category                | Library                      |
| ----------------------- | ---------------------------- |
| Framework               | Next.js 16+ (App Router)     |
| Language                | TypeScript                   |
| Styling                 | Tailwind CSS                 |
| State Management        | Redux Toolkit                |
| Server State / Fetching | React Query (TanStack Query) |
| Form Validation         | Zod                          |
| HTTP Client             | Axios                        |
| Authentication          | NextAuth.js (OAuth)          |
| Animations              | Framer Motion                |
| Utilities               | clsx                         |
| Testing                 | Jest + React Testing Library |

---

## Prerequisites

- Node.js 18+
- A running instance of the [GearUp backend](../backend/GearUp) (default: `http://localhost:5000`)
- Environment variables configured (see below)

---

## Environment Variables

Create a `.env.local` file in the `gear-up/` directory:

```env
# URL of the GearUp .NET backend API
NEXT_PUBLIC_API_KEY=http://localhost:5000

# 32-character secret key for AES-256-GCM cookie encryption
COOKIE_ENCRYPTION_KEY=your-32-character-secret-key-here

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

> **`COOKIE_ENCRYPTION_KEY`** must be exactly 32 bytes. It is used to AES-256-GCM encrypt the `user_data` httpOnly cookie so that profile data is never exposed to the client in plaintext.

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
gear-up/src/
├── app/                        # Next.js App Router pages & API routes
│   ├── api/
│   │   ├── auth/               # NextAuth route handler
│   │   │   ├── login/          # POST /api/auth/login — calls authAPI
│   │   │   └── register/       # POST /api/auth/register — calls authAPI
│   │   ├── token/              # Token refresh endpoints
│   │   └── user/               # GET /api/user — decrypts user_data cookie
│   ├── auth/                   # Auth pages (login, register, email, password)
│   │   ├── hooks/
│   │   │   └── useAuthToast.ts # Independent toast notification hook
│   │   └── useAuthForm.ts      # Form state, Zod validation, submit handler
│   ├── car/                    # Car detail and search pages
│   ├── hooks/                  # App-wide custom hooks (useToast, useFormData, …)
│   ├── post/                   # Community post pages
│   ├── profile/
│   │   ├── admin/              # Admin dashboard (requires Admin role)
│   │   ├── dealer/             # Dealer dashboard (requires Dealer role)
│   │   └── user/               # User profile page
│   ├── types/                  # TypeScript type/interface definitions (14 files)
│   ├── layout.tsx              # Root layout — mounts all global providers
│   └── page.tsx                # Home page
│
├── components/                 # Reusable UI components
│   ├── Admin/
│   ├── Appointment/
│   ├── Car/
│   ├── Common/
│   ├── Dealer/
│   ├── Messaging/
│   └── Navbar/
│
├── Context/                    # React context providers
│   ├── AdminCarFilterContext.tsx
│   ├── AdminKycFilterContext.tsx
│   ├── NotificationContext.tsx
│   └── UserDataContext.tsx     # Provides decrypted user profile app-wide
│
├── lib/                        # Redux store, slices, shared config
│   ├── config.ts               # NEXT_PUBLIC_API_KEY + DEFAULT_API_URL
│   ├── Store.ts                # Redux store setup
│   ├── hooks.ts                # Typed useAppDispatch / useAppSelector
│   ├── SignOut.ts              # Sign-out helper (clears cookies + Redux)
│   └── Features/
│       └── userSlice.ts        # Redux user state slice
│
├── provider/                   # Thin provider wrappers
│   ├── NextAuthSessionProvider.tsx
│   └── ReactQueryProvider.tsx
│
├── store/
│   └── auth/
│       └── authSlice.ts        # Auth state (isAuthenticated, role, …)
│
├── utils/
│   ├── API/                    # All Axios-based API calls
│   │   ├── AxiosClient.ts      # Axios instance + getFetch/postFetch/putFetch/…
│   │   ├── AuthAPI.ts
│   │   ├── CarAPI.ts
│   │   ├── PostAPI.ts
│   │   ├── MessageAPI.ts
│   │   └── …
│   ├── Auth/                   # Auth-specific server-side utilities
│   │   ├── authAPI.ts          # Login/register orchestrator (server action)
│   │   ├── authFetchAPI.ts     # Low-level auth HTTP POST with error handling
│   │   ├── CookieIntegration.ts# Sets access_token, refresh_token, user_data cookies
│   │   └── ResponseError.ts    # Custom error class carrying HTTP status
│   ├── User/
│   │   └── UserFetch.ts        # Fetches the authenticated user profile from backend
│   ├── cookieHelper.ts         # Server-side decrypt helpers for middleware
│   ├── encryption.ts           # AES-256-GCM encrypt / decrypt via Web Crypto API
│   ├── getClientCookie.ts      # Client-side cookie reader (non-httpOnly cookies)
│   ├── parseSetCookieHeader.ts # Parses Set-Cookie headers from proxy responses
│   ├── timeFormat.ts           # Date/time formatting utilities
│   └── SVG.tsx                 # Shared SVG icon components
│
└── proxy.ts                    # Next.js middleware — route protection & RBAC
```

---

## Architecture Overview

```
Browser
  │
  ├─► Next.js Middleware (proxy.ts)     ← runs on every non-static request
  │       │ reads cookies, checks roles, refreshes tokens
  │       ▼
  ├─► Next.js App Router (pages / layouts)
  │       │
  │       ├─► Server Actions / API Route Handlers
  │       │       │ authAPI, /api/user, /api/auth/*
  │       │       ▼
  │       │   GearUp .NET Backend  ←──► Database
  │       │
  │       └─► Client Components
  │               │
  │               ├─► UserDataContext  (reads /api/user → decrypted profile)
  │               ├─► Redux Store      (auth state, user slice)
  │               ├─► React Query      (server state / caching)
  │               └─► Axios (AxiosClient) → GearUp .NET Backend
```

**Provider stack** (outermost → innermost, from `layout.tsx`):

```
StoreProvider (Redux)
  └─ ReactQueryProvider
       └─ NextAuthSessionProvider
            └─ UserDataProvider
                 └─ NotificationProvider
                      └─ {children} (pages)
```

---

## Data Flows

### 1. Authentication Flow

Triggered when a user submits the Login or Register form.

```
[Browser Form]
      │  onSubmit → new FormData(e.currentTarget)
      ▼
[Login.tsx / Register.tsx]
      │  try { await handleFormSubmit(formData) } catch { showErrorToast() }
      ▼
[useAuthForm.ts :: handleSubmit()]
      │  setIsPending(true) → await submit(formData) → finally setIsPending(false)
      │  errors re-thrown so the component catch block fires
      ▼
[/api/auth/login  (Next.js Route Handler)]  ← server boundary
      │  calls authAPI(url, payload)
      ▼
[authAPI.ts]  ← "use server"
      │
      ├─1─► authFetchAPI(url, payload)
      │         │  POST {DEFAULT_API_URL}/api/v1/auth/login
      │         │  checks res.ok → throws ResponseError on 4xx/5xx
      │         └─► returns AuthResponse<AuthItem> { accessToken, refreshToken }
      │
      ├─2─► token_integration(res.data)
      │         │  sets httpOnly cookies:
      │         │    access_token   (maxAge: 5 min)
      │         │    refresh_token  (maxAge: 7 days)
      │         └─► via next/headers cookies()
      │
      ├─3─► UserFetch()
      │         └─► GET /api/v1/users/me  (with access_token)
      │             returns full UserItem profile
      │
      ├─4─► encrypt(userProfile)
      │         │  AES-256-GCM via Web Crypto API
      │         │  key = COOKIE_ENCRYPTION_KEY (padded to 32 bytes)
      │         │  returns "ivHex:ciphertextHex"
      │         └─► format: 24-char IV hex + ":" + ciphertext hex
      │
      └─5─► user_data_integration(encryptedString)
                │  sets httpOnly cookie:
                │    user_data  (maxAge: 7 days, plain encrypted string)
                └─► stored as-is (no extra JSON.stringify)

[Back in Login.tsx]
      ├─ success → showSuccessToast() → router.push("/")
      └─ catch (ResponseError) → showErrorToast(error.message)
```

---

### 2. Token Refresh Flow

Handled transparently in the Next.js middleware before the page renders.

```
[Every request via proxy.ts]
      │
      ├─ reads: access_token, refresh_token, user_data cookies
      │
      ├─ [access_token present] ──► proceed to RBAC checks (see §4)
      │
      └─ [no access_token, but refresh_token present]
              │
              ▼
         POST {BACKEND_API_URL}/api/v1/auth/refresh
              │  body: refresh_token
              │
              ├─ [res.ok]
              │     sets new access_token  (maxAge: 5 min)
              │     sets new refresh_token (maxAge: 7 days)
              │     └─► NextResponse.next() with updated cookies
              │
              └─ [!res.ok]
                    deletes access_token, refresh_token, user_data cookies
                    └─► redirect to "/"
```

---

### 3. User Data Flow

How the decrypted user profile reaches every client component.

```
[proxy.ts / server actions]
      │  reads user_data cookie (httpOnly — only readable server-side)
      │  calls getDecryptedFullUserData(cookie) → cookieHelper.ts → decrypt()
      └─► UserItem { id, email, role, name, … }

[Client side — on app mount]
      │
      ▼
[UserDataContext.tsx]
      │  useEffect → fetch("/api/user")
      ▼
[GET /api/user  (Next.js Route Handler)]
      │  reads user_data cookie via next/headers cookies()
      │  await decrypt(cookie)  ← AES-256-GCM decryption
      └─► returns { data: UserItem, message: "…" }

[UserDataContext.tsx]
      │  setUser(response.data)
      └─► provides { user: UserItem | null, loading: boolean }
              via useUserData() hook to all client components
```

---

### 4. Route Protection & RBAC Flow

Every page request passes through `proxy.ts` middleware.

```
[Incoming Request]
      │
      ▼
[proxy.ts]
      │
      ├─ isPublicRoute(path)?
      │   PUBLIC_ROUTES: /, /auth/login, /auth/register, /auth/password,
      │                  /auth/email, /car/search, /post/discover, /verify
      │   └─ YES → NextResponse.next()  (no auth required)
      │
      ├─ /profile/admin/login → always allow
      │
      ├─ no tokens + protected route → redirect to "/"
      │
      ├─ [has tokens] → getDecryptedFullUserData(user_data cookie)
      │       │
      │       ├─ role === "Dealer"
      │       │     └─ redirect to /profile/dealer?tab=dashboard
      │       │        (unless path is /messages)
      │       │
      │       ├─ role === "Admin" + not on /profile/admin/*
      │       │     └─ redirect to /profile/admin?tab=dashboard
      │       │
      │       ├─ path starts with /profile/admin
      │       │     ├─ no user_data cookie → redirect to "/"
      │       │     ├─ role === "Admin" → allow
      │       │     └─ role !== "Admin" → redirect to /unauthorized
      │       │
      │       └─ otherwise → NextResponse.next()
      │
      └─ [token refresh] → see §2
```

---

### 5. Form Submission Flow

The auth form system is split into two independent hooks.

```
[Auth Page Component]  e.g. Login.tsx
      │
      ├─ useAuthToast({ onSuccess: { message }, onError: { message } })
      │     └─► { ToastComponent, showSuccessToast, showErrorToast, … }
      │
      ├─ useAuthForm(initialData, zodSchema, submitFn)
      │     └─► { handleSubmit, formData, setFormData, errors, isPending, isButtonActive }
      │
      └─ local handleSubmit:
            try {
              await handleFormSubmit(formData)   // from useAuthForm
              showSuccessToast()                  // from useAuthToast
              router.push(redirectPath)
            } catch (error) {
              showErrorToast(error.message)       // from useAuthToast
            }

[useAuthForm.ts :: handleSubmit()]
      │  setIsPending(true)
      │  await submit(formData)    ← errors bubble up; NOT caught here
      └─  finally: setIsPending(false)

[useAuthToast.ts]
      │  wraps useToast() (app-wide toast engine)
      │  showSuccessToast(msg?) → addToastMessage("success", msg)
      └─  showErrorToast(msg?)  → addToastMessage("error",   msg)
```

> **Key rule**: Use `onSubmit` (not `action=`) on the `<form>` element. The `action=` prop swallows async errors inside React transitions; `onSubmit` with `e.preventDefault()` propagates them correctly.

---

### 6. API Call Flow

For all data after authentication (cars, posts, appointments, messages, etc.).

```
[Client Component / Server Action]
      │  imports getFetch / postFetch / putFetch / deleteFetch / patchFetch
      ▼
[AxiosClient.ts]  ← "use server"
      │  reads access_token from httpOnly cookie (server-side via next/headers)
      │  attaches Authorization: Bearer <access_token> header
      ▼
[Axios instance]  baseURL = NEXT_PUBLIC_API_KEY (e.g. http://localhost:5000)
      ▼
[GearUp .NET Backend]  → processes request → returns response
      │
      └─ errors: thrown up to the caller (React Query / component try/catch)
```

Specific API modules in `src/utils/API/`:

| Module               | Responsibility                  |
| -------------------- | ------------------------------- |
| `CarAPI.ts`          | Car listings CRUD               |
| `PostAPI.ts`         | Community posts CRUD + comments |
| `AppointmentAPI.ts`  | Booking and scheduling          |
| `MessageAPI.ts`      | Real-time messaging             |
| `NotificationAPI.ts` | Push notification reads         |
| `ReviewAPI.ts`       | Dealer reviews                  |
| `AdminAPI.ts`        | Admin KYC + user management     |
| `UserAPI.ts`         | User profile updates            |

---

## Roles & Permissions

| Role                | Default Redirect                | Protected Prefix  | Notes                                                   |
| ------------------- | ------------------------------- | ----------------- | ------------------------------------------------------- |
| **User** (customer) | Stays on requested page         | —                 | Default role after registration                         |
| **Dealer**          | `/profile/dealer?tab=dashboard` | `/profile/dealer` | Redirected by middleware unless on `/messages`          |
| **Admin**           | `/profile/admin?tab=dashboard`  | `/profile/admin`  | Non-admins hitting `/profile/admin/*` → `/unauthorized` |

---

## Key Custom Hooks

### `useAuthForm<T>(initialData, schema, submitFn)`

Located: `src/app/auth/useAuthForm.ts`

Manages form state, Zod validation, and submission lifecycle.

| Return           | Type                     | Description                                  |
| ---------------- | ------------------------ | -------------------------------------------- |
| `formData`       | `T`                      | Current form field values                    |
| `setFormData`    | `Dispatch`               | Update form values                           |
| `errors`         | `Record<string, string>` | Per-field validation errors from Zod         |
| `isPending`      | `boolean`                | `true` while `submitFn` is awaiting          |
| `isButtonActive` | `boolean`                | `true` only when schema validation passes    |
| `handleSubmit`   | `(FormData) => Promise`  | Wraps `submitFn`; re-throws errors to caller |

---

### `useAuthToast(config)`

Located: `src/app/auth/hooks/useAuthToast.ts`

Independent toast hook for auth pages. Decoupled from `useAuthForm`.

| Return                   | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `ToastComponent`         | JSX element — render in the page to display toasts |
| `showSuccessToast(msg?)` | Shows a green success toast                        |
| `showErrorToast(msg?)`   | Shows a red error toast                            |
| `showInfoToast(msg)`     | Shows a blue info toast                            |
| `hideToast()`            | Hides the active toast after 2.5s                  |

---

### `useUserData()`

Located: `src/Context/UserDataContext.tsx`

Provides the decrypted user profile to any client component.

```tsx
const { user, loading } = useUserData();
// user: UserItem | null
// loading: boolean
```

---

## Cookie Architecture

| Cookie          | HttpOnly | Secure | Max Age   | Content                               |
| --------------- | -------- | ------ | --------- | ------------------------------------- |
| `access_token`  | ✅       | ✅     | 5 minutes | JWT access token                      |
| `refresh_token` | ✅       | ✅     | 7 days    | JWT refresh token                     |
| `user_data`     | ✅       | ✅     | 7 days    | AES-256-GCM encrypted `UserItem` JSON |

### `user_data` encryption format

```
{stored value} = ivHex + ":" + ciphertextHex

ivHex         — 24 hex chars (12-byte random IV)
ciphertextHex — AES-256-GCM encrypted JSON.stringify(UserItem)
```

- Key derivation: `COOKIE_ENCRYPTION_KEY` env var, padded/truncated to 32 bytes via `TextEncoder`
- Algorithm: `AES-GCM` via `crypto.subtle` (Web Crypto API — runs in Node.js Edge runtime)
- Decryption: `cookieHelper.ts → getDecryptedFullUserData()` (used in middleware) and `GET /api/user` (used client-side via context)

---

## Testing

```bash
npm run test          # run all tests
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

Test files live alongside source in `**/__tests__/` directories or as `*.test.ts(x)` files. See `TESTING.md` for conventions and `jest.config.ts` for configuration.
