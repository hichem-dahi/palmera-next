<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    v-if="client"
    :items="historyItems"
    :headers="headers"
    style="background-color: rgb(252, 252, 252)"
  >
    <template v-slot:top>
      <v-card class="pb-2 d-flex align-end" color="#EFEFF1" elevation="0">
        <div class="col-1 d-flex justify-space-between w-75">
          <v-card-title> 
            <div>{{ client?.name }}</div>
            <div class="text-medium-emphasis text-subtitle-2">
              {{ $t('phone') }}: {{ client?.phone }}
            </div>
          </v-card-title>
        </div>
      </v-card>
    </template>
    <template v-slot:item.date="{ item }">
      <div class="text-no-wrap">{{ format(item.date, 'yyyy-MM-dd') }}</div>
      <div class="text-no-wrap">{{ format(item.date, 'p') }}</div>
    </template>
    <template v-slot:item.details="{ item }">
      <div v-for="(detail, i) in item.details" :key="i">
        {{ detail }}
      </div>     
    </template>
    <template v-slot:item.order="{ item }">
      <v-btn v-if="item.orderId" 
        variant="text"
        size="small"
        color="light-blue"
        :icon="mdiOpenInNew" 
        :to="{ name: 'order', params: { order_id: item.orderId }}">
      </v-btn>
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { format } from 'date-fns';
import { sortBy } from 'lodash';

import { mdiOpenInNew } from '@mdi/js';

import products from '@/composables/localStore/useProductStore';
import companies from '@/composables/localStore/useCompanyStore';
import { individuals } from '@/composables/localStore/useIndividualsStore';
import orders from '@/composables/localStore/useOrdersStore';

import { ConsumerType } from '@/models/models';

const emits = defineEmits(['close'])
const route = useRoute()
const { t } = useI18n()

const client = computed(() => 
  companies.value.find(c => c.id == route.params.client_id) || 
  individuals.value.find(i => i.id == route.params.client_id))

const getProduct = (id: string) => products.value.find(e => e.id == id);

// Determine if the client is a Company or an Individual
const consumerType = computed(() => {
  return client.value && 'rc' in client.value
    ? ConsumerType.Company
    : ConsumerType.Individual;
});


const historyItems = computed(() => {
  const clientOrders =  orders.value.filter(o => 
    o.company == client.value?.id || o.individual?.id == client.value?.id) 
  const items = clientOrders.map(o =>  {
    const orderLinesInfo = o.order_lines.map(ol => {
        const info = { qte: ol.qte, product: getProduct(ol.product_id)?.name };
        return `${info.qte}m ${info.product}`;
      });

    const total =  o.total_price || 0
    const remaining =  total - o.paid_price

    return {
      date: o.date,
      index: `${t('N°')}${o.index}`,
      details: orderLinesInfo,
      total,
      remaining,
      orderId: o.id
    }
  })

  return sortBy(items, (t) => new Date(t.date)).reverse()
})

const headers = computed(() => [
  { 
    title: t('date'),
    align: 'start',
    sortable: false,
    key: 'date'
  },
  { title: t('order'), key: 'index' },
  { title: t('details'), key: 'details' },
  { title: `${t('total')} (DA)`, key: 'total' },
  { title: `${t('remaining')} (DA)`, key: 'remaining' },
  { title: ``, key: 'order' }
] as any)
</script>