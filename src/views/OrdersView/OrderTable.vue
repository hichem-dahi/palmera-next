<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    v-if="order"
    :items="items"
    :headers="headers"
    style="background-color: #FEFEFE"
    hide-default-footer
  >
    <template v-slot:top>
      <v-card class="pb-2 d-flex align-end" color="#F7F7F7" elevation="0">
        <div class="col-1 d-flex justify-space-between w-75">
          <v-card-title> 
            <div class="text-medium-emphasis text-subtitle-2">
              <div>{{ consumerName }}</div>
            </div>
            <div class="text-medium-emphasis text-subtitle-2">
              {{ format(order.date, 'yyyy-MM-dd')  }}
            </div>
          </v-card-title>
        </div>
      </v-card>
    </template>
     <!-- 
    <template v-slot:item.qte="{ item }">
      <v-number-input v-if="proxyOrderlines?.[item.index]?.qte"
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
        v-model="proxyOrderlines[item.index].qte" />
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn color="medium-emphasis" 
        variant="text" 
        size="small" 
        icon="mdi-delete" 
        @click="deleteItem(item)" />
      <DeleteItemModal v-model="deleteDialog" @close="closeDelete" @confirm="deleteItemConfirm" />
    </template>
     -->
  </v-data-table>
  <v-card class="pa-4 pb-2" border="0" elevation="0">
    <div class="total-info d-flex justify-end">
      <div class="info">
        <div class="d-flex align-center" v-for="(value, key) in totalItems"  :key="key">
          <div class="font-weight-medium">
            {{ $t(key) }}:&nbsp;  
          </div> 
          <div :class="{'text-red': key === 'remaining'}">{{ value }} DA</div>
        </div> 
      </div>
    </div>
    <!-- 
    <v-divider class="my-4" />
    <v-card-actions  class="align-start justify-end">
      <v-btn :disabled="!isModified" variant="text" @click="cancelEdit">Cancel</v-btn>
      <v-btn :disabled="!isModified" variant="text" color="blue" @click="confirmEdit">save</v-btn>
    </v-card-actions>
     -->
  </v-card>
  <v-snackbar
    v-model="isSuccess"
    :timeout="2000"
    color="success"
    text="Order was modified succesfully."
  />
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { cloneDeep, isEqual, sum } from 'lodash';
import { format } from 'date-fns';

import products from '@/composables/localStore/useProductStore';
import companies from '@/composables/localStore/useCompanyStore';

import OrderLineForm from '@/views/OrdersView/OrderLineForm.vue'
import DeleteItemModal from './DeleteItemModal.vue'

import { ConsumerType, DocumentType, type Order, type OrderLine } from '@/models/models';

const order = defineModel<Order>('order')
const emits = defineEmits(['close'])

const { t } = useI18n()

const newlineDialog = ref(false)
const deleteDialog = ref(false)

const isSuccess = ref(false)

const proxyOrder = ref<Order | undefined>(cloneDeep(order.value)) 
const selectedOrderline = ref<OrderLine>()

const headers = computed(() => [
 {
    title: t('product'),
    align: 'start',
    sortable: false,
    key: 'product_name',
  },
  { title: t('quantity'), key: 'qte', align: 'start' },
  { title:  t('U.P'), key: 'unity_price' },
  { title: t('total'), key: 'total_price' },
] as any)

const isModified = computed(() => !isEqual(order.value, proxyOrder.value))

const consumerName = computed(() => 
  companies.value.find(e => e.id === order.value?.company)?.name || 
  order.value?.individual?.name)

const consumerType = computed(() => order.value?.company ? ConsumerType.Company : ConsumerType.Individual)

const proxyOrderlines = computed(() => proxyOrder.value?.order_lines)

const items = computed(() => proxyOrderlines.value?.map((o, i) => {
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
    const alreadySelected = proxyOrderlines.value?.map(ol => ol.product_id)
    return !alreadySelected?.includes(e.value)
  })
)
const totalItems = computed(() => {
  return {
    remaining: (order.value?.total_price || 0) - (order.value?.paid_price || 0),
    total: order.value?.total_price,
  }
})

const getProduct = (id: string) => products.value.find(e => e.id == id)

const deleteItem = (item: any) => {
  selectedOrderline.value = proxyOrderlines.value?.[item.index]
  deleteDialog.value = true
}

const deleteItemConfirm = () =>  {
  const index =  proxyOrderlines.value?.findIndex(e => e.id == selectedOrderline.value?.id) || -1
  proxyOrderlines.value?.splice(index, 1)
  closeDelete()
}

const closeDelete = () => {
  selectedOrderline.value = undefined
  deleteDialog.value = false
}

function addOrderline(form: OrderLine, validation: { touch: () => void, invalid: boolean }) {
  validation.touch()
  if(!validation.invalid){
    proxyOrderlines.value?.push(form)
    newlineDialog.value = false
  }
}

function cancelEdit() {
  proxyOrder.value = cloneDeep(order.value)
}

function confirmEdit() {
  if (order.value) {
    order.value = cloneDeep(proxyOrder.value) 
    isSuccess.value = true
  }
}

watch(proxyOrderlines, (orderLines) => {
  if(!proxyOrder.value || !orderLines) 
    return 
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
  min-width: 50px;
  .v-field__append-inner {
    display: none;
  }
}

.total-info {
  text-transform: capitalize;
  font-size: 0.85rem;
  padding: 0 1rem;
}
</style>