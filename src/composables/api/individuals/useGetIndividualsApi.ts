import { computed } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useGetIndividualsApi() {
  const query = async () => supabase.from('individuals').select()

  const q = useAsyncState(query, undefined, { immediate: false }) // Invoke query properly

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && !error.value)

  return { ...q, data, error, isSuccess }
}
