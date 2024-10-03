<template>
  <div v-if="form.delivery">
    <!-- Driver Name Field with Error Messages -->
    <v-text-field
      :label="$t('driver')"
      density="compact"
      v-model="form.delivery.driver_name"
      :error-messages="getErrorMessages(v$.driver_name)"
      @blur="v$.driver_name.$touch()"
    />

    <!-- Phone Field with Error Messages -->
    <v-text-field
      :label="$t('phone')"
      density="compact"
      v-model="form.delivery.phone"
      :error-messages="getErrorMessages(v$.phone)"
      @blur="v$.phone.$touch()"
    />

    <!-- Matricule Field with Error Messages -->
    <v-text-field
      :label="$t('registration-number')"
      density="compact"
      v-model="form.delivery.matricule"
      :error-messages="getErrorMessages(v$.matricule)"
      format
      @blur="v$.matricule.$touch()"
    />

    <!-- Destination Field with Error Messages -->
    <v-text-field
      :label="$t('destination')"
      density="compact"
      v-model="form.delivery.destination"
      :error-messages="getErrorMessages(v$.destination)"
      @blur="v$.destination.$touch()"
    />
  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { minLength, numeric, required } from '@vuelidate/validators';

import { form } from './CreateOrderStepper/state';

import type { Delivery } from '@/models/models';

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

const v$ = useVuelidate(rules, form.delivery as Delivery);

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