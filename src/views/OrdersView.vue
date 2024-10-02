<template>
  <v-btn 
    class="mb-5" 
    append-icon="mdi-plus"
    :to="{ name: 'create-order' }"
  >
    {{ $t('add-order') }}
  </v-btn>
  <v-container>
    <v-row v-for="(_, i) in orders" :key="i">
      <v-col cols="6">
        <OrderCard v-model:order="orders[i]"/> 
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import orders from '@/composables/localStore/useOrdersStore';
import OrderCard from '@/views/OrdersView/OrderCard.vue';
</script>