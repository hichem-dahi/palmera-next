<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card class="pa-4" :title="$t('add-payment')">
      <template v-slot:text>
        <v-number-input
          inset
          control-variant="stacked"
          v-model="amount"
          :max="remaining"
          :min="0"
          :suffix="`/${remaining}DA`"
        />
      </template>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-btn :disabled="amount <= 0 || amount > remaining" @click="addPayment">Confirm</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import payments from '@/composables/localStore/usePaymentsStore'

import type { Order } from '@/models/models'

const order = defineModel<Order>('order')
const dialog = defineModel<boolean>('dialog')

const amount = ref<number>(0)
const remaining = computed(() => (order.value?.total_price || 0) - (order.value?.paid_price || 0))

function addPayment() {
  if (order.value && amount.value > 0 && amount.value <= remaining.value) {
    const payment = {
      id: uuidv4(),
      date: new Date(),
      amount: amount.value
    }
    payments.value.unshift(payment)
    order.value.payments_ids.push(payment.id)
    order.value.paid_price = (order.value.paid_price || 0) + amount.value
    amount.value = 0
    dialog.value = false
  }
}
</script>
