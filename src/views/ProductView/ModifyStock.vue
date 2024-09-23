<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card class="pa-4" title="Modify stock">
      <v-number-input 
        label="Quantity" 
        variant="outlined"
        inset
        control-variant="stacked" 
        :error="!$v.qte.$pending && $v.qte.$error"
        :error-messages="$v.$errors.map(e => e.$message)"
        v-model="form.qte"
        type="number" 
      />

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialog = false">cancel</v-btn>
        <v-btn variant="text" color="primary" @click="saveStock">save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import { adjustStock } from '@/composables/useStockManage';

import type { Product } from '@/models/models';

const dialog = defineModel<boolean>()
const props = defineProps<{product: Product}>()

const notZero = (value: any) => value !== null && value !== undefined && value !== 0;

const form = reactive({
  qte: null
})

const rules = {
  qte: { required, notZero },
}

const $v = useVuelidate(rules, form);

function saveStock() {
 $v.value.$touch()
 if (!$v.value.$invalid) {
  adjustStock(props.product.id, form.qte!)
  dialog.value = false
 }
}
</script>