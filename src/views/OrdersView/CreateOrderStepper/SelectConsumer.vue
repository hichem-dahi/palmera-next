<template>
  <div class="pa-4">
    <v-radio-group v-model="consumerType">
      <v-radio :label="$t('company')" :value="ConsumerType.Company" />
      <v-radio :label="$t('individual')" :value="ConsumerType.Individual" />
    </v-radio-group>

    <div v-if="consumerType == ConsumerType.Individual">
      <v-combobox
        :label="$t('name')"
        :items="individualsItems"
        :error="!$v.individual.name.$pending && $v.individual.name.$error"
        :error-messages="$v.individual.name.$errors.map((e) => e as any)"
        v-model="form.individual.name"
        :item-props="itemProps"
        @update:model-value="handleCustomerChange"
      />
      <v-text-field
        :label="$t('phone')"
        :error="!$v.individual.phone.$pending && $v.individual.phone.$error"
        v-model="form.individual.phone"
      />
    </div>
    <v-select
      v-else-if="consumerType == ConsumerType.Company"
      :label="$t('client')"
      :items="companiesItems"
      :error="!$v.company.$pending && $v.company.$error"
      item-title="name"
      item-value="id"
      v-model="form.company"
    />
  </div>
  <slot name="actions" :v="$v"></slot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { isString } from 'lodash'
import useVuelidate from '@vuelidate/core'
import { alpha, numeric, required, requiredIf } from '@vuelidate/validators'

import { individuals } from '@/composables/localStore/useIndividualsStore'
import companies from '@/composables/localStore/useCompanyStore'

import { ConsumerType } from '@/models/models'

import { form, consumerType } from './state'

const rules = {
  company: {
    required: requiredIf(() => !form.individual.name && !form.individual.phone) // required if individual is not filled
  },
  individual: {
    name: {
      required: requiredIf(() => !form.company) // required if company is not filled
    },
    phone: {
      required: requiredIf(() => !form.company), // required if company is not filled
      numeric
    }
  }
}
const $v = useVuelidate(rules, form)

const companiesItems = computed(() =>
  companies.value.map((c) => {
    return { id: c.id, name: c.name }
  })
)

const individualsItems = computed(() =>
  individuals.value.map((c) => {
    return { id: c.id, name: c.name, phone: c.phone }
  })
)

const itemProps = (item: any) => {
  if (isString(item)) return item
  return {
    title: item.name,
    subtitle: item.phone
  }
}

function handleCustomerChange(item: any) {
  form.individual.id = uuidv4()
  form.individual.name = ''
  form.individual.phone = ''

  const existingIndividual = individualsItems.value.find((individual) => individual.id === item.id)

  if (existingIndividual) {
    form.individual = { ...existingIndividual }
  } else if (isString(item)) {
    form.individual.name = item
  }
}
</script>
