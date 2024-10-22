import { reactive, computed } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useVerifyCodeApi() {
  const params = reactive({ email: '', code: '' })

  const query = () =>
    supabase.auth.verifyOtp({
      email: params.email,
      token: params.code,
      type: 'email'
    })
  const q = useAsyncState(query, undefined, { immediate: false })

  return { ...q, params }
}
