import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const srcRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function vueFilesUnder(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return vueFilesUnder(path)
    return entry.name.endsWith('.vue') ? [path] : []
  })
}

const userFacingVueFiles = [
  ...vueFilesUnder(resolve(srcRoot, 'views')),
  ...vueFilesUnder(resolve(srcRoot, 'components')),
  ...vueFilesUnder(resolve(srcRoot, 'features')),
]

describe('Gateway Bot full surface contract', () => {
  it('removes legacy decorative styling from every product surface', () => {
    for (const file of userFacingVueFiles) {
      const source = readFileSync(file, 'utf8')
      expect(source, file).not.toMatch(/shadow-(?:glow|glass)|rounded-2xl|bg-mesh-gradient/)
      expect(source, file).not.toMatch(/(?:from|to)-(?:purple|violet)-/)
    }
  })

  it('keeps admin operations ordered around subscriptions and system health', () => {
    const dashboard = readFileSync(resolve(srcRoot, 'views/admin/DashboardView.vue'), 'utf8')
    const subscriptions = dashboard.indexOf('data-testid="admin-subscription-operations"')
    const systemStatus = dashboard.indexOf('data-testid="admin-system-status"')
    const usage = dashboard.indexOf('data-testid="admin-usage-overview"')

    expect(subscriptions).toBeGreaterThan(-1)
    expect(systemStatus).toBeGreaterThan(subscriptions)
    expect(usage).toBeGreaterThan(systemStatus)
  })
})
