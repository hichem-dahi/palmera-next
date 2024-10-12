import { useLocalStorage } from '@vueuse/core'

import type { Proforma } from '@/models/models'

const proformas = useLocalStorage('preformas', [] as Proforma[])

export default proformas
