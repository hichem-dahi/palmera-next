<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card class="pa-4" :title="$t('modify-stock')">
      <v-number-input
        :label="$t('quantity')"
        variant="outlined"
        inset
        control-variant="stacked"
        :error="!$v.qte.$pending && $v.qte.$error"
        v-model.number="form.qte"
        type="number"
      />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialog = false">{{ $t('cancel') }}</v-btn>
        <v-btn variant="text" color="primary" @click="saveStock">{{ $t('confirm') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

import { adjustStock } from '@/composables/useStockManage'

import type { Product } from '@/models/models'

const dialog = defineModel<boolean>()
const props = defineProps<{ product: Product }>()

const notZero = (value: any) => value !== null && value !== undefined && value !== 0

const form = reactive({
  qte: null
})

const rules = {
  qte: { required, notZero }
}

const $v = useVuelidate(rules, form)

function saveStock() {
  $v.value.$touch()
  if (!$v.value.$invalid && form.qte) {
    adjustStock(props.product.id, form.qte)
    dialog.value = false
  }
}
</script>
