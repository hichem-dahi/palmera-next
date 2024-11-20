<template>
  <v-row v-if="form" align="end" no-gutters>
    <v-col>
      <v-select
        class="mr-3"
        :label="$t('product')"
        variant="underlined"
        inset
        :error="!$v.product_id.$pending && $v.product_id.$error"
        :items="availableProducts"
        item-value="id"
        item-title="name"
        v-model="form.product_id"
        hide-no-data
        hide-details
      >
        <template v-slot:selection>
          <span>{{ selectedProduct?.name }}</span>
        </template>
      </v-select>
    </v-col>
    <v-col class="mr-3">
      <v-number-input
        :label="$t('quantity')"
        variant="underlined"
        inset
        :disabled="!form.product_id"
        hide-details
        control-variant="stacked"
        :error="!$v.qte.$pending && $v.qte.$error"
        :suffix="`/${selectedProduct?.qte ?? 0}`"
        :max="selectedProduct?.qte ?? undefined"
        :min="0"
        v-model="form.qte"
      />
    </v-col>
    <v-col class="mr-3">
      <v-number-input
        :label="$t('U.P')"
        variant="underlined"
        inset
        :disabled="!form.qte"
        hide-details
        control-variant="stacked"
        :error="!$v.unit_price.$pending && $v.unit_price.$error"
        :min="0"
        v-model="form.unit_price"
      />
    </v-col>
    <v-col cols="2">
      <div class="pa-2 text-medium-emphasis text-caption">
        {{ $t('total') }}: {{ form.total_price }}DA
      </div>
    </v-col>
    <v-col cols="1">
      <v-btn
        v-if="!isNew"
        color="medium-emphasis"
        variant="text"
        :icon="mdiDelete"
        size="small"
        @click="emits('delete', form)"
      />
    </v-col>
  </v-row>
  <slot
    name="actions"
    :form="model"
    :validation="{ touch: $v.$touch, invalid: $v.$invalid }"
  ></slot>
</template>

<script setup lang="ts">
import { reactive, watchEffect, computed, watch } from 'vue'
import useVuelidate from '@vuelidate/core'
import { minValue, numeric, required } from '@vuelidate/validators'
import { mdiDelete } from '@mdi/js'

import type { Product } from '@/models/models'
import type { OrderLineData } from '@/composables/api/orders/useGetOrderApi'

const model = defineModel<OrderLineData>({
  default: {
    order_id: '',
    product_id: '',
    qte: 0,
    unit_price: 0,
    total_price: 0,
    unit_cost_price: null
  },
  required: false
})

const props = defineProps<{ availableProducts?: Product[]; products: Product[]; isNew: boolean }>()
const emits = defineEmits(['add', 'delete'])

const form = reactive(model.value)

const orderLineRules = {
  product_id: { required },
  qte: { required, numeric, minValue: minValue(1) },
  unit_price: { required, numeric, minValue: minValue(1) },
  total_price: { required, numeric, minValue: minValue(1) },
  unit_cost_price: { numeric, minValue: minValue(1) }
}

const $v = useVuelidate(orderLineRules, form)

const selectedProduct = computed(() => props.products.find((e) => e.id === form.product_id))

watchEffect(() => {
  if (form?.qte && form.unit_price) {
    form.total_price = form.unit_price * form?.qte
  }
})

watch(selectedProduct, (newProduct) => {
  if (newProduct) {
    form.unit_price = newProduct.price || 0
    form.product = newProduct
    form.product.cost_price
      ? (form.unit_cost_price = form.product.cost_price)
      : (form.unit_cost_price = null)
  }
})
</script>
