import { useLocalStorage } from '@vueuse/core'
import type { Payment } from '@/models/models'

const payments = useLocalStorage('payments', [] as Payment[])

export default payments
