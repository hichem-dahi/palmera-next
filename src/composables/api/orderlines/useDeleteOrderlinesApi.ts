import { ref, computed } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useDeleteOrderlinesApi() {
  const orderId = ref() // Use ref to make it reactive

  const query = async () => {
    if (orderId.value) {
      return supabase.from('order_lines').delete().eq('order_id', orderId.value)
    } else {
      throw new Error('Form is null or incomplete')
    }
  }

  const q = useAsyncState(query, undefined) // Invoke query properly

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && !error.value)

  return { ...q, data, error, isSuccess, orderId }
}
