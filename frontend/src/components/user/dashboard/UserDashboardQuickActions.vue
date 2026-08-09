<template>
  <section aria-labelledby="quick-actions-title">
    <div class="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 id="quick-actions-title" class="text-xl font-semibold text-gray-950 dark:text-white">常用操作</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-dark-400">从创建密钥开始，快速进入日常工作。</p>
      </div>
    </div>

    <div class="grid overflow-hidden rounded-[6px] border border-gray-200 bg-gray-200 dark:border-dark-700 dark:bg-dark-700 sm:grid-cols-2 xl:grid-cols-4">
      <router-link
        v-for="action in actions"
        :key="action.path"
        :to="action.path"
        class="group flex min-h-[112px] items-start gap-4 bg-white p-5 transition-colors hover:bg-gray-50 focus-visible:z-10 dark:bg-dark-900 dark:hover:bg-dark-800"
      >
        <Icon :name="action.icon" size="md" class="mt-0.5 shrink-0 text-primary-600 dark:text-primary-400" />
        <span class="min-w-0 flex-1">
          <span class="block text-sm font-semibold text-gray-900 dark:text-white">{{ action.title }}</span>
          <span class="mt-1 block text-xs leading-5 text-gray-500 dark:text-dark-400">{{ action.description }}</span>
        </span>
        <Icon name="arrowRight" size="sm" class="mt-0.5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5" />
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Icon from '@/components/icons/Icon.vue'
import { useBatchImageAccess } from '@/composables/useBatchImageAccess'

type DashboardIconName = 'key' | 'chart' | 'sparkles' | 'gift'

interface DashboardAction {
  path: string
  icon: DashboardIconName
  title: string
  description: string
}

const { canUseBatchImage, refreshBatchImageAccess } = useBatchImageAccess()

const actions = computed<DashboardAction[]>(() => {
  const items: DashboardAction[] = [
    { path: '/keys', icon: 'key', title: '创建 API 密钥', description: '生成接入凭证并绑定可用分组' },
    { path: '/usage', icon: 'chart', title: '查看调用记录', description: '按模型、密钥与时间核对用量' },
    { path: '/redeem', icon: 'gift', title: '兑换权益', description: '使用兑换码激活订阅或账户权益' },
  ]

  if (canUseBatchImage.value) {
    items.splice(2, 0, {
      path: '/batch-image',
      icon: 'sparkles',
      title: '批量图像助手',
      description: '进入已授权的批量图像工作流',
    })
  }

  return items
})

onMounted(() => {
  void refreshBatchImageAccess()
})
</script>
