<template>
  <v-card title="Create Order" class="pa-4">
    <v-select 
      label="Client" 
      :items="clientsItems" 
      :error="!$v.client_id.$pending && $v.client_id.$error"
      item-title="title" 
      item-value="value" 
      v-model="form.client_id">
    </v-select>
    <v-divider class="py-2"></v-divider>
    <OrderLineForm 
      v-for="(_,i) in form.order_lines" 
      :key="i" 
      v-model="form.order_lines[i]" 
      :is-new="false"
      :products-items="productsItems"
      @delete="deleteOrderline" 
      />
    <v-btn class="ma-2" size="small" variant="text" text="Add line" append-icon="mdi-plus" @click="addEmptyOrderline" />
    <v-divider class="py-2"></v-divider>
    <v-number-input 
      label="Paid price" 
      inset
      controlVariant="stacked"
      :error="!$v.paid_price.$pending && $v.paid_price.$error"
      :suffix="`/${total_price} DA`"
      :max="total_price"
      :min="0"
      v-model="form.paid_price"
    />

    <v-btn block @click="submitForm">Add</v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { sum } from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import useVuelidate from '@vuelidate/core';
import { minLength, numeric, required } from '@vuelidate/validators';

import orders from '@/composables/localStore/useOrdersStore';
import clients from '@/composables/localStore/useClientsStore';
import products from '@/composables/localStore/useProductStore';

import OrderLineForm from '@/views/OrdersView/OrderLineForm.vue'

import type { Order, OrderLine } from '@/models/models';

const isOpen = defineModel()

const clientsItems = computed(() => clients.value.map(c => { 
  return { title: c.name, value: c.id }
}))

const productsItems = computed(() => products.value
  .map(c => { 
    return { title: c.name, value: c.id }
  })
  .filter(e => {
    const alreadySelected = form.order_lines.map(ol => ol.product_id)
    return !alreadySelected.includes(e.value)
  })
)

const total_price = computed(() => sum(form.order_lines.map(e => e.total_price)))

const form = reactive<Order>({
  id: uuidv4(),
  client_id: '',
  order_lines: [{
    id: uuidv4(),      
    product_id: '',   
    qte: null,
    total_price: 0
  }],
  total_price: 0,
  paid_price: 0,
  date: new Date()
})

const rules = {
  id: { required },
  client_id: { required },
  order_lines: { required, minLength: minLength(1) },
  total_price: { required, numeric },
  paid_price: { required, numeric },
};

const $v = useVuelidate(rules, form);

function submitForm() {
  form.total_price = sum(form.order_lines.map(e => e.total_price))
  $v.value.$touch();
  if (!$v.value.$invalid) {
    orders.value.push(form)
    isOpen.value = false
  }
}

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
