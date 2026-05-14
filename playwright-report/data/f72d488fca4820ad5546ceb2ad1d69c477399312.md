# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: social/messages-posts.spec.ts >> Messaging >> messages page renders conversation list
- Location: e2e/social/messages-posts.spec.ts:9:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByPlaceholder(/search conversations/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByPlaceholder(/search conversations/i)

```

```yaml
- navigation:
  - link "Gear Up Logo":
    - /url: /
    - img "Gear Up Logo"
  - navigation "Primary":
    - list:
      - listitem:
        - link "Home":
          - /url: /
      - listitem:
        - link "Discover":
          - /url: /post/discover
  - link "Sign In":
    - /url: /auth/login
    - button "Sign In"
- text: User id is not provide
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { loginAsUser } from "../pages/shared";
  3  | 
  4  | test.describe("Messaging", () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await loginAsUser(page);
  7  |   });
  8  | 
  9  |   test("messages page renders conversation list", async ({ page }) => {
  10 |     await page.goto("/messages");
  11 | 
  12 |     await expect(
  13 |       page.getByPlaceholder(/search conversations/i),
> 14 |     ).toBeVisible({ timeout: 5000 });
     |       ^ Error: expect(locator).toBeVisible() failed
  15 |   });
  16 | });
  17 | 
  18 | test.describe("Posts", () => {
  19 |   test.beforeEach(async ({ page }) => {
  20 |     await loginAsUser(page);
  21 |   });
  22 | 
  23 |   test("discover feed renders posts", async ({ page }) => {
  24 |     await page.goto("/post/discover");
  25 | 
  26 |     // The discover page shows posts from all users
  27 |     await expect(page.getByText(/check out this amazing car/i)).toBeVisible({
  28 |       timeout: 8000,
  29 |     });
  30 |   });
  31 | 
  32 |   test("post detail page shows content", async ({ page }) => {
  33 |     await page.goto("/post/post-1");
  34 | 
  35 |     await expect(
  36 |       page.getByText(/check out this amazing car/i),
  37 |     ).toBeVisible({ timeout: 8000 });
  38 |   });
  39 | });
  40 | 
```