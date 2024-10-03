<template>   
  <v-row v-if="form" align="end" no-gutters>
    <v-col>      
      <v-select 
        class="mr-3"
        :label="$t('product')" 
        variant="underlined"
        inset
        :error="!$v.product_id.$pending && $v.product_id.$error"
        :items="productsItems" 
        item-value="value" 
        v-model="form.product_id"
        hide-no-data
        hide-details
        >
        <template v-slot:selection>
          <span>{{ product?.name }}</span>
        </template>
      </v-select>
    </v-col>
    <v-col>
      <v-number-input 
        :label="$t('quantity')" 
        variant="underlined"
        inset
        :disabled="!form.product_id"
        hide-details
        control-variant="stacked"        
        :error="!$v.qte.$pending && $v.qte.$error"
        :suffix="`/${product?.qte}`"
        :max="product?.qte || undefined"
        :min="0"
        v-model="form.qte"
      />
    </v-col>
    <v-col cols="2">
      <div class="pa-2 text-medium-emphasis text-caption">{{$t('total')}}: {{ form.total_price }}DA</div>
    </v-col>
    <v-col cols="1">
      <v-btn v-if="!isNew"
        color="medium-emphasis" 
        variant="text" 
        icon="mdi-delete" 
        size="small"
        @click="emits('delete', form)"
      />
    </v-col>
  </v-row>
  <slot name="actions" :form="model" :validation="{touch: $v.$touch, invalid: $v.$invalid}"></slot>
</template>

<script setup lang="ts">
import { reactive, watchEffect, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import useVuelidate from '@vuelidate/core';
import { minValue, numeric, required } from '@vuelidate/validators';

import products from '@/composables/localStore/useProductStore';

import type { OrderLine } from '@/models/models';

interface Item { 
  title: string
  value: string
}

const model = defineModel<OrderLine>({ default: {
  id: uuidv4(),      
  product_id: '',   
  qte: null,
  total_price: 0
}, 
  required: false 
});

const props = defineProps<{ productsItems: Item[], isNew: boolean }>()
const emits = defineEmits(['add', 'delete'])

const product = computed(() => products.value.find(e => e.id == form.product_id)) 

const form = reactive(model.value)

const orderLineRules = {
  id: { required },
  product_id: { required },
  qte: { required, numeric, minValue: minValue(1) },
  total_price: { required, numeric, minValue: minValue(1) },
}
const $v = useVuelidate(orderLineRules, form);

watchEffect(() => {
  const product = products.value.find(p => p.id === form!.product_id)
  if (product?.price && form?.qte) {
    const total_price = product.price * form?.qte
    form.total_price = total_price
  }
})
</script>