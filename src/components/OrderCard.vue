<template>
  <v-card v-if="order" class="pa-4" variant="outlined">
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
        <div class="font-weight-bold">Remaining:</div> 
        <div class="text-red">&nbsp;{{ order.total_price - order.paid_price }} DA</div>
      </div>
    </v-card-subtitle>
    <v-card-actions class="justify-end">
      <v-btn @click="showTable = true" color="blue">Show</v-btn>
      <v-dialog v-model="showTable" width="800">
        <DataTable v-model:order="order" @close="showTable = false" />
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { format } from 'date-fns';

import clients from '@/composables/localStore/useClientsStore';

import DataTable from '@/components/DataTable.vue'

import type { Order } from '@/models/models';

const order = defineModel<Order>('order')

const showTable = ref(false)
const client = computed(() => clients.value.find(e => e.id === order.value?.client_id))
</script>