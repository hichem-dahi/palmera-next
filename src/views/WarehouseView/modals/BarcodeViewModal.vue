<template>
  <v-dialog max-width="360" v-model="dialog">
    <v-card class="pa-4">
      <!-- Show only one barcode in the dialog -->
      <div id="barcode-container" class="barcode-container text-center pa-4">
        <div class="product-title">{{ props.product.name }}</div>
        <svg ref="barcodeRef"></svg>
      </div>
      <v-btn @click="printBarcode">{{ $t('print') }}</v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import JsBarcode from 'jsbarcode'
import printJS from 'print-js'

import type { Product } from '@/models/models'

const dialog = defineModel<boolean>('dialog')
const model = defineModel<string | null>('barcode')

const props = defineProps<{ product: Product }>()

const barcodeRef = ref()

const printBarcode = () => {
  printJS({
    printable: 'barcode-container',
    type: 'html',
    style: `
      /* Styling for printing */
      .barcode-container {
        display: block;
        text-align: center;
        margin-bottom: 20px;
        page-break-after: always; /* Ensures each barcode is on a separate page */
      }
      svg {
        display: block;
        margin: 0 auto;
        width: 200px;
        height: auto;
        image-rendering: crisp-edges;
      }
    `,
    scanStyles: false
  })
}

watchEffect(() => {
  if (barcodeRef.value) {
    if (typeof model.value === 'string' && model.value.trim() !== '') {
      JsBarcode(barcodeRef.value, model.value, {
        text: `${props.product.price} DA`,
        width: 3
      })
    } else {
      barcodeRef.value.innerHTML = ''
    }
  }
})
</script>

<style scoped>
.barcode-video {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: contain; /* Ensure the video scales properly */
}
</style>
