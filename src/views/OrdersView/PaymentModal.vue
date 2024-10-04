<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card class="pa-4" :title="$t('add-payment')">
      <template v-slot:text>
        <v-number-input 
          inset
          control-variant="stacked"
          v-model="payment" 
          :max="remaining" 
          :min="0" 
          :suffix="`/${remaining}DA`"
        />
      </template> 
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-btn :disabled="payment <= 0 || payment > remaining" @click="addPayment">Confirm</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Order } from '@/models/models';

// Define reactive models
const order = defineModel<Order>('order');
const dialog = defineModel<boolean>('dialog');

// Payment field and computed remaining amount
const payment = ref<number>(0);
const remaining = computed(() => (order.value?.total_price || 0) - (order.value?.paid_price || 0));

// Function to handle payment addition
function addPayment() {
  if (order.value && payment.value > 0 && payment.value <= remaining.value) {
    order.value.paid_price = (order.value.paid_price || 0) + payment.value;
    dialog.value = false;
    payment.value = 0; // Reset payment after adding
  }
}
</script>