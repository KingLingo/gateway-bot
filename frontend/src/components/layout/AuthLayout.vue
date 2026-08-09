<template>
  <div class="auth-shell">
    <aside class="auth-context">
      <img
        src="/images/gateway-architecture-mobile.jpg"
        alt=""
        class="auth-context-image"
        aria-hidden="true"
      />
      <div class="auth-context-shade" />
      <RouterLink to="/home" class="auth-brand" aria-label="返回首页">
        <span v-if="!siteLogo" class="auth-mark">G</span>
        <img v-else :src="siteLogo" alt="" class="auth-custom-logo" />
        <span><strong>Gateway</strong><em>Bot</em></span>
      </RouterLink>
      <div class="auth-context-copy">
        <p>AI API 订阅服务</p>
        <h1>让每一次接入，<br />都更简单</h1>
        <span>{{ siteSubtitle }}</span>
      </div>
      <div class="auth-context-foot">密钥 · 用量 · 周期</div>
    </aside>

    <main class="auth-panel">
      <div class="auth-mobile-brand">
        <RouterLink to="/home" class="auth-brand">
          <span v-if="!siteLogo" class="auth-mark">G</span>
          <img v-else :src="siteLogo" alt="" class="auth-custom-logo" />
          <span>{{ siteName }}</span>
        </RouterLink>
      </div>

      <div class="auth-form-wrap">
        <div class="auth-form-surface">
          <slot />
        </div>
        <div class="auth-footer-links">
          <slot name="footer" />
        </div>
      </div>

      <p class="auth-copyright">
        &copy; {{ currentYear }} {{ siteName }}. 保留所有权利。
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { sanitizeUrl } from '@/utils/url'

const appStore = useAppStore()
const siteName = computed(() => appStore.siteName || 'Gateway Bot')
const siteLogo = computed(() => sanitizeUrl(appStore.siteLogo || '', { allowRelative: true, allowDataUrl: true }))
const siteSubtitle = computed(() => appStore.cachedPublicSettings?.site_subtitle || '订阅、密钥与用量，一处清晰管理')
const currentYear = new Date().getFullYear()

onMounted(() => appStore.fetchPublicSettings())
</script>

<style scoped>
.auth-shell {
  display: grid;
  min-height: 100dvh;
  grid-template-columns: minmax(340px, 0.88fr) minmax(520px, 1.12fr);
  background: #f5f3ed;
}

.auth-context {
  position: sticky;
  top: 0;
  min-height: 100dvh;
  overflow: hidden;
  background: #0f1512;
  color: #f2f0ea;
}

.auth-context-image,
.auth-context-shade {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
}

.auth-context-image {
  object-fit: cover;
  filter: saturate(0.35) contrast(1.08) brightness(0.62) sepia(0.14) hue-rotate(72deg);
}

.auth-context-shade {
  background: linear-gradient(180deg, rgb(15 21 18 / 0.62), rgb(15 21 18 / 0.94));
}

.auth-brand {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.9rem;
  font-weight: 620;
}

.auth-context > .auth-brand {
  margin: 2rem;
}

.auth-brand em {
  margin-left: 0.25rem;
  color: #69b086;
  font-style: normal;
}

.auth-mark,
.auth-custom-logo {
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(105 176 134 / 0.7);
  border-radius: 4px;
  color: #69b086;
  object-fit: contain;
}

.auth-context-copy {
  position: absolute;
  z-index: 1;
  right: 2rem;
  bottom: 8rem;
  left: 2rem;
}

.auth-context-copy > p {
  color: #69b086;
  font-size: 0.78rem;
}

.auth-context-copy h1 {
  margin-top: 1rem;
  font-size: clamp(2.7rem, 4.7vw, 5rem);
  font-weight: 550;
  line-height: 1.03;
}

.auth-context-copy > span {
  display: block;
  margin-top: 1.5rem;
  max-width: 28rem;
  color: #94a198;
  line-height: 1.7;
}

.auth-context-foot {
  position: absolute;
  z-index: 1;
  right: 2rem;
  bottom: 2rem;
  left: 2rem;
  border-top: 1px solid #303c35;
  padding-top: 1rem;
  color: #77847c;
  font-size: 0.72rem;
}

.auth-panel {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem clamp(2rem, 7vw, 8rem);
  color: #242521;
}

:global(.dark) .auth-panel {
  background: #131a17;
  color: #f2f0ea;
}

.auth-form-wrap {
  width: 100%;
  max-width: 440px;
}

.auth-form-surface {
  border-top: 2px solid #1f6b4a;
  padding-top: 2rem;
}

.auth-footer-links {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
}

.auth-copyright {
  position: absolute;
  bottom: 1.5rem;
  color: #969990;
  font-size: 0.7rem;
}

.auth-mobile-brand {
  display: none;
}

@media (max-width: 900px) {
  .auth-shell { display: block; }
  .auth-context { display: none; }
  .auth-panel { min-height: 100dvh; padding: 5rem 1.25rem; }
  .auth-mobile-brand { position: absolute; top: 1.25rem; left: 1.25rem; display: block; }
  .auth-copyright { position: static; margin-top: 3rem; }
}
</style>
