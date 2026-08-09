<template>
  <AppLayout>
    <div class="mx-auto max-w-[1480px] space-y-8">
      <header class="grid gap-3 border-b border-gray-200 pb-6 dark:border-dark-700 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p class="text-sm font-medium text-primary-700 dark:text-primary-400">AI API 工作台</p>
          <h1 class="mt-2 text-3xl font-semibold text-gray-950 dark:text-white">接入与用量，一处掌握</h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-dark-400">
            先确认订阅状态，再创建密钥并查看每一次 API 调用。
          </p>
        </div>
        <button type="button" class="btn btn-secondary btn-sm w-fit" @click="refreshAll">
          <Icon name="refresh" size="sm" class="mr-1.5" />
          刷新数据
        </button>
      </header>

      <SubscriptionOverview />

      <UserDashboardQuickActions />

      <section aria-labelledby="usage-overview-title" class="space-y-5">
        <div>
          <h2 id="usage-overview-title" class="text-xl font-semibold text-gray-950 dark:text-white">用量概览</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-dark-400">请求、成本与模型分布按所选时间范围汇总。</p>
        </div>

        <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div v-for="index in 3" :key="index" class="card space-y-3 p-5">
            <div class="skeleton h-3 w-24"></div>
            <div class="skeleton h-7 w-32"></div>
          </div>
        </div>

        <template v-else-if="stats">
          <UserDashboardStats
            :stats="stats"
            :is-simple="authStore.isSimpleMode"
            :platform-quotas="platformQuotas"
          />
          <UserDashboardCharts
            v-model:startDate="startDate"
            v-model:endDate="endDate"
            v-model:granularity="granularity"
            :loading="loadingCharts"
            :trend="trendData"
            :models="modelStats"
            @dateRangeChange="loadCharts"
            @granularityChange="loadCharts"
            @refresh="refreshAll"
          />
          <UserDashboardRecentUsage :data="recentUsage" :loading="loadingUsage" />
        </template>

        <div v-else class="border border-gray-200 px-5 py-8 dark:border-dark-700">
          <p class="font-medium text-gray-900 dark:text-white">暂时无法读取用量</p>
          <p class="mt-1 text-sm text-gray-500 dark:text-dark-400">订阅与密钥功能仍可正常使用，请稍后刷新。</p>
        </div>
      </section>

      <section
        v-if="!authStore.isSimpleMode"
        data-testid="account-assets"
        class="grid gap-5 border-t border-gray-200 py-6 dark:border-dark-700 sm:grid-cols-[1fr_auto] sm:items-center"
      >
        <div>
          <h2 class="text-sm font-semibold text-gray-900 dark:text-white">账户资产</h2>
          <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-dark-400">
            余额作为订阅之外的补充结算资产，不影响当前订阅周期。
          </p>
        </div>
        <dl class="flex flex-wrap gap-x-8 gap-y-3 sm:justify-end">
          <div>
            <dt class="text-xs text-gray-500 dark:text-dark-400">可用余额</dt>
            <dd class="mt-1 text-lg font-semibold tabular-nums text-gray-900 dark:text-white">{{ formatMoney(availableBalance) }}</dd>
          </div>
          <div v-if="frozenBalance > 0">
            <dt class="text-xs text-gray-500 dark:text-dark-400">冻结金额</dt>
            <dd class="mt-1 text-lg font-semibold tabular-nums text-gray-700 dark:text-gray-200">{{ formatMoney(frozenBalance) }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usageAPI, type UserDashboardStats as UserStatsType } from '@/api/usage'
import AppLayout from '@/components/layout/AppLayout.vue'
import Icon from '@/components/icons/Icon.vue'
import SubscriptionOverview from '@/components/user/dashboard/SubscriptionOverview.vue'
import UserDashboardStats from '@/components/user/dashboard/UserDashboardStats.vue'
import UserDashboardCharts from '@/components/user/dashboard/UserDashboardCharts.vue'
import UserDashboardRecentUsage from '@/components/user/dashboard/UserDashboardRecentUsage.vue'
import UserDashboardQuickActions from '@/components/user/dashboard/UserDashboardQuickActions.vue'
import type { UsageLog, TrendDataPoint, ModelStat, PlatformQuotaItem } from '@/types'
import { getMyPlatformQuotas } from '@/api/user'
import { formatDateLocalInput } from '@/utils/format'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const availableBalance = computed(() => Number(user.value?.balance || 0))
const frozenBalance = computed(() => Number(user.value?.frozen_balance || 0))

const stats = ref<UserStatsType | null>(null)
const loading = ref(false)
const loadingUsage = ref(false)
const loadingCharts = ref(false)
const trendData = ref<TrendDataPoint[]>([])
const modelStats = ref<ModelStat[]>([])
const recentUsage = ref<UsageLog[]>([])
const platformQuotas = ref<PlatformQuotaItem[] | null>(null)

const startDate = ref(formatDateLocalInput(new Date(Date.now() - 6 * 86400000)))
const endDate = ref(formatDateLocalInput(new Date()))
const granularity = ref('day')

function formatMoney(value: number): string {
  return `$${Number.isFinite(value) ? value.toFixed(2) : '0.00'}`
}

async function loadStats(): Promise<void> {
  loading.value = true
  try {
    await authStore.refreshUser()
    stats.value = await usageAPI.getDashboardStats()
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
  } finally {
    loading.value = false
  }
}

async function loadCharts(): Promise<void> {
  loadingCharts.value = true
  try {
    const result = await Promise.all([
      usageAPI.getDashboardTrend({
        start_date: startDate.value,
        end_date: endDate.value,
        granularity: granularity.value as 'day' | 'hour',
      }),
      usageAPI.getDashboardModels({ start_date: startDate.value, end_date: endDate.value }),
    ])
    trendData.value = result[0].trend || []
    modelStats.value = result[1].models || []
  } catch (error) {
    console.error('Failed to load charts:', error)
  } finally {
    loadingCharts.value = false
  }
}

async function loadRecent(): Promise<void> {
  loadingUsage.value = true
  try {
    const result = await usageAPI.getByDateRange(startDate.value, endDate.value)
    recentUsage.value = result.items.slice(0, 5)
  } catch (error) {
    console.error('Failed to load recent usage:', error)
  } finally {
    loadingUsage.value = false
  }
}

async function loadPlatformQuotas(): Promise<void> {
  try {
    const data = await getMyPlatformQuotas()
    platformQuotas.value = data.platform_quotas ?? []
  } catch (error) {
    console.warn('Failed to load platform quotas:', error)
    platformQuotas.value = []
  }
}

function refreshAll(): void {
  void loadStats()
  void loadCharts()
  void loadRecent()
  void loadPlatformQuotas()
}

onMounted(refreshAll)
</script>
