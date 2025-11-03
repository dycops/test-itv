<script setup lang="ts">
import { computed } from 'vue'
import { useDataFetcher } from '@/composables/useDataFetcher'

type Ticker = { symbol: string; price: number; change: number }

interface Props {
  symbols?: string[]
}

const props = defineProps<Props>()
const query = computed(() =>
  props.symbols && props.symbols.length ? props.symbols.join(',') : 'AAPL,GOOG',
)
const url = computed(() => `/test-itv/api/stocks?symbols=${encodeURIComponent(query.value)}`)

const { data, loading, error, refetch } = useDataFetcher<Ticker[]>(url)
</script>

<template>
  <div class="widget">
    <h3 class="title">Котировки</h3>
    <div v-if="loading" class="state">Загрузка котировок…</div>
    <div v-else-if="error" class="state error">Ошибка: {{ error.message }}</div>
    <div v-else-if="data">
      <table class="table">
        <thead>
          <tr>
            <th>Акция</th>
            <th>Цена</th>
            <th>Изм.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in data" :key="row.symbol">
            <td>{{ row.symbol }}</td>
            <td>{{ row.price.toFixed(2) }}</td>
            <td :class="{ up: row.change >= 0, down: row.change < 0 }">
              {{ row.change.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
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
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  padding: 6px 8px;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.up {
  color: #2ecc71;
}
.down {
  color: #e74c3c;
}
.error {
  color: #db786d;
}
.refresh {
  margin-top: 8px;
}
</style>
