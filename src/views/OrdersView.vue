<template>
  <div class="d-flex align-start flex-wrap ga-8 pa-4">
    <v-btn
      class="my-5"
      variant="tonal"
      size="small"
      :append-icon="mdiPlus"
      :to="{ name: 'create-order' }"
    >
      {{ $t('add-order') }}
    </v-btn>
    <v-divider v-if="!$vuetify.display.mobile" vertical />
    <div class="filters d-flex align-center ga-4">
      <v-select
        variant="underlined"
        hide-details
        :items="docItems"
        v-model="docType"
        max-width="368"
        min-width="100"
        :label="$t('document-type')"
        clearable
      />
      <v-date-input
        variant="underlined"
        hide-details
        prepend-icon=""
        v-model="dateRange"
        :label="$t('date')"
        max-width="368"
        min-width="150"
        multiple="range"
      />
    </div>
  </div>
  <v-container>
    <div v-if="docType == DocumentType.Proforma">
      <v-row v-for="(_, i) in proformas" :key="i">
        <v-col sm="12" md="6">
          <ProformaCard v-model:proforma="proformas[i]" />
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row v-for="(_, i) in filteredOrders" :key="i">
        <v-col sm="12" md="6">
          <OrderCard v-model:order="filteredOrders[i]" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { isSameDay } from 'date-fns'
import { useI18n } from 'vue-i18n'
import { kebabCase } from 'lodash'

import { mdiPlus } from '@mdi/js'

import orders from '@/composables/localStore/useOrdersStore'
import proformas from '@/composables/localStore/useProformaStore'

import OrderCard from '@/views/OrdersView/OrderCard.vue'
import ProformaCard from './OrdersView/ProformaCard.vue'

import { DocumentType } from '@/models/models'

const { t } = useI18n()

const docType = ref<DocumentType | null>(null)
const dateRange = ref([])

const docItems = [
  { title: t(kebabCase(DocumentType[1])), value: DocumentType.Invoice },
  { title: t(kebabCase(DocumentType[2])), value: DocumentType.DeliveryNote },
  { title: t(kebabCase(DocumentType[3])), value: DocumentType.Voucher },
  { title: t(kebabCase(DocumentType[4])), value: DocumentType.Proforma }
]

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const docFilter = docType.value ? o.document_type === docType.value : true
    const dateFilter = dateRange.value.length
      ? dateRange.value.some((selectedDate) => isSameDay(o.date, selectedDate))
      : true
    return docFilter && dateFilter
  })
})
</script>
