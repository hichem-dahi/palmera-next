<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-card 
    class="pa-4" 
    hover 
    :to="{ name: 'product', params: { product_id: product?.id }}"> 
    <v-card-title v-text="product?.name" />
    <v-card-subtitle class="text-body-2">
      <div class="d-flex">
        <div class="font-weight-bold">{{ $t('qte') }}</div> 
        <div>&nbsp;{{ product?.qte}}</div>
      </div>
      <div class="d-flex">
        <div class="font-weight-bold">{{ $t('U.P') }}</div> 
        <div>&nbsp;{{ product?.price }} DA</div>
      </div>
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