import { useLocalStorage } from '@vueuse/core'
import type { Product } from '@/models/models'

const products = useLocalStorage('products', [] as Product[])

export default products
