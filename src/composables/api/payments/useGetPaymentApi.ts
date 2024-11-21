import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'

import { supabase } from '@/supabase/supabase'

export function useGetPaymentApi() {
  const paymentId = ref<string>()

  const query = async () => {
    if (paymentId.value) {
      return supabase
        .from('payments')
        .select(
          `
            *,
            order:orders(
              *,
              order_lines:order_lines (
                *,
                product:products (*)
              ),
              individual:individuals (*),
              client:organizations!orders_client_id_fkey (*)   
            )
          `
        )
        .eq('id', paymentId.value)
    } else {
      throw new Error('Form is null or incomplete')
    }
  }

  const q = useAsyncState(query, undefined) // Invoke query properly

  const data = computed(() => q.state.value?.data?.[0])
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && !error.value)

  return { ...q, data, error, isSuccess, paymentId }
}

export type PaymentData = NonNullable<ReturnType<typeof useGetPaymentApi>['data']['value']>
