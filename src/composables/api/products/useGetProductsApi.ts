import { computed } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useGetProductsApi() {
  const query = async () => supabase.from('products').select()

  const q = useAsyncState(query, undefined, { immediate: true }) // Invoke query properly

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && q.state.value?.statusText === 'OK')

  return { ...q, data, error, isSuccess }
}
