import { useLocalStorage } from '@vueuse/core'

import type { Order } from '@/models/models'

const orders = useLocalStorage('orders', [] as Order[])

export default orders
