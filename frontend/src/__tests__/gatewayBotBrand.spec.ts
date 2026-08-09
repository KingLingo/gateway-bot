import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const srcRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function filesUnder(directory: string, extension: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return filesUnder(path, extension)
    return entry.name.endsWith(extension) ? [path] : []
  })
}

const userVisibleFiles = [
  resolve(srcRoot, '../index.html'),
  resolve(srcRoot, 'main.ts'),
  resolve(srcRoot, 'router/title.ts'),
  resolve(srcRoot, 'stores/app.ts'),
  resolve(srcRoot, 'views/HomeView.vue'),
  resolve(srcRoot, 'views/KeyUsageView.vue'),
  resolve(srcRoot, 'views/public/LegalDocumentView.vue'),
  resolve(srcRoot, 'components/layout/AuthLayout.vue'),
  resolve(srcRoot, 'components/layout/AppSidebar.vue'),
  resolve(srcRoot, 'i18n/locales/zh/landing.ts'),
  resolve(srcRoot, 'i18n/locales/en/landing.ts'),
  resolve(srcRoot, 'i18n/locales/zh/misc.ts'),
  resolve(srcRoot, 'i18n/locales/en/misc.ts'),
  resolve(srcRoot, 'i18n/locales/zh/dashboard.ts'),
  resolve(srcRoot, 'i18n/locales/en/dashboard.ts'),
  resolve(srcRoot, 'i18n/locales/zh/admin/settings.ts'),
  resolve(srcRoot, 'i18n/locales/en/admin/settings.ts'),
  ...filesUnder(resolve(srcRoot, 'views'), '.vue'),
  ...filesUnder(resolve(srcRoot, 'components'), '.vue'),
  ...filesUnder(resolve(srcRoot, 'features'), '.vue'),
  ...filesUnder(resolve(srcRoot, 'i18n/locales'), '.ts'),
]

describe('Gateway Bot public brand', () => {
  it('does not expose the upstream project name in user-visible surfaces', () => {
    for (const file of userVisibleFiles) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/Sub2API/)
    }
  })

  it('keeps the Gateway Bot name available as the default identity', () => {
    expect(readFileSync(resolve(srcRoot, 'stores/app.ts'), 'utf8')).toContain(
      "ref<string>('Gateway Bot')",
    )
  })
})
