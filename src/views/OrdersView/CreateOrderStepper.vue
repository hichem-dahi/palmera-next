<template>
  <v-stepper v-model="step">
    <template v-slot:default>
      <v-stepper-header>
        <template v-for="n in numericSteps" :key="`${n}-step`">
          <div v-if="n == Steps.SelectConsumer && consumerPicked ? false : true">
            <v-stepper-item :complete="step > n" :step="`Step {{ n }}`" :value="n">
            </v-stepper-item>

            <v-divider v-if="n !== numericSteps[numericSteps.length - 1]" :key="n" />
          </div>
        </template>
      </v-stepper-header>

      <v-stepper-window>
        <form>
          <!-- Step 1: SelectConsumer - Only displayed if no consumer in route query -->
          <v-stepper-window-item :value="Steps.SelectConsumer">
            <SelectConsumer>
              <template v-slot:actions="{ v }">
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="nextStep(v)">{{ $t('next') }}</v-btn>
                </v-card-actions>
              </template>
            </SelectConsumer>
          </v-stepper-window-item>

          <!-- Step 2: CreateOrder -->
          <v-stepper-window-item :value="Steps.CreateOrder">
            <CreateOrder>
              <template v-slot:actions="{ v }">
                <v-card-actions>
                  <v-btn v-if="!consumerPicked" @click="step--">{{ $t('back') }}</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn @click="nextStep(v)">{{ $t('next') }}</v-btn>
                </v-card-actions>
              </template>
            </CreateOrder>
          </v-stepper-window-item>

          <!-- Step 3: ExtraInfo -->
          <v-stepper-window-item :value="Steps.ExtraInfo">
            <ExtraInfo>
              <template v-slot:actions="{ v }">
                <v-card-actions>
                  <v-btn @click="step--">{{ $t('back') }}</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn @click="nextStep(v)">{{ $t('confirm') }}</v-btn>
                </v-card-actions>
              </template>
            </ExtraInfo>
          </v-stepper-window-item>
        </form>
      </v-stepper-window>
    </template>
  </v-stepper>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { cloneDeep, isString } from 'lodash'

import orders from '@/composables/localStore/useOrdersStore'
import proformas from '@/composables/localStore/useProformaStore'
import { individuals, upsertIndividuals } from '@/composables/localStore/useIndividualsStore'
import organizations from '@/composables/localStore/useOrganizationsStore'

import SelectConsumer from './CreateOrderStepper/SelectConsumer.vue'
import CreateOrder from './CreateOrderStepper/CreateOrder.vue'
import ExtraInfo from './CreateOrderStepper/ExtraInfo.vue'

import {
  form,
  payment,
  cleanForm,
  processPayment,
  resetForm,
  resetPayment
} from './CreateOrderStepper/state'

import type { Validation } from '@vuelidate/core'
import { DocumentType } from '@/models/models'

enum Steps {
  SelectConsumer = 1,
  CreateOrder,
  ExtraInfo
}

const emits = defineEmits(['success'])

const route = useRoute()

const numericSteps: Steps[] = Object.values(Steps).filter(
  (value) => typeof value === 'number'
) as Steps[]
const step = ref(Steps.SelectConsumer)

const consumerPicked = computed(() => route.query.consumer)

onMounted(() => {
  const consumer = route.query.consumer

  if (isString(consumer)) {
    // Check if the consumer is a company
    const organization = organizations.value.find((c) => c.id === consumer)
    if (organization) {
      form.organization_id = organization.id
    } else {
      // Check if the consumer is an individual
      const individual = individuals.value.find((i) => i.id === consumer)
      if (individual) {
        form.individual = individual
      }
    }

    // Skip "SelectConsumer" step and start from step 2
    step.value = Steps.CreateOrder
  }
})

function nextStep(v: Validation) {
  v.$touch()
  if (!v.$invalid) {
    if (step.value === Steps.ExtraInfo) {
      cleanForm()
      const order = cloneDeep(form)
      if (order.document_type === DocumentType.Proforma) {
        proformas.value.unshift(order)
        emits('success')
        return
      }
      orders.value.unshift(order)
      if (order.individual) upsertIndividuals(order.individual)
      if (payment) processPayment(cloneDeep(payment))
      resetForm()
      resetPayment()
      emits('success')
    }
    step.value++
  }
}
</script>
