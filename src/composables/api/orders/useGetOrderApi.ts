import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useGetOrderApi() {
  const orderId = ref()

  const query = async () =>
    supabase
      .from('orders')
      .select(
        `*,
          client:organizations!orders_client_id_fkey (*),    
          order_lines:order_lines (
            *,
            product:products (*)
          ),    
          payments(*),
          delivery:deliveries (*),
          individual:individuals (*)
        `
      )
      .eq('id', orderId.value)
      .single()

  const q = useAsyncState(query, undefined, { immediate: false }) // Invoke query properly

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && !error.value)

  return { ...q, orderId, data, error, isSuccess }
}
