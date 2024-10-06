import type { Company } from '@/models/models'
import { useLocalStorage } from '@vueuse/core'

interface Self {
  company?: Company
}

const self = useLocalStorage<Self>('self', { company: undefined })

export default self
