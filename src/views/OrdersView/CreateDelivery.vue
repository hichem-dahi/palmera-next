<template>
  <div>
    <!-- Driver Name Field with Error Messages -->
    <v-text-field
      :label="$t('driver')"
      density="compact"
      v-model="form.driver_name"
      :error="!v$.driver_name.$pending && v$.driver_name.$error"
      @blur="v$.driver_name.$touch()"
    />

    <!-- Phone Field with Error Messages -->
    <v-text-field
      :label="$t('phone')"
      density="compact"
      v-model="form.phone"
      :error="!v$.phone.$pending && v$.phone.$error"
      @blur="v$.phone.$touch()"
    />

    <!-- Matricule Field with Error Messages -->
    <v-text-field
      :label="$t('registration-number')"
      density="compact"
      v-model="form.matricule"
      :error="!v$.matricule.$pending && v$.matricule.$error"
      @blur="v$.matricule.$touch()"
    />

    <!-- Destination Field with Error Messages -->
    <v-text-field
      :label="$t('destination')"
      density="compact"
      v-model="form.destination"
      :error="!v$.destination.$pending && v$.destination.$error"
      @blur="v$.destination.$touch()"
    />
  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { minLength, numeric, required } from '@vuelidate/validators'

import type { Delivery } from '@/models/models'

const dialog = defineModel<boolean>('dialog')
const form = defineModel<Delivery>('delivery', { required: true })

const rules = {
  driver_name: { required, minLength: minLength(3) },
  phone: {
    required,
    numeric,
    minLength: minLength(10)
  },
  matricule: { required, minLength: minLength(6) },
  destination: { required, minLength: minLength(3) }
}

const v$ = useVuelidate(rules, form)
</script>
