<template>
  <div class="filters d-flex align-end ga-6">
    <v-text-field
      variant="underlined"
      hide-details
      v-model="model.name"
      max-width="368"
      min-width="100"
      :label="$t('name')"
      clearable
    />
    <v-btn variant="text" :append-icon="mdiBarcodeScan" @click="showScanner = true">{{
      $t('scan')
    }}</v-btn>
    <BarcodeScannerModal v-model:barcode="model.barcode" v-model:dialog="showScanner" />
    <v-chip v-if="model.barcode" :value="!!model.barcode" closable @click:close="clearBarcode">
      {{ model.barcode }}
    </v-chip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mdiBarcodeScan } from '@mdi/js'

import BarcodeScannerModal from './modals/BarcodeScannerModal.vue'

const model = defineModel<{ name: string | null; barcode: number | null }>({ required: true })
const showScanner = ref(false)

const clearBarcode = () => {
  model.value.barcode = null
}
</script>
