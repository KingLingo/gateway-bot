# Gateway Bot Full UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand and redesign every existing Sub2API frontend flow as the Chinese-first Gateway Bot AI API subscription service without changing routes, permissions, APIs, fields, or feature flags.

**Architecture:** Keep Vue business components and API contracts intact, then apply a new tokenized visual system through Tailwind and shared primitives so every page inherits the redesign. Replace the public and authentication shells, add a subscription-first dashboard composition using the existing subscription endpoints, and reshape the admin dashboard while preserving all data sources. Ship from a Gateway Bot fork and custom release channel so upstream binaries cannot overwrite the UI.

**Tech Stack:** Vue 3, TypeScript, Pinia, Vue Router, Vue I18n, Tailwind CSS 3, Vitest, Vite, Go, GitHub Actions, Playwright.

---

### Task 1: Baseline and Brand Contract

**Files:**
- Modify: `frontend/src/router/__tests__/title.spec.ts`
- Create: `frontend/src/__tests__/gatewayBotBrand.spec.ts`
- Modify: `frontend/src/router/title.ts`
- Modify: `frontend/src/stores/app.ts`
- Modify: `frontend/src/main.ts`
- Modify: `frontend/index.html`
- Modify: `frontend/src/views/public/LegalDocumentView.vue`
- Modify: `frontend/src/views/KeyUsageView.vue`
- Modify: `frontend/src/i18n/locales/zh/misc.ts`
- Modify: `frontend/src/i18n/locales/en/misc.ts`
- Modify: `frontend/src/i18n/locales/zh/dashboard.ts`
- Modify: `frontend/src/i18n/locales/en/dashboard.ts`
- Modify: `frontend/src/i18n/locales/zh/admin/settings.ts`
- Modify: `frontend/src/i18n/locales/en/admin/settings.ts`
- Modify: `frontend/src/i18n/locales/zh/landing.ts`
- Modify: `frontend/src/i18n/locales/en/landing.ts`

- [ ] **Step 1: Write failing default-brand tests**

```ts
it('uses Gateway Bot when no custom site name is configured', () => {
  expect(resolveDocumentTitle('控制台', '')).toBe('控制台 - Gateway Bot')
})

it('contains no user-visible Sub2API fallback', () => {
  for (const file of userVisibleFiles) {
    expect(readFileSync(file, 'utf8')).not.toMatch(/Sub2API/)
  }
})
```

- [ ] **Step 2: Verify RED**

Run: `corepack pnpm@10.28.0 --dir frontend vitest run src/router/__tests__/title.spec.ts src/__tests__/gatewayBotBrand.spec.ts`

Expected: FAIL because title and public UI fall back to `Sub2API`.

- [ ] **Step 3: Replace only user-visible defaults and copy**

Use `Gateway Bot` for default `siteName`, document title, setup copy, onboarding copy, public legal/key-usage headers, settings placeholders, and user-facing configuration examples. Preserve internal storage keys, WebSocket protocol names, API object identifiers, database defaults, filenames, and compatibility constants.

- [ ] **Step 4: Verify GREEN and feature tests**

Run: `corepack pnpm@10.28.0 --dir frontend vitest run src/router/__tests__/title.spec.ts src/__tests__/gatewayBotBrand.spec.ts src/router/__tests__/feature-access.spec.ts`

Expected: PASS; existing feature flag tests remain unchanged.

- [ ] **Step 5: Commit**

```bash
git add frontend/index.html frontend/src/router frontend/src/stores/app.ts frontend/src/main.ts frontend/src/views/public/LegalDocumentView.vue frontend/src/views/KeyUsageView.vue frontend/src/i18n frontend/src/__tests__/gatewayBotBrand.spec.ts
git commit -m "feat: establish Gateway Bot brand contract"
```

### Task 2: Design Tokens and Shared UI Primitives

**Files:**
- Modify: `frontend/tailwind.config.js`
- Modify: `frontend/src/style.css`
- Create: `frontend/src/assets/brand/gateway-g.svg`
- Create: `frontend/src/assets/fonts/README.md`
- Modify: `frontend/src/components/icons/Icon.vue`
- Modify: `frontend/src/components/common/Input.vue`
- Modify: `frontend/src/components/common/TextArea.vue`
- Modify: `frontend/src/components/common/Select.vue`
- Modify: `frontend/src/components/common/Toggle.vue`
- Modify: `frontend/src/components/common/StatusBadge.vue`
- Modify: `frontend/src/components/common/StatCard.vue`
- Modify: `frontend/src/components/common/DataTable.vue`
- Modify: `frontend/src/components/common/BaseDialog.vue`
- Modify: `frontend/src/components/common/EmptyState.vue`
- Create: `frontend/src/__tests__/gatewayBotDesignSystem.spec.ts`

- [ ] **Step 1: Write failing token and structure tests**

```ts
expect(tailwindSource).toContain("500: '#69B086'")
expect(tailwindSource).toContain("950: '#0F1512'")
expect(styleSource).toContain('--gb-surface: #fcfbf7')
expect(styleSource).toContain('@media (prefers-reduced-motion: reduce)')
expect(styleSource).not.toContain('@apply rounded-2xl')
expect(styleSource).not.toContain('bg-gradient-to-r from-primary-500')
```

- [ ] **Step 2: Verify RED**

Run: `corepack pnpm@10.28.0 --dir frontend vitest run src/__tests__/gatewayBotDesignSystem.spec.ts`

Expected: FAIL on missing Gateway Bot tokens and old rounded/gradient primitives.

- [ ] **Step 3: Implement the token system**

Map existing utility names to the approved palette so unchanged views inherit the design: `primary` becomes moss green, `dark` becomes olive-black surfaces, `gray` becomes warm neutral, cards become flat 6px bordered panels, controls become 4px, numeric values use tabular figures, focus rings remain visible, and semantic colors remain reserved for state. Add a local-first `Geist Variable`, `Noto Sans SC`, `PingFang SC` font stack and document the optional self-hosted font files without adding remote runtime dependencies.

- [ ] **Step 4: Refine shared components**

Remove decorative gradients, hover lift, oversized icon tiles, full-pill defaults, and nested card styling. Keep component props, emitted events, ARIA attributes, loading states, disabled states, and keyboard behavior unchanged.

- [ ] **Step 5: Verify GREEN**

Run: `corepack pnpm@10.28.0 --dir frontend vitest run src/__tests__/gatewayBotDesignSystem.spec.ts src/components/common/__tests__ src/components/layout/__tests__`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/tailwind.config.js frontend/src/style.css frontend/src/assets frontend/src/components/common frontend/src/components/icons frontend/src/__tests__/gatewayBotDesignSystem.spec.ts
git commit -m "feat: add Gateway Bot design system"
```

### Task 3: Public Home, Authentication, and Public Flows

**Files:**
- Modify: `frontend/src/views/__tests__/HomeView.compact.spec.ts`
- Create: `frontend/src/views/__tests__/HomeView.gateway.spec.ts`
- Modify: `frontend/src/views/HomeView.vue`
- Create: `frontend/public/images/gateway-architecture-desktop.jpg`
- Create: `frontend/public/images/gateway-architecture-mobile.jpg`
- Create: `frontend/public/images/gateway-access-detail.jpg`
- Modify: `frontend/src/i18n/locales/zh/landing.ts`
- Modify: `frontend/src/i18n/locales/en/landing.ts`
- Modify: `frontend/src/components/layout/AuthLayout.vue`
- Modify: `frontend/src/views/auth/LoginView.vue`
- Modify: `frontend/src/views/auth/RegisterView.vue`
- Modify: `frontend/src/views/auth/ForgotPasswordView.vue`
- Modify: `frontend/src/views/auth/ResetPasswordView.vue`
- Modify: `frontend/src/views/auth/EmailVerifyView.vue`
- Modify: `frontend/src/views/auth/*CallbackView.vue`
- Modify: `frontend/src/views/KeyUsageView.vue`
- Modify: `frontend/src/views/NotFoundView.vue`
- Modify: `frontend/src/views/setup/SetupWizardView.vue`

- [ ] **Step 1: Write failing public-home tests**

```ts
expect(wrapper.text()).toContain('让 AI 接入触手可及')
expect(wrapper.text()).toContain('订阅主流 AI API，统一管理密钥、用量与周期。接入从这里开始。')
expect(wrapper.find('.terminal-container').exists()).toBe(false)
expect(wrapper.find('a[href*="github.com/Wei-Shaw/sub2api"]').exists()).toBe(false)
expect(wrapper.find('[data-testid="home-docs"]').exists()).toBe(Boolean(settings.doc_url))
```

- [ ] **Step 2: Verify RED**

Run: `corepack pnpm@10.28.0 --dir frontend vitest run src/views/__tests__/HomeView.compact.spec.ts src/views/__tests__/HomeView.gateway.spec.ts`

Expected: FAIL because the old terminal and generic gateway copy still render.

- [ ] **Step 3: Build the asymmetric Chinese-first home**

Implement a full-bleed dark olive hero with locally hosted, open-license architectural photography, editorial typography, stable text contrast, and a visible hint of the next section. Produce desktop and mobile crops plus one supporting detail image, record source/license metadata, use the exact headline and supporting copy, preserve custom HTML/URL/compact-home precedence, preserve auth-aware CTA destinations, conditionally render docs, and remove GitHub promotion. Follow with a continuous three-step access path, subscription value panel, supported-model rail, observability section, and final API Key CTA.

- [ ] **Step 4: Rebuild authentication and public shells**

Replace orb/grid backgrounds and centered glass cards with a two-zone but non-card shell: branded editorial context and a restrained form surface. Keep every current field, OAuth method, captcha gate, callback state, validation message, feature switch, and destination. Localize hard-coded 404/footer UI into Chinese.

- [ ] **Step 5: Verify GREEN and auth behavior**

Run: `corepack pnpm@10.28.0 --dir frontend vitest run src/views/__tests__/HomeView.compact.spec.ts src/views/__tests__/HomeView.gateway.spec.ts src/views/auth/__tests__ src/components/auth/__tests__ src/components/__tests__/LoginForm.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/views/HomeView.vue frontend/src/views/__tests__ frontend/src/i18n/locales/*/landing.ts frontend/src/components/layout/AuthLayout.vue frontend/src/views/auth frontend/src/views/KeyUsageView.vue frontend/src/views/NotFoundView.vue frontend/src/views/setup/SetupWizardView.vue
git commit -m "feat: redesign public and authentication flows"
```

### Task 4: Application Shell and Subscription-First User Dashboard

**Files:**
- Modify: `frontend/src/components/layout/AppLayout.vue`
- Modify: `frontend/src/components/layout/AppHeader.vue`
- Modify: `frontend/src/components/layout/AppSidebar.vue`
- Modify: `frontend/src/components/layout/__tests__/AppSidebar.spec.ts`
- Create: `frontend/src/components/user/dashboard/__tests__/SubscriptionOverview.spec.ts`
- Create: `frontend/src/components/user/dashboard/SubscriptionOverview.vue`
- Modify: `frontend/src/views/user/DashboardView.vue`
- Modify: `frontend/src/components/user/dashboard/UserDashboardStats.vue`
- Modify: `frontend/src/components/user/dashboard/UserDashboardQuickActions.vue`
- Modify: `frontend/src/components/user/dashboard/UserDashboardCharts.vue`
- Modify: `frontend/src/components/user/dashboard/UserDashboardRecentUsage.vue`
- Modify: `frontend/src/i18n/locales/zh/dashboard.ts`
- Modify: `frontend/src/i18n/locales/en/dashboard.ts`

- [ ] **Step 1: Write failing subscription-priority tests**

```ts
expect(wrapper.get('[data-testid="subscription-overview"]').exists()).toBe(true)
expect(wrapper.get('[data-testid="subscription-overview"]').element.compareDocumentPosition(
  wrapper.get('[data-testid="account-assets"]').element
) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
expect(wrapper.text()).toContain('当前订阅')
```

- [ ] **Step 2: Verify RED**

Run: `corepack pnpm@10.28.0 --dir frontend vitest run src/components/user/dashboard/__tests__/SubscriptionOverview.spec.ts`

Expected: FAIL because the subscription overview does not exist.

- [ ] **Step 3: Implement the new application shell**

Use a compact 248px sidebar, grouped navigation, Gateway Bot wordmark, no version badge, no glow, a 64px quiet header, drawer navigation on mobile, and warm/olive content surfaces. Preserve collapse state, scroll restoration, custom menu SVG handling, all routes, role checks, announcement/theme/language/account actions, and onboarding selectors.

- [ ] **Step 4: Implement subscription-first dashboard**

Render `activeSubscriptions` from the existing Pinia store first, with group name, status, period, expiry, and available usage values. Add explicit empty/loading states and show the purchase route only when the existing payment/subscription feature flag allows it. Put key/use/redeem actions next, usage panels after that, and balance under `data-testid="account-assets"` as a secondary ledger strip.

- [ ] **Step 5: Verify GREEN**

Run: `corepack pnpm@10.28.0 --dir frontend vitest run src/components/user/dashboard src/components/layout/__tests__ src/stores/__tests__/subscriptions.spec.ts src/router/__tests__`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/layout frontend/src/components/user/dashboard frontend/src/views/user/DashboardView.vue frontend/src/i18n/locales/*/dashboard.ts
git commit -m "feat: prioritize subscriptions in the user workspace"
```

### Task 5: User Pages, Admin Workspace, and Full Shared Surface

**Files:**
- Modify: `frontend/src/views/user/*.vue`
- Modify: `frontend/src/views/admin/**/*.vue`
- Modify: `frontend/src/components/account/**/*.vue`
- Modify: `frontend/src/components/admin/**/*.vue`
- Modify: `frontend/src/components/channels/**/*.vue`
- Modify: `frontend/src/components/payment/**/*.vue`
- Modify: `frontend/src/components/user/**/*.vue`
- Modify: `frontend/src/components/modelPlaza/**/*.vue`
- Modify: `frontend/src/components/charts/**/*.vue`
- Modify: `frontend/src/features/**/*.vue`
- Modify: `frontend/src/views/admin/DashboardView.vue`
- Create: `frontend/src/__tests__/gatewayBotSurfaceAudit.spec.ts`

- [ ] **Step 1: Write failing surface audit**

```ts
expect(userFacingVueSource).not.toMatch(/shadow-(glow|glass)|rounded-2xl|from-purple|bg-mesh-gradient/)
expect(userFacingVueSource).not.toMatch(/>\s*Sub2API\s*</)
expect(adminDashboardSource).toContain('data-testid="admin-system-status"')
```

- [ ] **Step 2: Verify RED**

Run: `corepack pnpm@10.28.0 --dir frontend vitest run src/__tests__/gatewayBotSurfaceAudit.spec.ts`

Expected: FAIL on legacy decorative styling.

- [ ] **Step 3: Normalize every user and admin view**

Apply unframed page sections, 6px panels, 4px controls, restrained borders, compact headers, tabular data, stable table widths, consistent empty/loading/error states, and state-only semantic colors. Replace decorative icon tiles and gradients while preserving component behavior. Do not remove or reorder business form fields, hide features, alter routes, alter v-if feature guards, or change API calls.

- [ ] **Step 4: Reshape admin dashboard information hierarchy**

Place subscription operations first where reliable existing stats exist; otherwise keep the closest available subscription links and metrics without inventing numbers. Follow with system status (`data-testid="admin-system-status"`), usage, then user and commercial records. Retain all current charts, filters, refresh paths, batch image access, and role checks.

- [ ] **Step 5: Verify all frontend behavior**

Run: `corepack pnpm@10.28.0 --dir frontend lint:check`

Run: `corepack pnpm@10.28.0 --dir frontend typecheck`

Run: `corepack pnpm@10.28.0 --dir frontend test:run`

Expected: all commands exit 0; pre-existing Vue/i18n stderr warnings are recorded but no assertions fail.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/views frontend/src/components frontend/src/features frontend/src/__tests__/gatewayBotSurfaceAudit.spec.ts
git commit -m "feat: redesign all Gateway Bot application surfaces"
```

### Task 6: Custom Release Pipeline and Upgrade Protection

**Files:**
- Create: `.github/workflows/gateway-bot-release.yml`
- Create: `.github/workflows/gateway-bot-upstream-sync.yml`
- Modify: `deploy/Dockerfile`
- Modify: `/opt/sub2api/scripts/update.sh` on the zgo host (confirm the live path before editing and update this plan if deployment discovery reports a different path)
- Create: `docs/deployment/gateway-bot-release.md`

- [ ] **Step 1: Add workflow contract checks**

Create a shell validation that asserts workflows run frontend lint/typecheck/test/build, `go test ./...`, Linux amd64 build, SHA256 generation, and release tags matching `gateway-bot-v<upstream>-r<revision>`.

- [ ] **Step 2: Verify RED**

Run: `bash scripts/verify-gateway-bot-release.sh`

Expected: FAIL because custom workflows do not exist.

- [ ] **Step 3: Implement fork release workflows**

Add manual and tag-triggered release build, upstream-tag detection, sync branch + pull request creation, immutable artifacts, checksums, and release notes. Keep backend binary/module names unchanged. Point the deployment updater only at the Gateway Bot repository/tag prefix while retaining backup, checksum, health check, rollback, and log behavior.

- [ ] **Step 4: Verify GREEN**

Run: `bash scripts/verify-gateway-bot-release.sh`

Run: `corepack pnpm@10.28.0 --dir frontend build`

Run: `cd backend && go test ./...`

Expected: PASS and frontend assets are embedded in the production binary as before.

- [ ] **Step 5: Commit**

```bash
git add .github deploy docs/deployment scripts/verify-gateway-bot-release.sh
git commit -m "ci: add protected Gateway Bot release channel"
```

### Task 7: Responsive Visual Verification and Deployment

**Files:**
- Create: `frontend/tests/e2e/gateway-bot-visual.spec.ts`
- Create: `docs/qa/gateway-bot-ui-verification.md`

- [ ] **Step 1: Start production-like local servers**

Run: `corepack pnpm@10.28.0 --dir frontend build && corepack pnpm@10.28.0 --dir frontend preview --host 127.0.0.1 --port 61439`

Expected: preview responds at `http://127.0.0.1:61439`.

- [ ] **Step 2: Verify public and authenticated layouts**

Use Playwright at 1440x900, 1024x768, 390x844, and 360x800. Capture home, login, key usage, user dashboard, subscriptions, keys, usage, admin dashboard, users, groups, accounts, settings, dialogs, tables, dark/light themes, empty/loading/error states, and disabled feature configurations.

- [ ] **Step 3: Check visual invariants**

Assert no horizontal overflow, no text/control overlap, no blank hero background, no clipped navigation, no viewport-sized heading inside panels, next-section visibility in the home hero, reduced-motion behavior, keyboard focus visibility, and touch targets of at least 40px for primary mobile controls.

- [ ] **Step 4: Run final verification**

Run: `corepack pnpm@10.28.0 --dir frontend lint:check`

Run: `corepack pnpm@10.28.0 --dir frontend typecheck`

Run: `corepack pnpm@10.28.0 --dir frontend test:run`

Run: `corepack pnpm@10.28.0 --dir frontend build`

Run: `cd backend && go test ./...`

Expected: all exit 0.

- [ ] **Step 5: Deploy and smoke test zgo**

Back up the current binary/config, install the verified Gateway Bot artifact, restart the service, and verify `/health`, `/home`, `/login`, `/dashboard`, `/admin/dashboard`, static assets, browser console, and service logs. Roll back automatically if health or smoke checks fail.

- [ ] **Step 6: Commit QA evidence**

```bash
git add frontend/tests/e2e docs/qa/gateway-bot-ui-verification.md
git commit -m "test: verify Gateway Bot UI across workflows"
```
