<template>
  <div class="auth-shell">
    <aside class="auth-context">
      <img
        src="/media/gateway-architecture-mobile.jpg"
        alt=""
        class="auth-context-image"
        aria-hidden="true"
      />
      <div class="auth-context-shade" />
      <RouterLink to="/home" class="auth-brand" aria-label="返回首页">
        <GatewayBrand :logo="siteLogo" :name="siteName" mark-class="auth-mark" name-class="auth-brand-name" />
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
          <GatewayBrand :logo="siteLogo" :name="siteName" mark-class="auth-mark" />
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
import GatewayBrand from '@/components/brand/GatewayBrand.vue'

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
  background: #F4F6F8;
}

.auth-context {
  position: sticky;
  top: 0;
  min-height: 100dvh;
  overflow: hidden;
  background: #0B0D0F;
  color: #F5F7F8;
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
  filter: saturate(0.2) contrast(1.08) brightness(0.62);
}

.auth-context-shade {
  background: linear-gradient(180deg, rgb(11 13 15 / 0.62), rgb(11 13 15 / 0.94));
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

:deep(.auth-mark),
.auth-custom-logo {
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(151 177 157 / 0.5);
  border-radius: 6px;
  object-fit: contain;
}

:deep(.auth-brand-name) { color: #F5F7F8; }

.auth-context-copy {
  position: absolute;
  z-index: 1;
  right: 2rem;
  bottom: 8rem;
  left: 2rem;
}

.auth-context-copy > p {
  color: #88A18E;
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
  color: #9DA6AE;
  line-height: 1.7;
}

.auth-context-foot {
  position: absolute;
  z-index: 1;
  right: 2rem;
  bottom: 2rem;
  left: 2rem;
  border-top: 1px solid #353C42;
  padding-top: 1rem;
  color: #89929A;
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
  background: #F4F6F8;
  color: #17191C;
}

:global(.dark .auth-panel) {
  background: #0B0D0F;
  color: #F5F7F8;
}

.auth-form-wrap {
  width: 100%;
  max-width: 440px;
}

.auth-form-surface {
  border: 1px solid rgb(93 105 114 / 0.22);
  border-top: 2px solid #526E59;
  border-radius: 8px;
  background: rgb(255 255 255 / 0.72);
  backdrop-filter: blur(16px);
  padding: 2rem;
}

:global(.dark .auth-form-surface) {
  border-color: rgb(157 166 174 / 0.24);
  background: rgb(22 25 28 / 0.74);
}

.auth-footer-links {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
}

.auth-copyright {
  position: absolute;
  bottom: 1.5rem;
  color: #66707A;
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
