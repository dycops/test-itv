import { ref, watchEffect, type Ref } from 'vue'

export interface UseDataFetcherResult<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refetch: () => Promise<void>
}

export function useDataFetcher<T>(urlRef: Ref<string> | string): UseDataFetcherResult<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false) as Ref<boolean>
  const error = ref<Error | null>(null) as Ref<Error | null>

  const doFetch = async (url: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      data.value = (await res.json()) as T
    } catch (e) {
      error.value = e as Error
      data.value = null
    } finally {
      loading.value = false
    }
  }

  const refetch = async () => {
    const currentUrl = typeof urlRef === 'string' ? urlRef : urlRef.value
    await doFetch(currentUrl)
  }

  watchEffect(() => {
    const currentUrl = typeof urlRef === 'string' ? urlRef : urlRef.value
    void doFetch(currentUrl)
  })

  return { data, loading, error, refetch }
}
