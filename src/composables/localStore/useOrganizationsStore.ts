import { useLocalStorage } from '@vueuse/core'
import type { Organization } from '@/models/models'

const organizations = useLocalStorage('organizations', [] as Organization[])

export default organizations
