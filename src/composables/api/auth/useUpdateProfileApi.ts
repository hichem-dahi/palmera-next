import { reactive } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useUpdateProfileApi() {
  const params = reactive<any>({
    form: {}
  })

  const query = async () =>
    params.form.id
      ? supabase.from('profiles').update(params.form).eq('id', params.form.id).select().single()
      : undefined

  const q = useAsyncState(query, undefined, { immediate: false })

  return { ...q, params }
}
