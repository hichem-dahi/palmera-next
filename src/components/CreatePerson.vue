<template>
  <v-sheet class="pa-4">
    <v-text-field
      label="First Name"
      v-model.trim="form.first_name"
      :error-messages="!$v.first_name.$pending && $v.first_name.$error ? 'First Name is required' : ''"
      @blur="$v.first_name.$touch()"
    />
    <v-text-field
      label="Last Name"
      v-model.trim="form.last_name"
      :error-messages="!$v.last_name.$pending && $v.last_name.$error ? 'Last Name is required' : ''"
      @blur="$v.last_name.$touch()"
    />

    <v-btn block @click="submitForm">Add</v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, alpha } from '@vuelidate/validators';

import personnel from '@/composables/localStore/usePersonnelStore';

const isOpen = defineModel()

const form = reactive({
  first_name: '',
  last_name: '',
});

const rules = {
  first_name: { alpha, required },
  last_name: { alpha, required },
};

const $v = useVuelidate(rules, form);

async function submitForm() {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    personnel.value.push({...form, history: [] as any[]})
    isOpen.value = false
  } else {
    console.log('Form is invalid');
  }
}
</script>
