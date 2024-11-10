import { reactive, ref, watchEffect } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { round, sum } from 'lodash'

import { ConsumerType, DocumentType, OrderStatus, type Payment } from '@/models/models'
import payments from '@/composables/localStore/usePaymentsStore'
import self from '@/composables/localStore/useSelf'
import type { TablesInsert } from '@/types/database.types'

const consumerType = ref<ConsumerType>()

const defaultForm = () => ({
  id: uuidv4(),
  organization_id: self.value.user?.organization_id,
  client_id: undefined as string | undefined,
  delivery_id: undefined,
  individual_id: undefined,
  date: new Date().toISOString(),
  document_type: 0, //TODO: change type
  doc_index: null,
  status: OrderStatus.Pending,
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

const orderlinesForm = ref<TablesInsert<'order_lines'>[]>([])
const deliveryForm = ref<TablesInsert<'deliveries'>>({
  driver_name: '',
  phone: undefined,
  license_plate: '',
  destination: ''
})
const individualForm = ref({
  name: '',
  phone: undefined as string | undefined
})

function cleanForm() {
  if (!form.document_type) return
  switch (form.document_type) {
    case DocumentType.Proforma:
      form.paid_price = undefined
      break
    default:
      break
  }

  if (consumerType.value === ConsumerType.Organization) {
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
  form.total_price = sum(orderlinesForm.value.map((e) => e.total_price))
  if (payment.amount && payment.amount > 0 && payment.amount <= remaining) {
    //form.payments_ids = [payment.id]
    form.paid_price = form.total_price - (form.total_price - payment.amount)
  }
})

export {
  orderlinesForm,
  deliveryForm,
  individualForm,
  form,
  payment,
  consumerType,
  cleanForm,
  resetForm,
  resetPayment,
  processPayment
}
