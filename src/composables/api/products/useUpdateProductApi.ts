import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

import type { TablesUpdate } from '@/types/database.types'

export function useUpdateProductApi() {
  const form = ref<TablesUpdate<'products'>>() // Use ref to make it reactive

  const query = async () => {
    if (form.value && form.value.id) {
      return supabase.from('products').update(form.value).eq('id', form.value.id).select().single()
    } else {
      throw new Error('Form is null or incomplete')
    }
  }

  const q = useAsyncState(query, undefined) // Invoke query properly

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && q.state.value?.statusText === 'OK')

  return { ...q, data, error, isSuccess, form }
}
