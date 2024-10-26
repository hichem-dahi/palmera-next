import { computed, reactive } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useGetProductApi() {
  const params = reactive({
    id: ''
  })

  const query = async () => {
    if (params.id) {
      return supabase.from('products').select().eq('id', params.id).single()
    } else {
      throw new Error('Form is null or incomplete')
    }
  }
  const q = useAsyncState(query, undefined, { immediate: true }) // Invoke query properly

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && q.state.value?.statusText === 'OK')

  return { ...q, data, error, isSuccess }
}
