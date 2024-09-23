<template>
  <v-card class="pa-4" title="Create Delivery">
    <!-- Driver Name Field with Error Messages -->
    <v-text-field
      label="Driver Name"
      v-model="form.driver_name"
      :error-messages="getErrorMessages(v$.driver_name)"
      @blur="v$.driver_name.$touch()"
    />

    <!-- Phone Field with Error Messages -->
    <v-text-field
      label="Phone"
      v-model="form.phone"
      :error-messages="getErrorMessages(v$.phone)"
      @blur="v$.phone.$touch()"
    />

    <!-- Matricule Field with Error Messages -->
    <v-text-field
      label="Matricule"
      v-model="form.matricule"
      :error-messages="getErrorMessages(v$.matricule)"
      format
      @blur="v$.matricule.$touch()"
    />

    <!-- Destination Field with Error Messages -->
    <v-text-field
      label="Destination"
      v-model="form.destination"
      :error-messages="getErrorMessages(v$.destination)"
      @blur="v$.destination.$touch()"
    />
    <!-- Submit Button -->
    <v-btn block @click="addDelivery">Submit</v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import useVuelidate from '@vuelidate/core';
import { minLength, numeric, required } from '@vuelidate/validators';
import deliveries from '@/composables/localStore/useDeliveryStore';

import type { Delivery, Order } from '@/models/models';
import { watchEffect } from 'vue';
import { computed } from 'vue';

const dialog = defineModel<boolean>('dialog')
const order = defineModel<Order>('order')

const emits = defineEmits(['goInvoice'])

const form = reactive<Delivery>({
  id: uuidv4(),
  driver_name: '',
  phone: '',
  matricule: '',
  destination: '',
})

const rules = {
  id: { required },
  driver_name: { required, minLength: minLength(3) },  
  phone: { 
    required, 
    numeric, 
    minLength: minLength(10)  
  },
  matricule: { required, minLength: minLength(6) },    
  destination: { required, minLength: minLength(3) },
};


const v$ = useVuelidate(rules, form);

const delivery = computed(() => deliveries.value.find(d => d.id == order.value?.delivery))

watchEffect(() => {
  if (delivery.value)
    Object.assign(form, delivery.value) 
})

function addDelivery() {
  v$.value.$touch()
  if (!v$.value.$invalid && order.value) {
    delivery.value ? null : order.value.delivery = form.id
    delivery.value ? null : deliveries.value.push(form)
    dialog.value = false
    emits('goInvoice')
  }
}

function getErrorMessages(field: any) {
  if (!field.$dirty) return []; // No errors if the field hasn't been touched
  const errors = [];
  if (field.required.$invalid) errors.push('This field is required.');
  if (field.minLength.$invalid) {
    errors.push(`Minimum length is ${field.minLength.$params.min} characters.`);
  }
  if (field.numeric?.$invalid && !/^\d+$/.test(field.$model)) {
    errors.push('This field must contain only numbers.');
  }
  return errors;
}
</script>