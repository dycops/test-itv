<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watchEffect } from 'vue'

import { useDataFetcher } from '@/composables/useDataFetcher'

interface DashboardWidgetConfig {
  id: number
  component: string
  settings: Record<string, unknown>
}

const apiUrl = ref('/api/dashboard')
const { data, loading, error } = useDataFetcher<DashboardWidgetConfig[]>(apiUrl)

// динамическая карта виджетов из папки widgets
const widgetModules = import.meta.glob('@/components/widgets/*.vue')

function resolveAsyncComponent(name: string) {
  const key = Object.keys(widgetModules).find((k) => k.endsWith(`/${name}.vue`))
  if (!key) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return defineAsyncComponent(widgetModules[key] as any)
}

const widgets = computed(() => data?.value ?? [])

// defaultCity для Weather из конфигурации
const defaultCity = ref<string | null>(null)
watchEffect(() => {
  const weatherCfg = widgets.value.find((w) => w.component === 'Weather')
  defaultCity.value =
    (weatherCfg?.settings as { defaultCity?: string } | undefined)?.defaultCity ?? null
})
</script>

<template>
  <section class="dashboard">
    <div v-if="loading" class="state">Загрузка панели…</div>
    <div v-else-if="error" class="state error">Ошибка: {{ error.message }}</div>

    <div v-else class="grid">
      <component
        v-for="w in widgets"
        :key="w.id"
        :is="resolveAsyncComponent(w.component)"
        v-bind="w.settings"
        :defaultCity="w.component === 'Weather' ? defaultCity : undefined"
      />
    </div>
  </section>
</template>

<style scoped>
.dashboard {
  padding: 16px;
}
.state {
  padding: 16px;
}
.state.error {
  color: #db786d;
}
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}
.grid > * {
  grid-column: span 4;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
@media (max-width: 1024px) {
  .grid > * {
    grid-column: span 6;
  }
}
@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .grid > * {
    grid-column: span 4;
  }
}
</style>
