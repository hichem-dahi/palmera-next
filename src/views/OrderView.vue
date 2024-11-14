<template>
  <v-btn
    class="mt-3"
    size="small"
    color="grey"
    variant="text"
    :prepend-icon="mdiChevronLeft"
    @click="$router.go(-1)"
    :text="$t('back')"
  />
  <div class="text-h5 pa-4 my-4">{{ title }}</div>
  <div class="wrapper" v-if="order">
    <div class="table border">
      <OrderTable ref="orderTableRef" v-model:order="order" />
    </div>
    <div class="invoice-actions d-flex flex-column align-start ga-1">
      <v-btn
        variant="text"
        :prepend-icon="mdiCashSync"
        :disabled="isCancelled"
        @click="paymentDialog = true"
      >
        {{ $t('payments') }}
      </v-btn>

      <DocumentButtons
        v-if="order"
        :order="order"
        :isConfirmable="isConfirmable"
        @go-doc-page="processOrder"
      />

      <v-btn
        v-if="order?.status === OrderStatus.Confirmed"
        variant="text"
        :prepend-icon="mdiCancel"
        @click="cancelDialog = true"
        :text="$t('cancel')"
      />
      <PaymentsCard v-if="order.payments.length" :order="order" :payments="order.payments" />
    </div>
    <PaymentMethodModal
      v-model:dialog="paymentMethodDialog"
      v-model:order="order"
      @go-invoice="processOrder()"
    />
    <PaymentModal
      v-model:order="order"
      v-model:dialog="paymentDialog"
      :is-loading="insertPaymentApi.isLoading.value"
      @confirm="addPayment"
    />
    <ConfirmModal
      v-model="confirmDialog"
      :is-loading="updateOrderApi.isLoading.value"
      @confirm="processOrder"
    />
    <CancelModal
      v-model="cancelDialog"
      :is-loading="updateOrderApi.isLoading.value"
      @confirm="cancelOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { mdiCashSync, mdiChevronLeft, mdiCancel } from '@mdi/js'

import { generateStockMovementsForOrder, restoreStockFromOrder } from '@/composables/useStockManage'

import { useGetOrderApi } from '@/composables/api/orders/useGetOrderApi'
import { useUpdateOrderApi } from '@/composables/api/orders/useUpdateOrderApi'
import { useInsertStockMovementsApi } from '@/composables/api/stockMovements/useInsertStockMovementsApi'
import { useInsertPaymentsApi } from '@/composables/api/payments/useInsertPaymentApi'

import OrderTable from './OrderView/OrderTable.vue'
import CreateDelivery from './OrdersView/CreateDelivery.vue'
import PaymentMethodModal from './OrdersView/PaymentMethodModal.vue'
import PaymentModal from './OrderView/PaymentModal.vue'
import ConfirmModal from './OrderView/ConfirmModal.vue'
import CancelModal from './OrdersView/CancelModal.vue'
import PaymentsCard from './OrderView/PaymentsCard.vue'
import DocumentButtons from './OrderView/DocumentButtons.vue'

import { DocumentType, OrderStatus, StockMovementType } from '@/models/models'
import type { TablesInsert } from '@/types/database.types'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const getOrderApi = useGetOrderApi()
const updateOrderApi = useUpdateOrderApi()
const insertStockMovementsApi = useInsertStockMovementsApi()
const insertPaymentApi = useInsertPaymentsApi()

const paymentDialog = ref(false)
const deliveryDialog = ref(false)
const paymentMethodDialog = ref(false)
const confirmDialog = ref(false)
const cancelDialog = ref(false)

const orderTableRef = ref<InstanceType<typeof OrderTable>>()
const order = ref(getOrderApi.data.value)

onMounted(() => {
  if (route.params.order_id) {
    getOrderApi.orderId.value = route.params.order_id as string
    getOrderApi.execute()
  }
})

const title = computed(() => {
  if (order.value?.document_type == DocumentType.Proforma) {
    return t('preforma')
  } else {
    return `${t('order')} ${t('N°')} ${order.value?.index}`
  }
})

const isConfirmable = computed(() => orderTableRef.value?.isConfirmable || false)

const isCancelled = computed(() => order.value?.status === OrderStatus.Cancelled)
const isPending = computed(() => order.value?.status === OrderStatus.Pending)

function processOrder() {
  if (isPending.value && !confirmDialog.value) {
    confirmDialog.value = true
    return
  }
  if (isPending.value) {
    insertStockMovementsApi.type.value = StockMovementType.Sub
    insertStockMovementsApi.form.value = generateStockMovementsForOrder(order.value!)
    insertStockMovementsApi.execute()
    return
  }
  goDocPage()
}

function goDocPage() {
  const routeName = getRouteNameByDocumentType(order.value!.document_type)
  if (routeName) {
    router.push({
      name: routeName,
      params: { order_id: order.value?.id },
      query: { type: order.value!.document_type }
    })
  }
}

function getRouteNameByDocumentType(documentType: DocumentType) {
  switch (documentType) {
    case DocumentType.Proforma:
      return 'preforma'
    case DocumentType.Invoice:
      return 'invoice'
    case DocumentType.Voucher:
      return 'voucher'
    case DocumentType.DeliveryNote:
      return order.value?.client_id ? 'invoice' : 'voucher'
    default:
      return null
  }
}

function cancelOrder() {
  insertStockMovementsApi.type.value = StockMovementType.Add
  insertStockMovementsApi.form.value = restoreStockFromOrder(order.value!)
  insertStockMovementsApi.execute()
}

function addPayment(payment: TablesInsert<'payments'>) {
  insertPaymentApi.form.value = payment
  insertPaymentApi.execute()
}

watch(
  () => getOrderApi.isSuccess.value,
  (isSuccess) => {
    if (isSuccess && getOrderApi.data.value) {
      order.value = getOrderApi.data.value
    }
  }
)

watch(
  () => insertStockMovementsApi.isSuccess.value,
  (isSuccess) => {
    if (isSuccess && insertStockMovementsApi.type.value === StockMovementType.Sub) {
      updateOrderApi.form.value = { id: order.value?.id, status: OrderStatus.Confirmed }
      updateOrderApi.execute()
    } else if (isSuccess && insertStockMovementsApi.type.value === StockMovementType.Add) {
      updateOrderApi.form.value = {
        id: order.value?.id,
        paid_price: 0,
        status: OrderStatus.Cancelled
      }
      updateOrderApi.execute()
    }
  }
)

watch(
  () => updateOrderApi.isSuccess.value,
  (isSuccess) => {
    if (!isSuccess) return

    const form = updateOrderApi.form.value
    const status = form?.status

    order.value = updateOrderApi.data.value

    if (form?.paid_price) {
      paymentDialog.value = false
      return
    }

    if (status === OrderStatus.Confirmed) {
      confirmDialog.value = false
      goDocPage()
      return
    }

    if (status === OrderStatus.Cancelled) {
      cancelDialog.value = false
      return
    }
  }
)

watch(
  () => insertPaymentApi.isSuccess.value,
  (isSuccess) => {
    if (isSuccess && insertPaymentApi.data.value?.amount) {
      updateOrderApi.form.value = {
        id: order.value?.id,
        paid_price: (order.value?.paid_price || 0) + insertPaymentApi.data.value?.amount
      }
      updateOrderApi.execute()
    }
  }
)
</script>
<style>
.wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 3rem;
}

.table {
  min-width: 60%;
  height: min-content;
}
</style>
