import { computed, reactive } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useSignUpApi() {
  const form = reactive({ email: '' })

  const query = () =>
    supabase.auth.signInWithOtp({
      email: form.email
    })

  const q = useAsyncState(query, undefined) // Invoke query properly

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)

  return { ...q, data, error, form }
}
