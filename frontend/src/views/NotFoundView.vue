<template>
  <div class="relative flex min-h-screen overflow-hidden bg-dark-950 text-white">
    <div class="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] border-l border-white/10 bg-dark-900 lg:block"></div>
    <div class="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 px-6 py-8 sm:px-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:px-16 lg:py-12">
      <section class="flex min-h-[70vh] flex-col justify-between lg:min-h-0 lg:pr-16">
        <router-link to="/home" class="inline-flex w-fit items-center gap-3 text-sm font-semibold tracking-wide text-gray-200 transition-colors hover:text-white">
          <span class="flex h-8 w-8 items-center justify-center rounded bg-primary-500 text-dark-950">G</span>
          Gateway Bot
        </router-link>

        <div class="my-auto py-20 sm:py-24">
          <p class="mb-6 font-mono text-sm text-primary-400">错误代码 / 404</p>
          <h1 class="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[6.5rem]">
            这条路径暂时<br />没有通向目的地
          </h1>
          <p class="mt-8 max-w-md text-base leading-7 text-gray-300 sm:text-lg">
            页面可能已移动，或地址输入有误。
          </p>
        </div>
      </section>

      <aside class="flex items-end border-t border-white/10 py-8 lg:border-l-0 lg:border-t-0 lg:pl-12">
        <div class="w-full">
          <Icon name="exclamationTriangle" size="xl" weight="light" class="mb-8 text-primary-400" />
          <p class="mb-8 max-w-sm text-sm leading-6 text-gray-400">
            你可以返回刚才的页面，或直接进入控制台继续管理订阅与 API 密钥。
          </p>
          <div class="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <button type="button" class="btn btn-secondary border-white/20 bg-transparent text-white hover:bg-white/10" @click="goBack">
              <Icon name="arrowLeft" size="md" class="mr-2" />
              返回上一页
            </button>
            <router-link to="/dashboard" class="btn btn-primary">
              <Icon name="home" size="md" class="mr-2" />
              前往控制台
            </router-link>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Icon from '@/components/icons/Icon.vue'

const router = useRouter()

function goBack(): void {
  router.back()
}
</script>
