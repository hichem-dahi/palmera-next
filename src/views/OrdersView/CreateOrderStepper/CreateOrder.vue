<template>
  <div class="pa-4">
    <OrderLineForm 
      v-for="(_,i) in form.order_lines" 
      :key="i" 
      v-model="form.order_lines[i]" 
      :is-new="i == 0"
      :products-items="productsItems"
      @delete="deleteOrderline" 
      />
      
    <v-btn 
      class="mt-6" 
      size="small" 
      block
      variant="text" 
      :text="$t('add')" 
      :append-icon="mdiPlus" 
      @click="addEmptyOrderline" 
    />
  </div>
  <slot name="actions" :v="$v"></slot>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { required, numeric, minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { mdiPlus } from '@mdi/js';


import products from '@/composables/localStore/useProductStore';

import OrderLineForm from '@/views/OrdersView/OrderLineForm.vue'

import type { OrderLine } from '@/models/models';

import { form } from './state';

// Validation rules for `order_lines`
const rules = {
  order_lines: {
    $each: {
      product_id: { required },
      qte: { required, numeric, minValue: minValue(1) },
      total_price: { required, numeric, minValue: minValue(0) }
    }
  }
};

// Initialize Vuelidate for `order_lines`
const $v = useVuelidate(rules, form);

const productsItems = computed(() => products.value
  .map(c => { 
    return { title: c.name, value: c.id }
  })
  .filter(e => {
    const alreadySelected = form.order_lines.map(ol => ol.product_id)
    return !alreadySelected.includes(e.value)
  })
)

function addEmptyOrderline() {
  form.order_lines.push({
    id: uuidv4(),      
    product_id: '',   
    qte: null,
    total_price: 0
  })
}

function deleteOrderline(orderLine: OrderLine) {
  const index = form.order_lines.indexOf(orderLine);
  form.order_lines.splice(index, 1);
}
</script>
