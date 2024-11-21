import { useLocalStorage } from '@vueuse/core'

import type { Session } from '@supabase/supabase-js'

import type { Organization } from '@/models/models'
import type { ProfileData } from '../api/auth/useGetProfileApi'

interface Self {
  user?: ProfileData
  session?: Session
  organization?: Organization
}

const self = useLocalStorage<Self>('self', {
  user: undefined,
  session: undefined,
  organization: undefined
})

export default self
