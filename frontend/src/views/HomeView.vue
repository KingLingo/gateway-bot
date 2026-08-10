<template>
  <div v-if="hasHomeContent" class="min-h-screen bg-paper dark:bg-dark-950">
    <iframe
      v-if="isHomeContentUrl"
      :src="homeContent.trim()"
      class="h-screen w-full border-0"
      :title="t('home.customHomeTitle')"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
    <div v-else v-html="homeContent" />
  </div>

  <div
    v-else-if="compactHomeEnabled"
    data-testid="compact-home"
    class="flex min-h-[100dvh] items-center justify-center bg-dark-950 px-5 text-dark-50"
  >
    <RouterLink
      :to="dashboardPath"
      class="group flex max-w-lg items-center gap-5 border-l border-primary-500 py-4 pl-5"
    >
      <span>
        <GatewayBrand :logo="siteLogo" :name="siteName" />
        <span class="mt-1 block text-sm text-dark-400">{{ t('home.compactHint') }}</span>
      </span>
      <Icon name="arrowRight" class="ml-auto text-primary-400 transition-transform group-hover:translate-x-1" />
    </RouterLink>
  </div>

  <div
    v-else
    data-testid="gateway-home"
    class="gateway-home"
    :class="{ 'nav-tucked': navTucked, 'reveal-ready': revealReady }"
  >
    <header class="home-nav">
      <RouterLink to="/home" class="brand-wordmark" :aria-label="siteName">
        <GatewayBrand :logo="siteLogo" :name="siteName" mark-class="brand-mark" name-class="brand-name" />
      </RouterLink>

      <div class="flex items-center gap-1 sm:gap-2">
        <a
          v-if="docUrl"
          :href="docUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-link hidden sm:inline-flex"
        >
          {{ t('home.docs') }}
        </a>
        <!-- 这里原来有个主题切换按钮，但落地页是整页深色摄影 + 深色蒙版，
             没有浅色版本可切，点了什么都不会发生。一个点了没反应的控件比没有控件更糟，
             用户会据此判定整页坏了。控制台里的切换是好用的，留在控制台。 -->
        <LocaleSwitcher />
        <RouterLink :to="dashboardPath" class="home-console-link">
          {{ isAuthenticated ? t('home.dashboard') : t('home.login') }}
          <Icon name="arrowRight" size="sm" />
        </RouterLink>
      </div>
    </header>

    <main>
      <section class="hero-section">
        <!-- 原来这里是一整张 Unsplash 玻璃幕墙照片。它是全页最「板正」的一块：
             任何一个 SaaS 落地页都可以换上同一张图而毫无违和，等于没有表达。
             换成自绘的终端底纹 —— 不需要任何静态资源，也不会再被别人撞图。 -->
        <div class="hero-grid" aria-hidden="true" />
        <div class="hero-scan" aria-hidden="true" />
        <div class="hero-grain" aria-hidden="true" />
        <div class="hero-vignette" aria-hidden="true" />

        <div class="hero-content">
          <div class="hero-copy">
            <p class="hero-eyebrow" aria-hidden="true">
              <span class="hero-eyebrow-mark">[ gateway_bot ]</span>{{ t('home.heroEyebrow') }}
            </p>
            <h1 class="hero-title" :aria-label="t('home.title')">
              <span class="hero-title-lead" aria-hidden="true">{{ t('home.titleLead') }}</span>
              <span class="hero-title-accent" aria-hidden="true">
                {{ t('home.titleAccent') }}<span class="hero-caret" aria-hidden="true" />
              </span>
            </h1>
            <p>{{ t('home.description') }}</p>
            <!-- 「改一行环境变量」这句话，不如把那一行直接摆出来。
                 origin 用当前站点真实来源，自托管到任何域名下都不会写错。 -->
            <p class="hero-command" aria-hidden="true">
              <span class="hero-command-prompt">$</span> export ANTHROPIC_BASE_URL={{ apiOrigin }}
            </p>
            <div class="hero-actions">
              <RouterLink :to="dashboardPath" class="hero-primary">
                {{ isAuthenticated ? t('home.goToDashboard') : t('home.getStarted') }}
                <Icon name="arrowRight" size="sm" />
              </RouterLink>
              <a
                v-if="docUrl"
                data-testid="home-docs"
                :href="docUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="hero-secondary"
              >
                {{ t('home.viewDocs') }}
              </a>
            </div>
            <!-- 首屏原来只有情绪，没有事实：Claude / GPT 要滚过三屏才第一次出现。
                 一个持怀疑态度的开发者在首屏就要知道「有哪些模型、跟什么兼容、几个 Key」。 -->
            <p class="hero-proof">{{ t('home.heroProof') }}</p>
          </div>

          <!-- 网关做的事一句话说不清，但一张图两秒就懂。用 box-drawing 字符画，
               因为它零资源、可被下游运营方直接改字符换成自己的模型名，
               而且天然就是这页想说的那种语言。图形本身对读屏是噪音，
               所以整块 aria-hidden，含义交给 figcaption 的那句话。 -->
          <figure class="hero-route">
            <div class="hero-route-art" aria-hidden="true">
              <pre class="hero-route-wide">{{ routeDiagramWide }}</pre>
              <pre class="hero-route-narrow">{{ routeDiagramNarrow }}</pre>
              <span class="hero-packet hero-packet-in" />
              <span class="hero-packet hero-packet-out" />
            </div>
            <figcaption>{{ t('home.heroDiagramLabel') }}</figcaption>
          </figure>

          <!-- 这三条价值点的词条一直躺在 i18n 里没人渲染，而首屏底部正好空着一大块。 -->
          <ul class="hero-foot">
            <li>{{ t('home.heroFoot.subscription') }}</li>
            <li>{{ t('home.heroFoot.keys') }}</li>
            <li>{{ t('home.heroFoot.usage') }}</li>
          </ul>
        </div>
      </section>

      <section class="access-section home-section">
        <div class="section-heading" data-reveal>
          <span class="section-counter" aria-hidden="true">[01]</span>
          <h2>{{ t('home.access.title') }}</h2>
          <p>{{ t('home.access.description') }}</p>
        </div>
        <ol class="access-path">
          <li
            v-for="(step, index) in accessSteps"
            :key="step.title"
            data-reveal
            :style="{ '--reveal-i': index }"
          >
            <span class="step-node" aria-hidden="true">{{ index + 1 }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </li>
        </ol>
        <!-- 「使用统一端点」这句话，对开发者来说不如四行 curl 有说服力。
             base_url 用当前站点真实来源拼出来，不写死示例域名。 -->
        <figure class="access-snippet" data-reveal>
          <figcaption>{{ t('home.access.snippetLabel') }}</figcaption>
          <pre><code>{{ curlSnippet }}</code></pre>
        </figure>
      </section>

      <!-- 这一段原来靠一张玻璃走廊特写撑住右栏，那张图跟「订阅额度」没有任何关系，
           只是在填面积。换成等宽账本：它说的正好就是左边那段话在说的东西。
           栏位值全部来自 i18n，是「你会看到哪几栏」的说明，不是伪造的用量数字。 -->
      <section class="subscription-section home-section">
        <div class="subscription-copy" data-reveal>
          <span class="section-counter" aria-hidden="true">[02]</span>
          <h2>{{ t('home.subscription.title') }}</h2>
          <p>{{ t('home.subscription.description') }}</p>
          <RouterLink to="/subscriptions" class="text-link">
            {{ t('home.subscription.action') }}
            <Icon name="arrowRight" size="sm" />
          </RouterLink>
        </div>
        <figure class="subscription-ledger" data-reveal>
          <figcaption>{{ t('home.subscription.ledgerLabel') }}</figcaption>
          <dl>
            <div v-for="item in subscriptionItems" :key="item.label">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
        </figure>
      </section>

      <section class="models-section home-section">
        <span class="section-counter" data-reveal aria-hidden="true">[03]</span>
        <h2 data-reveal>{{ t('home.models.title') }}</h2>
        <p data-reveal>{{ t('home.models.description') }}</p>
        <div class="model-rail" :aria-label="t('home.models.railLabel')" data-reveal>
          <div class="model-identity model-gpt">
            <ModelIcon model="openai" size="24px" aria-hidden="true" />
            <span>GPT</span>
          </div>
          <div class="model-identity model-claude">
            <ModelIcon model="claude" size="24px" aria-hidden="true" />
            <span>Claude</span>
          </div>
          <div class="model-coming-soon">
            <Icon name="sparkles" size="sm" aria-hidden="true" />
            <span>{{ t('home.models.comingSoon') }}</span>
          </div>
        </div>
      </section>

      <section class="visibility-section home-section">
        <div data-reveal>
          <span class="section-counter" aria-hidden="true">[04]</span>
          <h2>{{ t('home.visibility.title') }}</h2>
          <p>{{ t('home.visibility.description') }}</p>
        </div>
        <div class="visibility-ledger">
          <div
            v-for="(item, index) in visibilityItems"
            :key="item.title"
            data-reveal
            :style="{ '--reveal-i': index }"
          >
            <Icon :name="item.icon" />
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </section>

      <section class="final-section">
        <p data-reveal>{{ t('home.final.eyebrow') }}</p>
        <h2 data-reveal :style="{ '--reveal-i': 1 }">{{ t('home.final.title') }}</h2>
        <RouterLink :to="dashboardPath" class="hero-primary" data-reveal :style="{ '--reveal-i': 2 }">
          {{ isAuthenticated ? t('home.goToDashboard') : t('home.getStarted') }}
          <Icon name="arrowRight" size="sm" />
        </RouterLink>
      </section>
    </main>

    <footer class="home-footer">
      <p>&copy; {{ currentYear }} {{ siteName }}. {{ t('home.footer.allRightsReserved') }}</p>
      <a
        v-if="docUrl"
        :href="docUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ t('home.docs') }}
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore, useAuthStore } from '@/stores'
import Icon from '@/components/icons/Icon.vue'
import GatewayBrand from '@/components/brand/GatewayBrand.vue'
import ModelIcon from '@/components/common/ModelIcon.vue'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import { sanitizeUrl } from '@/utils/url'

const { t } = useI18n()
const appStore = useAppStore()
const authStore = useAuthStore()

const siteName = computed(() => appStore.cachedPublicSettings?.site_name || appStore.siteName || 'Gateway Bot')
const siteLogo = computed(() => sanitizeUrl(appStore.cachedPublicSettings?.site_logo || appStore.siteLogo || '', { allowRelative: true, allowDataUrl: true }))
const docUrl = computed(() => sanitizeUrl(appStore.cachedPublicSettings?.doc_url || appStore.docUrl || ''))
const homeContent = computed(() => appStore.cachedPublicSettings?.home_content || '')
const hasHomeContent = computed(() => homeContent.value.trim().length > 0)
const compactHomeEnabled = computed(() => appStore.cachedPublicSettings?.compact_home_enabled === true)
const isHomeContentUrl = computed(() => /^(https?:\/\/)/.test(homeContent.value.trim()))
const isAuthenticated = computed(() => authStore.isAuthenticated)
const dashboardPath = computed(() => authStore.isAdmin ? '/admin/dashboard' : isAuthenticated.value ? '/dashboard' : '/login')
const currentYear = new Date().getFullYear()
// 网关可以自托管在任何域名下，示例里写死一个域名就是错的
const apiOrigin = computed(() => (typeof window === 'undefined' ? '' : window.location.origin))

// 首屏的路由图。用字符画而不是 SVG/图片，是为了下游运营方能直接改这两个字符串
// 换成自己的模型名，不用回来找设计源文件。
// 列位置是被 CSS 依赖的：.hero-packet 用 ch（等宽字体下 1ch = 一个字符宽）
// 定位到宽版第 3 行的两段横线上，改字符画时这两个偏移量要跟着改。
const routeDiagramWide = [
  '  claude-*  ──┐',
  '              │      ┌─────────────────┐',
  '              ├─────▶│   gateway_bot   │─────▶  ANTHROPIC_BASE_URL',
  '              │      └─────────────────┘        OPENAI_BASE_URL',
  '  gpt-*     ──┘',
].join('\n')

const routeDiagramNarrow = [
  ' claude-*  ─┐   ┌───────────────┐',
  '            ├──▶│  gateway_bot  │──▶  SDK',
  ' gpt-*     ─┘   └───────────────┘',
].join('\n')
const curlSnippet = computed(() => [
  `curl ${apiOrigin.value}/v1/chat/completions \\`,
  '  -H "Authorization: Bearer $GATEWAY_API_KEY" \\',
  '  -H "Content-Type: application/json" \\',
  `  -d '{"model":"MODEL_ID","messages":[{"role":"user","content":"Hello"}]}'`,
].join('\n'))

// 导航原本是 absolute，滚过首屏后「进入控制台」就永久离场了。改成 fixed 常驻，
// 再用下滚收起 / 上滚归位避免它一直占着移动端视口。
const navTucked = ref(false)
// 入场动效的开关：只有 JS 跑起来且用户没要求减少动效时才置 true，
// 否则 [data-reveal] 保持默认可见，不会出现「JS 挂了整页空白」。
const revealReady = ref(false)

const accessSteps = computed(() => [
  { title: t('home.access.choose.title'), description: t('home.access.choose.description') },
  { title: t('home.access.key.title'), description: t('home.access.key.description') },
  { title: t('home.access.call.title'), description: t('home.access.call.description') },
])

const subscriptionItems = computed(() => [
  { label: t('home.subscription.period'), value: t('home.subscription.periodValue') },
  { label: t('home.subscription.quota'), value: t('home.subscription.quotaValue') },
  { label: t('home.subscription.expiry'), value: t('home.subscription.expiryValue') },
])

const visibilityItems = computed(() => [
  { icon: 'link' as const, title: t('home.visibility.session.title'), description: t('home.visibility.session.description') },
  { icon: 'chart' as const, title: t('home.visibility.tracking.title'), description: t('home.visibility.tracking.description') },
  { icon: 'checkCircle' as const, title: t('home.visibility.status.title'), description: t('home.visibility.status.description') },
])

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

let lastScrollY = 0
let scrollQueued = false
let revealObserver: IntersectionObserver | null = null

function handleScroll() {
  if (scrollQueued) return
  scrollQueued = true
  requestAnimationFrame(() => {
    const y = Math.max(window.scrollY, 0)
    // 阈值 160 是为了让首屏顶部的轻微回弹不触发收起
    navTucked.value = y > 160 && y > lastScrollY
    lastScrollY = y
    scrollQueued = false
  })
}

function setupReveal() {
  if (typeof IntersectionObserver === 'undefined') return
  const targets = document.querySelectorAll<HTMLElement>('.gateway-home [data-reveal]')
  if (!targets.length) return

  revealReady.value = true
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-revealed')
        revealObserver?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
  )
  targets.forEach((el) => revealObserver!.observe(el))
}

onMounted(() => {
  authStore.checkAuth()
  if (!appStore.publicSettingsLoaded) appStore.fetchPublicSettings()

  if (prefersReducedMotion()) return
  lastScrollY = Math.max(window.scrollY, 0)
  window.addEventListener('scroll', handleScroll, { passive: true })
  setupReveal()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  revealObserver?.disconnect()
  revealObserver = null
})
</script>

<style scoped>
.gateway-home {
  /* 强调色从原来的鼠尾草绿换成磷光琥珀：绿色在深色底上读作「状态正常」，
     是仪表盘的语言；这页要的是一台还亮着的终端。集中定义，别再散落十几个字面量。 */
  --gb-amber: #e6a23c;
  --gb-amber-soft: #f0c07a;
  --gb-amber-dim: #8a6a2f;

  min-height: 100dvh;
  overflow: hidden;
  background: #0b0d0f;
  color: #f5f7f8;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.home-nav {
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 68px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgb(255 255 255 / 0.12);
  padding: 0 5vw;
  background: rgb(11 13 15 / 0.82);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.08), 0 12px 36px rgb(0 0 0 / 0.2);
  backdrop-filter: blur(18px) saturate(1.12);
  -webkit-backdrop-filter: blur(18px) saturate(1.12);
  transition: transform 320ms cubic-bezier(.2,.7,.2,1);
}
.nav-tucked .home-nav { transform: translateY(-100%); }
/* 收起的导航仍然在 tab 顺序里。不把它放回来，键盘用户会把焦点交给一个不可见的按钮。 */
.nav-tucked .home-nav:focus-within { transform: none; }

.brand-wordmark,
:deep(.brand-name),
.hero-actions,
.home-console-link,
.hero-primary,
.hero-secondary,
.nav-icon,
.nav-link,
.text-link {
  display: inline-flex;
  align-items: center;
}

.brand-wordmark { gap: 0.75rem; }
:deep(.brand-mark) { height: 2rem; width: 2rem; }
:deep(.brand-name) { font-size: 0.95rem; }
.nav-link { height: 40px; padding: 0 0.75rem; color: #ccd3d9; font-size: 0.875rem; }
.nav-icon { height: 40px; width: 40px; justify-content: center; border-radius: 6px; color: #ccd3d9; }
.nav-icon:hover, .nav-link:hover { background: rgb(242 240 234 / 0.08); color: #fff; }
.home-console-link {
  height: 40px;
  gap: 0.5rem;
  border: 1px solid rgb(255 255 255 / 0.28);
  border-radius: 6px;
  padding: 0 0.9rem;
  font-size: 0.875rem;
  font-weight: 600;
}
.home-console-link:hover { border-color: var(--gb-amber); color: var(--gb-amber-soft); }

.hero-section {
  position: relative;
  display: flex;
  min-height: 92dvh;
  align-items: flex-end;
  isolation: isolate;
  overflow: hidden;
}

/* ---- 首屏底纹 ----
   四层全部是 CSS 画的，没有任何静态资源：
   grid 是机房栅格，scan 是 CRT 扫描线，grain 是原来那层噪点，
   vignette 负责把四角压暗、并在文案背后留一团琥珀余温。 */
.hero-grid, .hero-scan, .hero-grain, .hero-vignette { position: absolute; inset: 0; }
.hero-grid {
  z-index: 0;
  opacity: 0.5;
  background-image:
    repeating-linear-gradient(90deg, rgb(230 162 60 / 0.05) 0 1px, transparent 1px 88px),
    repeating-linear-gradient(0deg, rgb(230 162 60 / 0.05) 0 1px, transparent 1px 88px);
}
/* 扫描线必须很淡：超过 4% 就从「氛围」变成「屏幕坏了」，
   而且在低 DPI 屏上会跟像素栅格打架产生摩尔纹。 */
.hero-scan {
  z-index: 1;
  opacity: 0.55;
  background-image: repeating-linear-gradient(0deg, rgb(0 0 0 / 0.32) 0 1px, transparent 1px 3px);
}
.hero-vignette {
  z-index: 2;
  background:
    radial-gradient(120% 90% at 22% 62%, rgb(230 162 60 / 0.11), transparent 58%),
    radial-gradient(100% 100% at 50% 50%, transparent 38%, rgb(11 13 15 / 0.72) 100%);
}
.hero-grain { z-index: 3; opacity: 0.16; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.38'/%3E%3C/svg%3E"); mix-blend-mode: soft-light; }

.hero-content {
  position: relative;
  z-index: 4;
  display: grid;
  width: 100%;
  grid-template-areas: "copy route" "foot foot";
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 0 clamp(2rem, 4vw, 4.5rem);
  padding: 9rem 8vw 5rem;
}
.hero-copy { grid-area: copy; max-width: 760px; animation: hero-enter 700ms cubic-bezier(.2,.7,.2,1) both; }
.hero-eyebrow { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.6rem; margin-bottom: 1.5rem; color: #968f84; font-family: SFMono-Regular, Menlo, monospace; font-size: 0.74rem; letter-spacing: 0.08em; }
.hero-eyebrow-mark { color: var(--gb-amber); }
.hero-title { display: grid; width: min(100%, 12em); font-size: clamp(2.7rem, 5.1vw, 5rem); font-weight: 560; line-height: 1.1; letter-spacing: -0.005em; }
.hero-title-lead { justify-self: start; color: #f2f4f5; }
/* 光标跟在第二行末尾，所以这一行不能换行，否则光标会被甩到独立一行去 */
.hero-title-accent { justify-self: start; color: var(--gb-amber); white-space: nowrap; }
.hero-caret { display: inline-block; width: 0.48em; height: 0.82em; margin-left: 0.14em; background: var(--gb-amber); vertical-align: -0.04em; animation: caret-blink 1.06s steps(1, end) infinite; }
.hero-copy > p:not(.hero-proof):not(.hero-command):not(.hero-eyebrow) { margin-top: 1.5rem; max-width: 36rem; color: #b8b1a6; font-size: clamp(1rem, 1.35vw, 1.2rem); line-height: 1.75; }
/* 「改一行环境变量」这句承诺，摆出那一行本身最有说服力 */
.hero-command {
  margin-top: 1.5rem;
  overflow-x: auto;
  border: 1px solid rgb(230 162 60 / 0.24);
  border-radius: 8px;
  padding: 0.7rem 0.9rem;
  background: rgb(230 162 60 / 0.05);
  color: var(--gb-amber-soft);
  font-family: SFMono-Regular, Menlo, monospace;
  font-size: 0.8rem;
  white-space: nowrap;
}
.hero-command-prompt { margin-right: 0.5rem; color: var(--gb-amber); user-select: none; }
.hero-proof { margin-top: 1.5rem; color: #968f84; font-family: SFMono-Regular, Menlo, monospace; font-size: 0.78rem; letter-spacing: 0.02em; }
.hero-actions { margin-top: 2rem; flex-wrap: wrap; gap: 0.75rem; }
.hero-primary, .hero-secondary { min-height: 44px; border-radius: 8px; padding: 0.7rem 1.1rem; font-size: 0.9rem; font-weight: 650; }
.hero-primary { gap: 0.6rem; background: var(--gb-amber); color: #17120a; }
.hero-primary:hover { background: var(--gb-amber-soft); }

/* ---- 首屏路由图 ----
   .hero-packet 的 left 用 ch 定位到字符画第 3 行的两段横线上（等宽字体 1ch = 一个字符宽），
   top 用 line-height 反推行号。所以 .hero-route-art 与内部 pre 必须共享同一个
   font-size / line-height，否则包会飘到线外。 */
.hero-route {
  grid-area: route;
  max-width: 100%;
  border: 1px solid rgb(255 255 255 / 0.1);
  border-radius: 8px;
  padding: 1.1rem 1.25rem 0.9rem;
  background: rgb(11 13 15 / 0.55);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.06);
  animation: hero-enter 700ms cubic-bezier(.2,.7,.2,1) both;
  animation-delay: 100ms;
}
.hero-route-art {
  position: relative;
  overflow-x: auto;
  color: #7f8a92;
  font-family: SFMono-Regular, Menlo, monospace;
  font-size: clamp(0.58rem, 0.85vw, 0.78rem);
  line-height: 1.6;
}
.hero-route-art pre { font: inherit; }
.hero-route-narrow { display: none; }
.hero-route figcaption { margin-top: 1rem; border-top: 1px solid rgb(255 255 255 / 0.08); padding-top: 0.75rem; max-width: 34ch; color: #7d766c; font-size: 0.72rem; line-height: 1.55; }
.hero-packet {
  position: absolute;
  top: calc(2 * 1.6em + 0.8em);
  height: 2px;
  width: 1ch;
  border-radius: 1px;
  background: var(--gb-amber);
  box-shadow: 0 0 6px rgb(230 162 60 / 0.85);
  transform: translateY(-50%);
  opacity: 0;
}
.hero-packet-in { animation: packet-in 2.8s steps(6, end) infinite; }
.hero-packet-out { animation: packet-out 2.8s steps(5, end) infinite; animation-delay: 900ms; }
@keyframes packet-in {
  0% { left: 15ch; opacity: 0; }
  6% { opacity: 1; }
  32% { left: 21ch; opacity: 1; }
  38%, 100% { left: 21ch; opacity: 0; }
}
@keyframes packet-out {
  0% { left: 41ch; opacity: 0; }
  6% { opacity: 1; }
  28% { left: 46ch; opacity: 1; }
  34%, 100% { left: 46ch; opacity: 0; }
}
@keyframes caret-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

.hero-foot {
  grid-area: foot;
  margin-top: clamp(3rem, 7vw, 6rem);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid rgb(223 233 224 / 0.16);
  animation: hero-enter 700ms cubic-bezier(.2,.7,.2,1) both;
  animation-delay: 160ms;
}
.hero-foot li { padding: 1.1rem 1.25rem 0 0; color: #c8c1b5; font-size: 0.9rem; letter-spacing: 0.01em; }
.hero-foot li + li { border-left: 1px solid rgb(223 233 224 / 0.16); padding-left: 1.75rem; }
.hero-secondary { border: 1px solid rgb(255 255 255 / 0.34); color: #f5f7f8; }
.hero-secondary:hover { border-color: #f5f7f8; }

.home-section { padding: clamp(5rem, 9vw, 9rem) 8vw; }
.section-heading { max-width: 880px; }
/* 章节序号：整页六屏原本没有任何位置感，滚到第四屏时不知道还剩多少。
   等宽方括号编号既补上进度，也是这页选定的那套终端语汇的一部分。 */
.section-counter { display: block; margin-bottom: 1.1rem; color: var(--gb-amber); font-family: SFMono-Regular, Menlo, monospace; font-size: 0.74rem; letter-spacing: 0.14em; }
/* 原来五个 section 的 h2 全是 4.6vw，整页六屏用同一个音量在喊，等于没有层级。
   正文段落降到 3.4vw，只把最大号留给收尾的行动召唤。 */
.section-heading h2, .subscription-copy h2, .models-section h2, .visibility-section h2, .final-section h2 { font-size: clamp(2rem, 3.4vw, 3.25rem); font-weight: 560; line-height: 1.08; }
.final-section h2 { font-size: clamp(2.5rem, 4.6vw, 4.5rem); }

/* ---- 中文标题的断行 ----
   中文没有词间空格，浏览器可以在任意两个字之间断行，所以一个放不下的标题会被
   切成「订阅不 / 是一笔模 / 糊的余额」这种词内断裂。这在中文里是明确的排版事故。
   治本的办法不是调断行规则（CSS 管不了中文词边界），而是让标题真的放得下：
   窄栏里的标题必须用配得上栏宽的字号，不能继续吃 4.6vw 这个视口尺寸。
   下面两条按各自容器实测宽度定档（订阅面板内宽约 347px、可见性左栏约 432px）。 */
.subscription-copy h2 { font-size: clamp(1.6rem, 2.15vw, 2.15rem); }
.visibility-section h2 { font-size: clamp(1.75rem, 2.9vw, 2.9rem); }

/* text-wrap: balance 是为拉丁文的参差右边界设计的；中文里它只会把「用量」
   这类双字词拆到两行去，所以只给英文开。 */
.section-heading h2:lang(en),
.subscription-copy h2:lang(en),
.models-section h2:lang(en),
.visibility-section h2:lang(en),
.final-section h2:lang(en) { text-wrap: balance; }

.section-heading p, .subscription-copy > p, .models-section > p, .visibility-section > div > p { margin-top: 1.25rem; max-width: 38rem; color: #968f84; line-height: 1.75; text-wrap: pretty; }

.access-section { background: #14181c; }
/* 「只需三步」是一个序列，序列在桌面端应该横着读。原来三步纵向堆叠、每行末尾还挂一个
   向右的箭头，箭头指向的是页面外边距而不是下一步——版式和内容互相矛盾。
   改成三列并排，用竖向细线 + 序号承担顺序感，箭头因此可以整个去掉。 */
.access-path { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 5rem; border-top: 1px solid #32393f; }
.access-path li { position: relative; padding: 2.5rem 2.5rem 2.5rem 0; }
.access-path li + li { border-left: 1px solid #33302a; padding-left: 2.5rem; }
.step-node { margin-bottom: 1.25rem; }
/* 序号原来是圆角胶囊。这页已经统一在方括号编号那套语汇上，圆形在这里是外来物。 */
.step-node { display: inline-flex; height: 1.75rem; width: 1.75rem; align-items: center; justify-content: center; border: 1px solid var(--gb-amber-dim); border-radius: 4px; color: var(--gb-amber); font-family: SFMono-Regular, Menlo, monospace; font-size: 0.72rem; }
.access-path h3 { font-size: 1.5rem; font-weight: 580; }
.access-path p { margin-top: 0.5rem; color: #968f84; }

.access-snippet { margin-top: 3.5rem; overflow-x: auto; border: 1px solid #33302a; border-radius: 8px; background: #0e0d0c; }
/* 给 curl 块加一排终端窗口按钮。纯装饰、不可点，所以只能是 ::before 而不是真元素——
   真元素会进无障碍树，读屏会念出三个没有意义的圆点。 */
.access-snippet figcaption { display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid #33302a; padding: 0.7rem 1.25rem; color: #968f84; font-family: SFMono-Regular, Menlo, monospace; font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; }
.access-snippet figcaption::before { content: '●  ●  ●'; color: #3a352d; font-size: 0.6rem; letter-spacing: -0.04em; }
.access-snippet pre { padding: 1.25rem; color: #d6cfc2; font-family: SFMono-Regular, Menlo, monospace; font-size: 0.82rem; line-height: 1.85; }

.subscription-section { display: grid; grid-template-columns: minmax(0, 1.22fr) minmax(340px, 0.78fr); gap: 8vw; align-items: center; background: #0b0d0f; color: #f5f7f8; }
.subscription-copy {
  /* 边框和高光原来是冷白的，配的是右栏那张玻璃幕墙照片。照片换成暖色等宽账本之后，
     它成了整页唯一一道冷白边——改成同一族的琥珀，让这一行的两块面板看起来是一对。
     底色和不透明度不动：它们和下面 prefers-reduced-transparency 的降级是一套的。 */
  border: 1px solid rgb(230 162 60 / 0.14);
  border-radius: 8px;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background: rgb(20 24 28 / 0.82);
  box-shadow: inset 0 1px 0 rgb(230 162 60 / 0.08), 0 24px 60px rgb(0 0 0 / 0.22);
  /* 这里没有 backdrop-filter：这块面板背后是纯色 #0b0d0f，模糊一层纯色什么都看不出来，
     只白白换来一个合成层。导航的毛玻璃背后确实有内容，那一处保留。 */
}
.subscription-copy > p { color: #a29b90; }

/* 右栏原来是一张玻璃走廊特写。图跟额度、周期、到期日毫无关系，纯粹在填面积。
   换成等宽账本：说的正好就是左边那段话在说的东西，且不需要任何静态资源。
   ⚠️ 这里的值来自 i18n，是「你会看到哪几栏」的说明，不是伪造的用量数字——
   摆一个假的 62% 进度条会好看得多，但那是在页面上撒谎。 */
.subscription-ledger {
  overflow: hidden;
  border: 1px solid #33302a;
  border-radius: 8px;
  background: #0e0d0c;
  font-family: SFMono-Regular, Menlo, monospace;
}
.subscription-ledger figcaption { border-bottom: 1px solid #33302a; padding: 0.7rem 1.25rem; color: #968f84; font-size: 0.72rem; letter-spacing: 0.06em; }
.subscription-ledger dl { padding: 0.5rem 1.25rem 1rem; }
.subscription-ledger dl div { display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px dashed #2b2823; padding: 1rem 0; }
.subscription-ledger dl div:last-child { border-bottom: 0; }
.subscription-ledger dt { flex-shrink: 0; color: #968f84; font-size: 0.8rem; }
.subscription-ledger dd { color: var(--gb-amber-soft); font-size: 0.8rem; text-align: right; }
.text-link { margin-top: 2rem; gap: 0.5rem; color: var(--gb-amber); font-weight: 650; }

.models-section { background: #0b0d0f; }
.models-section > h2 { transform: translateX(0.8rem); }
.models-section > p { color: #a29b90; }
.models-section > .section-counter { transform: translateX(0.8rem); }
/* 最宽的一格原本给了「敬请期待」，把版面让给了唯一没有内容的东西 */
.model-rail { display: grid; grid-template-columns: 1.2fr 1.2fr .6fr; margin-top: 4rem; border: 1px solid #33302a; border-radius: 8px; overflow: hidden; }
.model-identity, .model-coming-soon { display: flex; align-items: center; gap: 0.75rem; min-height: 104px; padding: 1.5rem; font-size: 1.1rem; font-weight: 620; }
.model-identity + .model-identity, .model-coming-soon { border-left: 1px solid #33302a; }
.model-gpt { color: #e4e8eb; }
.model-claude { color: #d5a391; }
.model-coming-soon { color: #a29b90; font-size: .875rem; font-weight: 500; }

.visibility-section { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 9vw; background: #14181c; }
.visibility-section > div:first-child { transform: translateX(-0.8rem); }
.visibility-ledger { border-top: 1px solid #33302a; }
.visibility-ledger > div { display: grid; grid-template-columns: 2rem 1fr; column-gap: 1rem; border-bottom: 1px solid #33302a; padding: 1.5rem 0; }
.visibility-ledger svg { grid-row: 1 / span 2; color: var(--gb-amber); }
.visibility-ledger h3 { font-weight: 620; }
.visibility-ledger p { margin-top: 0.35rem; color: #968f84; font-size: 0.88rem; line-height: 1.6; }

/* 收尾原来是一整块鼠尾草绿。整页最后一屏是全站唯一的换底色处，
   它决定了用户合上页面时记住的是什么颜色，所以必须跟琥珀是同一家。 */
.final-section { display: grid; min-height: 70dvh; place-items: center; align-content: center; gap: 2rem; padding: 6rem 5vw; background: #1c1710; text-align: center; }
.final-section > p { color: var(--gb-amber-soft); font-family: SFMono-Regular, Menlo, monospace; font-size: 0.8rem; letter-spacing: 0.04em; }
/* 12ch 是按英文标题的理想行长定的；中文「从一个 API Key 开始」在这个宽度下会把
   「开始」孤零零挤到第二行，所以中文放宽到刚好一行放得下。 */
.final-section h2 { max-width: 17ch; }
.final-section h2:lang(en) { max-width: 12ch; }
.home-footer { display: flex; justify-content: space-between; gap: 2rem; border-top: 1px solid #33302a; padding: 2rem 5vw; color: #8a847b; font-size: 0.78rem; }
.home-footer a:hover { color: #f5f7f8; }

/* ---- 交互状态 ----
   原来 hover 只换颜色且没有 transition，是硬切；也没有按压反馈。
   :active 规则必须排在 :hover 之后（同优先级按源码顺序生效）。 */
.home-console-link,
.hero-primary,
.hero-secondary,
.nav-icon,
.nav-link,
.text-link,
.home-footer a {
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms cubic-bezier(.2,.7,.2,1);
}
.hero-primary:hover, .hero-secondary:hover { transform: translateY(-1px); }
.home-console-link:active,
.hero-primary:active,
.hero-secondary:active,
.nav-icon:active,
.nav-link:active { transform: translateY(1px); }

.home-console-link :deep(svg),
.hero-primary :deep(svg),
.text-link :deep(svg) { transition: transform 200ms cubic-bezier(.2,.7,.2,1); }
.home-console-link:hover :deep(svg),
.hero-primary:hover :deep(svg),
.text-link:hover :deep(svg) { transform: translateX(3px); }
.text-link:hover { color: var(--gb-amber-soft); }

/* 全局 :focus-visible 用的是 --gb-brand(#405647)，落在本页固定的 #0b0d0f 底上
   只有 2.44:1，低于 WCAG 2.2 对焦点指示器要求的 3:1。琥珀在同一个底上是 8.9:1。
   这里写字面量而不是 var()：compact-home 分支不在 .gateway-home 里，拿不到那三个自定义属性。 */
.gateway-home :deep(*:focus-visible),
[data-testid="compact-home"] :deep(*:focus-visible) {
  outline: 2px solid #e6a23c;
  outline-offset: 3px;
}

/* ---- 入场动效 ----
   .reveal-ready 只有 JS 挂载且未开启「减少动效」时才加上，
   因此无 JS / 减少动效场景下 [data-reveal] 始终是可见的常态。 */
.reveal-ready [data-reveal] { opacity: 0; transform: translateY(16px); }
.reveal-ready [data-reveal].is-revealed {
  opacity: 1;
  transform: none;
  transition:
    opacity 620ms cubic-bezier(.2,.7,.2,1) calc(var(--reveal-i, 0) * 70ms),
    transform 620ms cubic-bezier(.2,.7,.2,1) calc(var(--reveal-i, 0) * 70ms);
}

@keyframes hero-enter { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 767px) {
  .home-nav { height: 62px; padding: 0 1rem; }
  :deep(.brand-name) { display: none; }
  .home-console-link { padding: 0 0.7rem; }
  .hero-section { min-height: 94dvh; }
  /* 两栏在 390px 下放不下，回到单列：文案在上、路由图在下 */
  .hero-content { display: block; padding: 7.5rem 1.25rem 6rem; }
  .hero-title { width: 100%; font-size: clamp(2.3rem, 10.4vw, 3.4rem); }
  /* 桌面上第二行末尾跟着光标所以不能换行；窄屏里长英文标题必须放行，
     否则 nowrap 会把「One interchange.」顶出视口造成横向溢出。 */
  .hero-title-accent { white-space: normal; }
  .hero-copy > p:not(.hero-proof):not(.hero-command):not(.hero-eyebrow) { max-width: 22rem; font-size: 0.98rem; }
  /* 窄屏让这行命令折行，而不是留一条只能横滑的单行：
     apiOrigin 是运行时变量，域名一长必定溢出，触屏上横滑比换行难用得多。 */
  .hero-command { font-size: 0.68rem; overflow-x: visible; white-space: normal; overflow-wrap: anywhere; line-height: 1.75; }
  .hero-proof { font-size: 0.72rem; }
  /* 宽版字符画 66 列，窄屏放不下，换成 36 列的紧凑版。
     数据包动画是按宽版的列偏移写死的，所以一并撤掉。 */
  .hero-route { margin-top: 2.5rem; padding: 0.9rem 1rem 0.75rem; }
  .hero-route-art { font-size: 0.66rem; }
  .hero-route-wide { display: none; }
  .hero-route-narrow { display: block; }
  .hero-packet { display: none; }
  /* 三列在 390px 下每列只剩 40 多 px，必须竖排；分隔线也从竖改横 */
  .hero-foot { margin-top: 2.5rem; grid-template-columns: 1fr; }
  .hero-foot li { padding: 0.75rem 0; font-size: 0.85rem; }
  .hero-foot li + li { border-left: 0; border-top: 1px solid rgb(223 233 224 / 0.16); padding-left: 0; }
  .home-section { padding: 5rem 1.25rem; }
  .access-snippet { margin-top: 2.5rem; }
  /* 窄屏上让它折行，而不是逼用户横向拖着读一条 curl */
  .access-snippet pre { padding: 1rem; font-size: 0.72rem; white-space: pre-wrap; overflow-wrap: anywhere; }
  .access-path { margin-top: 3rem; }
  /* 窄屏放不下三列，回到纵向堆叠：分隔线从竖线换成横线 */
  .access-path { grid-template-columns: 1fr; }
  .access-path li { display: grid; grid-template-columns: 2.5rem 1fr; gap: 0.75rem; padding: 1.75rem 0; }
  .access-path li + li { border-left: 0; border-top: 1px solid #303c35; padding-left: 0; }
  .step-node { margin-bottom: 0; }
  .subscription-section, .visibility-section { grid-template-columns: 1fr; gap: 3.5rem; }
  .models-section > h2, .models-section > .section-counter, .visibility-section > div:first-child { transform: none; }
  .subscription-ledger dl { padding: 0.25rem 1rem 0.75rem; }
  .subscription-ledger dl div { flex-direction: column; gap: 0.3rem; }
  .subscription-ledger dd { text-align: left; }
  .model-rail { grid-template-columns: 1fr; margin-right: 0; }
  .model-identity, .model-coming-soon { min-height: 76px; padding: 1.1rem 1.25rem; }
  .model-identity + .model-identity, .model-coming-soon { border-top: 1px solid #32393f; border-left: 0; }
  .final-section { min-height: 62dvh; padding: 5rem 1.25rem; }
  .home-footer { flex-direction: column; padding: 2rem 1.25rem; }
}

@media (prefers-reduced-transparency: reduce) {
  .home-nav {
    background: #111519;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .subscription-copy {
    background: #14181c;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-copy, .hero-foot, .hero-route { animation: none; }
  /* 闪烁光标停在「亮」而不是消失：它是标题的一部分，关掉动画不该让标题看起来缺了一块。
     数据包整体撤掉——它只有在动的时候才有意义，静止时是线上两个无解释的色块。 */
  .hero-caret { animation: none; opacity: 1; }
  .hero-packet { animation: none; display: none; }
  .home-nav { transition: none; }
  .nav-tucked .home-nav { transform: none; }
  .reveal-ready [data-reveal] { opacity: 1; transform: none; }
  .home-console-link,
  .hero-primary,
  .hero-secondary,
  .nav-icon,
  .nav-link,
  .text-link,
  .home-footer a,
  .home-console-link :deep(svg),
  .hero-primary :deep(svg),
  .text-link :deep(svg) { transition: none; }
  .hero-primary:hover,
  .hero-secondary:hover,
  .home-console-link:hover :deep(svg),
  .hero-primary:hover :deep(svg),
  .text-link:hover :deep(svg) { transform: none; }
}
</style>
