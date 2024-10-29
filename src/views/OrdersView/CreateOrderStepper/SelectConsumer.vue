<template>
  <div class="pa-4">
    <v-radio-group v-model="consumerType">
      <v-radio :label="$t('company')" :value="ConsumerType.Organization" />
      <v-radio :label="$t('individual')" :value="ConsumerType.Individual" />
    </v-radio-group>

    <div v-if="consumerType == ConsumerType.Individual">
      <v-combobox
        :label="$t('name')"
        :items="individualsItems"
        :error="!v2$.name.$pending && v2$.name.$error"
        v-model="form.individual.name"
        :item-props="itemProps"
        @update:model-value="handleCustomerChange"
      />
      <v-text-field
        :label="$t('phone')"
        :error="!v2$.phone.$pending && v2$.phone.$error"
        v-model="form.individual.phone"
      />
    </div>
    <v-select
      v-else-if="consumerType == ConsumerType.Organization"
      :label="$t('client')"
      :items="organizationsItems"
      :error="!v1$.$pending && v1$.$error"
      item-title="name"
      item-value="id"
      v-model="form.organization_id"
    />
  </div>
  <slot name="actions" :v="v$"></slot>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { isString } from 'lodash'
import useVuelidate from '@vuelidate/core'
import { minLength, numeric, required } from '@vuelidate/validators'

import { individuals } from '@/composables/localStore/useIndividualsStore'
import organizations from '@/composables/localStore/useOrganizationsStore'

import { ConsumerType } from '@/models/models'

import { form, consumerType } from './state'

//TODO: to refactor form.individual type

// Validation rules ensuring either individual or company is required
const rules1 = { required }

const rules2 = {
  id: {
    required
  },
  name: {
    required
  },
  phone: {
    numeric,
    minLength: minLength(10)
  }
}

// Initialize the Vuelidate validation instance
const v1$ = useVuelidate(
  rules1,
  toRef(() => form.organization_id)
)

const v2$ = useVuelidate(
  rules2,
  toRef(() => form.individual)
)

const v$ = computed(() =>
  consumerType.value === ConsumerType.Organization ? v1$.value : v2$.value
)

const organizationsItems = computed(() =>
  organizations.value.map((c) => {
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
