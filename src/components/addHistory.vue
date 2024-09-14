<template>
  <v-card class="pa-4" title="Ajouter Remarque">
    <!-- Date Input Field -->
    <v-divider class="mb-2"></v-divider>
    <v-date-input
      label="Date"
      prepend-icon=""
      prepend-inner-icon="$calendar"
      variant="outlined"
      persistent-placeholder
      v-model="form.date"
      :error-messages="!$v.date.$pending && $v.date.$error ? 'Date is required' : ''"
    ></v-date-input>
    

    <v-select 
      label="type" 
      v-model="form.type" 
      :items="types"
      item-title="title"
      item-value="value"
      :error-messages="!$v.type.$pending && $v.type.$error ? 'Type is required' : ''"
    >

    </v-select>
    <!-- Value Input Field -->
    <v-text-field
      label="Value"
      v-model="form.value"
      :disabled="form.type != HistoryType.dept"
      :error-messages="!$v.value.$pending && $v.value.$error ? 'Value is required' : ''"
    ></v-text-field>
    
    <!-- Add Button -->
    <v-btn block @click="submitForm">Add</v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import useVuelidate from '@vuelidate/core';
import { numeric, required } from '@vuelidate/validators';

import personnel from '@/composables/localStore/usePersonnelStore';

import { HistoryType } from '@/models/models';

const types = [
  { value: HistoryType.absence, title: 'Absence'},
  { value: HistoryType.dept, title: 'Endettement'}
]

const isOpen = defineModel<boolean>('dialog')
const person = defineModel<any>('person')

const form = reactive({
  date: new Date(),
  value: null,
  type: HistoryType.dept
});

const rules = {
  date: { required },
  value: { numeric },
  type: { required, numeric }
};

const $v = useVuelidate(rules, form);

async function submitForm() {
  $v.value.$touch(); // Touch all fields to trigger validation
  if (!$v.value.$invalid) {
    person.value.history.push(form);
    console.log('Personnel added:', personnel.value);
    isOpen.value = false
  } else {
    console.log('Form is invalid');
  }
}
</script>
