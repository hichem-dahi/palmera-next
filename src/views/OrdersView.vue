<template>
  <v-btn class="my-5" :append-icon="mdiPlus" :to="{ name: 'create-order' }">
    {{ $t('add-order') }}
  </v-btn>
  <v-container>
    <v-row v-for="(_, i) in orders" :key="i">
      <v-col sm="12" md="6">
        <OrderCard v-model:order="orders[i]"/> 
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { mdiPlus } from '@mdi/js';

import orders from '@/composables/localStore/useOrdersStore';
import OrderCard from '@/views/OrdersView/OrderCard.vue';
</script>