import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const source = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), '../AuthLayout.vue'),
  'utf8',
)

describe('Gateway Bot authentication shell', () => {
  it('uses the editorial split shell without legacy orb or grid decoration', () => {
    expect(source).toContain('auth-context')
    expect(source).toContain('auth-panel')
    expect(source).toMatch(/让每一次接入，[\s\S]*都更简单/)
    expect(source).not.toContain('Gradient Orbs')
    expect(source).not.toContain('Grid Pattern')
    expect(source).not.toContain('card-glass')
  })

  it('uses Chinese footer copy and the Gateway Bot default', () => {
    expect(source).toContain("appStore.siteName || 'Gateway Bot'")
    expect(source).toContain('保留所有权利')
  })

  it('keeps the dark theme selector scoped to the authentication panel', () => {
    expect(source).toContain(':global(.dark .auth-panel)')
    expect(source).not.toContain(':global(.dark) .auth-panel')
  })

  it('uses cold graphite tokens and a targeted glass form emphasis', () => {
    expect(source).toContain('background: #F4F6F8')
    expect(source).toContain('background: #0B0D0F')
    expect(source).toContain('border-top: 2px solid #526E59')
    expect(source).toContain('background: rgb(255 255 255 / 0.72)')
    expect(source).toContain(':deep(.auth-mark)')
    expect(source).toContain(':deep(.auth-brand-name)')
    expect(source).not.toContain('#f5f3ed')
    expect(source).not.toContain('#0f1512')
    expect(source).not.toContain('#69b086')
  })
})
