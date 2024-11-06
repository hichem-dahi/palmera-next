import { reactive, ref, watchEffect } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { max, round, sum } from 'lodash'

import {
  ConsumerType,
  DocumentType,
  OrderStatus,
  type Delivery,
  type Individual,
  type OrderLine,
  type Payment
} from '@/models/models'
import payments from '@/composables/localStore/usePaymentsStore'
import self from '@/composables/localStore/useSelf'

const consumerType = ref<ConsumerType>()

const defaultForm = () => ({
  id: uuidv4(),
  organization_id: self.value.user?.organization_id,
  client_id: '',
  individual: {
    name: '',
    phone: undefined
  } as Individual,
  date: new Date().toISOString(),
  order_lines: [
    {
      id: uuidv4(),
      product_id: '',
      qte: null,
      unit_price: 0,
      total_price: 0
    }
  ],
  delivery: {
    driver_name: '',
    phone: undefined,
    license_plate: '',
    destination: ''
  } as Delivery,
  document_type: 'DeliveryNote', //TODO: change type
  doc_index: null,
  status: 'Pending',
  payment_method: '',
  paid_price: 0 as any,
  total_price: 0,
  tva: 0,
  ttc: 0
})

const form = reactive(defaultForm())

const payment = reactive({
  id: uuidv4(),
  date: new Date(),
  amount: null as number | null
})

function cleanForm() {
  switch (form.document_type) {
    case DocumentType.Invoice:
    case DocumentType.Voucher:
      form.delivery = undefined as any
      break
    case DocumentType.Proforma:
      form.delivery = undefined as any
      form.paid_price = undefined
      break
    default:
      break
  }

  if (consumerType.value === ConsumerType.Organization) {
    form.individual = undefined as any
    form.tva = round(form.total_price * 0.19, 0)
    form.ttc = round(form.total_price * 1.19, 0)
  } else if (consumerType.value === ConsumerType.Individual) {
    form.client_id = undefined as any
  }
}

function resetForm() {
  Object.assign(form, defaultForm())
}

function resetPayment() {
  Object.assign(payment, {
    id: uuidv4(),
    date: new Date(),
    amount: null
  })
}

function processPayment(p: typeof payment) {
  const remaining = form.total_price - form.paid_price
  if (form && p.amount && p.amount > 0 && p.amount <= remaining) {
    payments.value.push(p as Payment)
  }
}

watchEffect(() => {
  const remaining = form.total_price - form.paid_price
  form.total_price = sum(form.order_lines.map((e) => e.total_price))
  if (payment.amount && payment.amount > 0 && payment.amount <= remaining) {
    //form.payments_ids = [payment.id]
    form.paid_price = form.total_price - (form.total_price - payment.amount)
  }
})

export { form, payment, consumerType, cleanForm, resetForm, resetPayment, processPayment }
