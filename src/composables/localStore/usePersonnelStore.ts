import { useLocalStorage } from '@vueuse/core'

const personnel = useLocalStorage('personnel', [] as any[])

export default personnel
