import { expect, test, type Page, type TestInfo } from '@playwright/test'

const publicRoutes = [
  '/home',
  '/login',
  '/register',
  '/forgot-password',
  '/key-usage',
]

const protectedRoutes = [
  '/dashboard',
  '/subscriptions',
  '/purchase',
  '/keys',
  '/usage',
  '/redeem',
  '/affiliate',
  '/available-channels',
  '/profile',
  '/orders',
  '/admin/dashboard',
  '/admin/ops',
  '/admin/audit-logs',
  '/admin/users',
  '/admin/groups',
  '/admin/channels/pricing',
  '/admin/channels/monitor',
  '/admin/subscriptions',
  '/admin/accounts',
  '/admin/announcements',
  '/admin/proxies',
  '/admin/redeem',
  '/admin/promo-codes',
  '/admin/settings',
  '/admin/risk-control',
  '/admin/prompt-audit',
  '/admin/usage',
  '/admin/affiliates/invites',
  '/admin/affiliates/rebates',
  '/admin/affiliates/transfers',
  '/admin/orders/dashboard',
  '/admin/orders',
  '/admin/orders/plans',
]

async function verifySurface(page: Page, route: string, testInfo: TestInfo) {
  await page.goto(route, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(350)

  for (const image of await page.locator('img:visible').all()) {
    await image.scrollIntoViewIfNeeded()
  }
  await page.waitForFunction(
    () => [...document.images]
      .filter((image) => image.getClientRects().length > 0)
      .every((image) => image.complete),
    undefined,
    { timeout: 5_000 },
  )
  await page.evaluate(() => window.scrollTo(0, 0))

  const audit = await page.evaluate(() => ({
    bodyText: document.body.innerText,
    brokenImages: [...document.images]
      .filter((image) => image.getClientRects().length > 0)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.alt || image.currentSrc),
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }))

  expect(audit.documentWidth, `${route} must not overflow horizontally`).toBeLessThanOrEqual(
    audit.viewportWidth,
  )
  expect(audit.brokenImages, `${route} must not contain broken images`).toEqual([])
  expect(audit.bodyText).not.toContain('Sub2API')
  expect(audit.bodyText).not.toContain('Wei-Shaw/sub2api')
  await expect(page.locator('body')).toBeVisible()

  await testInfo.attach(route.replaceAll('/', '_') || '_root', {
    body: await page.screenshot({ fullPage: false }),
    contentType: 'image/png',
  })
}

test.describe('Gateway Bot public surfaces', () => {
  for (const route of publicRoutes) {
    test(`${route} has no visual regressions`, async ({ page }, testInfo) => {
      await verifySurface(page, route, testInfo)
    })
  }
})

test.describe('Gateway Bot authenticated surfaces', () => {
  test.skip(!process.env.E2E_STORAGE_STATE, 'Set E2E_STORAGE_STATE to a Playwright auth state file')

  for (const route of protectedRoutes) {
    test(`${route} has no visual regressions`, async ({ page }, testInfo) => {
      await verifySurface(page, route, testInfo)
      await expect(page).not.toHaveURL(/\/login(?:\?|$)/)
    })
  }
})
