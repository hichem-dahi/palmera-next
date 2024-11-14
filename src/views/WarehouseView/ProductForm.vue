<template>
  <v-card class="pa-4">
    <v-text-field
      :label="$t('code')"
      v-model="model.code"
      :error-messages="!$v.code.$pending && $v.code.$error ? $t('Code is required') : ''"
      @blur="$v.code.$touch()"
    />
    <v-text-field
      :label="$t('name')"
      v-model="model.name"
      :error-messages="!$v.name.$pending && $v.name.$error ? $t('Name is required') : ''"
      @blur="$v.name.$touch()"
    />
    <v-text-field
      :label="$t('quantity')"
      v-model="model.qte"
      type="number"
      :error-messages="
        !$v.qte.$pending && $v.qte.$error ? $t('Qunatity must be greater than zero') : ''
      "
      @blur="$v.qte.$touch()"
    />

    <v-text-field
      :label="$t('price')"
      v-model="model.price"
      type="number"
      :error-messages="
        !$v.price.$pending && $v.price.$error ? $t('Price must be greater than zero') : ''
      "
      @blur="$v.price.$touch()"
    />
    <v-text-field
      :label="$t('cost-price')"
      v-model="model.cost_price"
      type="number"
      :error-messages="
        !$v.price.$pending && $v.cost_price.$error ? $t('Price must be greater than zero') : ''
      "
      @blur="$v.cost_price.$touch()"
    />
    <slot name="actions" :form="model"></slot>
  </v-card>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minValue, numeric } from '@vuelidate/validators'

import self from '@/composables/localStore/useSelf'

const model = defineModel({
  default: {
    code: '',
    name: '',
    organization_id: self.value.user?.organization_id || '',
    qte: 0,
    price: 0,
    cost_price: null as number | null
  }
})

const rules = {
  code: { required },
  name: { required },
  organization_id: { required },
  qte: { required, numeric, minValue: minValue(1) },
  price: { required, numeric, minValue: minValue(1) },
  cost_price: { numeric, minValue: minValue(1) }
}

const $v = useVuelidate(
  rules,
  toRef(() => model.value)
)
</script>
