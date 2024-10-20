import { useLocalStorage } from '@vueuse/core'

import type { Session } from '@supabase/supabase-js'

import type { Company } from '@/models/models'

interface Self {
  user?: any
  session?: Session
  company?: Company
}

const self = useLocalStorage<Self>('self', {
  user: undefined,
  session: undefined,
  company: undefined
})

export default self
