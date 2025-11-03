<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useDataFetcher } from '@/composables/useDataFetcher'
import { useUserStore, type UserProfileData } from '@/stores/user'

const url = ref('/test-itv/api/users/123')
const { data, loading, error } = useDataFetcher<UserProfileData>(url)

const userStore = useUserStore()

watchEffect(() => {
  if (data.value) {
    userStore.setProfile(data.value)
  }
})
</script>

<template>
  <div class="widget">
    <h3 class="title">Профиль пользователя</h3>
    <div v-if="loading" class="state">Загрузка…</div>
    <div v-else-if="error" class="state error">Ошибка: {{ error.message }}</div>
    <div v-else-if="data">
      <div class="row">
        <span class="label">Имя:</span> <strong>{{ data.name }}</strong>
      </div>
      <div class="row">
        <span class="label">Город:</span> <strong>{{ data.city }}</strong>
      </div>
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
.state.error {
  color: #db786d;
}
.row {
  margin: 4px 0;
}
.label {
  color: #6b7280;
  margin-right: 6px;
}
</style>
