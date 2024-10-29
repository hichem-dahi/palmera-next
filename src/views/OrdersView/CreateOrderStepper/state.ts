import { reactive, ref, watchEffect } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { max, round, sum } from 'lodash'

import orders from '@/composables/localStore/useOrdersStore'

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

const consumerType = ref<ConsumerType>()

const defaultForm = () => ({
  id: uuidv4(),
  index: undefined as any,
  organization_id: undefined as any,
  individual: {
    id: uuidv4(),
    name: '',
    phone: undefined
  } as Individual,
  date: new Date(),
  order_lines: [
    {
      id: uuidv4(),
      product_id: '',
      qte: null,
      unit_price: 0,
      total_price: 0
    }
  ] as OrderLine[],
  delivery: {
    id: uuidv4(),
    driver_name: '',
    phone: undefined,
    matricule: '',
    destination: ''
  } as Delivery,
  document_type: 0,
  docIndex: null,
  status: OrderStatus.Pending,
  payments_ids: [] as string[],
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
      form.index = undefined
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
    form.organization_id = undefined
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
  form.index = (max(orders.value.map((o) => o.index)) || 0) + 1

  if (payment.amount && payment.amount > 0 && payment.amount <= remaining) {
    form.payments_ids = [payment.id]
    form.paid_price = form.total_price - (form.total_price - payment.amount)
  }
})

export { form, payment, consumerType, cleanForm, resetForm, resetPayment, processPayment }
