<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDataFetcher } from '@/composables/useDataFetcher'
import { useUserStore } from '@/stores/user'

type WeatherData = { city: string; temperature: number; description: string }

interface Props {
  defaultCity?: string
}

const props = defineProps<Props>()
const userStore = useUserStore()

const activeCity = ref<string>(props.defaultCity || 'Moscow')

watch(
  () => userStore.city,
  (newCity) => {
    if (newCity && newCity !== activeCity.value) {
      activeCity.value = newCity
    }
  },
  { immediate: true },
)

const url = computed(() => `/api/weather?city=${encodeURIComponent(activeCity.value)}`)
const { data, loading, error, refetch } = useDataFetcher<WeatherData>(url)
</script>

<template>
  <div class="widget">
    <h3 class="title">Погода</h3>
    <div v-if="loading" class="state">Загрузка погоды…</div>
    <div v-else-if="error" class="state error">Ошибка: {{ error.message }}</div>
    <div v-else-if="data">
      <div class="row">
        <span class="city">{{ data.city }}</span>
        <span class="temp">{{ data.temperature }}°C</span>
        <span class="desc">{{ data.description }}</span>
      </div>
      <button class="refresh" @click="refetch">Обновить</button>
    </div>
  </div>
</template>

<style scoped>
.title {
  margin: 0 0 8px;
  font-size: 16px;
}
.state {
  padding: 8px 0;
}
.row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.temp {
  font-weight: 600;
}
.city {
  font-weight: 600;
}
.error {
  color: #db786d;
}
.refresh {
  margin-top: 8px;
}
</style>
