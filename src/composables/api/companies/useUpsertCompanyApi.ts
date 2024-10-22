import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

import type { Company } from '@/models/models'

export function useUpsertCompanyApi() {
  const form = ref<Company | null>(null) // Use ref to make it reactive

  const query = async () => {
    if (form.value) {
      return supabase.from('companies').upsert(form.value).select()
    } else {
      throw new Error('Form is null or incomplete')
    }
  }

  const q = useAsyncState(query, undefined) // Invoke query properly

  const data = computed(() => q.state.value?.data?.[0])
  const error = computed(() => q.state.value?.error)

  return { ...q, data, error, form }
}
