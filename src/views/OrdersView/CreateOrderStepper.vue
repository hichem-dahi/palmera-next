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
                  <v-btn :loading="isLoading" @click="nextStep(v)">
                    {{ $t('confirm') }}
                  </v-btn>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { isString } from 'lodash'

import { individuals } from '@/composables/localStore/useIndividualsStore'
import organizations from '@/composables/localStore/useOrganizationsStore'

import { useInsertOrderApi } from '@/composables/api/orders/useInsertOrderApi'
import { useInsertDeliveryApi } from '@/composables/api/deliveries/useInsertDeliveryApi'
import { useInsertIndividualApi } from '@/composables/api/individuals/useInsertIndivudualApi'
import { useInsertOrderlinesApi } from '@/composables/api/orderlines/useInsertOrderlinesApi'

import SelectConsumer from './CreateOrderStepper/SelectConsumer.vue'
import CreateOrder from './CreateOrderStepper/CreateOrder.vue'
import ExtraInfo from './CreateOrderStepper/ExtraInfo.vue'

import {
  form,
  cleanForm,
  resetForm,
  resetPayment,
  orderlinesForm,
  deliveryForm,
  individualForm
} from './CreateOrderStepper/state'

import type { Validation } from '@vuelidate/core'
import { DocumentType, type OrderLine } from '@/models/models'
import type { TablesInsert } from '@/types/database.types'

enum Steps {
  SelectConsumer = 1,
  CreateOrder,
  ExtraInfo
}

defineEmits(['success'])

const route = useRoute()

const numericSteps: Steps[] = Object.values(Steps).filter(
  (value) => typeof value === 'number'
) as Steps[]

const insertOrderApi = useInsertOrderApi()
const insertDeliveryApi = useInsertDeliveryApi()
const insertIndividualApi = useInsertIndividualApi()
const insertOrderlinesApi = useInsertOrderlinesApi()

const step = ref(Steps.SelectConsumer)

const consumerPicked = computed(() => route.query.consumer)

const isLoading = computed(
  () =>
    insertOrderApi.isLoading.value ||
    insertDeliveryApi.isLoading.value ||
    insertIndividualApi.isLoading.value ||
    insertOrderlinesApi.isLoading.value
)

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
        individualForm.value = individual
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
      insertOrderApi.form.value = { ...(form as TablesInsert<'orders'>) }
      if (deliveryForm.value) {
        insertOrderApi.form.value!.document_type = DocumentType.DeliveryNote
        insertDeliveryApi.form.value = { ...deliveryForm.value }
        insertDeliveryApi.execute()
      } else if (individualForm.value) {
        insertIndividualApi.form.value = { ...individualForm.value }
        insertIndividualApi.execute()
      } else {
        insertOrderApi.execute()
      }

      return
    }
    step.value++
  }
}

watch(
  () => insertDeliveryApi.isSuccess.value,
  (isSuccess) => {
    if (isSuccess && insertDeliveryApi.data.value) {
      Object.assign(insertOrderApi.form.value!, {
        delivery_id: insertDeliveryApi.data.value.id
      })
      if (individualForm.value) {
        insertIndividualApi.form.value = { ...individualForm.value }
        insertIndividualApi.execute()
      } else {
        insertOrderApi.execute()
      }
    }
  }
)

watch(
  () => insertIndividualApi.isSuccess.value,
  (isSuccess) => {
    if (isSuccess && insertIndividualApi.data.value) {
      if (insertOrderApi.form.value) {
        Object.assign(insertOrderApi.form.value, {
          individual_id: insertIndividualApi.data.value.id
        })
        insertOrderApi.execute()
      }
    }
  }
)

watch(
  () => insertOrderApi.isSuccess.value,
  (isSuccess) => {
    if (isSuccess && insertOrderApi.data.value) {
      insertOrderlinesApi.form.value = orderlinesForm.value.map(
        ({ product, ...o }) =>
          ({
            ...o,
            order_id: insertOrderApi.data.value?.id ?? ''
          }) as OrderLine
      )
      insertOrderlinesApi.execute()
      resetForm()
      resetPayment()
    }
  }
)
</script>
