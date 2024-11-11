import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

import type { TablesUpdate } from '@/types/database.types'

export function useUpdateOrderApi() {
  const form = ref<TablesUpdate<'orders'>>() // Use ref to make it reactive

  const query = async () => {
    if (form.value?.id) {
      return supabase
        .from('orders')
        .update(form.value)
        .eq('id', form.value.id)
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
        .single()
    } else {
      throw new Error('Form is null or incomplete')
    }
  }

  const q = useAsyncState(query, undefined) // Invoke query properly

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && !error.value)

  return { ...q, data, error, isSuccess, form }
}
