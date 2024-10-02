<template>
  <v-card
    v-if="client"
    class="pa-4 pb-0 mx-auto"
    :prepend-icon="consumerType == ConsumerType.Company ? 'mdi-domain' : 'mdi-account'"
    :title="client?.name"
  >
  <v-card-subtitle style="line-height: 150%;">
    <div v-if="'address' in client">{{ $t('address') }}: {{ client?.address }}</div>
    <div>{{ $t('phone') }}: <a :href="`tel:${client?.phone}`">{{ client?.phone }}</a> </div>
  </v-card-subtitle>

  <v-card-actions class="ma-0 pa-0">
    <v-spacer></v-spacer>
    <v-btn
      :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      @click="show = !show"
    ></v-btn>
  </v-card-actions>

  <v-expand-transition>
      <div v-show="show">
        <v-card-subtitle inset class="pa-2">{{ $t('history') }}</v-card-subtitle>
        <v-divider inset/>
        <v-card-text>
          <div class="d-flex align-center" v-for="(item, i) in historyItems" :key="i">
            <router-link class="text-decoration-none text-primary" :to="{ name: 'order', params: { order_id: item.orderId }}">
              {{ item.title }} 
            </router-link>
            <div class="text-medium-emphasis"> &nbsp; &nbsp;{{ format(item.date, 'yyyy-MM-dd p')  }} &mdash; &nbsp;</div>
            <div class="text-medium-emphasis">{{ item.summary }} </div>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  <template v-slot:append>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn class="ml-auto" 
          v-bind="props" 
          variant="text"
          icon="mdi-dots-vertical" />
        </template>
      <v-list density="compact">
        <v-list-item density="compact" @click="deleteClient">
          <v-list-item-title>Supprimer</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> 
    <v-dialog v-model="dialog1" max-width="400">
      <AddHistory v-model:dialog="dialog1" v-model:person="client" />
    </v-dialog> 
  </template>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { format } from 'date-fns';
import { sortBy } from 'lodash';
import { useI18n } from 'vue-i18n';

import orders from '@/composables/localStore/useOrdersStore';
import products from '@/composables/localStore/useProductStore';

import { ConsumerType, type Company, type Individual } from '@/models/models';

const client = defineModel<Company | Individual>()

const { t } = useI18n()

const show = ref(false)
const dialog1 = ref(false)

const getProduct = (id: string) => products.value.find(e => e.id == id);

// Determine if the client is a Company or an Individual
const consumerType = computed(() => {
  return client.value && 'rc' in client.value
    ? ConsumerType.Company
    : ConsumerType.Individual;
});

const historyItems = computed(() => {
  const clientOrders =  orders.value.filter(o => 
    o.company == client.value?.id || o.individual?.id == client.value?.id
  ) 
  const items = clientOrders.map(o =>  {
    const orderLinesInfo = o.order_lines.map(ol => {
        const info = { qte: ol.qte, product: getProduct(ol.product_id)?.name };
        return `${info.qte}m ${info.product}`;
      });

    return {
      title: `${t('order')} ${t('N°')}${o.index}`,
      date: o.date,
      summary: orderLinesInfo.join(', '),
      orderId: o.id
    }
  })

  return sortBy(items, (t) => new Date(t.date)).reverse()
  }
)

function deleteClient() {}
</script>