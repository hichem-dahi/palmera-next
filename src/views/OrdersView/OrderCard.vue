<template>
  <v-card
    v-if="order"
    color="grey-lighten-5"
    class="pa-4"
    hover
    variant="elevated"
    :to="{ name: 'order', params: { order_id: order.id } }"
  >
    <v-card-title>{{ $t('order') }} {{ $t('N°') }} {{ order.index }}</v-card-title>
    <v-card-text class="order-info py-0">
      <div>
        <span class="font-weight-bold">{{ $t('client') }}:</span>
        <span>&nbsp;{{ consumerName }}</span>
      </div>
      <div>
        <span class="font-weight-bold">{{ $t('date') }}:</span>
        <span>&nbsp;{{ format(order.date, 'yyyy-MM-dd') }}</span>
      </div>
      <div>
        <span class="font-weight-bold">{{ $t('total') }}:</span>
        <span>&nbsp;{{ order.total_price }} {{ $t('DA') }}</span>
      </div>
      <div>
        <span class="font-weight-bold">{{ $t('remaining') }}:</span>
        <span class="text-red"
          >&nbsp;{{ order.total_price - order.paid_price }} {{ $t('DA') }}</span
        >
      </div>
    </v-card-text>
    <v-card-actions class="py-0">
      <v-spacer></v-spacer>
      <v-btn variant="text" size="x-small">
        {{ docTitle }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'

import companies from '@/composables/localStore/useCompanyStore'

import { DocumentType, type Order } from '@/models/models'
import { kebabCase } from 'lodash'

const { t } = useI18n()
const order = defineModel<Order>('order', { required: true })

const docTitle = computed(
  () =>
    `${t(kebabCase(DocumentType[order.value.document_type]))} ${t('N°')} ${order.value.docIndex}`
)
const consumerName = computed(
  () =>
    companies.value.find((e) => e.id === order.value?.company)?.name ||
    order.value?.individual?.name
)
</script>

<style>
.order-info {
  font-size: 0.8rem;
}
</style>
