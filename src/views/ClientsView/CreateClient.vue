<template>
  <v-card title="Create client" class="pa-4">
    <v-text-field
      label="Name"
      v-model.trim="form.name"
      :error-messages="!$v.name.$pending && $v.name.$dirty ? [
        $v.name.required.$invalid ? 'Name is required' : '',
        $v.name.minLength.$invalid ? 'Name must be at least 3 characters' : ''
      ].filter(Boolean) : []"
      @blur="$v.name.$touch()"
    />
    <v-text-field
      label="Phone"
      v-model.trim="form.phone"
      :error-messages="!$v.phone.$pending && $v.phone.$dirty ? [
        $v.phone.required.$invalid ? 'Phone is required' : '',
        $v.phone.numeric.$invalid ? 'Phone must be numeric' : '',
        $v.phone.minLength.$invalid ? 'Phone must be at least 10 digits' : ''
      ].filter(Boolean) : []"
      @blur="$v.phone.$touch()"
    />
    <v-text-field
      label="RC"
      v-model.trim="form.rc"
      :error-messages="!$v.rc.$pending && $v.rc.$dirty ? [
        $v.rc.required.$invalid ? 'RC is required' : '',
        $v.rc.numeric.$invalid ? 'RC must be numeric' : ''
      ].filter(Boolean) : []"
      @blur="$v.rc.$touch()"
    />
    <v-text-field
      label="NIF"
      v-model.trim="form.nif"
      :error-messages="!$v.nif.$pending && $v.nif.$dirty ? [
        $v.nif.required.$invalid ? 'NIF is required' : '',
        $v.nif.numeric.$invalid ? 'NIF must be numeric' : ''
      ].filter(Boolean) : []"
      @blur="$v.nif.$touch()"
    />
    <v-text-field
      label="ART"
      v-model.trim="form.art"
      :error-messages="!$v.art.$pending && $v.art.$dirty ? [
        $v.art.numeric.$invalid ? 'ART must be numeric' : ''
      ].filter(Boolean) : []"
      @blur="$v.art.$touch()"
    />
    <v-text-field
      label="Address"
      v-model.trim="form.address"
      :error-messages="!$v.address.$pending && $v.address.$dirty ? [
        $v.address.required.$invalid ? 'Address is required' : '',
        $v.address.minLength.$invalid ? 'Address must be at least 10 characters' : ''
      ].filter(Boolean) : []"
      @blur="$v.address.$touch()"
    />
    <v-text-field
      label="Activity"
      v-model.trim="form.activity"
      :error-messages="!$v.activity.$pending && $v.activity.$dirty ? [
        $v.activity.required.$invalid ? 'Activity is required' : ''
      ].filter(Boolean) : []"
      @blur="$v.activity.$touch()"
    />

    <v-btn block @click="submitForm">Add</v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import useVuelidate from '@vuelidate/core';
import { required, minLength, numeric } from '@vuelidate/validators';

import clients from '@/composables/localStore/useClientsStore';

import type { Client } from '@/models/models';

const isOpen = defineModel()

const form = reactive<Client>({
  id: uuidv4(),
  name: '',
  phone: '',
  rc: '',
  nif: '',
  art: '',
  address: '',
  activity: ''
})

const rules = {
  id: { required },
  name: { required, minLength: minLength(3) },
  phone: { required, minLength: minLength(10), numeric },
  rc: { required, numeric },
  nif: { required, numeric },
  art: { numeric },
  address: { required, minLength: minLength(10) },
  activity: { required }
};

const $v = useVuelidate(rules, form);

async function submitForm() {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    clients.value.push({...form})
    isOpen.value = false
  } else {
    console.log('Form is invalid');
  }
}
</script>
