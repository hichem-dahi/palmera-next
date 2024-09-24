<template>
  <v-sheet class="pa-4">
    <v-text-field
      label="Code"
      v-model="form.code"
      :error-messages="!$v.code.$pending && $v.code.$error ? 'Code is required' : ''"
      @blur="$v.code.$touch()"
    />
    <v-text-field
      label="Name"
      v-model="form.name"
      :error-messages="!$v.name.$pending && $v.name.$error ? 'Name is required' : ''"
      @blur="$v.name.$touch()"
    />
    <v-text-field
      label="Quantity"
      v-model="form.qte"
      type="number"
      :error-messages="!$v.qte.$pending && $v.qte.$error ? 'Quantity must be greater than zero' : ''"
      @blur="$v.qte.$touch()"
    />

    <v-text-field
      label="Price"
      v-model="form.price"
      type="number"
      :error-messages="!$v.price.$pending && $v.price.$error ? 'Price must be greater than zero' : ''"
      @blur="$v.price.$touch()"
    />

    <v-btn block @click="submitForm">Add</v-btn>
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
