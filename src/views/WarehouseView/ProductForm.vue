<template>
  <v-card class="pa-4">
    <v-text-field
      :label="$t('code')"
      v-model="proxyForm.code"
      :error-messages="!$v.code.$pending && $v.code.$error ? $t('Code is required') : ''"
      @blur="$v.code.$touch()"
    />
    <v-text-field
      :label="$t('name')"
      v-model="proxyForm.name"
      :error-messages="!$v.name.$pending && $v.name.$error ? $t('Name is required') : ''"
      @blur="$v.name.$touch()"
    />
    <v-text-field
      :label="$t('quantity')"
      v-model="proxyForm.qte"
      type="number"
      :error-messages="
        !$v.qte.$pending && $v.qte.$error ? $t('Qunatity must be greater than zero') : ''
      "
      @blur="$v.qte.$touch()"
    />

    <v-text-field
      :label="$t('price')"
      v-model="proxyForm.price"
      type="number"
      :error-messages="
        !$v.price.$pending && $v.price.$error ? $t('Price must be greater than zero') : ''
      "
      @blur="$v.price.$touch()"
    />
    <slot name="actions" :form="proxyForm" :v="$v"></slot>
  </v-card>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from 'lodash'
import useVuelidate from '@vuelidate/core'
import { required, minValue, numeric } from '@vuelidate/validators'

import type { Product } from '@/models/models'

const props = defineProps<{ form?: Product }>()

const proxyForm = ref<Product>({
  id: uuidv4(),
  code: '',
  name: '',
  qte: null,
  price: null
})

if (props.form) proxyForm.value = cloneDeep(props.form)

const rules = {
  id: { required },
  code: { required },
  name: { required },
  qte: { required, numeric, minValue: minValue(1) },
  price: { required, numeric, minValue: minValue(1) }
}

const $v = useVuelidate(
  rules,
  toRef(() => proxyForm.value)
)
</script>
