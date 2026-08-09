import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const srcRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(srcRoot, '../..')

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
  resolve(srcRoot, 'stores/adminCompliance.ts'),
  resolve(srcRoot, 'views/user/KeysView.vue'),
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

const serverBrandFiles = [
  resolve(repoRoot, 'backend/internal/service/setting_parse.go'),
  resolve(repoRoot, 'backend/internal/service/setting_public.go'),
  resolve(repoRoot, 'backend/internal/service/admin_compliance.go'),
  resolve(repoRoot, 'backend/internal/service/balance_notify_service.go'),
  resolve(repoRoot, 'backend/internal/service/openai_live_attestation.go'),
  resolve(repoRoot, 'backend/internal/web/embed_on.go'),
  resolve(repoRoot, 'frontend/vite.config.ts'),
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

  it('does not restore upstream branding from server-side defaults', () => {
    for (const file of serverBrandFiles) {
      const source = readFileSync(file, 'utf8')
      expect(source, file).not.toMatch(/Sub2API/)
      expect(source, file).not.toContain('Subscription to API Conversion Platform')
      expect(source, file).not.toContain('AI API Gateway</title>')
    }
  })

  it('removes upstream project promotion and version branding from the product UI', () => {
    const promotionFiles = [
      ...userVisibleFiles,
      resolve(repoRoot, 'backend/internal/service/admin_compliance.go'),
      resolve(repoRoot, 'docs/legal/admin-compliance.zh.md'),
      resolve(repoRoot, 'docs/legal/admin-compliance.en.md'),
    ]
    for (const file of promotionFiles) {
      expect(readFileSync(file, 'utf8'), file).not.toContain('https://github.com/Wei-Shaw/sub2api')
    }

    const sidebar = readFileSync(resolve(srcRoot, 'components/layout/AppSidebar.vue'), 'utf8')
    expect(sidebar).not.toContain('<VersionBadge')
    expect(sidebar).not.toContain("import VersionBadge")
  })
})
