import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useDeleteOrganizationApi() {
  const orgId = ref<string>()

  const query = async () => {
    if (orgId.value) {
      return supabase.from('organizations').delete().eq('id', orgId.value)
    } else {
      throw new Error('Form is null or incomplete')
    }
  }

  const q = useAsyncState(query, undefined, { immediate: false }) // Invoke query properly

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && !error.value)

  return { ...q, data, isSuccess, error, orgId }
}
