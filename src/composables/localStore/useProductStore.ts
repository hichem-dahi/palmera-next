import type { Product } from '@/models/models'
import { useLocalStorage } from '@vueuse/core'

const products = useLocalStorage('products', [] as Product[])

export default products
