import { computed, reactive } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useSignUpApi() {
  const params = reactive({ email: '' })

  const query = () =>
    supabase.auth.signInWithOtp({
      email: params.email
    })

  const q = useAsyncState(query, null, { immediate: false })

  return { ...q, params }
}
