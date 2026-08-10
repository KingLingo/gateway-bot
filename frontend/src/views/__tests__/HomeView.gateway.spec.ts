import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const testDir = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(resolve(testDir, '../HomeView.vue'), 'utf8')
const zhLanding = readFileSync(resolve(testDir, '../../i18n/locales/zh/landing.ts'), 'utf8')
const enLanding = readFileSync(resolve(testDir, '../../i18n/locales/en/landing.ts'), 'utf8')

describe('Gateway Bot home experience', () => {
  it('uses matching localized hero title segments', () => {
    expect(zhLanding).toContain("title: '让 AI 接入触手可及'")
    expect(zhLanding).toContain("titleLead: '让 AI 接入'")
    expect(zhLanding).toContain("titleReach: '触手'")
    expect(zhLanding).toContain("titleNear: '可及'")
    expect(zhLanding).toContain('订阅主流 AI API，统一管理密钥、用量与周期。接入从这里开始。')
    expect(enLanding).toContain("title: 'AI access, always within reach'")
    expect(enLanding).toContain("titleLead: 'AI access'")
    expect(enLanding).toContain("titleReach: 'within'")
    expect(enLanding).toContain("titleNear: 'reach'")
  })

  it('renders a local responsive hero visual and no upstream promotion', () => {
    expect(source).toContain('data-testid="gateway-home"')
    expect(source).toContain('/media/gateway-architecture-desktop.jpg')
    expect(source).toContain('/media/gateway-architecture-mobile.jpg')
    expect(source).not.toContain('terminal-container')
    expect(source).not.toContain('github.com/Wei-Shaw')
  })

  // 静态图必须放在 /media/ 下，不能放 /images/。
  // 后端 shouldBypassEmbeddedFrontend() 把 /images/ 整段让给网关 API
  // （/images/generations、/images/edits、/images/batches… 都是根级真实路由），
  // 内嵌前端中间件会直接放行，请求落到 API 路由上拿到 404 page not found。
  // 这个坑在 vite preview 下看不出来（没有那层中间件），只在真机上炸，
  // 所以只能靠断言守住。
  it('keeps static artwork out of the gateway API namespace', () => {
    const auth = readFileSync(resolve(testDir, '../../components/layout/AuthLayout.vue'), 'utf8')
    const html = readFileSync(resolve(testDir, '../../../index.html'), 'utf8')
    for (const file of [source, auth, html]) {
      expect(file).not.toMatch(/["'(]\/(images|videos)\/[^"')]*\.(jpe?g|png|webp|avif|svg|gif)/)
    }
  })

  it('keeps documentation conditional on the configured URL', () => {
    expect(source).toMatch(/v-if="docUrl"[\s\S]{0,240}:href="docUrl"/)
  })

  it('hides the nested brand wordmark below the tablet breakpoint', () => {
    expect(source).toContain(':deep(.brand-name) { display: none; }')
  })

  it('binds the localized hero to an accessible asymmetric editorial composition', () => {
    expect(source).toContain('<h1 class="hero-title" :aria-label="t(\'home.title\')">')
    expect(source).toContain('<span class="hero-title-lead" aria-hidden="true">{{ t(\'home.titleLead\') }}</span>')
    expect(source).toContain('<span class="hero-title-reach" aria-hidden="true">{{ t(\'home.titleReach\') }}</span>')
    expect(source).toContain('<span class="hero-title-near" aria-hidden="true">{{ t(\'home.titleNear\') }}</span>')
    expect(source).toMatch(/\.hero-title\s*\{[^}]*display:\s*grid;/s)
    expect(source).toMatch(/\.hero-title-art\s*\{[^}]*display:\s*flex;[^}]*justify-self:\s*end;[^}]*white-space:\s*nowrap;/s)
    expect(source).toMatch(/\.hero-title-reach\s*\{[^}]*font-family:\s*"Songti SC", "STSong", "Noto Serif SC", serif;/s)
    expect(source).toMatch(/\.hero-title-near\s*\{[^}]*font-family:\s*"Kaiti SC", "STKaiti", "Noto Serif SC", serif;/s)
  })

  it('keeps the subscription photo caption readable over variable imagery', () => {
    expect(source).toContain('class="subscription-caption"')
    expect(source).toMatch(/\.subscription-caption\s*\{[^}]*font-size:\s*0\.9rem;/s)
    expect(source).toMatch(/\.subscription-caption\s*\{[^}]*background:\s*rgb\([^;]+\/\s*0\.78\);/s)
    expect(source).toMatch(/\.subscription-caption\s*\{[^}]*backdrop-filter:\s*blur\(14px\)/s)
  })

  it('owns the subscription panel contrast instead of relying on the global theme class', () => {
    expect(source).not.toContain('subscription-copy glass-emphasis')
    expect(source).toMatch(/\.subscription-copy\s*\{[^}]*background:\s*rgb\([^;]+\/\s*0\.82\);/s)
    expect(source).toMatch(/\.subscription-copy\s*\{[^}]*border:\s*1px solid rgb\(255 255 255 \/ 0\.14\);/s)
  })

  it('owns a dark glass navigation surface independently of the global theme', () => {
    expect(source).toContain('<header class="home-nav">')
    expect(source).not.toContain('home-nav glass-nav')
    expect(source).toContain('<RouterLink to="/home" class="brand-wordmark" :aria-label="siteName">')
    expect(source).toMatch(/\.home-nav\s*\{[^}]*background:\s*rgb\(11 13 15 \/ 0\.82\);/s)
    expect(source).toMatch(/\.home-nav\s*\{[^}]*backdrop-filter:\s*blur\(18px\)/s)
    expect(source).toMatch(/\.home-nav\s*\{[^}]*-webkit-backdrop-filter:\s*blur\(18px\)/s)
    expect(source).toMatch(/\.home-nav\s*\{[^}]*box-shadow:\s*inset 0 1px 0/s)
  })

  it('provides opaque local surfaces when reduced transparency is requested', () => {
    expect(source).toMatch(/@media \(prefers-reduced-transparency: reduce\)/)
    expect(source).toMatch(/@media \(prefers-reduced-transparency: reduce\)\s*\{[\s\S]*?\.home-nav\s*\{[^}]*background:\s*#111519;[^}]*backdrop-filter:\s*none;[^}]*-webkit-backdrop-filter:\s*none;[^}]*\}/s)
    expect(source).toMatch(/@media \(prefers-reduced-transparency: reduce\)\s*\{[\s\S]*?\.subscription-caption\s*\{[^}]*background:\s*#0b0d0f;[^}]*backdrop-filter:\s*none;[^}]*-webkit-backdrop-filter:\s*none;[^}]*\}/s)
    expect(source).toMatch(/@media \(prefers-reduced-transparency: reduce\)\s*\{[\s\S]*?\.subscription-copy\s*\{[^}]*background:\s*#14181c;[^}]*backdrop-filter:\s*none;[^}]*-webkit-backdrop-filter:\s*none;[^}]*\}/s)
    expect(source).toMatch(/@media \(prefers-reduced-motion: reduce\)/)
  })

  it('uses asymmetric homepage proportions without weakening contrast', () => {
    expect(source).toContain('grid-template-columns: minmax(0, 1.22fr) minmax(340px, 0.78fr)')
    expect(source).toContain('class="subscription-caption"')
    expect(source).not.toContain('subscription-copy glass-emphasis')
    expect(source).toContain('background: rgb(20 24 28 / 0.82)')
    expect(source).toMatch(/\.models-section > h2\s*\{[^}]*transform:\s*translateX\(/s)
    expect(source).toMatch(/\.visibility-section > div:first-child\s*\{[^}]*transform:\s*translateX\(/s)
    expect(source).toContain('.subscription-section, .visibility-section { grid-template-columns: 1fr; gap: 3.5rem; }')
    expect(source).toContain('.models-section > h2, .visibility-section > div:first-child { transform: none; }')
  })

  it('removes the mobile title translation that can create horizontal overflow', () => {
    expect(source).toMatch(/@media \(max-width: 767px\)\s*\{[\s\S]*?\.hero-title-art\s*\{[^}]*transform:\s*none;[^}]*padding-right:\s*1px;[^}]*\}/s)
  })
})
