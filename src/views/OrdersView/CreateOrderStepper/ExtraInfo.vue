<template>
  <v-radio-group v-model="documentType">
    <v-radio :label="$t('delivery-note')" :value="DocumentType.DeliveryNote" />
    <v-radio :label="$t('invoice')" :value="DocumentType.Invoice" />
  </v-radio-group>
  <v-number-input 
    :label="$t('payment')" 
    inset
    controlVariant="stacked"
    :error="!$v.paid_price.$pending && $v.paid_price.$error"
    :suffix="`/${form.total_price} DA`"
    :max="form.total_price"
    :min="0"
    v-model="form.paid_price"
  />
  <v-text-field v-if="form?.company"
    :label="$t('payment-method')" 
    :error="!$v.payment_method.$pending && $v.payment_method.$error"
    v-model="form.payment_method" 
  />
  <CreateDelivery 
    v-if="documentType == DocumentType.DeliveryNote" 
    v-model="form.delivery" 
  />
  <slot name="actions" :v="$v"></slot>
</template>

<script setup lang="ts">
import { numeric, requiredIf } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import CreateDelivery from '../CreateDelivery.vue';

import { DocumentType } from '@/models/models';

import { form, documentType } from './state';

const requiredDelivery = requiredIf(() => documentType.value == DocumentType.DeliveryNote)

const rules = {
  payment_method: { 
    required: requiredIf(() => !!form.company),  // required only if company exists
  },  
  paid_price: { numeric },
  delivery: {
    driver_name: { 
      required: requiredDelivery, 
    },
    phone: {  
      required: requiredDelivery, 
      numeric
    },
    matricule: {  
      required: requiredDelivery, 
    },
    destination: {  
      required: requiredDelivery
    }
  },
}

const $v = useVuelidate(rules, form)
</script>