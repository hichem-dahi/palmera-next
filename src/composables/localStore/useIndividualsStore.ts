import { useLocalStorage } from '@vueuse/core'
import type { Individual } from '@/models/models'

const individuals = useLocalStorage('individuals', [] as Individual[])

function upsertIndividuals(form: Individual) {
  const existingIndex = individuals.value.findIndex((c) => c.id === form.id)
  if (existingIndex === -1) {
    individuals.value.push(form)
  }
}

export { individuals, upsertIndividuals }
