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
    <FilterBar v-model="filters" />
  </div>
  <v-container>
    <div v-if="filters.docType == DocumentType.Proforma">
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
import { computed, reactive } from 'vue'
import { isSameDay } from 'date-fns'
import { mdiPlus } from '@mdi/js'

import orders from '@/composables/localStore/useOrdersStore'
import proformas from '@/composables/localStore/useProformaStore'

import OrderCard from '@/views/OrdersView/OrderCard.vue'
import ProformaCard from './OrdersView/ProformaCard.vue'
import FilterBar from './OrdersView/FilterBar.vue'

import { DocumentType } from '@/models/models'
import type { Filters } from './OrdersView/models/models'

const filters = reactive<Filters>({
  docType: null,
  dateRange: []
})

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const docFilter = filters.docType ? o.document_type === filters.docType : true
    const dateFilter = filters.dateRange.length
      ? filters.dateRange.some((selectedDate) => isSameDay(o.date, selectedDate))
      : true

    return docFilter && dateFilter
  })
})
</script>
