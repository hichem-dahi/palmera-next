<template>
  <v-btn 
    class="mt-3" 
    size="small" 
    color="grey" 
    variant="text" 
    prepend-icon="mdi-chevron-left" 
    @click="$router.go(-1)" 
    :text="$t('back')" />
  <div class="text-h5 pa-4 my-4">Fiche de Stock: {{ product?.name }}</div>
  <div class="product-wrapper">
    <div class="product-table border">
      <ProductTable />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import products from '@/composables/localStore/useProductStore';

import ProductTable from './ProductView/ProductTable.vue'

const route = useRoute()

const product = computed(() => products.value.find(p => p.id == route.params.product_id))

</script>

<style>
.product-wrapper {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.product-table {
  min-width: 70%;
}
</style>
