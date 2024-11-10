import { computed } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useGetOrdersApi() {
  const query = async () =>
    supabase.from('orders').select(`
    *,
    client:organizations!orders_client_id_fkey (*),    
    delivery:deliveries (*),
    individual:individuals (*)
  `)

  const q = useAsyncState(query, undefined, { immediate: true }) // Invoke query properly

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && q.state.value?.statusText === 'OK')

  return { ...q, data, error, isSuccess }
}
