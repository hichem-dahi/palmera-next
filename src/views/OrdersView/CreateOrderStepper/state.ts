import { reactive, ref, watchEffect } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { max, sum } from 'lodash'

import orders from '@/composables/localStore/useOrdersStore'

import { ConsumerType, DocumentType, type OrderLine } from '@/models/models'

const consumerType = ref<ConsumerType>()
const documentType = ref(DocumentType.DeliveryNote)

const form = reactive({
  id: uuidv4(),
  index: 0,
  company: undefined,
  individual: {
    id: uuidv4(),
    name: '',
    phone: ''
  },
  date: new Date(),
  order_lines: [
    {
      id: uuidv4(),
      product_id: '',
      qte: null,
      total_price: 0
    }
  ] as OrderLine[],
  delivery: {
    id: uuidv4(),
    driver_name: '',
    phone: '',
    matricule: '',
    destination: ''
  },
  payment_method: '',
  paid_price: 0,
  total_price: 0
})

watchEffect(() => {
  form.total_price = sum(form.order_lines.map((e) => e.total_price))
  form.index = (max(orders.value.map((o) => o.index)) || 0) + 1

  if (consumerType.value == ConsumerType.Company) {
    form.individual = {
      id: '',
      name: '',
      phone: ''
    }
  } else if (consumerType.value == ConsumerType.Individual) {
    form.company = undefined
  }
})

export { form, consumerType, documentType }
