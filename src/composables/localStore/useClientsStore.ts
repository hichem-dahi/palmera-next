import { useLocalStorage } from '@vueuse/core'
import type { Client } from '@/models/models'

const clients = useLocalStorage('clients', [] as Client[])

export default clients
