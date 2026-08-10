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

  if (route === '/home') {
    const heroTitle = page.locator('.hero-title')

    await expect(heroTitle).toBeVisible()
    await expect(page.locator('.hero-title-lead')).toBeVisible()
    await expect(page.locator('.hero-title-reach')).toBeVisible()
    await expect(page.locator('.hero-title-near')).toBeVisible()

    await page.evaluate(() => document.documentElement.classList.remove('dark'))
    const homeAudit = await page.evaluate(() => {
      const title = document.querySelector<HTMLElement>('.hero-title')!
      const art = document.querySelector<HTMLElement>('.hero-title-art')!
      const nav = document.querySelector<HTMLElement>('.home-nav')!
      const navText = nav.querySelector<HTMLElement>('.brand-wordmark')!
      const titleRect = title.getBoundingClientRect()
      const artRect = art.getBoundingClientRect()
      const navStyle = getComputedStyle(nav)
      const textStyle = getComputedStyle(navText)

      const colorChannels = (value: string) =>
        (value.match(/[\d.]+/g) ?? []).map(Number)
      const luminance = ([red, green, blue]: number[]) => {
        const channels = [red, green, blue].map((channel) => {
          const normalized = channel / 255
          return normalized <= 0.04045
            ? normalized / 12.92
            : ((normalized + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
      }
      const background = colorChannels(navStyle.backgroundColor)
      const foreground = colorChannels(textStyle.color)
      const lighter = Math.max(luminance(background), luminance(foreground))
      const darker = Math.min(luminance(background), luminance(foreground))

      return {
        titleRect: { left: titleRect.left, right: titleRect.right },
        artRect: { left: artRect.left, right: artRect.right },
        titleClientWidth: title.clientWidth,
        titleScrollWidth: title.scrollWidth,
        viewportWidth: window.innerWidth,
        navBackgroundAlpha: background[3] ?? 1,
        navTextAlpha: foreground[3] ?? 1,
        navContrast: (lighter + 0.05) / (darker + 0.05),
      }
    })

    expect(homeAudit.titleRect.left).toBeGreaterThanOrEqual(0)
    expect(homeAudit.titleRect.right).toBeLessThanOrEqual(homeAudit.viewportWidth)
    expect(homeAudit.artRect.left).toBeGreaterThanOrEqual(0)
    expect(homeAudit.artRect.right).toBeLessThanOrEqual(homeAudit.viewportWidth)
    if (homeAudit.viewportWidth <= 390) {
      expect(homeAudit.titleScrollWidth).toBeLessThanOrEqual(homeAudit.titleClientWidth)
    }
    expect(homeAudit.navBackgroundAlpha).toBeGreaterThan(0)
    expect(homeAudit.navTextAlpha).toBeGreaterThan(0)
    expect(homeAudit.navContrast).toBeGreaterThanOrEqual(4.5)
  }

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
