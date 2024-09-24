<template>
  <v-btn 
    class="my-5" 
    size="small" 
    color="grey" 
    variant="text" 
    prepend-icon="mdi-chevron-left" 
    @click="$router.go(-1)" 
    text="back" />
  <div class="product-wrapper">
    <div class="product-table border">
      <ProductTable />
    </div>
  </div>
</template>
<script setup lang="ts">
import ProductTable from './ProductView/ProductTable.vue'
</script>

<style>
.product-wrapper {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.product-table {
  width: 70%;
}
</style>
