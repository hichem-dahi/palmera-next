<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    v-if="order"
    :items="items"
    :headers="headers"
    hide-default-footer
  >
    <template v-slot:top>
      <v-card class="d-flex align-center">
        <v-card-title class="py-3 px-6 w-50"> 
          <div>Commande N°{{ 1 }}</div>
          <div class="text-medium-emphasis text-subtitle-2">
            <div>{{ client?.name }}</div>
          </div>
          <div class="text-medium-emphasis text-subtitle-2">
            {{ format(order.date, 'yyyy-MM-dd')  }}
          </div>
        </v-card-title>

        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="400">
          <template v-slot:activator="{ props }">
            <v-btn
              class="mb-2"
              variant="text"
              color="primary"
              :disabled="!productsItems.length"
              v-bind="props"
            >
              New product
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Edit line</v-card-title>
            <v-card-text>
              <OrderLineForm 
                :is-new="true"
                :products-items="productsItems"
              >
              <template v-slot:actions="{ form, validation }">
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn variant="text" color="blue" @click="dialog = false">cancel</v-btn>
                  <v-btn variant="text" color="blue" @click="addOrderline(form, validation)">save</v-btn>
                </v-card-actions>
              </template>
            </OrderLineForm>
            </v-card-text>

          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card class="pa-4">
            <v-card-title class="text-h6 text-center" style="overflow: visible;">
              Are you sure you want to delete this item?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </template>
    <template v-slot:item.qte="{ item }">
      <v-number-input
        class="number-input"
        type="number" 
        width="150"
        hide-details
        inset
        variant="plain"
        density="compact" 
        :suffix="`/${item.product?.qte}`"
        counter="50"
        :max="item.product?.qte || 0"
        :min="1"
        v-model="proxyOrderlines[item.index].qte">
      </v-number-input>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn color="medium-emphasis" 
        variant="text" 
        size="small" 
        icon="mdi-delete" 
        @click="deleteItem(item)" />
    </template>
  </v-data-table>
  <v-card class="pa-4">
    <div class="d-flex justify-end">
      <div class="info" style="width: 40%;">
        <div class="d-flex">
         <div class="font-weight-bold">Total:&nbsp;  </div> 
          <div>{{ proxyOrder.total_price }}DA</div>
        </div> 
        <div class="d-flex">
          <div class="font-weight-bold">Total T.V.A (18%):&nbsp; </div> 
          <div>{{ (proxyOrder.total_price * 92)/100 }}DA</div>
        </div> 
      </div>
    </div>
    <v-card-actions class="mt-5">
      <v-btn variant="text" @click="cancelEdit">Cancel</v-btn>
      <v-btn variant="text" color="green" @click="confirmEdit">Confirm</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import { computed, ref, readonly, watch } from 'vue';
import { format } from 'date-fns';
import { sum } from 'lodash';

import products from '@/composables/localStore/useProductStore';
import clients from '@/composables/localStore/useClientsStore';

import OrderLineForm from '@/components/OrderLineForm.vue'

import type { Order, OrderLine } from '@/models/models';

const order = defineModel<Order>('order')
const emits = defineEmits(['close'])

const proxyOrder = ref<Order>(JSON.parse(JSON.stringify(order.value))) 
const dialog = ref(false)
const dialogDelete = ref(false)
const selectedOrderline = ref<OrderLine>()
const isConfirm = ref(false)

const headers = readonly(ref([
 {
    title: 'Product',
    align: 'start',
    sortable: false,
    key: 'product_name',
  },
  { title: 'Quantity', key: 'qte', align: 'start' },
  { title: 'P.U (DA)', key: 'unity_price' },
  { title: 'Total (DA)', key: 'total_price' },
  { title: 'Actions', key: 'actions', sortable: false },
]))

const client = computed(() => clients.value.find(e =>   
  order.value ? e.id === order.value.client_id : null 
))

const proxyOrderlines = computed(() => proxyOrder.value.order_lines)

const items = computed(() => proxyOrderlines.value.map((o, i) => {
  const product = getProduct(o.product_id)
  return { 
    id: o.id,
    index: i,
    product: product,
    product_name: product?.name,
    qte: o.qte,
    unity_price: product?.price,
    total_price: o.total_price
   }
}))

const productsItems = computed(() => products.value
  .map(c => { 
    return { title: c.name, value: c.id }
  })
  .filter(e => {
    const alreadySelected = proxyOrderlines.value.map(ol => ol.product_id)
    return !alreadySelected.includes(e.value)
  })
)

const getProduct = (id: string) => products.value.find(e => e.id == id)

const deleteItem = (item: any) => {
  selectedOrderline.value = proxyOrderlines.value[item.index]
  dialogDelete.value = true
}

const deleteItemConfirm = () =>  {
  const index =  proxyOrderlines.value.findIndex(e => e.id == selectedOrderline.value?.id)
  proxyOrderlines.value.splice(index, 1)
  closeDelete()
}

const closeDelete = () => {
  selectedOrderline.value = undefined
  dialogDelete.value = false
}

function addOrderline(form: OrderLine, validation: { touch: () => void, invalid: boolean }) {
  validation.touch()
  if(!validation.invalid){
    proxyOrderlines.value.push(form)
    dialog.value = false
  }
}

function cancelEdit() {
  emits('close')
}

function confirmEdit() {
  if(order.value){
    order.value = proxyOrder.value
    emits('close')
  }
}

watch(proxyOrderlines, (orderLines) => {
  isConfirm.value = true
  proxyOrder.value.total_price = sum(orderLines.map(e => {
    const product = getProduct(e.product_id)
    e.total_price = Number(e.qte) * Number(product?.price) 
    return e.total_price
  }))
},
{
  deep: true
})
</script>

<style>
.number-input {
  max-width: 70px;
  .v-field__append-inner {
    display: none;
  }
}
</style>