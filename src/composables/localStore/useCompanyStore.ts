import { useLocalStorage } from '@vueuse/core'
import type { Company } from '@/models/models'

const companies = useLocalStorage('companies', [] as Company[])

export default companies
