import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useUpdateProfileApi() {
  const params = ref({
    profileForm: undefined
  })

  const query = async () =>
    params.value.profileForm
      ? supabase.from('profiles').update(params.value.profileForm)
      : undefined

  const q = useAsyncState(query, undefined)

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)

  return { ...q, data, error }
}
