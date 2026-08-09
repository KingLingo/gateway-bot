<template>
  <div v-if="hasHomeContent" class="min-h-screen bg-paper dark:bg-dark-950">
    <iframe
      v-if="isHomeContentUrl"
      :src="homeContent.trim()"
      class="h-screen w-full border-0"
      title="自定义首页"
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
      <span class="brand-mark">G</span>
      <span>
        <span class="block text-2xl font-semibold">{{ siteName }}</span>
        <span class="mt-1 block text-sm text-dark-400">{{ t('home.compactHint') }}</span>
      </span>
      <Icon name="arrowRight" class="ml-auto text-primary-400 transition-transform group-hover:translate-x-1" />
    </RouterLink>
  </div>

  <div v-else data-testid="gateway-home" class="gateway-home">
    <header class="home-nav">
      <RouterLink to="/home" class="brand-wordmark" aria-label="Gateway Bot 首页">
        <span class="brand-mark">G</span>
        <span class="brand-name"><strong>Gateway</strong><em>Bot</em></span>
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
        <LocaleSwitcher />
        <button
          type="button"
          class="nav-icon"
          :aria-label="isDark ? t('home.switchToLight') : t('home.switchToDark')"
          @click="toggleTheme"
        >
          <Icon :name="isDark ? 'sun' : 'moon'" size="sm" />
        </button>
        <RouterLink :to="dashboardPath" class="home-console-link">
          {{ isAuthenticated ? t('home.dashboard') : t('home.login') }}
          <Icon name="arrowRight" size="sm" />
        </RouterLink>
      </div>
    </header>

    <main>
      <section class="hero-section">
        <picture class="hero-visual" aria-hidden="true">
          <source media="(max-width: 767px)" srcset="/images/gateway-architecture-mobile.jpg" />
          <img src="/images/gateway-architecture-desktop.jpg" alt="" fetchpriority="high" />
        </picture>
        <div class="hero-scrim" />
        <div class="hero-grain" />

        <div class="hero-content">
          <div class="hero-copy">
            <h1>{{ t('home.title') }}</h1>
            <p>{{ t('home.description') }}</p>
            <div class="hero-actions">
              <RouterLink :to="dashboardPath" class="hero-primary">
                {{ t('home.goToDashboard') }}
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
          </div>

          <div class="hero-index" aria-hidden="true">
            <span>01</span>
            <span class="hero-index-line" />
            <span>接入</span>
          </div>
        </div>

        <div class="hero-foot">
          <span>{{ t('home.heroFoot.subscription') }}</span>
          <span>{{ t('home.heroFoot.keys') }}</span>
          <span>{{ t('home.heroFoot.usage') }}</span>
        </div>
      </section>

      <section class="access-section home-section">
        <div class="section-heading">
          <h2>{{ t('home.access.title') }}</h2>
          <p>{{ t('home.access.description') }}</p>
        </div>
        <ol class="access-path">
          <li v-for="(step, index) in accessSteps" :key="step.title">
            <span class="step-number">0{{ index + 1 }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
            <Icon v-if="index < accessSteps.length - 1" name="arrowRight" class="step-arrow" />
          </li>
        </ol>
      </section>

      <section class="subscription-section home-section">
        <div class="subscription-image">
          <img src="/images/gateway-access-detail.jpg" alt="玻璃建筑通道细节" loading="lazy" />
          <span>{{ t('home.subscription.imageCaption') }}</span>
        </div>
        <div class="subscription-copy">
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
        <h2>{{ t('home.models.title') }}</h2>
        <p>{{ t('home.models.description') }}</p>
        <div class="model-rail" aria-label="支持的模型平台">
          <span>OpenAI</span>
          <span class="model-claude">Claude</span>
          <span>Gemini</span>
          <span>Grok</span>
          <span>更多模型</span>
        </div>
      </section>

      <section class="visibility-section home-section">
        <div>
          <h2>{{ t('home.visibility.title') }}</h2>
          <p>{{ t('home.visibility.description') }}</p>
        </div>
        <div class="visibility-ledger">
          <div v-for="item in visibilityItems" :key="item.title">
            <Icon :name="item.icon" />
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </section>

      <section class="final-section">
        <p>{{ t('home.final.eyebrow') }}</p>
        <h2>{{ t('home.final.title') }}</h2>
        <RouterLink :to="dashboardPath" class="hero-primary">
          {{ t('home.goToDashboard') }}
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
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore, useAuthStore } from '@/stores'
import Icon from '@/components/icons/Icon.vue'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import { sanitizeUrl } from '@/utils/url'

const { t } = useI18n()
const appStore = useAppStore()
const authStore = useAuthStore()

const siteName = computed(() => appStore.cachedPublicSettings?.site_name || appStore.siteName || 'Gateway Bot')
const docUrl = computed(() => sanitizeUrl(appStore.cachedPublicSettings?.doc_url || appStore.docUrl || ''))
const homeContent = computed(() => appStore.cachedPublicSettings?.home_content || '')
const hasHomeContent = computed(() => homeContent.value.trim().length > 0)
const compactHomeEnabled = computed(() => appStore.cachedPublicSettings?.compact_home_enabled === true)
const isHomeContentUrl = computed(() => /^(https?:\/\/)/.test(homeContent.value.trim()))
const isAuthenticated = computed(() => authStore.isAuthenticated)
const dashboardPath = computed(() => authStore.isAdmin ? '/admin/dashboard' : isAuthenticated.value ? '/dashboard' : '/login')
const currentYear = new Date().getFullYear()
const isDark = ref(document.documentElement.classList.contains('dark'))

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

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  authStore.checkAuth()
  if (!appStore.publicSettingsLoaded) appStore.fetchPublicSettings()
})
</script>

<style scoped>
.gateway-home {
  min-height: 100dvh;
  overflow: hidden;
  background: #0f1512;
  color: #f2f0ea;
}

.home-nav {
  position: absolute;
  z-index: 30;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 68px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgb(242 240 234 / 0.14);
  padding: 0 5vw;
}

.brand-wordmark,
.brand-name,
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
.brand-mark {
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(105 176 134 / 0.65);
  border-radius: 4px;
  color: #69b086;
  font-weight: 700;
}
.brand-name { gap: 0.28rem; font-size: 0.95rem; font-style: normal; }
.brand-name strong { font-weight: 620; }
.brand-name em { color: #69b086; font-style: normal; font-weight: 620; }
.nav-link { height: 40px; padding: 0 0.75rem; color: #c9cec8; font-size: 0.875rem; }
.nav-icon { height: 40px; width: 40px; justify-content: center; border-radius: 4px; color: #c9cec8; }
.nav-icon:hover, .nav-link:hover { background: rgb(242 240 234 / 0.08); color: #fff; }
.home-console-link {
  height: 40px;
  gap: 0.5rem;
  border: 1px solid rgb(242 240 234 / 0.3);
  border-radius: 4px;
  padding: 0 0.9rem;
  font-size: 0.875rem;
  font-weight: 600;
}
.home-console-link:hover { border-color: #69b086; color: #69b086; }

.hero-section {
  position: relative;
  display: flex;
  min-height: 92dvh;
  align-items: flex-end;
  isolation: isolate;
  overflow: hidden;
}
.hero-visual, .hero-scrim, .hero-grain { position: absolute; inset: 0; }
.hero-visual img { height: 100%; width: 100%; object-fit: cover; filter: saturate(0.52) contrast(1.08) brightness(0.7) sepia(0.12) hue-rotate(72deg); }
.hero-scrim { z-index: 1; background: linear-gradient(90deg, rgb(15 21 18 / 0.98) 0%, rgb(15 21 18 / 0.8) 38%, rgb(15 21 18 / 0.16) 76%), linear-gradient(0deg, rgb(15 21 18 / 0.86), transparent 54%); }
.hero-grain { z-index: 2; opacity: 0.16; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.38'/%3E%3C/svg%3E"); mix-blend-mode: soft-light; }
.hero-content { position: relative; z-index: 3; display: grid; width: 100%; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 3rem; padding: 9rem 8vw 8rem; }
.hero-copy { max-width: 760px; animation: hero-enter 700ms cubic-bezier(.2,.7,.2,1) both; }
.hero-copy h1 { max-width: 10ch; font-size: clamp(3.5rem, 7vw, 7rem); font-weight: 560; line-height: 0.98; letter-spacing: 0; }
.hero-copy p { margin-top: 1.75rem; max-width: 34rem; color: #b2bcb5; font-size: clamp(1rem, 1.35vw, 1.2rem); line-height: 1.75; }
.hero-actions { margin-top: 2rem; flex-wrap: wrap; gap: 0.75rem; }
.hero-primary, .hero-secondary { min-height: 44px; border-radius: 4px; padding: 0.7rem 1.1rem; font-size: 0.9rem; font-weight: 650; }
.hero-primary { gap: 0.6rem; background: #69b086; color: #0f1512; }
.hero-primary:hover { background: #79b891; }
.hero-secondary { border: 1px solid rgb(242 240 234 / 0.38); color: #f2f0ea; }
.hero-secondary:hover { border-color: #f2f0ea; }
.hero-index { display: flex; align-items: center; gap: 1rem; color: #94a198; font-family: 'Geist Mono', monospace; font-size: 0.75rem; writing-mode: vertical-rl; }
.hero-index-line { display: block; width: 1px; height: 64px; background: #69b086; }
.hero-foot { position: absolute; z-index: 4; right: 5vw; bottom: 0; left: 5vw; display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid rgb(242 240 234 / 0.18); }
.hero-foot span { padding: 1.25rem 0; color: #94a198; font-size: 0.78rem; }
.hero-foot span + span { border-left: 1px solid rgb(242 240 234 / 0.12); padding-left: 1.5rem; }

.home-section { padding: clamp(5rem, 9vw, 9rem) 8vw; }
.section-heading { max-width: 660px; }
.section-heading h2, .subscription-copy h2, .models-section h2, .visibility-section h2, .final-section h2 { font-size: clamp(2.25rem, 4.6vw, 4.5rem); font-weight: 560; line-height: 1.08; }
.section-heading p, .subscription-copy > p, .models-section > p, .visibility-section > div > p { margin-top: 1.25rem; max-width: 38rem; color: #94a198; line-height: 1.75; }

.access-section { background: #131a17; }
.access-path { margin-top: 5rem; border-top: 1px solid #303c35; }
.access-path li { position: relative; display: grid; grid-template-columns: 5rem minmax(0, 1fr) auto; gap: 2rem; align-items: start; border-bottom: 1px solid #303c35; padding: 2rem 0; }
.step-number { color: #69b086; font-family: 'Geist Mono', monospace; font-size: 0.75rem; }
.access-path h3 { font-size: 1.5rem; font-weight: 580; }
.access-path p { margin-top: 0.5rem; color: #94a198; }
.step-arrow { margin-top: 0.25rem; color: #4a5850; }

.subscription-section { display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(340px, 0.88fr); gap: 8vw; align-items: center; background: #f5f3ed; color: #242521; }
.subscription-image { position: relative; min-height: 560px; overflow: hidden; border-radius: 6px; }
.subscription-image::after { position: absolute; inset: 0; content: ''; background: linear-gradient(0deg, rgb(15 21 18 / 0.68), transparent 48%); }
.subscription-image img { position: absolute; inset: 0; height: 100%; width: 100%; object-fit: cover; filter: saturate(0.45) sepia(0.16) hue-rotate(70deg); }
.subscription-image span { position: absolute; z-index: 1; right: 1.5rem; bottom: 1.5rem; left: 1.5rem; color: #e4e3dd; font-size: 0.78rem; }
.subscription-copy > p { color: #70736b; }
.subscription-copy dl { margin-top: 3rem; border-top: 1px solid #d8d5cc; }
.subscription-copy dl div { display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px solid #d8d5cc; padding: 1rem 0; }
.subscription-copy dt { color: #70736b; font-size: 0.85rem; }
.subscription-copy dd { font-weight: 600; }
.text-link { margin-top: 2rem; gap: 0.5rem; color: #1f6b4a; font-weight: 650; }

.models-section { background: #0f1512; }
.models-section > p { color: #94a198; }
.model-rail { display: flex; margin-top: 4rem; gap: 0; overflow-x: auto; border-top: 1px solid #303c35; border-bottom: 1px solid #303c35; }
.model-rail span { min-width: 180px; flex: 1; padding: 1.75rem 1rem; color: #b2bcb5; font-size: 1.05rem; }
.model-rail span + span { border-left: 1px solid #303c35; }
.model-rail .model-claude { color: #c76d4e; }

.visibility-section { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 9vw; background: #171f1b; }
.visibility-ledger { border-top: 1px solid #303c35; }
.visibility-ledger > div { display: grid; grid-template-columns: 2rem 1fr; column-gap: 1rem; border-bottom: 1px solid #303c35; padding: 1.5rem 0; }
.visibility-ledger svg { grid-row: 1 / span 2; color: #69b086; }
.visibility-ledger h3 { font-weight: 620; }
.visibility-ledger p { margin-top: 0.35rem; color: #94a198; font-size: 0.88rem; line-height: 1.6; }

.final-section { display: grid; min-height: 70dvh; place-items: center; align-content: center; gap: 2rem; padding: 6rem 5vw; background: #26352d; text-align: center; }
.final-section > p { color: #94a198; font-size: 0.82rem; }
.final-section h2 { max-width: 12ch; }
.home-footer { display: flex; justify-content: space-between; gap: 2rem; border-top: 1px solid #303c35; padding: 2rem 5vw; color: #77847c; font-size: 0.78rem; }
.home-footer a:hover { color: #f2f0ea; }

@keyframes hero-enter { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 767px) {
  .home-nav { height: 62px; padding: 0 1rem; }
  .brand-name { display: none; }
  .home-console-link { padding: 0 0.7rem; }
  .hero-section { min-height: 94dvh; }
  .hero-scrim { background: linear-gradient(0deg, rgb(15 21 18 / 0.98) 0%, rgb(15 21 18 / 0.8) 58%, rgb(15 21 18 / 0.38) 100%); }
  .hero-content { display: block; padding: 8rem 1.25rem 8.5rem; }
  .hero-copy h1 { max-width: 8ch; font-size: clamp(3rem, 15vw, 4.7rem); }
  .hero-copy p { max-width: 22rem; font-size: 0.98rem; }
  .hero-index { display: none; }
  .hero-foot { right: 1.25rem; left: 1.25rem; }
  .hero-foot span { padding: 1rem 0; font-size: 0.68rem; }
  .hero-foot span + span { padding-left: 0.65rem; }
  .home-section { padding: 5rem 1.25rem; }
  .access-path { margin-top: 3rem; }
  .access-path li { grid-template-columns: 2.5rem 1fr; gap: 0.75rem; }
  .step-arrow { display: none; }
  .subscription-section, .visibility-section { grid-template-columns: 1fr; gap: 3.5rem; }
  .subscription-image { min-height: 420px; order: 2; }
  .model-rail { margin-right: -1.25rem; }
  .model-rail span { min-width: 140px; }
  .final-section { min-height: 62dvh; padding: 5rem 1.25rem; }
  .home-footer { flex-direction: column; padding: 2rem 1.25rem; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-copy { animation: none; }
}
</style>
