import { computed, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { supabase } from '@/supabase/supabase'

// Define types outside the function for reuse
type QueryResult = Awaited<ReturnType<typeof fetchOrder>>
export type OrderData = NonNullable<QueryResult['data']>
export type OrderLineData = OrderData['order_lines'][0]

// Function to perform the Supabase query
async function fetchOrder(orderId: string) {
  return supabase
    .from('orders')
    .select(
      `*,
        client:organizations!orders_client_id_fkey (*),    
        order_lines:order_lines (
          *,
          product:products (*)
        ),    
        payments(*),
        delivery:deliveries (*),
        individual:individuals (*)
      `
    )
    .eq('id', orderId)
    .single()
}

// Composition function to fetch an order
export function useGetOrderApi() {
  const orderId = ref<string | undefined>()

  const query = async () => (orderId.value ? fetchOrder(orderId.value) : undefined)

  const q = useAsyncState(query, undefined, { immediate: false })

  const data = computed(() => q.state.value?.data)
  const error = computed(() => q.state.value?.error)
  const isSuccess = computed(() => q.isReady.value && !error.value)

  return { ...q, orderId, data, error, isSuccess }
}
