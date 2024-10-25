<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table
    v-if="order"
    :items="items"
    :headers="headers"
    style="background-color: #fefefe"
    hide-default-footer
  >
    <template v-slot:top>
      <v-card class="pb-2 d-flex align-center" color="#F7F7F7" elevation="0">
        <div class="col-1 d-flex justify-space-between w-75">
          <v-card-title>
            <div class="text-medium-emphasis text-subtitle-2">
              <div>{{ consumerName }}</div>
            </div>
            <div class="text-medium-emphasis text-subtitle-2">
              {{ format(order.date, 'yyyy-MM-dd') }}
            </div>
          </v-card-title>
        </div>
        <v-divider class="mx-4" inset vertical />
        <div class="col-2">
          <v-dialog v-if="isPending" v-model="newlineDialog" max-width="400">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="text"
                size="small"
                :append-icon="mdiPlus"
                color="primary"
                :disabled="!productsItems.length"
                v-bind="props"
              >
                New product
              </v-btn>
            </template>
            <v-card>
              <v-card-title>{{ $t('add-product') }}</v-card-title>
              <v-card-text>
                <OrderLineForm :is-new="true" :products-items="productsItems">
                  <template v-slot:actions="{ form, validation }">
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn variant="text" color="blue" @click="addOrderline(form, validation)">
                        {{ $t('add') }}
                      </v-btn>
                    </v-card-actions>
                  </template>
                </OrderLineForm>
              </v-card-text>
            </v-card>
          </v-dialog>
          <div>
            <v-chip v-if="isConfirmed" variant="tonal" color="green">{{ $t('confirmed') }}</v-chip>
            <v-chip v-else-if="isCancelled" variant="tonal" color="red">
              {{ $t('cancelled') }}
            </v-chip>
          </div>
        </div>
      </v-card>
    </template>
    <template v-if="isPending" v-slot:item.qte="{ item }">
      <v-number-input
        v-if="isNumber(proxyOrderlines?.[item.index]?.qte)"
        class="number-input"
        type="number"
        width="150"
        hide-details
        inset
        variant="outlined"
        density="compact"
        :min="0"
        :suffix="`/${item.product?.qte}`"
        :error="proxyOrderlines[item.index].qte! > item.product?.qte!"
        counter="50"
        v-model="proxyOrderlines[item.index].qte"
      />
    </template>
    <template v-if="isPending" v-slot:item.actions="{ item }">
      <v-btn
        color="medium-emphasis"
        variant="text"
        size="small"
        :icon="mdiDelete"
        @click="deleteItem(item)"
      />
      <DeleteItemModal v-model="deleteDialog" @close="closeDelete" @confirm="deleteItemConfirm" />
    </template>
  </v-data-table>
  <v-card class="pa-4 pb-2" elevation="0">
    <div class="total-info d-flex justify-end">
      <div class="info">
        <div v-for="(value, key) in totalItems" :key="key">
          <div>
            <span class="font-weight-medium"> {{ $t(key) }}:&nbsp; </span>
            <span :class="{ 'text-red': key === 'remaining' }">{{ value }} DA</span>
          </div>
        </div>
      </div>
    </div>
    <v-card-actions v-if="isPending" class="justify-end mt-6">
      <v-btn :disabled="!isModified" variant="text" size="small" @click="cancelEdit">
        {{ $t('cancel') }}
      </v-btn>
      <v-btn :disabled="!isModfiable" variant="text" color="blue" size="small" @click="confirmEdit">
        {{ $t('save') }}
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-snackbar
    v-model="isSuccess"
    :timeout="2000"
    color="success"
    text="Order was modified succesfully."
  />
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'
import { cloneDeep, isEqual, isNumber, sum } from 'lodash'
import { mdiDelete, mdiPlus } from '@mdi/js'

import products from '@/composables/localStore/useProductStore'
import companies from '@/composables/localStore/useCompanyStore'
import orders from '@/composables/localStore/useOrdersStore'

import OrderLineForm from '@/views/OrdersView/OrderLineForm.vue'
import DeleteItemModal from './DeleteItemModal.vue'

import { ConsumerType, OrderStatus, type Order, type OrderLine } from '@/models/models'

const order = defineModel<Order>('order')
const emits = defineEmits(['close'])

const { t } = useI18n()

const newlineDialog = ref(false)
const deleteDialog = ref(false)
const isSuccess = ref(false)
const proxyOrder = ref<Order | undefined>(cloneDeep(order.value))
const selectedOrderline = ref<OrderLine>()

const headers = computed(
  () =>
    [
      {
        title: t('product'),
        align: 'start',
        sortable: false,
        key: 'product_name'
      },
      { title: t('quantity'), key: 'qte', align: 'start' },
      { title: t('U.P'), key: 'unit_price' },
      { title: t('total'), key: 'total_price' },
      { title: '', key: 'actions' }
    ] as any
)

const isModified = computed(() => !isEqual(order.value, proxyOrder.value))
const isModfiable = computed(() => isModified.value && isValidOrderlines.value)

const isValidOrderlines = computed(() =>
  proxyOrderlines.value?.every((o) => o.qte! <= getProduct(o.product_id)?.qte!)
)

const consumerName = computed(
  () =>
    companies.value.find((e) => e.id === order.value?.company)?.name ||
    order.value?.individual?.name
)

const consumerType = computed(() =>
  order.value?.company ? ConsumerType.Company : ConsumerType.Individual
)

const isConfirmed = computed(() => order.value?.status === OrderStatus.Confirmed)
const isCancelled = computed(() => order.value?.status === OrderStatus.Cancelled)
const isPending = computed(() => order.value?.status === OrderStatus.Pending)

const isConfirmable = computed(() => !isModified.value && isValidOrderlines.value)

const proxyOrderlines = computed(() => proxyOrder.value?.order_lines)

const totalItems = computed(() => {
  return {
    remaining: (order.value?.total_price || 0) - (order.value?.paid_price || 0),
    total: order.value?.total_price
  }
})

const items = computed(() =>
  proxyOrder.value?.order_lines.map((o, i) => {
    const product = getProduct(o.product_id)
    return {
      id: o.id,
      index: i,
      product: product,
      product_name: product?.name,
      qte: o.qte,
      unit_price: o.unit_price,
      total_price: o.total_price
    }
  })
)

const productsItems = computed(() =>
  products.value
    .map((c) => {
      return { title: c.name, value: c.id }
    })
    .filter((e) => {
      const alreadySelected = proxyOrder.value?.order_lines.map((ol) => ol.product_id)
      return !alreadySelected?.includes(e.value)
    })
)

const getProduct = (id: string) => products.value.find((e) => e.id == id)

const deleteItem = (item: any) => {
  selectedOrderline.value = proxyOrderlines.value?.[item.index]
  deleteDialog.value = true
}

const deleteItemConfirm = () => {
  const index = proxyOrderlines.value?.findIndex((e) => e.id === selectedOrderline.value?.id)
  if (isNumber(index)) {
    proxyOrderlines.value?.splice(index, 1)
    closeDelete()
  }
}

const closeDelete = () => {
  selectedOrderline.value = undefined
  deleteDialog.value = false
}

function addOrderline(form: OrderLine, validation: { touch: () => void; invalid: boolean }) {
  validation.touch()
  if (!validation.invalid) {
    proxyOrder.value?.order_lines.push(form)
    newlineDialog.value = false
  }
}

function cancelEdit() {
  proxyOrder.value = cloneDeep(order.value)
}

function confirmEdit() {
  if (order.value && proxyOrder.value) {
    const orderIndex = orders.value.findIndex((o) => o.id === order.value?.id)
    if (orderIndex !== -1) {
      orders.value[orderIndex] = cloneDeep(proxyOrder.value)
    }
    isSuccess.value = true
  }
}

watch(
  proxyOrderlines,
  (orderLines) => {
    if (!proxyOrder.value || !orderLines) return
    proxyOrder.value.total_price = sum(
      orderLines.map((e) => {
        e.total_price = Number(e.qte) * Number(e.unit_price)
        return e.total_price
      })
    )
  },
  {
    deep: true
  }
)

defineExpose({
  isConfirmable
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
