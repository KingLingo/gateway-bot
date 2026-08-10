import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const testDir = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(resolve(testDir, '../HomeView.vue'), 'utf8')
const zhLanding = readFileSync(resolve(testDir, '../../i18n/locales/zh/landing.ts'), 'utf8')

describe('Gateway Bot home experience', () => {
  it('uses the approved Chinese value proposition', () => {
    expect(zhLanding).toContain("title: '让 AI 接入触手可及'")
    expect(zhLanding).toContain('订阅主流 AI API，统一管理密钥、用量与周期。接入从这里开始。')
  })

  it('renders a local responsive hero visual and no upstream promotion', () => {
    expect(source).toContain('data-testid="gateway-home"')
    expect(source).toContain('/images/gateway-architecture-desktop.jpg')
    expect(source).toContain('/images/gateway-architecture-mobile.jpg')
    expect(source).not.toContain('terminal-container')
    expect(source).not.toContain('github.com/Wei-Shaw')
  })

  it('keeps documentation conditional on the configured URL', () => {
    expect(source).toMatch(/v-if="docUrl"[\s\S]{0,240}:href="docUrl"/)
  })

  it('hides the nested brand wordmark below the tablet breakpoint', () => {
    expect(source).toContain(':deep(.brand-name) { display: none; }')
  })

  it('splits the Chinese hero into an accessible asymmetric editorial composition', () => {
    expect(source).toContain('<h1 class="hero-title" :aria-label="t(\'home.title\')">')
    expect(source).toContain('class="hero-title-lead"')
    expect(source).toContain('class="hero-title-reach"')
    expect(source).toContain('class="hero-title-near"')
    expect(source).toMatch(/\.hero-title-reach\s*\{[^}]*font-family:\s*"Songti SC", "STSong", "Noto Serif SC", serif;/s)
    expect(source).toMatch(/\.hero-title-near\s*\{[^}]*font-family:\s*"Kaiti SC", "STKaiti", "Noto Serif SC", serif;/s)
    expect(source).toMatch(/\.hero-title-art\s*\{[^}]*white-space:\s*nowrap;/s)
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
})
