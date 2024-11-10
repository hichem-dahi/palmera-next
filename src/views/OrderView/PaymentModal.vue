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
        <v-btn
          :disabled="amount <= 0 || amount > remaining"
          :loading="insertPaymentApi.isLoading.value"
          @click="addPayment"
          >Confirm</v-btn
        >
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useInsertPaymentsApi } from '@/composables/api/payments/useInsertPaymentApi'

import type { Order } from '@/models/models'
import type { TablesInsert } from '@/types/database.types'

const order = defineModel<Order>('order')
const dialog = defineModel<boolean>('dialog')

const insertPaymentApi = useInsertPaymentsApi()

const amount = ref<number>(0)
const remaining = computed(() => (order.value?.total_price || 0) - (order.value?.paid_price || 0))

function addPayment() {
  if (order.value && amount.value > 0 && amount.value <= remaining.value) {
    const payment: TablesInsert<'payments'> = {
      date: new Date().toISOString(),
      order_id: order.value.id,
      amount: amount.value
    }
    insertPaymentApi.form.value = payment
    insertPaymentApi.execute()
    //order.value.paid_price = (order.value.paid_price || 0) + amount.value
    amount.value = 0
    dialog.value = false
  }
}

watch(
  () => insertPaymentApi.isSuccess.value,
  (isSuccess) => {
    if (isSuccess) {
      dialog.value = false
    }
  }
)
</script>
