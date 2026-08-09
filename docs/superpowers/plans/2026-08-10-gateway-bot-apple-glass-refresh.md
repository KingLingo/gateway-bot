# Gateway Bot Apple Glass Refresh Implementation Plan

> Executor: Terra. Coordinator and final reviewer: Sol.

**Goal:** Deepen Gateway Bot's brand, typography, layout and materials while limiting the current customer-facing model catalog to GPT and Claude.

**Compatibility rule:** Do not change backend APIs, routes, database enums, permissions, feature flags, encryption constants, compatibility headers or existing-record readability.

## Phase 1: Brand foundation and regression contracts

1. Add failing tests for the new default logo metadata, Apple-style font stack, radius/material tokens, and customer-facing model scope.
2. Replace `frontend/public/logo.svg` with the original Gateway mark and create a reusable brand component for public, auth, sidebar, legal, key-usage and model-plaza shells.
3. Update favicon fallback and accessible logo labels. A configured custom `site_logo` must continue to override the default.
4. Consolidate common operation icons on Phosphor and remove hand-authored sidebar action paths where equivalent icons exist.

## Phase 2: System typography and material

1. Update Tailwind and global CSS to the native SF Pro/PingFang stack, cold silver/graphite surfaces, 6px controls and 8px panels.
2. Add reusable glass navigation, glass emphasis and glass dialog utilities with light/dark contrast and non-backdrop fallbacks.
3. Apply the system to shared buttons, fields, selects, toggles, tables, badges, dialogs, empty states, page headers and layout shells.
4. Preserve dense tables and forms as solid surfaces; do not make every component translucent.

## Phase 3: Public and authentication composition

1. Recompose `HomeView.vue` into an asymmetric first viewport, continuous access path, subscription value section, GPT/Claude model section, and “更多模型敬请期待” placeholder.
2. Keep the established title “让 AI 接入触手可及” and subscription-first Chinese copy.
3. Refresh authentication and public shells with the new brand component and restrained glass.
4. Verify all imagery, loading, error, disabled, reduced-motion and mobile states.

## Phase 4: User and admin surfaces

1. Preserve the subscription-first dashboard and redesign its visual hierarchy with one glass emphasis region and solid supporting data regions.
2. Filter customer-facing discovery, plan scopes, channel presentation and setup guidance to OpenAI/Anthropic; remove Gemini/Grok promotional and creation affordances.
3. Preserve historical Gemini/Grok records in admin data tables and detail views, but remove them from recommended/new creation paths.
4. Apply the typography, radius, icon and material system across all existing user and admin routes without changing behavior.
5. Preserve the pending AppHeader tablet overflow fix and its regression test.

## Phase 5: Verification and release

1. Run focused tests after each phase, then full ESLint, typecheck, Vitest, build and `go test ./... -count=1` from `backend/`.
2. Run local public visual matrix and inspect screenshot output.
3. Sol reviews the complete diff for model-scope regressions, branding leaks, accessibility and responsive overflow.
4. Commit and push only after the full gate passes; publish the next immutable `gateway-bot-v0.1.173-rN` release.
5. Deploy with backup and automatic rollback, then run the production authenticated route matrix at all four target viewports.
