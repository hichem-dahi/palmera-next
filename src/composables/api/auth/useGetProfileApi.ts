import { ref, computed } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useGetProfileApi() {
  const userId = ref()

  const query = async () =>
    userId.value
      ? supabase
          .from('profiles')
          .select(
            `
            id, 
            full_name, 
            email, 
            phone, 
            company_id,
            companies (
              id,
              name,
              activity,
              address,
              art,
              nif,
              nis,
              phone,
              rc
            )
          `
          )
          .eq('id', userId.value)
          .single()
      : undefined

  const q = useAsyncState(query, undefined, { immediate: false })

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)

  return { ...q, data, error, userId }
}
