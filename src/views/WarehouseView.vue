<template>
  <v-btn class="my-5" :append-icon="mdiPlus" @click="dialog = true">{{ $t('add-product') }}</v-btn>
  <v-dialog v-model="dialog" max-width="400px">
    <CreateProduct v-model="dialog" />
  </v-dialog>
  <v-row justify="start">
    <v-col v-for="(_, i) in products" :key="i" sm="12" md="4">
      <ProductCard v-model="products[i]" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiPlus } from '@mdi/js';

import CreateProduct from '@/views/WarehouseView/CreateProduct.vue';
import ProductCard from '@/views/WarehouseView/ProductCard.vue';

import products from '@/composables/localStore/useProductStore';

const dialog = ref(false)
</script>