<template>
  <section
    data-testid="subscription-overview"
    class="overflow-hidden rounded-[6px] border border-gray-200 bg-white dark:border-dark-700 dark:bg-dark-900"
  >
    <div class="flex flex-col gap-5 border-b border-gray-200 px-5 py-5 dark:border-dark-700 sm:flex-row sm:items-end sm:justify-between sm:px-6">
      <div>
        <div class="mb-2 flex items-center gap-2 text-sm text-primary-700 dark:text-primary-400">
          <span class="h-2 w-2 rounded-full bg-primary-500" aria-hidden="true"></span>
          {{ activeSubscriptions.length > 0 ? `正在使用 ${activeSubscriptions.length} 项订阅` : '订阅服务' }}
        </div>
        <h2 class="text-2xl font-semibold text-gray-950 dark:text-white">当前订阅</h2>
        <p class="mt-1 max-w-xl text-sm leading-6 text-gray-500 dark:text-dark-400">
          订阅决定可用模型、用量周期与访问额度，余额仅作为补充账户资产。
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <router-link to="/subscriptions" class="btn btn-secondary btn-sm">
          查看全部
          <Icon name="arrowRight" size="sm" class="ml-1.5" />
        </router-link>
        <router-link
          v-if="purchaseEnabled"
          :to="{ path: '/purchase', query: { tab: 'subscription' } }"
          class="btn btn-primary btn-sm"
        >
          选择订阅
        </router-link>
      </div>
    </div>

    <div v-if="loading && activeSubscriptions.length === 0" class="grid gap-px bg-gray-200 dark:bg-dark-700 lg:grid-cols-2">
      <div v-for="index in 2" :key="index" class="bg-white p-6 dark:bg-dark-900">
        <div class="skeleton h-5 w-36"></div>
        <div class="mt-6 grid grid-cols-3 gap-4">
          <div v-for="cell in 3" :key="cell" class="space-y-2">
            <div class="skeleton h-3 w-16"></div>
            <div class="skeleton h-5 w-24"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loadFailed && activeSubscriptions.length === 0" class="flex flex-col items-start gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="font-medium text-gray-900 dark:text-white">暂时无法读取订阅</p>
        <p class="mt-1 text-sm text-gray-500 dark:text-dark-400">其他功能不受影响，可以稍后重新载入。</p>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" @click="loadSubscriptions(true)">
        重新载入
      </button>
    </div>

    <div v-else-if="activeSubscriptions.length === 0" class="grid gap-6 px-6 py-8 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p class="font-medium text-gray-900 dark:text-white">还没有正在生效的订阅</p>
        <p class="mt-1 max-w-xl text-sm leading-6 text-gray-500 dark:text-dark-400">
          激活订阅后，可在这里查看服务周期、用量窗口与到期时间。
        </p>
      </div>
      <router-link
        v-if="purchaseEnabled"
        :to="{ path: '/purchase', query: { tab: 'subscription' } }"
        class="btn btn-primary btn-sm"
      >
        浏览订阅
      </router-link>
    </div>

    <div v-else class="grid gap-px bg-gray-200 dark:bg-dark-700 lg:grid-cols-2">
      <article
        v-for="subscription in activeSubscriptions"
        :key="subscription.id"
        class="min-w-0 bg-white px-5 py-6 dark:bg-dark-900 sm:px-6"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="truncate text-lg font-semibold text-gray-950 dark:text-white">
              {{ subscription.group?.name || `订阅分组 ${subscription.group_id}` }}
            </p>
            <p class="mt-1 text-xs text-gray-500 dark:text-dark-400">
              {{ platformName(subscription.group?.platform) }} · 编号 {{ subscription.id }}
            </p>
          </div>
          <span class="status-badge status-badge-success shrink-0">生效中</span>
        </div>

        <dl class="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
          <div>
            <dt class="text-xs text-gray-500 dark:text-dark-400">订阅周期</dt>
            <dd class="mt-1 text-sm font-medium tabular-nums text-gray-900 dark:text-gray-100">
              {{ formatPeriod(subscription.starts_at, subscription.expires_at) }}
            </dd>
          </div>
          <div>
            <dt class="text-xs text-gray-500 dark:text-dark-400">到期时间</dt>
            <dd class="mt-1 text-sm font-medium tabular-nums text-gray-900 dark:text-gray-100">
              {{ formatExpiry(subscription.expires_at) }}
            </dd>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <dt class="text-xs text-gray-500 dark:text-dark-400">可用额度</dt>
            <dd class="mt-1 text-sm font-medium tabular-nums text-gray-900 dark:text-gray-100">
              {{ availableUsage(subscription) }}
            </dd>
          </div>
        </dl>

        <div v-if="usageWindows(subscription).length > 0" class="mt-6 space-y-3 border-t border-gray-100 pt-5 dark:border-dark-800">
          <div v-for="window in usageWindows(subscription)" :key="window.label" class="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3">
            <span class="text-xs text-gray-500 dark:text-dark-400">{{ window.label }}</span>
            <div class="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-700">
              <div class="h-full rounded-full bg-primary-500" :style="{ width: `${window.percentage}%` }"></div>
            </div>
            <span class="w-20 text-right text-xs tabular-nums text-gray-600 dark:text-dark-300">
              ${{ window.used.toFixed(2) }} / ${{ window.limit.toFixed(2) }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAppStore, useSubscriptionStore } from '@/stores'
import Icon from '@/components/icons/Icon.vue'
import type { UserSubscription } from '@/types'

interface UsageWindow {
  label: string
  used: number
  limit: number
  percentage: number
}

const appStore = useAppStore()
const subscriptionStore = useSubscriptionStore()
const loadFailed = ref(false)

const activeSubscriptions = computed(() => subscriptionStore.activeSubscriptions)
const loading = computed(() => subscriptionStore.loading)
const purchaseEnabled = computed(
  () => appStore.cachedPublicSettings?.payment_enabled === true,
)

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function formatPeriod(startsAt: string, expiresAt: string | null): string {
  if (!startsAt) return expiresAt ? `至 ${formatDate(expiresAt)}` : '持续有效'
  return `${formatDate(startsAt)} 起`
}

function formatExpiry(expiresAt: string | null): string {
  return expiresAt ? formatDate(expiresAt) : '长期有效'
}

function platformName(platform?: string): string {
  const names: Record<string, string> = {
    anthropic: 'Anthropic',
    openai: 'OpenAI',
    gemini: 'Google AI',
    grok: 'xAI',
    antigravity: 'Antigravity',
  }
  return platform ? names[platform] || platform : 'AI API'
}

function usageWindows(subscription: UserSubscription): UsageWindow[] {
  const candidates = [
    ['今日', subscription.daily_usage_usd, subscription.group?.daily_limit_usd],
    ['本周', subscription.weekly_usage_usd, subscription.group?.weekly_limit_usd],
    ['本月', subscription.monthly_usage_usd, subscription.group?.monthly_limit_usd],
  ] as const

  return candidates.flatMap(([label, used, limit]) => {
    if (!limit || limit <= 0) return []
    return [{
      label,
      used: Number(used || 0),
      limit,
      percentage: Math.min(100, Math.max(0, (Number(used || 0) / limit) * 100)),
    }]
  })
}

function availableUsage(subscription: UserSubscription): string {
  const windows = usageWindows(subscription)
  if (windows.length === 0) return '按订阅规则使用'
  const primary = windows[windows.length - 1]
  return `$${Math.max(0, primary.limit - primary.used).toFixed(2)}`
}

async function loadSubscriptions(force = false): Promise<void> {
  loadFailed.value = false
  try {
    await subscriptionStore.fetchActiveSubscriptions(force)
  } catch {
    loadFailed.value = true
  }
}

onMounted(() => {
  void loadSubscriptions()
})
</script>
