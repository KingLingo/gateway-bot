import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const testDir = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(resolve(testDir, '../HomeView.vue'), 'utf8')
const zhLanding = readFileSync(resolve(testDir, '../../i18n/locales/zh/landing.ts'), 'utf8')
const enLanding = readFileSync(resolve(testDir, '../../i18n/locales/en/landing.ts'), 'utf8')

describe('Gateway Bot home experience', () => {
  // titleLead + titleAccent 拼起来必须逐字等于 title：title 是 h1 的 aria-label，
  // 两个可见 span 都是 aria-hidden，读屏用户只听得到 title 这一串。
  it('uses matching localized hero title segments', () => {
    expect(zhLanding).toContain("title: '所有模型，在此换乘'")
    expect(zhLanding).toContain("titleLead: '所有模型，'")
    expect(zhLanding).toContain("titleAccent: '在此换乘'")
    expect(enLanding).toContain("title: 'Every model. One interchange.'")
    expect(enLanding).toContain("titleLead: 'Every model.'")
    expect(enLanding).toContain("titleAccent: 'One interchange.'")

    for (const landing of [zhLanding, enLanding]) {
      // 必须切到 home 块里再找 title：文件开头的 batchImageGuide 也有一个同缩进的 title。
      const home = landing.split('\n  home: {\n')[1]
      expect(home).toBeTruthy()
      const title = home.match(/^\s{4}title: '(.+)',$/m)?.[1]
      const lead = home.match(/titleLead: '(.+)',/)?.[1]
      const accent = home.match(/titleAccent: '(.+)',/)?.[1]
      expect(title).toBeTruthy()
      expect(`${lead}${accent}`.replace(/\s+/g, '')).toBe(title!.replace(/\s+/g, ''))
    }
  })

  // 首屏曾经是一整张 Unsplash 照片，现在底纹、路由图全部是 CSS / 字符画画的。
  // 这条守住「别再往首屏塞图片」——落地页的图是二进制体积，没有 CDN 可以卸载。
  it('renders the hero from CSS and character art, with no photography or upstream promotion', () => {
    expect(source).toContain('data-testid="gateway-home"')
    expect(source).toMatch(/<section class="hero-section">[\s\S]*?<\/section>/)
    const hero = source.match(/<section class="hero-section">[\s\S]*?<\/section>/)![0]
    expect(hero).not.toMatch(/<img|<picture|\/media\//)
    expect(source).toContain('routeDiagramWide')
    expect(source).toContain('routeDiagramNarrow')
    expect(source).not.toContain('terminal-container')
    expect(source).not.toContain('github.com/Wei-Shaw')
  })

  // 字符画的列位置被 CSS 依赖：.hero-packet 用 ch 定位到宽版第 3 行的两段横线上。
  // 改了图就要改偏移量，这条在改错时报出来，免得数据包飘到线外才在真机上看见。
  it('keeps the route diagram aligned with the packet animation offsets', () => {
    const wide = source.match(/const routeDiagramWide = \[([\s\S]*?)\]\.join/)![1]
    const lines = [...wide.matchAll(/'(.*)',/g)].map((m) => m[1])
    expect(lines).toHaveLength(5)
    // 第 3 行（索引 2）：├ 在第 15 列进箱，箱右侧 ─────▶ 从第 41 列出发
    expect(lines[2].indexOf('├')).toBe(14)
    expect(lines[2].indexOf('│')).toBe(21) // 箱体左边框，进箱的包停在它前面一格
    expect(lines[2].lastIndexOf('│')).toBe(39) // 箱体右边框，出箱的包从它后面一格起步
    expect(lines[2].length).toBeGreaterThan(46)
    expect(source).toMatch(/@keyframes packet-in\s*\{[^}]*left:\s*15ch/s)
    expect(source).toMatch(/@keyframes packet-out\s*\{[^}]*left:\s*41ch/s)
  })

  // 静态图必须放在 /media/ 下，不能放 /images/。
  // 后端 shouldBypassEmbeddedFrontend() 把 /images/ 整段让给网关 API
  // （/images/generations、/images/edits、/images/batches… 都是根级真实路由），
  // 内嵌前端中间件会直接放行，请求落到 API 路由上拿到 404 page not found。
  // 这个坑在 vite preview 下看不出来（没有那层中间件），只在真机上炸，
  // 所以只能靠断言守住。
  it('keeps static artwork out of the gateway API namespace', () => {
    const auth = readFileSync(resolve(testDir, '../../components/layout/AuthLayout.vue'), 'utf8')
    const html = readFileSync(resolve(testDir, '../../../index.html'), 'utf8')
    for (const file of [source, auth, html]) {
      expect(file).not.toMatch(/["'(]\/(images|videos)\/[^"')]*\.(jpe?g|png|webp|avif|svg|gif)/)
    }
  })

  it('keeps documentation conditional on the configured URL', () => {
    expect(source).toMatch(/v-if="docUrl"[\s\S]{0,240}:href="docUrl"/)
  })

  it('hides the nested brand wordmark below the tablet breakpoint', () => {
    expect(source).toContain(':deep(.brand-name) { display: none; }')
  })

  // h1 的可见内容整体 aria-hidden，含义只由 aria-label 承担；
  // 光标是纯装饰的空 span，绝不能带文本，否则会被读出来。
  it('binds the localized hero title to an accessible two-part composition', () => {
    expect(source).toContain('<h1 class="hero-title" :aria-label="t(\'home.title\')">')
    expect(source).toContain('<span class="hero-title-lead" aria-hidden="true">{{ t(\'home.titleLead\') }}</span>')
    expect(source).toMatch(/<span class="hero-title-accent" aria-hidden="true">\s*\{\{ t\('home\.titleAccent'\) \}\}<span class="hero-caret" aria-hidden="true" \/>/)
    expect(source).toMatch(/\.hero-title\s*\{[^}]*display:\s*grid;/s)
    // 三套书法字族（宋体/楷体各一）已经撤掉：那是设计上的用力，不是性格，
    // 而且中日韩衬线在没装字体的机器上会静默回落成完全不同的观感。
    expect(source).not.toMatch(/Songti SC|STKaiti|Kaiti SC/)
  })

  // 首屏底纹的四层必须都是 CSS 画的，且都对读屏隐藏。
  it('paints the hero backdrop with layered CSS instead of assets', () => {
    for (const layer of ['hero-grid', 'hero-scan', 'hero-grain', 'hero-vignette']) {
      expect(source).toContain(`<div class="${layer}" aria-hidden="true" />`)
    }
    expect(source).not.toContain('hero-visual')
    expect(source).not.toContain('hero-scrim')
  })

  // 减少动效下光标必须停在「亮」：它是标题的一部分，关掉动画不该让标题看起来缺一块。
  it('degrades the hero motion gracefully when reduced motion is requested', () => {
    expect(source).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\.hero-caret\s*\{[^}]*animation:\s*none;[^}]*opacity:\s*1;[^}]*\}/s)
    expect(source).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\.hero-packet\s*\{[^}]*animation:\s*none;[^}]*display:\s*none;[^}]*\}/s)
  })

  // 订阅段右栏原来是一张玻璃走廊特写，跟额度/周期/到期日毫无关系。
  // 现在是等宽账本，且栏位值来自 i18n 说明文案 —— 不能改成伪造的用量数字。
  it('replaces the subscription photo with a ledger built from localized copy', () => {
    expect(source).not.toContain('subscription-caption')
    expect(source).not.toContain('subscription-image')
    expect(source).toContain('<figure class="subscription-ledger" data-reveal>')
    expect(source).toContain("{{ t('home.subscription.ledgerLabel') }}")
    expect(source).toMatch(/\.subscription-ledger\s*\{[^}]*font-family:\s*SFMono-Regular/s)
    expect(zhLanding).not.toContain('imageCaption')
    expect(enLanding).not.toContain('imageCaption')
  })

  // 章节序号给六屏长页一个位置感，同时是这页那套终端语汇的一部分。
  it('numbers the sections in a monospaced terminal register', () => {
    for (const n of ['01', '02', '03', '04']) {
      expect(source).toMatch(new RegExp(`<span class="section-counter"[^>]*aria-hidden="true">\\[${n}\\]</span>`))
    }
    expect(source).toMatch(/\.section-counter\s*\{[^}]*font-family:\s*SFMono-Regular/s)
  })

  it('owns the subscription panel contrast instead of relying on the global theme class', () => {
    expect(source).not.toContain('subscription-copy glass-emphasis')
    expect(source).toMatch(/\.subscription-copy\s*\{[^}]*background:\s*rgb\([^;]+\/\s*0\.82\);/s)
    // 边框自己声明（不靠 glass-emphasis），且必须留在琥珀色系里——冷白边是旧照片版的遗留。
    expect(source).toMatch(/\.subscription-copy\s*\{[^}]*border:\s*1px solid rgb\(230 162 60 \/ 0\.14\);/s)
    expect(source).not.toMatch(/\.subscription-copy\s*\{[^}]*rgb\(255 255 255/s)
  })

  it('owns a dark glass navigation surface independently of the global theme', () => {
    expect(source).toContain('<header class="home-nav">')
    expect(source).not.toContain('home-nav glass-nav')
    expect(source).toContain('<RouterLink to="/home" class="brand-wordmark" :aria-label="siteName">')
    expect(source).toMatch(/\.home-nav\s*\{[^}]*background:\s*rgb\(11 13 15 \/ 0\.82\);/s)
    expect(source).toMatch(/\.home-nav\s*\{[^}]*backdrop-filter:\s*blur\(18px\)/s)
    expect(source).toMatch(/\.home-nav\s*\{[^}]*-webkit-backdrop-filter:\s*blur\(18px\)/s)
    expect(source).toMatch(/\.home-nav\s*\{[^}]*box-shadow:\s*inset 0 1px 0/s)
  })

  it('provides opaque local surfaces when reduced transparency is requested', () => {
    expect(source).toMatch(/@media \(prefers-reduced-transparency: reduce\)/)
    expect(source).toMatch(/@media \(prefers-reduced-transparency: reduce\)\s*\{[\s\S]*?\.home-nav\s*\{[^}]*background:\s*#111519;[^}]*backdrop-filter:\s*none;[^}]*-webkit-backdrop-filter:\s*none;[^}]*\}/s)
    expect(source).toMatch(/@media \(prefers-reduced-transparency: reduce\)\s*\{[\s\S]*?\.subscription-copy\s*\{[^}]*background:\s*#14181c;[^}]*backdrop-filter:\s*none;[^}]*-webkit-backdrop-filter:\s*none;[^}]*\}/s)
    expect(source).toMatch(/@media \(prefers-reduced-motion: reduce\)/)
  })

  it('uses asymmetric homepage proportions without weakening contrast', () => {
    expect(source).toContain('grid-template-columns: minmax(0, 1.22fr) minmax(340px, 0.78fr)')
    expect(source).not.toContain('subscription-copy glass-emphasis')
    expect(source).toContain('background: rgb(20 24 28 / 0.82)')
    expect(source).toMatch(/\.models-section > h2\s*\{[^}]*transform:\s*translateX\(/s)
    expect(source).toMatch(/\.visibility-section > div:first-child\s*\{[^}]*transform:\s*translateX\(/s)
    expect(source).toContain('.subscription-section, .visibility-section { grid-template-columns: 1fr; gap: 3.5rem; }')
    expect(source).toContain('.models-section > h2, .models-section > .section-counter, .visibility-section > div:first-child { transform: none; }')
  })

  // 桌面上标题第二行末尾跟着光标，所以 nowrap；窄屏必须放行，
  // 否则 'One interchange.' 会把 390px 视口顶出横向滚动条。
  it('lets the hero title wrap on narrow viewports to avoid horizontal overflow', () => {
    expect(source).toMatch(/\.hero-title-accent\s*\{[^}]*white-space:\s*nowrap;/s)
    expect(source).toMatch(/@media \(max-width: 767px\)\s*\{[\s\S]*?\.hero-title-accent\s*\{[^}]*white-space:\s*normal;[^}]*\}/s)
  })

  // 宽版字符画 66 列，窄屏必须换紧凑版，且数据包（按宽版列偏移写死）要一并撤掉。
  it('swaps to the compact diagram and drops the packets on narrow viewports', () => {
    expect(source).toMatch(/@media \(max-width: 767px\)\s*\{[\s\S]*?\.hero-route-wide\s*\{\s*display:\s*none;\s*\}/s)
    expect(source).toMatch(/@media \(max-width: 767px\)\s*\{[\s\S]*?\.hero-route-narrow\s*\{\s*display:\s*block;\s*\}/s)
    expect(source).toMatch(/@media \(max-width: 767px\)\s*\{[\s\S]*?\.hero-packet\s*\{\s*display:\s*none;\s*\}/s)
  })
})
