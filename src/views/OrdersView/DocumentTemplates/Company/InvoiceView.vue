<template>
  <div class="invoice-wrapper">
    <div v-if="order" ref="invoice" class="invoice">
      <div class="row-1">
        <div v-for="(value, key) in selfInfo" :key="key">
          <div v-if="key == 'name'">
            <h3>{{ value }}</h3>
          </div>
          <div v-else-if="key == 'activity'">
            <div>{{ value }}</div>
          </div>
          <div v-else>{{ key }}: {{ value }}</div>
        </div>
        <h3 class="type pa-4">
          {{ title }}
          <span v-if="order.index">N°: {{ padStart(order.docIndex.toString(), 4, '0') }}/2024</span>
        </h3>
        <div class="d-flex justify-space-between align-center ga-4">
          <div>
            <div v-for="(value, key) in consumer" :key="key">{{ key }}: {{ value }}</div>
          </div>
          <div class="mt-6 text-decoration-underline">
            SPA LE: {{ format(order.date, 'dd-MM-yyyy') }}
          </div>
        </div>
        <table cellpadding="10" cellspacing="0" width="100%">
          <thead>
            <tr>
              <th align="left">N°</th>
              <th align="left">Designation</th>
              <th align="left">Quantity</th>
              <th align="left">Prix HT</th>
              <th align="left">Montant HT</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="line in items" :key="line.index">
              <td v-for="(value, i) in line" :key="i">
                {{ value }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr v-for="(value, key) in totalItems" :key="key">
              <td colspan="3" class="no-border"></td>
              <td>
                <strong>{{ key }}</strong>
              </td>
              <td>
                <strong>{{ value }}</strong>
              </td>
              <!-- Replace with actual total -->
            </tr>
          </tfoot>
        </table>
        <div v-if="order?.payment_method" class="payment-method mt-5">
          Mode de payment: {{ order?.payment_method }}
        </div>
        <div v-if="totalWords" class="total-words">
          Arréter la préforma a la somme de: <b>{{ totalWords }}</b>
        </div>
      </div>
      <div
        class="delivery-info row-2"
        v-if="($route.query.type as any) == DocumentType.DeliveryNote"
      >
        <div class="d-flex align-center" v-for="(value, key) in deliveryInfo" :key="key">
          <span class="font-weight-bold">{{ key }}:</span>
          <span>&nbsp;{{ value }}</span>
        </div>
      </div>
    </div>
    <div class="actions no-print">
      <v-btn class="mr-5" @click="print()">print</v-btn>
      <v-btn @click="downloadInvoice()">download</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { pick, round, padStart } from 'lodash'
import html2pdf from 'html2pdf.js'
import n2words from 'n2words'

import orders from '@/composables/localStore/useOrdersStore'
import products from '@/composables/localStore/useProductStore'
import companies from '@/composables/localStore/useCompanyStore'

import { ConsumerType, DocumentType } from '@/models/models'
import self from '@/composables/localStore/useSelf'
import { format } from 'date-fns'

const route = useRoute()

const invoice = ref()

const title = computed(() => (order.value?.delivery ? 'bon de livraison' : 'facture'))

const order = computed(() => orders.value.find((o) => o.id == route.params.order_id))

const consumerType = computed(() =>
  order.value?.company ? ConsumerType.Company : ConsumerType.Individual
)

const totalWords = computed(() => {
  if (consumerType.value === ConsumerType.Individual) return undefined
  let number = totalItems.value['T.T.C'] || 0
  let integerPart = Math.floor(number)
  let decimalPart = number % 1

  let words = n2words(integerPart, { lang: 'fr' })
  if (decimalPart !== 0) {
    words += ' virgule ' + n2words(Math.floor(decimalPart * 10), { lang: 'fr' })
  }
  return `${words} dinars alg`
})

const deliveryInfo = computed(() => {
  const deliveryInfoKeys = ['chauffeur', 'phone', 'matricule', 'destination']
  let delivery = { ...order.value?.delivery, chauffeur: order.value?.delivery?.driver_name }

  return pick(delivery, deliveryInfoKeys)
})

const selfInfo = computed(() => {
  let selfInfo = self.value.company
  if (!selfInfo) return
  selfInfo = {
    ...selfInfo,
    name: selfInfo.name,
    'R.C': selfInfo.rc,
    'N°tel': selfInfo.phone
  } as any
  const desiredOrder = ['name', 'activity', 'address', 'R.C', 'nif', 'nis', 'art', 'N°tel']
  return pick(selfInfo, desiredOrder)
})

const consumer = computed(() => {
  let company = { ...companies.value.find((c) => c.id === order.value?.company) }
  let individual = order.value?.individual as any

  if (Object.keys(company).length) {
    company = { ...company, client: company.name } as any
    const desiredOrder = ['client', 'rc', 'nif', 'art', 'address', 'activity']
    return pick(company, desiredOrder)
  } else if (Object.keys(individual).length) {
    individual = { ...individual, client: individual.name }
    const desiredOrder = ['client', 'phone']
    return pick(individual, desiredOrder)
  } else return ''
})

const items = computed(() =>
  order.value?.order_lines.map((o, i) => {
    const product = getProduct(o.product_id)
    return {
      index: i,
      product_name: product?.name,
      qte: o.qte,
      unity_price: product?.price,
      total_price: o.total_price
    }
  })
)

const totalItems = computed(() => {
  const isCompany = consumerType.value == ConsumerType.Company
  if (isCompany) {
    return {
      total: order.value?.total_price,
      'T.V.A 19%': round((order.value?.total_price! * 19) / 100, 0),
      'T.T.C': round((order.value?.total_price! * 119) / 100, 0)
    }
  } else
    return {
      total: order.value?.total_price
    }
})

const getProduct = (id: string) => products.value.find((e) => e.id == id)

function print() {
  window.print()
}

function downloadInvoice() {
  const invoiceElement = document.querySelector('.invoice') // Select the invoice element
  if (!invoiceElement) return // Ensure the element exists

  // Backup original styles
  const originalMaxWidth = (invoiceElement as any).maxWidth
  const originalTransform = (invoiceElement as any).transform

  // Remove max-width and scale
  ;(invoiceElement as any).style.maxWidth = 'none'
  ;(invoiceElement as any).transform = 'none'

  // Configuration for html2pdf
  const opt = {
    margin: [10, 10, 10, 10], // Margins in mm
    filename: 'invoice.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 }, // Scale for better resolution
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  // Generate and save the PDF
  html2pdf()
    .from(invoiceElement)
    .set(opt)
    .save()
    .then(() => {
      // Restore original styles after download
      ;(invoiceElement as any).maxWidth = originalMaxWidth
      ;(invoiceElement as any).transform = originalTransform
    })
}
</script>

<style>
.invoice {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-transform: capitalize;
  aspect-ratio: 1 / 1.414; /* Aspect ratio for A4 size */
  overflow-y: auto; /* Add scroll to the wrapper if content exceeds the height */
  margin: auto;
  white-space: nowrap;
  transform: scale(0.7); /* Scale down the element */
  transform-origin: top; /* Ensure scaling happens from the top */

  @media (min-width: 1024px) {
    /* Target screens larger than 1024px (typical desktop size) */
    max-width: 50%;
  }

  table {
    margin-top: 25px;
  }

  th,
  td {
    border: 1px solid black;
    border-collapse: collapse; /* Ensures borders don't double up */
    padding: 4px 8px;
  }

  .no-border {
    border: none;
  }

  .type {
    margin-top: 5px;
    text-decoration: underline;
    text-align: center;
  }

  .payment-method {
    text-transform: none;
  }

  .total-words {
    text-transform: none;
  }

  .delivery-info {
    max-width: min-content;
    font-size: 12px;
    white-space: nowrap;
    padding: 1rem;
    border: 1px solid slategrey;
  }
}

@media print {
  .invoice {
    max-width: none;
    transform: none;
  }

  .no-print {
    display: none;
  }
}

.actions {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 2rem;
}
</style>
