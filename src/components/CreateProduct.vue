<template>
  <v-sheet class="pa-4">
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
    <v-file-input
      accept="image/*"
      label="Image"
      v-model="form.image"
      labe
      :error-messages="!$v.image.$pending && $v.image.$error ? 'Image is required' : ''"
      @blur="$v.image.$touch()"
    />

    <v-btn block @click="submitForm">Add</v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minValue, numeric } from '@vuelidate/validators';

import products from '@/composables/localStore/useProductStore';
import { fileToBase64 } from '@/helpers/helpers';

const isOpen = defineModel()

const form = reactive({
  name: '',
  qte: null,
  image: null as File | string | null
});

const rules = {
  name: { required },
  qte: { required, numeric, minValue: minValue(1) },
  image: { required }
};

const $v = useVuelidate(rules, form);

async function submitForm() {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    const src = await fileToBase64(form.image as File)
    form.image = src
    products.value.push({...form, history: [] as any[]})
    isOpen.value = false
  } else {
    console.log('Form is invalid');
  }
}
</script>
