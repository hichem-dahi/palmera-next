<template>
  <v-sheet class="pa-4">
    <v-text-field
      :label="$t('code')"
      v-model="form.code"
      :error-messages="!$v.code.$pending && $v.code.$error ? $t('Code is required') : ''"
      @blur="$v.code.$touch()"
    />
    <v-text-field
      :label="$t('name')"
      v-model="form.name"
      :error-messages="!$v.name.$pending && $v.name.$error ? $t('Name is required') : ''"
      @blur="$v.name.$touch()"
    />
    <v-text-field
      :label="$t('quantity')"
      v-model="form.qte"
      type="number"
      :error-messages="!$v.qte.$pending && $v.qte.$error ? $t('Qunatity must be greater than zero'): ''"
      @blur="$v.qte.$touch()"
    />

    <v-text-field
      :label="$t('price')"
      v-model="form.price"
      type="number"
      :error-messages="!$v.price.$pending && $v.price.$error ? $t('Price must be greater than zero') : ''"
      @blur="$v.price.$touch()"
    />

    <v-btn block @click="submitForm">{{ $t('add') }}</v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import useVuelidate from '@vuelidate/core';
import { required, minValue, numeric } from '@vuelidate/validators';

import products from '@/composables/localStore/useProductStore';

import type { Product } from '@/models/models';

const isOpen = defineModel()

const form = reactive<Product>({
  id: uuidv4(),
  code: '',
  name: '',
  qte: null,
  price: null,
});

const rules = {
  id: { required },
  code: { required },
  name: { required },
  qte: { required, numeric, minValue: minValue(1) },
  price: { required, numeric, minValue: minValue(1) },
};

const $v = useVuelidate(rules, form);

async function submitForm() {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    products.value.push(form)
    isOpen.value = false
  }
}
</script>
