# Gateway Bot Neural Route Brand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved neural-route logo, asymmetric Chinese hero typography, and readable subscription glass treatment without changing application behavior.

**Architecture:** Keep branding code-native: one SVG asset, the existing `GatewayBrand` wrapper, and scoped homepage markup/CSS. Use source-level Vitest contracts for SVG and CSS invariants, then use the existing Playwright visual matrix for responsive behavior. Preserve the current uncommitted subscription contrast fix and build on it rather than reverting it.

**Tech Stack:** Vue 3, TypeScript, scoped CSS, SVG, Vitest, Playwright, pnpm, Go embedded frontend.

---

### Task 1: Lock The Neural Route Logo Contract

**Files:**
- Modify: `frontend/src/__tests__/gatewayBotBrand.spec.ts`
- Modify: `frontend/public/logo.svg`

- [ ] **Step 1: Add a failing SVG semantics test**

Extend the existing logo source assertions with:

```ts
it('expresses the approved neural route AI mark', () => {
  const logo = readFileSync(resolve(repoRoot, 'frontend/public/logo.svg'), 'utf8')

  expect(logo).toContain('class="neural-node"')
  expect(logo).toContain('class="ai-spark"')
  expect(logo).toContain('gateway frames, neural routing nodes, and an AI spark')
  expect(logo).not.toMatch(/robot|chat bubble|Gemini|Grok/i)
})
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
cd frontend
pnpm vitest run src/__tests__/gatewayBotBrand.spec.ts
```

Expected: FAIL because `neural-node`, `ai-spark`, and the new description are absent.

- [ ] **Step 3: Implement the approved SVG**

Preserve the `128x128` view box, rounded graphite surface, silver gateway frames, and green route. Add two compact route nodes with `class="neural-node"`; replace the terminal status circle with this four-point spark structure:

```svg
<g class="ai-spark">
  <path d="m90 62 2.8 6.2L99 71l-6.2 2.8L90 80l-2.8-6.2L81 71l6.2-2.8Z"
        fill="#B8DABB" stroke="#EFF8F0" stroke-width="1.5"/>
</g>
```

Update the description to `An original mark with gateway frames, neural routing nodes, and an AI spark.` Keep strokes at least `1.5` SVG units and avoid any third-party model marks.

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run the Step 2 command. Expected: all tests in `gatewayBotBrand.spec.ts` pass.

### Task 2: Build The Asymmetric Chinese Hero Title

**Files:**
- Modify: `frontend/src/views/__tests__/HomeView.gateway.spec.ts`
- Modify: `frontend/src/views/HomeView.vue`

- [ ] **Step 1: Add failing title structure and font fallback tests**

Add:

```ts
it('splits the Chinese hero into an asymmetric editorial composition', () => {
  expect(source).toContain('class="hero-title-lead"')
  expect(source).toContain('class="hero-title-reach"')
  expect(source).toContain('class="hero-title-near"')
  expect(source).toMatch(/hero-title-reach[^}]*font-family:\s*"Songti SC", "STSong", "Noto Serif SC", serif/s)
  expect(source).toMatch(/hero-title-near[^}]*font-family:\s*"Kaiti SC", "STKaiti", "Noto Serif SC", serif/s)
})
```

- [ ] **Step 2: Run the focused homepage test and confirm RED**

```bash
cd frontend
pnpm vitest run src/views/__tests__/HomeView.gateway.spec.ts
```

Expected: FAIL because the split title classes and artistic font chains do not exist.

- [ ] **Step 3: Replace the single visual title with accessible split markup**

Keep the localized complete title as its accessible label:

```vue
<h1 class="hero-title" :aria-label="t('home.title')">
  <span class="hero-title-lead" aria-hidden="true">让 AI 接入</span>
  <span class="hero-title-art" aria-hidden="true">
    <span class="hero-title-reach">触手</span>
    <span class="hero-title-near">可及</span>
  </span>
</h1>
```

Implement scoped CSS that keeps exactly two title rows:

```css
.hero-title { display: grid; width: min(100%, 9.4em); }
.hero-title-lead { justify-self: start; white-space: nowrap; }
.hero-title-art { display: flex; justify-self: end; align-items: baseline; gap: 0.16em; white-space: nowrap; }
.hero-title-reach { color: #f2f4f5; font-family: "Songti SC", "STSong", "Noto Serif SC", serif; font-weight: 700; letter-spacing: -0.12em; }
.hero-title-near { color: #a6cbaa; font-family: "Kaiti SC", "STKaiti", "Noto Serif SC", serif; font-weight: 600; letter-spacing: -0.08em; transform: translateY(0.08em) rotate(-2deg); }
```

At the mobile breakpoint, reduce the second-row offset and rotation without allowing wrapping.

- [ ] **Step 4: Run the focused homepage test and confirm GREEN**

Run the Step 2 command. Expected: all homepage gateway tests pass.

### Task 3: Extend The Asymmetric Rhythm And Preserve Readability

**Files:**
- Modify: `frontend/src/views/__tests__/HomeView.gateway.spec.ts`
- Modify: `frontend/src/views/HomeView.vue`

- [ ] **Step 1: Add a failing layout contract**

Add assertions for the approved local contrast and asymmetric section proportions:

```ts
it('uses asymmetric homepage proportions without weakening contrast', () => {
  expect(source).toContain('grid-template-columns: minmax(0, 1.22fr) minmax(340px, 0.78fr)')
  expect(source).toContain('class="subscription-caption"')
  expect(source).not.toContain('subscription-copy glass-emphasis')
  expect(source).toContain('background: rgb(20 24 28 / 0.82)')
})
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run the Task 2 focused command. Expected: FAIL on the new `1.22fr / 0.78fr` proportion.

- [ ] **Step 3: Implement the section rhythm**

Change the subscription grid to `1.22fr / 0.78fr`, retain the existing glass caption and self-contained dark subscription panel fix, and add restrained offsets to the models and visibility headings. Do not change route targets, translation keys, subscription values, model names, or CTA labels. Keep all mobile multi-column sections collapsed to one column.

- [ ] **Step 4: Run focused tests and production build**

```bash
cd frontend
pnpm vitest run src/views/__tests__/HomeView.gateway.spec.ts src/__tests__/gatewayBotBrand.spec.ts
pnpm run typecheck
pnpm run build
```

Expected: all focused tests pass, typecheck exits `0`, and Vite build exits `0`.

### Task 4: Controller Review, Full Verification, And Release

**Files:**
- Modify after production QA: `docs/qa/gateway-bot-ui-verification.md`

- [ ] **Step 1: Review the worker diff for spec compliance**

Verify the changes are limited to the approved SVG, homepage, tests, and already-approved readability fix. Confirm GPT/Claude customer scope and all routes remain unchanged.

- [ ] **Step 2: Run full verification**

```bash
cd frontend
pnpm run lint:check
pnpm run typecheck
pnpm run test:run
pnpm run build
cd ../backend
go test ./... -count=1
cd ..
bash scripts/verify-gateway-bot-release.sh
git diff --check
```

Expected: every command exits `0`; Vitest reports zero failures.

- [ ] **Step 3: Run the public visual matrix**

```bash
cd frontend
E2E_BASE_URL=http://127.0.0.1:4175 pnpm run test:e2e:visual
```

Expected: all 20 public cases pass across four viewports, with no horizontal overflow or broken images.

- [ ] **Step 4: Publish a new immutable revision and deploy with rollback**

Create the next `gateway-bot-v0.1.173-rN` tag, wait for the release workflow, download all three assets, run `sha256sum -c checksums.txt`, back up the production binary, install the verified release, restart `sub2api`, and require successful `/health`, `/home`, `/login`, version, and log checks. Restore the backup immediately on any failure.

- [ ] **Step 5: Record production QA and commit the evidence**

Append the release version, checksums, public visual matrix count, authenticated-route availability, health results, and rollback location to `docs/qa/gateway-bot-ui-verification.md`.
