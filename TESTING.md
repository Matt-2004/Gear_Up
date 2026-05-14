# Test Documentation

## Running Tests

### Static Analysis

Run TypeScript type checking before tests:

```bash
npm run typecheck
npm run lint
```

### Unit & Integration Tests (Jest)

Run all Jest tests:

```bash
npm test
npm run test:watch
npm test -- --coverage
```

### E2E Tests (Playwright)

Run all E2E tests:

```bash
npm run test:e2e
```

Run in interactive UI mode:

```bash
npm run test:e2e:ui
```

Run a specific feature:

```bash
npx playwright test --grep "Car Search"
```

View the HTML report:

```bash
npx playwright show-report
```

The E2E test suite requires Playwright browsers installed:

```bash
npx playwright install --with-deps chromium
```

---

## Test Structure

### Unit Tests (Jest)

Test files are co-located with their components/modules and follow the naming convention `ComponentName.test.tsx` or `ModuleName.test.ts`.

Jest is configured to ignore the `e2e/` directory via `testPathIgnorePatterns` in `jest.config.ts`.

### E2E Tests (Playwright)

All E2E tests live under `e2e/` at the project root:

```
e2e/
├── auth/              # Auth flow specs (sign-in, sign-up, reset-password, email-verification)
├── cars/              # Car browsing, search, detail, and appointment specs
├── dealer/            # Dealer inventory, KYC registration, and appointment management specs
├── admin/             # Admin login, car verification, and KYC verification specs
├── social/            # Messaging and posts specs
├── mocks/
│   └── server.mjs     # Lightweight mock backend server
└── pages/             # Page Object Models (POMs) shared across specs
```

#### Page Object Models

Each feature area has a dedicated page object in `e2e/pages/` that encapsulates selectors and actions:

- `login.page.ts` — Login form
- `register.page.ts` — Registration form
- `car-browsing.page.ts` — Landing page, search page, car detail page
- `appointment.page.ts` — Appointment booking form
- `dealer-inventory.page.ts` — Dealer inventory dashboard
- `admin.page.ts` — Admin login and navigation
- `shared.ts` — Shared helpers (`loginAsUser()`, `assertToast()`, `waitForUrl()`)

#### Mock Backend

The E2E tests use a mock HTTP server (`e2e/mocks/server.mjs`) on port 5555 instead of hitting the real backend API. Key behaviors:

- Different test emails trigger different responses (e.g., `wrong@test.com` → 401, `unverified@test.com` → 403)
- Car data is generated procedurally for search, detail, and inventory endpoints
- Auth tokens, user profiles, and CRUD operations return controlled responses

The Playwright config starts the mock server and the Next.js dev server automatically via the `webServer` array in `playwright.config.ts`, with `NEXT_Backend_URL` set to `http://localhost:5555`.

#### data-testid Convention

Interactive elements in production components use `data-testid` attributes for stable selectors, following the pattern established by the auth pages:

- Car components: `car-card`, `car-title`, `car-price`, `view-details`, `search-input`, `search-button`, `gallery-prev`, `gallery-next`, `get-appointment`
- Dealer components: `dealer-dashboard-header`, `add-vehicle-button`, `stat-card`
- Appointment form: `appointment-date`, `appointment-time`, `appointment-location`, `appointment-notes`, `appointment-submit`

---

## Current Test Coverage

### Unit Tests (Jest) — 261 tests

- ✅ Auth components (sign-in, sign-up, reset password, email validation)
- ✅ Auth hooks and server actions (useSignIn, useSignUp, useResetPassword, signInAction, etc.)
- ✅ Shared utilities (debounce, KYC filter, number formatter, time format, appointment utils)
- ✅ Dealer dashboard components (StatsCard, DashboardHeader, FilterDropdown, CarList, CarCard, EmptyInventory)
- ✅ Dealer car dashboard integration
- ✅ Appointment hooks (useAppointmentActions, useAppointmentReviews)
- ✅ KYC registration context (KycFormContext — step validation, localStorage, API submission)

### E2E Tests (Playwright) — 43 tests passing

| Feature               | Spec File                             | Tests |
| --------------------- | ------------------------------------- | ----- |
| Sign In               | `e2e/auth/sign-in.spec.ts`            | 7     |
| Sign Up               | `e2e/auth/sign-up.spec.ts`            | 7     |
| Email Validation      | `e2e/auth/email-verification.spec.ts` | 5     |
| Reset Password        | `e2e/auth/reset-password.spec.ts`     | 5     |
| Car Browsing & Search | `e2e/cars/browsing.spec.ts`           | 14    |
| Appointment Booking   | `e2e/cars/appointment.spec.ts`        | 4     |
| Admin Login           | `e2e/admin/admin.spec.ts`             | 1     |

**Pending (needs role config):** dealer inventory (3), KYC registration (3), dealer appointments (2), admin car/KYC verification (2), messaging (1), posts (3) — 14 tests written, awaiting mock user role update.

---

## Mocking Strategy

### Unit Tests (Jest)

- **next/link**: Mocked to render simple anchor tags
- **Custom hooks**: Mocked when testing component rendering in isolation
- **API actions**: Mocked to return controlled responses
- **next/navigation**: `useSearchParams`, `useRouter` mocked

### E2E Tests (Playwright)

- **Backend API**: Fully mocked via `e2e/mocks/server.mjs` (Node HTTP server)
- **No browser-level route interception needed** — server actions go through the mock
- **Auth state**: Login via the real UI flow, which sets httpOnly cookies through server actions

---

## Best Practices

1. **Isolation**: Each test is independent; `beforeEach`/`afterEach` ensure clean state
2. **Selector stability**: Prefer `data-testid` over text or class selectors
3. **Mock fidelity**: Mock server responses match real API shapes (DTO types)
4. **No hardcoded waits**: Use `waitForURL`, `toBeVisible` with timeouts instead of `page.waitForTimeout`
5. **Page Objects**: Shared selectors live in page objects, not duplicated in specs

---

## Continuous Integration

All checks run on every push and pull request to `main` via `.github/workflows/Ci.yml`.

### Pipeline Flow

```txt
PUSH / PR to main
      │
      ▼
┌─────────────────┐
│  Checkout code  │  actions/checkout@v4
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Setup Node.js  │  actions/setup-node@v4 (Node 20, npm cache)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Install deps   │  npm ci
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌──────┐
│TypeCheck│ │Lint  │  Static analysis (parallel)
└───┬─────┘ └──┬───┘
    │         │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│   Unit Tests    │  Jest + React Testing Library
│                 │  --ci --coverage --maxWorkers=2
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Build       │  next build (production)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   E2E Tests     │  Playwright (Chromium)
│                 │  Mock backend on port 5555
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────┐
│  PASS  │ │  FAIL    │
│  ✅    | │  ❌       │
└────────┘ └────┬─────┘
                │
                ▼
         ┌──────────────────┐
         │ Upload artifacts │
         │ - coverage/      │
         │ - playwright-    │
         │   report/        │
         └──────────────────┘
```

### Step Details

| Step           | Command                                      | Purpose                                                                         | On Failure                                            |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Type check** | `npm run typecheck`                          | TypeScript compilation — catches type errors, missing exports, invalid props    | Blocks pipeline                                       |
| **Lint**       | `npm run lint`                               | ESLint — enforces code style, catches unused vars, hook violations              | Blocks pipeline                                       |
| **Unit tests** | `npm test -- --ci --coverage --maxWorkers=2` | Jest (260+ tests) — component rendering, hooks, utilities, auth actions         | Blocks pipeline; coverage report uploaded as artifact |
| **Build**      | `npm run build`                              | Production `next build` — verifies the app compiles with no route/config errors | Blocks pipeline                                       |
| **E2E tests**  | `npm run test:e2e`                           | Playwright (43+ tests) — full browser flows against mock backend                | Blocks pipeline; HTML report uploaded as artifact     |

### Triggers

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

### Environment Variables

The CI runner injects these at the job level:

| Variable              | Value                              |
| --------------------- | ---------------------------------- |
| `NEXT_Backend_URL`    | `https://gearup-1lj2.onrender.com` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000`            |

### Artifacts

- **Coverage report** (`coverage/`) — uploaded on every run, retained 7 days
- **Playwright report** (`playwright-report/`) — uploaded only on E2E failure, retained 7 days
