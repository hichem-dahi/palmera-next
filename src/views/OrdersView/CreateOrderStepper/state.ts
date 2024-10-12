import { reactive, ref, watchEffect } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { max, round, sum } from 'lodash'

import orders from '@/composables/localStore/useOrdersStore'

import {
  ConsumerType,
  DocumentType,
  type Delivery,
  type Individual,
  type OrderLine
} from '@/models/models'

const consumerType = ref<ConsumerType>()

const form = reactive({
  id: uuidv4(),
  index: undefined as any,
  company: undefined as any,
  individual: {
    id: uuidv4(),
    name: '',
    phone: ''
  } as Individual,
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
  } as Delivery,
  document_type: 0,
  docIndex: 0,
  payment_method: '',
  paid_price: 0 as any,
  total_price: 0,
  tva: 0,
  ttc: 0
})

function cleanForm() {
  switch (form.document_type) {
    case DocumentType.DeliveryNote:
      form.delivery = {
        id: uuidv4(),
        driver_name: '',
        phone: '',
        matricule: '',
        destination: ''
      }
      break

    case DocumentType.Invoice:
    case DocumentType.Voucher:
      form.delivery = undefined as any
      break

    case DocumentType.Proforma:
      form.delivery = undefined as any
      form.index = undefined
      form.paid_price = undefined
      break

    default:
      // Handle any other document types if necessary
      break
  }

  if (consumerType.value === ConsumerType.Company) {
    form.individual = undefined as any
    form.tva = round(form.total_price * 0.19, 0)
    form.ttc = round(form.total_price * 1.19, 0)
  } else if (consumerType.value === ConsumerType.Individual) {
    form.company = undefined
  }
}

watchEffect(() => {
  form.total_price = sum(form.order_lines.map((e) => e.total_price))
  form.index = (max(orders.value.map((o) => o.index)) || 0) + 1
  form.docIndex =
    (max(
      orders.value.filter((o) => o.document_type == form.document_type).map((o) => o.docIndex)
    ) || 0) + 1
})

export { form, consumerType, cleanForm }
