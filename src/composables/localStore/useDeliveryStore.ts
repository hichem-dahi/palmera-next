import { useLocalStorage } from '@vueuse/core'

import type { Delivery } from '@/models/models'

const deliveries = useLocalStorage('deliveries', [] as Delivery[])

export default deliveries
