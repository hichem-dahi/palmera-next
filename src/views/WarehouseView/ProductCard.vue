<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-card 
    class="pa-4" 
    hover 
    :to="{ name: 'product', params: { product_id: product?.id }}"> 
    <v-card-title v-text="product?.name" />
    <v-card-subtitle class="text-body-2">
      <div class="d-flex">
        <div class="font-weight-bold">Qte:</div> 
        <div>&nbsp;{{ product?.qte}}</div>
      </div>
      <div class="d-flex">
        <div class="font-weight-bold">P.U:</div> 
        <div>&nbsp;{{ product?.price }} DA</div>
      </div>
    </v-card-subtitle>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
          <div class="d-flex align-center" v-for="(instance, i) in product.history" :key="i">
            <div class="text-medium-emphasis">{{ instance.date }}</div>
            <div class="d-flex align-center ml-3">            
              x{{ instance.value }}, 
              <div class="ml-2" :class="{'text-green': instance.diff > 0, 'text-red': instance.diff < 0}">
                {{ instance.diff > 0  ? `+${instance.diff}` : instance.diff }}
              </div>
            </div>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { format } from 'date-fns'

import products from '@/composables/localStore/useProductStore';
import type { Product } from '@/models/models';

const product = defineModel<Product>()
const show = ref(false)

function deleteProduct() {
  const index = products.value.indexOf(product.value);
  products.value.splice(index, 1);
}

watch(() => product.value?.qte, async (newQte, oldQte) => {
  const transaction = {
    value: newQte,
    diff: newQte - oldQte,
    date: format(new Date(), 'yyyy-MM-dd, hh:mm'),
  };
  product.value?.history.push(transaction)
},
{ flush: 'sync' }
);
</script>