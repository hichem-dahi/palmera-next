import { useLocalStorage } from '@vueuse/core'

const products = useLocalStorage('products', [] as any[])

export default products
