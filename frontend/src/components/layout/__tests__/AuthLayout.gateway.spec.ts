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
})
