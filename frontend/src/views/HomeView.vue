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
      <span>
        <GatewayBrand :logo="siteLogo" :name="siteName" />
        <span class="mt-1 block text-sm text-dark-400">{{ t('home.compactHint') }}</span>
      </span>
      <Icon name="arrowRight" class="ml-auto text-primary-400 transition-transform group-hover:translate-x-1" />
    </RouterLink>
  </div>

  <div v-else data-testid="gateway-home" class="gateway-home">
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

        </div>
      </section>

      <section class="access-section home-section">
        <div class="section-heading">
          <h2>{{ t('home.access.title') }}</h2>
          <p>{{ t('home.access.description') }}</p>
        </div>
        <ol class="access-path">
          <li v-for="(step, index) in accessSteps" :key="step.title">
            <span class="step-node" aria-hidden="true">{{ index + 1 }}</span>
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
          <span class="subscription-caption">{{ t('home.subscription.imageCaption') }}</span>
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
            <span>更多模型敬请期待</span>
          </div>
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
  background: #0b0d0f;
  color: #f5f7f8;
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
  border-bottom: 1px solid rgb(255 255 255 / 0.12);
  padding: 0 5vw;
  background: rgb(11 13 15 / 0.82);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.08), 0 12px 36px rgb(0 0 0 / 0.2);
  backdrop-filter: blur(18px) saturate(1.12);
  -webkit-backdrop-filter: blur(18px) saturate(1.12);
}

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
.hero-copy p { margin-top: 1.5rem; max-width: 34rem; color: #b2bbc3; font-size: clamp(1rem, 1.35vw, 1.2rem); line-height: 1.75; }
.hero-actions { margin-top: 2rem; flex-wrap: wrap; gap: 0.75rem; }
.hero-primary, .hero-secondary { min-height: 44px; border-radius: 6px; padding: 0.7rem 1.1rem; font-size: 0.9rem; font-weight: 650; }
.hero-primary { gap: 0.6rem; background: #dfe9e0; color: #172018; }
.hero-primary:hover { background: #f0f5f1; }
.hero-secondary { border: 1px solid rgb(255 255 255 / 0.34); color: #f5f7f8; }
.hero-secondary:hover { border-color: #f5f7f8; }

.home-section { padding: clamp(5rem, 9vw, 9rem) 8vw; }
.section-heading { max-width: 660px; }
.section-heading h2, .subscription-copy h2, .models-section h2, .visibility-section h2, .final-section h2 { font-size: clamp(2.25rem, 4.6vw, 4.5rem); font-weight: 560; line-height: 1.08; }
.section-heading p, .subscription-copy > p, .models-section > p, .visibility-section > div > p { margin-top: 1.25rem; max-width: 38rem; color: #94a198; line-height: 1.75; }

.access-section { background: #14181c; }
.access-path { position: relative; margin-top: 5rem; border-top: 1px solid #32393f; }
.access-path li { position: relative; display: grid; grid-template-columns: 5rem minmax(0, 1fr) auto; gap: 2rem; align-items: start; border-bottom: 1px solid #303c35; padding: 2rem 0; }
.step-node { display: inline-flex; height: 1.75rem; width: 1.75rem; align-items: center; justify-content: center; border: 1px solid #7fa286; border-radius: 999px; color: #dfe9e0; font-family: SFMono-Regular, Menlo, monospace; font-size: 0.72rem; }
.access-path h3 { font-size: 1.5rem; font-weight: 580; }
.access-path p { margin-top: 0.5rem; color: #94a198; }
.step-arrow { margin-top: 0.25rem; color: #4a5850; }

.subscription-section { display: grid; grid-template-columns: minmax(0, 1.22fr) minmax(340px, 0.78fr); gap: 8vw; align-items: center; background: #0b0d0f; color: #f5f7f8; }
.subscription-image { position: relative; min-height: 560px; overflow: hidden; border-radius: 8px; }
.subscription-image::after { position: absolute; inset: 0; content: ''; background: linear-gradient(0deg, rgb(15 21 18 / 0.68), transparent 48%); }
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
  backdrop-filter: blur(22px) saturate(1.08);
  -webkit-backdrop-filter: blur(22px) saturate(1.08);
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
.model-rail { display: grid; grid-template-columns: 1.15fr .85fr 1.45fr; margin-top: 4rem; border: 1px solid #32393f; border-radius: 8px; overflow: hidden; }
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
.final-section h2 { max-width: 12ch; }
.home-footer { display: flex; justify-content: space-between; gap: 2rem; border-top: 1px solid #32393f; padding: 2rem 5vw; color: #737d86; font-size: 0.78rem; }
.home-footer a:hover { color: #f5f7f8; }

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
  .hero-copy p { max-width: 22rem; font-size: 0.98rem; }
  .home-section { padding: 5rem 1.25rem; }
  .access-path { margin-top: 3rem; }
  .access-path li { grid-template-columns: 2.5rem 1fr; gap: 0.75rem; }
  .step-arrow { display: none; }
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
  .hero-copy { animation: none; }
}
</style>
