<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card class="pa-4" title="Add payment method">
      <template v-slot:text>
        <v-text-field 
          label="payment method"
          v-model="paymentMethod" 
        />
      </template> 
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false">cancel</v-btn>
        <v-btn @click="addPaymentMethod">Confirm</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Order } from '@/models/models';

const order = defineModel<Order>('order')
const dialog = defineModel<boolean>('dialog')
const emits = defineEmits(['go-invoice'])

const paymentMethod = ref(order.value?.payment_method || '')

function addPaymentMethod() {
  if (order.value?.paid_price) {
    order.value.payment_method = paymentMethod.value
    emits('go-invoice')
    dialog.value = false
  }
}
</script>