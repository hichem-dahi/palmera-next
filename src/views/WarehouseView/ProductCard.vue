<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-card 
    class="pa-4" 
    hover 
    :to="{ name: 'product', params: { product_id: product?.id }}"> 
    <v-card-title v-text="product?.name" />
    <v-card-subtitle class="text-caption">
      <span class="font-weight-bold">{{ $t('code') }}:</span> 
      <span>&nbsp;{{ product?.code }}</span><br>
      <span class="font-weight-bold">{{ $t('quantity') }}:</span> 
      <span>&nbsp;{{ product?.qte }}</span><br>
      <span class="font-weight-bold">{{ $t('U.P') }}:</span> 
      <span>&nbsp;{{ product?.price }} DA</span>
    </v-card-subtitle>
  </v-card>
</template>
<script setup lang="ts">
import products from '@/composables/localStore/useProductStore';

import type { Product } from '@/models/models';

const product = defineModel<Product>()

function deleteProduct() {
  const index = products.value.indexOf(product.value!);
  products.value.splice(index, 1);
}
</script>