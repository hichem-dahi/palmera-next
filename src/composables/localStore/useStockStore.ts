import { useLocalStorage } from '@vueuse/core'
import type { StockMovement } from '@/models/models'

const stock = useLocalStorage('stock', [] as StockMovement[])

export default stock
