<template>
  <div class="invoice-wrapper">
    <div ref="invoice" class="invoice">
      <div class="row-1">
        <h3>Sarl palmera star</h3>
        <div>PRODUCTION MATERIAUX DE CONSTRUCTION</div>
        <div>Adresse: ZONE industrielle SBA</div>
        <div>R.C: 17b002428956</div>
        <div>NIF: 001722002428956</div>
        <div>NIS: 001722010000279</div>
        <div>N.ART: 22870119091</div>
        <div>N O TEL: 0560313249</div>
        <h3 class="type">{{ title }} N°: 0011/2024</h3>
        <div v-for="(value, key) in client" :key="key">
          {{ key }}: {{ value }}
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
              <td><strong>{{ key }}</strong></td>
              <td><strong>{{ value }}</strong></td> <!-- Replace with actual total -->
            </tr>
          </tfoot>
        </table>
        <div class="payment-method mt-5">
          Mode de payment: {{ order?.payment_method }}</div>
        <div class="preforma">
          Arréter la préforma a la somme de: <b>{{ preforma }}</b>
        </div>
      </div>
      <div class="delivery-info row-2 pa-4 border" v-if="($route.query.type as any) == InvoiceType.DeliveryNote">
        <div class="d-flex align-center" v-for="(value, key) in deliveryInfo" :key="key">
          <div class="font-weight-bold">{{key}}:</div> 
          <div>&nbsp;{{ value }}</div>
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
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { pick, round } from 'lodash';
import html2pdf from 'html2pdf.js';
import n2words from 'n2words'

import orders from '@/composables/localStore/useOrdersStore';
import clients from '@/composables/localStore/useClientsStore';
import products from '@/composables/localStore/useProductStore';
import deliveries from '@/composables/localStore/useDeliveryStore';

import { InvoiceType } from '@/models/models';

const route = useRoute()

const invoice = ref()

const title = computed(() =>  route.query.type as any == InvoiceType.Receipt ? 'facture' : 'bon de livraison')
const order = computed(() => orders.value.find(o => o.id == route.params.order_id))
const preforma = computed(() => {
  let number = totalItems.value['T.T.C'];
  let integerPart = Math.floor(number);
  let decimalPart = number % 1;

  let words = n2words(integerPart, { lang: 'fr' });
  if (decimalPart !== 0) {
      words += ' virgule ' + n2words(Math.floor(decimalPart * 10), { lang: 'fr' });
  }
  return words
})

const deliveryInfo = computed(() => {
  const deliveryInfoKeys = ['driver_name', 'phone', 'matricule', 'destination']
  return pick(deliveries.value.find(d => d.id == order.value?.delivery), deliveryInfoKeys)
})

const client = computed(() => {
  let client = {...clients.value.find(c => c.id === order.value?.client_id)}
  client = {...client, client: client.name} as any
  const desiredOrder = ['client', 'rc', 'nif', 'art', 'address', 'activity'];
  return pick(client, desiredOrder)
})

const items = computed(() => order.value?.order_lines.map((o, i) => {
  const product = getProduct(o.product_id)
  return { 
    index: i,
    product_name: product?.name,
    qte: o.qte,
    unity_price: product?.price,
    total_price: o.total_price
   }
}))

const totalItems = computed(() => {
  return {
    total: order.value?.total_price,
    'T.V.A 19%': round((order.value?.total_price! * 81) / 100, 0),
    'T.T.C': round((order.value?.total_price!  * 81) / 100, 0) 
  }
})

const getProduct = (id: string) => products.value.find(e => e.id == id)

function print() {
  window.print()
}

function downloadInvoice() {
  const invoiceElement = document.querySelector('.invoice'); // Select the invoice element
  if(!invoiceElement) return 

  const opt = {
    margin: 10, 
    filename: 'invoice.pdf', 
    image: { type: 'jpeg', quality: 0.98 }, 
    html2canvas: { scale: 2 }, 
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(invoiceElement).set(opt).save()
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
  max-width: 50%;
  transform: scale(0.7); /* Use transform for scaling */
  transform-origin: top; /* Ensure scaling happens from the top */

  table {
    margin-top: 25px;
  }

  th, td {
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
  .preforma {
    text-transform: none;
  }

  .delivery-info {
    max-width: min-content;
    font-size: 12px;
    white-space: nowrap;
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