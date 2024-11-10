import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useGetClientOrdersApi() {
  const clientId = ref<string>()

  const query = async () => {
    if (clientId.value) {
      return supabase
        .from('orders')
        .select(
          `
            *,
            client:organizations!orders_client_id_fkey (*),  
            order_lines:order_lines (
              *,
              product:products (*)
            ),      
            delivery:deliveries (*),
            individual:individuals (*)
          `
        )
        .eq('client_id', clientId.value)
    } else {
      throw new Error('Form is null or incomplete')
    }
  }
  const q = useAsyncState(query, undefined, { immediate: false }) // Invoke query properly

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && !error.value)

  return { ...q, data, error, isSuccess, clientId }
}
