<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    v-if="product"
    :items="items"
    :headers="headers"
    style="background-color: rgb(252, 252, 252)"
  >
    <template v-slot:top>
      <v-card class="pb-2 d-flex align-end" color="#EFEFF1" elevation="0">
        <div class="col-1 d-flex justify-space-between w-75">
          <v-card-title> 
            <div>{{ product?.name }}</div>
            <div class="text-medium-emphasis text-subtitle-2">
              Quantity: {{ product?.qte }}
            </div>
            <div class="text-medium-emphasis text-subtitle-2">
              P.U: {{ product?.price }} DA
            </div>
          </v-card-title>
        </div>
        <div class="col-2">
          <v-btn variant="text" color="primary" size="small" @click="modifyStockDialog = true">Modify stock</v-btn>
          <ModifyStock v-model="modifyStockDialog" :product="product" />
        </div>
      </v-card>
    </template>
    <template v-slot:item.order="{ item }">
      <router-link v-if="item.order" :to="{ name: 'order', params: { order_id: item.order }}">
        Link
      </router-link>
    </template>
    <template v-slot:item.date="{ item }">
      <span>{{ format(item.date, 'yyyy-MM-dd p') }}</span>
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import { ref, readonly, computed } from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'date-fns';

import products from '@/composables/localStore/useProductStore';
import stock from '@/composables/localStore/useStockStore';

import ModifyStock from './ModifyStock.vue';

const emits = defineEmits(['close'])
const route = useRoute()

const modifyStockDialog = ref(false)

const product = computed(() => products.value.find(p => p.id == route.params.product_id))
const stockMovements = computed(() => stock.value.filter(s => s.product_id == product.value?.id) )

const items = computed(() => stockMovements.value?.map((s, i) => {
  return { 
    id: s.id,
    index: i,
    date: s.date,
    qte: s.qte_change,
    unity_price: product.value?.price,
    order: s.order_id
   }
}).reverse())

const headers = readonly(ref([
  { 
    title: 'Date',
    align: 'start',
    sortable: false,
    key: 'date'
  },
  { title: 'Quantity change', key: 'qte', align: 'start' },
  { title: 'P.U (DA)', key: 'unity_price' },
  { title: 'Order', key: 'order' },
]) as any)
</script>