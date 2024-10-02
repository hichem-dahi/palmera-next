<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-stepper v-model="e1">
    <template v-slot:default>
      <v-stepper-header>
        <template v-for="n in steps" :key="`${n}-step`">
          <v-stepper-item
            :complete="e1 > n"
            :step="`Step {{ n }}`"
            :value="n"
            editable
          ></v-stepper-item>

          <v-divider
            v-if="n !== steps"
            :key="n"
          ></v-divider>
        </template>
      </v-stepper-header>

      <v-stepper-window>
          <form>
            <v-stepper-window-item :value="1">
              <SelectConsumer>
                <template v-slot:actions="{ v }">
                  <v-card-actions>
                    <v-btn @click="dialog">cancel</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="nextStep(v)">next</v-btn>
                  </v-card-actions>
                </template>
              </SelectConsumer>
            </v-stepper-window-item>

            <v-stepper-window-item :value="2">
              <CreateOrder>
                <template v-slot:actions="{ v }">
                  <v-card-actions>
                    <v-btn @click="e1--">back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="nextStep(v)">next</v-btn>
                  </v-card-actions>
                </template>
              </CreateOrder>
            </v-stepper-window-item>

            <v-stepper-window-item :value="3">
              <ExtraInfo>
                <template v-slot:actions="{ v }">
                  <v-card-actions>
                    <v-btn @click="e1--">back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="nextStep(v)">confirm</v-btn>
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
import { computed, ref } from 'vue';
import { cloneDeep } from 'lodash';

import orders from '@/composables/localStore/useOrdersStore';
import { upsertIndividuals } from '@/composables/localStore/useIndividualsStore';
import { processOrder } from '@/composables/useStockManage';

import SelectConsumer from './CreateOrderStepper/SelectConsumer.vue';
import CreateOrder from './CreateOrderStepper/CreateOrder.vue';
import ExtraInfo from './CreateOrderStepper/ExtraInfo.vue';

import type { Validation } from '@vuelidate/core';

import { form } from './CreateOrderStepper/state';

const dialog = defineModel<boolean>()
const emits = defineEmits(['success'])

const steps = ref(3)
const e1 = ref(1)

const disabled = computed(() => e1.value === 1 ? 'prev' : e1.value === steps.value ? 'next' : undefined)

function nextStep(v: Validation) {
  v.$touch()
  if (!v.$invalid) {
    if (e1.value === 3) {
      const order = cloneDeep(form)
      orders.value.unshift(order)
      if (form.individual)
        upsertIndividuals(order.individual)
      processOrder(order)
      emits('success')
    }
    e1.value++
  }
}
</script>