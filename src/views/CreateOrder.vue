<template>
  <div class="w-50 mx-auto">
    <div class="pa-4 text-h5">{{  $t('add-order')}}</div>
    <CreateOrderStepper @success="$router.go(-1)" />
  </div>
</template>

<script setup lang="ts">
import CreateOrderStepper from './OrdersView/CreateOrderStepper.vue';
</script>