<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card class="pa-4" :title="$t('add-payment')">
      <template v-slot:text>
        <v-number-input
          inset
          control-variant="stacked"
          v-model="form.amount"
          :max="remaining"
          :min="0"
          :suffix="`/${remaining}DA`"
        />
      </template>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false"> {{ $t('cancel') }} </v-btn>
        <v-btn
          :disabled="form.amount <= 0 || form.amount > remaining"
          :loading="isLoading"
          @click="emits('confirm', form)"
        >
          {{ $t('confirm') }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

import type { OrderData } from '@/composables/api/orders/useGetOrderApi'
import type { TablesInsert } from '@/types/database.types'

const emits = defineEmits(['confirm'])
const props = defineProps<{ isLoading: boolean }>()

const order = defineModel<OrderData>('order', { required: true })
const dialog = defineModel<boolean>('dialog')

const form = reactive<TablesInsert<'payments'>>({
  amount: 0,
  date: new Date().toISOString(),
  order_id: order.value?.id
})

const remaining = computed(() => (order.value?.total_price || 0) - (order.value?.paid_price || 0))
</script>
