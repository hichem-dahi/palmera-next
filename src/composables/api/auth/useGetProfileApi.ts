import { ref, computed } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

// Define QueryProfile based on the query function

export function useGetProfileApi() {
  const userId = ref<string | undefined>(undefined)

  // Define the query function outside of useGetProfileApi to reuse its type
  const query = async (userId: string | undefined) =>
    userId
      ? supabase
          .from('profiles')
          .select(
            `
        id, 
        full_name, 
        email, 
        phone, 
        organization_id,
        organization: organizations(*)
      `
          )
          .eq('id', userId)
          .single()
      : undefined
  const q = useAsyncState(() => query(userId.value), undefined, { immediate: false })

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && !error.value)

  return { ...q, data, error, isSuccess, userId }
}
