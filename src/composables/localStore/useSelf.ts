import { useLocalStorage } from '@vueuse/core'

import type { Session } from '@supabase/supabase-js'

import type { Company } from '@/models/models'
import type { Tables } from '@/types/database.types'

interface Self {
  user?: Tables<'profiles'>
  session?: Session
  company?: Company
}

const self = useLocalStorage<Self>('self', {
  user: undefined,
  session: undefined,
  company: undefined
})

export default self
