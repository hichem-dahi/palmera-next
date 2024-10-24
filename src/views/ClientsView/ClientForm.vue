<template>
  <v-card :title="title" class="pa-4">
    <v-text-field
      :label="$t('name')"
      v-model="model.name"
      :error-messages="
        !$v.name.$pending && $v.name.$error
          ? [
              $v.name.required.$invalid ? 'Name is required' : '',
              $v.name.minLength.$invalid ? 'Name must be at least 3 characters' : ''
            ].filter(Boolean)
          : []
      "
      @blur="$v.name.$touch()"
    />
    <v-text-field
      :label="$t('phone')"
      v-model.trim="model.phone"
      :error-messages="
        !$v.phone.$pending && $v.phone.$error
          ? [
              $v.phone.required.$invalid ? 'Phone is required' : '',
              $v.phone.numeric.$invalid ? 'Phone must be numeric' : '',
              $v.phone.minLength.$invalid ? 'Phone must be at least 10 digits' : ''
            ].filter(Boolean)
          : []
      "
      @blur="$v.phone.$touch()"
    />
    <v-text-field
      :label="$t('R.C')"
      v-model.trim="model.rc"
      :error-messages="
        !$v.rc.$pending && $v.rc.$error
          ? [$v.rc.required.$invalid ? 'RC is required' : ''].filter(Boolean)
          : []
      "
      @blur="$v.rc.$touch()"
    />
    <v-text-field
      :label="$t('NIF')"
      v-model.trim="model.nif"
      :error-messages="
        !$v.nif.$pending && $v.nif.$error
          ? [
              $v.nif.required.$invalid ? 'NIF is required' : '',
              $v.nif.numeric.$invalid ? 'NIF must be numeric' : ''
            ].filter(Boolean)
          : []
      "
      @blur="$v.nif.$touch()"
    />
    <v-text-field
      :label="$t('NIS')"
      v-model.trim="model.nis"
      :error-messages="
        !$v.nis.$pending && $v.nis.$error
          ? [
              $v.nis.required.$invalid ? 'NIS is required' : '',
              $v.nis.numeric.$invalid ? 'NIS must be numeric' : ''
            ].filter(Boolean)
          : []
      "
      @blur="$v.nis.$touch()"
    />
    <v-text-field
      :label="$t('N.ART')"
      v-model.trim="model.art"
      :error-messages="
        !$v.art.$pending && $v.art.$error
          ? [
              $v.art.required.$invalid ? 'ART is required' : '',
              $v.art.numeric.$invalid ? 'ART must be numeric' : ''
            ].filter(Boolean)
          : []
      "
      @blur="$v.art.$touch()"
    />
    <v-text-field
      :label="$t('address')"
      v-model.trim="model.address"
      :error-messages="
        !$v.address.$pending && $v.address.$error
          ? [
              $v.address.required.$invalid ? 'Address is required' : '',
              $v.address.minLength.$invalid ? 'Address must be at least 10 characters' : ''
            ].filter(Boolean)
          : []
      "
      @blur="$v.address.$touch()"
    />
    <v-text-field
      :label="$t('activity')"
      v-model.trim="model.activity"
      :error-messages="
        !$v.activity.$pending && $v.activity.$error
          ? [$v.activity.required.$invalid ? 'Activity is required' : ''].filter(Boolean)
          : []
      "
      @blur="$v.activity.$touch()"
    />

    <!-- Pass the form and validation as slot props -->
    <slot name="actions" :validation="$v"></slot>
  </v-card>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

import useVuelidate from '@vuelidate/core'
import { required, minLength, numeric } from '@vuelidate/validators'
import { toRef } from 'vue'

const props = defineProps<{ title: string }>()
const model = defineModel({
  default: {
    id: uuidv4(),
    name: '',
    phone: '',
    rc: '',
    nif: null as number | null,
    nis: null as number | null,
    art: null as number | null,
    address: '',
    activity: ''
  }
})

const rules = {
  id: { required },
  name: { required, minLength: minLength(3) },
  phone: { required, minLength: minLength(10), numeric },
  rc: { required },
  nif: { required, numeric },
  nis: { required, numeric },
  art: { required, numeric },
  address: { required, minLength: minLength(10) },
  activity: { required }
}

const $v = useVuelidate(
  rules,
  toRef(() => model.value)
)
</script>
