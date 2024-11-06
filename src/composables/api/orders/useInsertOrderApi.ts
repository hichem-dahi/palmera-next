import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

import type { TablesInsert } from '@/types/database.types'

export function useInsertOrderApi() {
  const form = ref<TablesInsert<'orders'>>() // Use ref to make it reactive

  const query = async () => {
    if (form.value) {
      return supabase
        .from('orders')
        .insert(form.value)
        .select(
          `
        *,
        individual:individual_id ( * ),
        delivery:delivery_id ( * )
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
