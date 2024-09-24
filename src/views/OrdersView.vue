<template>
  <v-btn class="mb-5" append-icon="mdi-plus" @click="dialog = true">{{ $t('add-order') }}</v-btn>
  <v-dialog v-model="dialog" max-width="600px">
    <CreateOrder v-model="dialog" />
  </v-dialog>
  <v-container>
    <v-row v-for="(_, i) in orders" :key="i">
      <v-col cols="6">
        <OrderCard v-model:order="orders[i]"/> 
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import orders from '@/composables/localStore/useOrdersStore';

import CreateOrder from '@/views/OrdersView/CreateOrder.vue';
import OrderCard from '@/views/OrdersView/OrderCard.vue';

const dialog = ref(false)
</script>