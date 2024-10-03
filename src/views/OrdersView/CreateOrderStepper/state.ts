import { reactive, ref, watchEffect } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { max, round, sum } from 'lodash'

import orders from '@/composables/localStore/useOrdersStore'

import { ConsumerType, DocumentType, type Delivery, type OrderLine } from '@/models/models'

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
  } as Delivery | undefined,
  payment_method: '',
  paid_price: 0,
  total_price: 0,
  tva: 0,
  ttc: 0
})

watchEffect(() => {
  form.total_price = sum(form.order_lines.map((e) => e.total_price))
  form.index = (max(orders.value.map((o) => o.index)) || 0) + 1
  if (documentType.value == DocumentType.Invoice) form.delivery = undefined
  if (consumerType.value == ConsumerType.Company) {
    form.individual = {
      id: '',
      name: '',
      phone: ''
    }
    form.tva = round((form.total_price * 19) / 100, 0)
    form.ttc = round((form.total_price * 119) / 100, 0)
  } else if (consumerType.value == ConsumerType.Individual) {
    form.company = undefined
  }
})

export { form, consumerType, documentType }
