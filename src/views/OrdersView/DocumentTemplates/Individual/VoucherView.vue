<template>
  <div class="voucher-wrapper" v-if="order">
    <div class="voucher" v-for="i in 3" :key="i">
      <div class="d-flex align-center">
        <div style="width: 33%">
          <h3>{{ self.company?.name }}</h3>
          <div>{{ self.company?.activity }}</div>
          <div>{{ self.company?.phone }}</div>
        </div>
        <h3 class="type">
          {{ title }} N°: {{ padStart(order.docIndex?.toString(), 4, '0') }}/2024
        </h3>
      </div>
      <div class="d-flex align-start justify-space-between mt-5">
        <div>
          <div v-for="(value, key) in individualInfo" :key="key">
            <span v-if="value">{{ key }}: {{ value }}</span>
          </div>
        </div>
        <div class="delivery-info" v-if="($route.query.type as any) == DocumentType.DeliveryNote">
          <div v-for="(value, key) in deliveryInfo" :key="key">
            <span>
              <b>{{ key }}:</b> {{ value }}
            </span>
          </div>
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
      <div class="total-words">{{ totalWords }}</div>
      <v-divider :class="{ 'mb-5': i !== 3 }" />
    </div>
    <div class="actions no-print">
      <v-btn class="mr-5" @click="print()">print</v-btn>
      <v-btn @click="downloadInvoice()">download</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { pick, padStart } from 'lodash'
import html2pdf from 'html2pdf.js'
import n2words from 'n2words'
import { format } from 'date-fns'

import orders from '@/composables/localStore/useOrdersStore'
import products from '@/composables/localStore/useProductStore'
import self from '@/composables/localStore/useSelf'

import { DocumentType } from '@/models/models'

const route = useRoute()

const title = computed(() => (order.value?.delivery ? 'Bon de livraison' : 'Bon'))
const order = computed(() => orders.value.find((o) => o.id == route.params.order_id))

const totalWords = computed(() => {
  let number = totalItems.value.total || 0
  let integerPart = Math.floor(number)
  let decimalPart = number % 1

  let words = n2words(integerPart, { lang: 'fr' })
  if (decimalPart !== 0) {
    words += ' virgule ' + n2words(Math.floor(decimalPart * 10), { lang: 'fr' })
  }
  return `${words} dinars alg`
})

const individualInfo = computed(() => {
  const individualInfoKeys = ['date', 'name', 'N°tel']
  let individual = {
    date: format(order.value?.date || '', 'dd-MM-yyyy'),
    name: order.value?.individual?.name,
    'N°tel': order.value?.individual?.phone
  }
  return pick(individual, individualInfoKeys)
})

const deliveryInfo = computed(() => {
  const deliveryInfoKeys = ['chauffeur', 'phone', 'matricule', 'destination']
  let delivery = { ...order.value?.delivery, chauffeur: order.value?.delivery?.driver_name }
  return pick(delivery, deliveryInfoKeys)
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
  return {
    total: order.value?.total_price
  }
})

const getProduct = (id: string) => products.value.find((e) => e.id == id)

function print() {
  window.print()
}

function downloadInvoice() {
  const invoiceElement = document.querySelector('.voucher') // Select the invoice element
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
    filename: 'voucher.pdf',
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
.voucher {
  text-transform: capitalize;
  white-space: nowrap;
  margin: auto;
  transform-origin: top; /* Ensure scaling happens from the top */
  max-height: calc(100% / 3);

  @media (min-width: 1024px) {
    /* Target screens larger than 1024px (typical desktop size) */
    max-width: 50%;
  }

  table {
    margin-top: 8px;
  }

  th,
  td {
    border: 1px solid black;
    border-collapse: collapse; /* Ensures borders don't double up */
    padding: 2px 4px;
  }

  .no-border {
    border: none;
  }

  .type {
    text-decoration: underline;
    text-align: center;
  }

  .total-words {
    text-transform: none;
    padding: 1rem;
    text-align: end;
  }

  .delivery-info {
    max-width: min-content;
    font-size: 0.6rem;
    white-space: nowrap;
    padding: 0.5rem 1rem;
  }
}

@media print {
  .voucher-wrapper {
    max-height: 100vh; /* Ensure the vouchers fit on one page */
  }

  .voucher {
    font-size: small;
    max-width: none;
    margin: 0;
    page-break-inside: avoid; /* Prevent breaking inside voucher */
    max-height: calc(100vh / 3);
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
