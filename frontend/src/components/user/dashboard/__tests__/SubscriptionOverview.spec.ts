import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const testDir = dirname(fileURLToPath(import.meta.url))
const componentPath = resolve(testDir, '../SubscriptionOverview.vue')
const dashboardPath = resolve(testDir, '../../../../views/user/DashboardView.vue')
const componentSource = existsSync(componentPath) ? readFileSync(componentPath, 'utf8') : ''
const dashboardSource = readFileSync(dashboardPath, 'utf8')

describe('subscription-first user dashboard', () => {
  it('renders an explicit subscription overview backed by the existing store', () => {
    expect(existsSync(componentPath)).toBe(true)
    expect(componentSource).toContain('data-testid="subscription-overview"')
    expect(componentSource).toContain('useSubscriptionStore')
    expect(componentSource).toContain('activeSubscriptions')
    expect(componentSource).toContain('当前订阅')
  })

  it('shows subscription purchasing only when the payment feature allows it', () => {
    expect(componentSource).toContain('purchaseEnabled')
    expect(componentSource).toContain('v-if="purchaseEnabled"')
    expect(componentSource).toContain("path: '/purchase'")
  })

  it('orders subscriptions and actions before usage, with balance in a secondary asset strip', () => {
    const subscriptionIndex = dashboardSource.indexOf('<SubscriptionOverview')
    const actionsIndex = dashboardSource.indexOf('<UserDashboardQuickActions')
    const usageIndex = dashboardSource.indexOf('<UserDashboardStats')
    const assetsIndex = dashboardSource.indexOf('data-testid="account-assets"')

    expect(subscriptionIndex).toBeGreaterThan(-1)
    expect(actionsIndex).toBeGreaterThan(subscriptionIndex)
    expect(usageIndex).toBeGreaterThan(actionsIndex)
    expect(assetsIndex).toBeGreaterThan(usageIndex)
  })
})
