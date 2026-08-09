<template>
  <span class="gateway-brand" :class="{ 'gateway-brand-compact': compact }">
    <span class="gateway-brand-mark" :class="markClass">
      <img v-if="logo" :src="logo" alt="" class="h-full w-full object-contain" />
      <img v-else src="/logo.svg" alt="" class="h-full w-full object-contain" />
    </span>
    <span v-if="!compact" class="gateway-brand-name" :class="nameClass">{{ name }}</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  logo?: string
  name?: string
  compact?: boolean
  markClass?: string
  nameClass?: string
}>(), {
  logo: '',
  name: 'Gateway Bot',
  compact: false,
  markClass: '',
  nameClass: '',
})
</script>

<style scoped>
.gateway-brand {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.65rem;
}

.gateway-brand-mark {
  display: inline-flex;
  height: 2.25rem;
  width: 2.25rem;
  flex: none;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 6px;
}

.gateway-brand-name {
  overflow: hidden;
  color: inherit;
  font-size: 0.975rem;
  font-weight: 620;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
