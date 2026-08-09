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
})
