<template>
  <div class="w-100 mx-auto">
    <v-row justify="center">
      <v-col sm="12" md="6">
        <div class="pa-4 text-h5">{{ $t('add-order') }}</div>
        <CreateOrderStepper @success="$router.go(-1)" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import CreateOrderStepper from './CreateOrderStepper.vue'
</script>
