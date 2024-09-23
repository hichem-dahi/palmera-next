<template>
  <v-card 
    v-if="order" 
    color="grey-lighten-5" 
    class="pa-4" 
    hover
    variant="elevated" 
    :to="{name: 'order', params: {order_id: order.id}}">
    <v-card-title>Commande N°{{ 1 }}</v-card-title>

    <v-card-subtitle class="text-body-2">
      <div class="d-flex">
        <div class="font-weight-bold">Client:</div> 
        <div>&nbsp;{{ client?.name }}</div>
      </div>
      <div class="d-flex">
        <div class="font-weight-bold">Date:</div> 
        <div>&nbsp;{{ format(order.date, 'yyyy-MM-dd' ) }}</div>
      </div>
      <div class="d-flex">
        <div class="font-weight-bold">Total:</div> 
        <div>&nbsp;{{ order.total_price }}DA</div>
      </div>
      <div class="d-flex">
        <div class="font-weight-bold">Remaining:</div> 
        <div class="text-red">&nbsp;{{ order.total_price - order.paid_price }}DA</div>
      </div>
    </v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';

import clients from '@/composables/localStore/useClientsStore';

import { type Order } from '@/models/models';
const order = defineModel<Order>('order')
const client = computed(() => clients.value.find(e => e.id === order.value?.client_id))
</script>