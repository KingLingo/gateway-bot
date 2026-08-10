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
        <picture class="hero-visual" aria-hidden="true">
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcset="/media/gateway-architecture-mobile.webp"
            width="385"
            height="1400"
          />
          <source
            media="(max-width: 767px)"
            srcset="/media/gateway-architecture-mobile.jpg"
            width="385"
            height="1400"
          />
          <source
            type="image/webp"
            srcset="/media/gateway-architecture-desktop.webp"
            width="1600"
            height="938"
          />
          <img
            src="/media/gateway-architecture-desktop.jpg"
            alt=""
            width="1600"
            height="938"
            fetchpriority="high"
          />
        </picture>
        <div class="hero-scrim" />
        <div class="hero-grain" />

        <div class="hero-content">
          <div class="hero-copy">
            <h1 class="hero-title" :aria-label="t('home.title')">
              <span class="hero-title-lead" aria-hidden="true">{{ t('home.titleLead') }}</span>
              <span class="hero-title-art" aria-hidden="true">
                <span class="hero-title-reach" aria-hidden="true">{{ t('home.titleReach') }}</span>
                <span class="hero-title-near" aria-hidden="true">{{ t('home.titleNear') }}</span>
              </span>
            </h1>
            <p>{{ t('home.description') }}</p>
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

          <!-- 这三条价值点的词条一直躺在 i18n 里没人渲染，而首屏底部正好空着一大块。
               放成一条细分隔的横排，既补上首屏该说的话，也压住图片底部的留白。 -->
          <ul class="hero-foot">
            <li>{{ t('home.heroFoot.subscription') }}</li>
            <li>{{ t('home.heroFoot.keys') }}</li>
            <li>{{ t('home.heroFoot.usage') }}</li>
          </ul>
        </div>
      </section>

      <section class="access-section home-section">
        <div class="section-heading" data-reveal>
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

      <section class="subscription-section home-section">
        <div class="subscription-image" data-reveal>
          <picture>
            <source type="image/webp" srcset="/media/gateway-access-detail.webp" width="491" height="736" />
            <img
              src="/media/gateway-access-detail.jpg"
              :alt="t('home.subscription.imageAlt')"
              width="491"
              height="736"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <span class="subscription-caption">{{ t('home.subscription.imageCaption') }}</span>
        </div>
        <div class="subscription-copy" data-reveal>
          <h2>{{ t('home.subscription.title') }}</h2>
          <p>{{ t('home.subscription.description') }}</p>
          <dl>
            <div v-for="item in subscriptionItems" :key="item.label">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
          <RouterLink to="/subscriptions" class="text-link">
            {{ t('home.subscription.action') }}
            <Icon name="arrowRight" size="sm" />
          </RouterLink>
        </div>
      </section>

      <section class="models-section home-section">
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
.home-console-link:hover { border-color: #a5c1a9; color: #dfe9e0; }

.hero-section {
  position: relative;
  display: flex;
  min-height: 92dvh;
  align-items: flex-end;
  isolation: isolate;
  overflow: hidden;
}
.hero-visual, .hero-scrim, .hero-grain { position: absolute; inset: 0; }
.hero-visual img { height: 100%; width: 100%; object-fit: cover; filter: saturate(0.25) contrast(1.1) brightness(0.62); }
.hero-scrim { z-index: 1; background: linear-gradient(90deg, rgb(11 13 15 / 0.98) 0%, rgb(11 13 15 / 0.84) 40%, rgb(11 13 15 / 0.18) 76%), linear-gradient(0deg, rgb(11 13 15 / 0.9), transparent 54%); }
.hero-grain { z-index: 2; opacity: 0.16; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.38'/%3E%3C/svg%3E"); mix-blend-mode: soft-light; }
.hero-content { position: relative; z-index: 3; display: grid; width: 100%; grid-template-columns: minmax(0, 1fr); align-items: end; padding: 8.5rem 8vw 6rem; }
.hero-copy { max-width: 760px; animation: hero-enter 700ms cubic-bezier(.2,.7,.2,1) both; }
.hero-title { display: grid; width: min(100%, 9.4em); font-size: clamp(3.4rem, 6.2vw, 6.4rem); font-weight: 560; line-height: 1.08; letter-spacing: 0; }
.hero-title-lead { justify-self: start; white-space: nowrap; }
.hero-title-art { display: flex; justify-self: end; align-items: baseline; gap: 0.16em; white-space: nowrap; transform: translateX(0.22em); }
.hero-title-reach { color: #f2f4f5; font-family: "Songti SC", "STSong", "Noto Serif SC", serif; font-weight: 700; letter-spacing: -0.12em; }
.hero-title-near { color: #a6cbaa; font-family: "Kaiti SC", "STKaiti", "Noto Serif SC", serif; font-weight: 600; letter-spacing: -0.08em; transform: translateY(0.08em) rotate(-2deg); }
.hero-copy > p:not(.hero-proof) { margin-top: 1.5rem; max-width: 36rem; color: #b2bbc3; font-size: clamp(1rem, 1.35vw, 1.2rem); line-height: 1.75; }
.hero-proof { margin-top: 1.5rem; color: #94a198; font-family: SFMono-Regular, Menlo, monospace; font-size: 0.78rem; letter-spacing: 0.02em; }
.hero-actions { margin-top: 2rem; flex-wrap: wrap; gap: 0.75rem; }
.hero-primary, .hero-secondary { min-height: 44px; border-radius: 6px; padding: 0.7rem 1.1rem; font-size: 0.9rem; font-weight: 650; }
.hero-primary { gap: 0.6rem; background: #dfe9e0; color: #172018; }
.hero-primary:hover { background: #f0f5f1; }

.hero-foot {
  margin-top: clamp(3rem, 7vw, 6rem);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid rgb(223 233 224 / 0.16);
  animation: hero-enter 700ms cubic-bezier(.2,.7,.2,1) both;
  animation-delay: 160ms;
}
.hero-foot li { padding: 1.1rem 1.25rem 0 0; color: #c3ccd2; font-size: 0.9rem; letter-spacing: 0.01em; }
.hero-foot li + li { border-left: 1px solid rgb(223 233 224 / 0.16); padding-left: 1.75rem; }
.hero-secondary { border: 1px solid rgb(255 255 255 / 0.34); color: #f5f7f8; }
.hero-secondary:hover { border-color: #f5f7f8; }

.home-section { padding: clamp(5rem, 9vw, 9rem) 8vw; }
.section-heading { max-width: 880px; }
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

.section-heading p, .subscription-copy > p, .models-section > p, .visibility-section > div > p { margin-top: 1.25rem; max-width: 38rem; color: #94a198; line-height: 1.75; text-wrap: pretty; }

.access-section { background: #14181c; }
/* 「只需三步」是一个序列，序列在桌面端应该横着读。原来三步纵向堆叠、每行末尾还挂一个
   向右的箭头，箭头指向的是页面外边距而不是下一步——版式和内容互相矛盾。
   改成三列并排，用竖向细线 + 序号承担顺序感，箭头因此可以整个去掉。 */
.access-path { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 5rem; border-top: 1px solid #32393f; }
.access-path li { position: relative; padding: 2.5rem 2.5rem 2.5rem 0; }
.access-path li + li { border-left: 1px solid #303c35; padding-left: 2.5rem; }
.step-node { margin-bottom: 1.25rem; }
.step-node { display: inline-flex; height: 1.75rem; width: 1.75rem; align-items: center; justify-content: center; border: 1px solid #7fa286; border-radius: 999px; color: #dfe9e0; font-family: SFMono-Regular, Menlo, monospace; font-size: 0.72rem; }
.access-path h3 { font-size: 1.5rem; font-weight: 580; }
.access-path p { margin-top: 0.5rem; color: #94a198; }

.access-snippet { margin-top: 3.5rem; overflow-x: auto; border: 1px solid #32393f; border-radius: 8px; background: #0f1316; }
.access-snippet figcaption { border-bottom: 1px solid #32393f; padding: 0.7rem 1.25rem; color: #94a198; font-family: SFMono-Regular, Menlo, monospace; font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; }
.access-snippet pre { padding: 1.25rem; color: #cfd8d2; font-family: SFMono-Regular, Menlo, monospace; font-size: 0.82rem; line-height: 1.85; }

.subscription-section { display: grid; grid-template-columns: minmax(0, 1.22fr) minmax(340px, 0.78fr); gap: 8vw; align-items: center; background: #0b0d0f; color: #f5f7f8; }
.subscription-image { position: relative; min-height: 560px; overflow: hidden; border-radius: 8px; }
.subscription-image::after { position: absolute; inset: 0; content: ''; background: linear-gradient(0deg, rgb(15 21 18 / 0.68), transparent 48%); }
/* picture 只是 webp/jpg 的选择器容器，不应该在布局里留下一个空的行内盒 */
.subscription-image picture { display: contents; }
.subscription-image img { position: absolute; inset: 0; height: 100%; width: 100%; object-fit: cover; filter: saturate(0.45) sepia(0.16) hue-rotate(70deg); }
.subscription-caption {
  position: absolute;
  z-index: 2;
  bottom: 1.25rem;
  left: 1.25rem;
  display: inline-flex;
  max-width: calc(100% - 2.5rem);
  align-items: center;
  border: 1px solid rgb(255 255 255 / 0.18);
  border-radius: 999px;
  padding: 0.65rem 0.9rem;
  background: rgb(11 13 15 / 0.78);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.12), 0 8px 24px rgb(0 0 0 / 0.2);
  color: #f5f7f8;
  backdrop-filter: blur(14px) saturate(1.15);
  font-size: 0.9rem;
  font-weight: 560;
  line-height: 1.4;
  -webkit-backdrop-filter: blur(14px) saturate(1.15);
}
.subscription-copy {
  border: 1px solid rgb(255 255 255 / 0.14);
  border-radius: 8px;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background: rgb(20 24 28 / 0.82);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.08), 0 24px 60px rgb(0 0 0 / 0.22);
  /* 这里没有 backdrop-filter：这块面板背后是纯色 #0b0d0f，模糊一层纯色什么都看不出来，
     只白白换来一个合成层。导航和图注的毛玻璃背后确实有内容，那两处保留。 */
}
.subscription-copy > p { color: #9da6ae; }
.subscription-copy dl { margin-top: 3rem; border-top: 1px solid #32393f; }
.subscription-copy dl div { display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px solid #32393f; padding: 1rem 0; }
.subscription-copy dt { color: #9da6ae; font-size: 0.85rem; }
.subscription-copy dd { font-weight: 600; }
.text-link { margin-top: 2rem; gap: 0.5rem; color: #c5d8c7; font-weight: 650; }

.models-section { background: #0b0d0f; }
.models-section > h2 { transform: translateX(0.8rem); }
.models-section > p { color: #9da6ae; }
/* 最宽的一格原本给了「敬请期待」，把版面让给了唯一没有内容的东西 */
.model-rail { display: grid; grid-template-columns: 1.2fr 1.2fr .6fr; margin-top: 4rem; border: 1px solid #32393f; border-radius: 8px; overflow: hidden; }
.model-identity, .model-coming-soon { display: flex; align-items: center; gap: 0.75rem; min-height: 104px; padding: 1.5rem; font-size: 1.1rem; font-weight: 620; }
.model-identity + .model-identity, .model-coming-soon { border-left: 1px solid #32393f; }
.model-gpt { color: #e4e8eb; }
.model-claude { color: #d5a391; }
.model-coming-soon { color: #9da6ae; font-size: .875rem; font-weight: 500; }

.visibility-section { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 9vw; background: #14181c; }
.visibility-section > div:first-child { transform: translateX(-0.8rem); }
.visibility-ledger { border-top: 1px solid #32393f; }
.visibility-ledger > div { display: grid; grid-template-columns: 2rem 1fr; column-gap: 1rem; border-bottom: 1px solid #32393f; padding: 1.5rem 0; }
.visibility-ledger svg { grid-row: 1 / span 2; color: #a5c1a9; }
.visibility-ledger h3 { font-weight: 620; }
.visibility-ledger p { margin-top: 0.35rem; color: #94a198; font-size: 0.88rem; line-height: 1.6; }

.final-section { display: grid; min-height: 70dvh; place-items: center; align-content: center; gap: 2rem; padding: 6rem 5vw; background: #28362d; text-align: center; }
.final-section > p { color: #b2bbc3; font-size: 0.82rem; }
/* 12ch 是按英文标题的理想行长定的；中文「从一个 API Key 开始」在这个宽度下会把
   「开始」孤零零挤到第二行，所以中文放宽到刚好一行放得下。 */
.final-section h2 { max-width: 17ch; }
.final-section h2:lang(en) { max-width: 12ch; }
.home-footer { display: flex; justify-content: space-between; gap: 2rem; border-top: 1px solid #32393f; padding: 2rem 5vw; color: #8b95a0; font-size: 0.78rem; }
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
.text-link:hover { color: #dfe9e0; }

/* 全局 :focus-visible 用的是 --gb-brand(#405647)，落在本页固定的 #0b0d0f 底上
   只有 2.44:1，低于 WCAG 2.2 对焦点指示器要求的 3:1。这里换成浅鼠尾草(9.9:1)。 */
.gateway-home :deep(*:focus-visible),
[data-testid="compact-home"] :deep(*:focus-visible) {
  outline: 2px solid #a5c1a9;
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
  .hero-scrim { background: linear-gradient(0deg, rgb(15 21 18 / 0.98) 0%, rgb(15 21 18 / 0.8) 58%, rgb(15 21 18 / 0.38) 100%); }
  .hero-content { display: block; padding: 8rem 1.25rem 8.5rem; }
  .hero-title { width: min(100%, 8.8em); font-size: clamp(3rem, 15vw, 4.7rem); }
  .hero-title-art { transform: none; padding-right: 1px; }
  .hero-title-near { transform: translateY(0.04em) rotate(-1deg); }
  .hero-copy > p:not(.hero-proof) { max-width: 22rem; font-size: 0.98rem; }
  .hero-proof { font-size: 0.72rem; }
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
  .models-section > h2, .visibility-section > div:first-child { transform: none; }
  .subscription-image { min-height: 420px; order: 2; }
  .subscription-caption { bottom: 1rem; left: 1rem; max-width: calc(100% - 2rem); }
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

  .subscription-caption {
    background: #0b0d0f;
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
  .hero-copy, .hero-foot { animation: none; }
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
