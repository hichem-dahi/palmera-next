<template>
  <v-card 
    v-if="order" 
    color="grey-lighten-5" 
    class="pa-4" 
    hover
    variant="elevated" 
    :to="{ name: 'order', params: {order_id: order.id}}" >
    <v-card-title>{{ $t('order') }} {{ $t('N°') }} {{ order.index }}</v-card-title>

    <v-card-subtitle class="order-info">
      <div class="d-flex">
        <div class="font-weight-bold">{{ $t('client') }}:</div> 
        <div>&nbsp;{{ consumerName }}</div>
      </div>
      <div class="d-flex">
        <div class="font-weight-bold">{{ $t('date') }}:</div> 
        <div>&nbsp;{{ format(order.date, 'yyyy-MM-dd' ) }}</div>
      </div>
      <div class="d-flex">
        <div class="font-weight-bold">{{ $t('total') }}:</div> 
        <div>&nbsp;{{ order.total_price }}DA</div>
      </div>
      <div class="d-flex">
        <div class="font-weight-bold"> {{$t('remaining')}}:</div> 
        <div class="text-red">&nbsp;{{ order.total_price - order.paid_price }}DA</div>
      </div>
    </v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';

import companies from '@/composables/localStore/useCompanyStore';

import { type Order } from '@/models/models';

const order = defineModel<Order>('order')

const consumerName = computed(() => 
  companies.value.find(e => e.id === order.value?.company)?.name || 
  order.value?.individual?.name)
</script>

<style>
.order-info {
  font-size: 0.8rem;
}</style>