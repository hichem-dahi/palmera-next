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
        @go-doc-page="goDocPage"
      />

      <v-btn
        v-if="order?.status === OrderStatus.Confirmed"
        variant="text"
        :prepend-icon="mdiCancel"
        @click="cancelDialog = true"
        :text="$t('cancel')"
      />
      <PaymentsCard v-if="orderPayments.length" :order="order" :payments="orderPayments" />
    </div>
  </div>
  <PaymentMethodModal
    v-model:dialog="paymentMethodDialog"
    v-model:order="order"
    @go-invoice="goDocPage()"
  />
  <PaymentModal v-model:order="order" v-model:dialog="paymentDialog" />
  <ConfirmModal v-model="confirmDialog" @close="confirmDialog = false" @confirm="goDocPage" />
  <CancelModal v-model="cancelDialog" @close="cancelDialog = false" @confirm="cancelOrder" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { mdiCashSync, mdiChevronLeft, mdiCancel } from '@mdi/js'

import orders from '@/composables/localStore/useOrdersStore'
import { processOrder, reverseOrder } from '@/composables/useStockManage'
import { setDocumentIndex } from '@/composables/Orders/setDocumentIndex'
import payments from '@/composables/localStore/usePaymentsStore'

import OrderTable from './OrderView/OrderTable.vue'
import CreateDelivery from './OrdersView/CreateDelivery.vue'
import PaymentMethodModal from './OrdersView/PaymentMethodModal.vue'
import PaymentModal from './OrderView/PaymentModal.vue'
import ConfirmModal from './OrderView/ConfirmModal.vue'
import CancelModal from './OrdersView/CancelModal.vue'
import PaymentsCard from './OrderView/PaymentsCard.vue'
import DocumentButtons from './OrderView/DocumentButtons.vue'

import { DocumentType, OrderStatus } from '@/models/models'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const orderTableRef = ref<InstanceType<typeof OrderTable>>()

const paymentDialog = ref(false)
const deliveryDialog = ref(false)
const paymentMethodDialog = ref(false)
const confirmDialog = ref(false)
const cancelDialog = ref(false)

const order = computed(() => orders.value.find((o) => o.id == route.params.order_id))

const orderPayments = computed(() =>
  payments.value.filter((p) => order.value?.payments_ids.includes(p.id))
)

const title = computed(() => {
  if (order.value?.document_type == DocumentType.Proforma) {
    return t('preforma')
  } else {
    return `${t('order')} ${t('N°')} ${order.value?.index}`
  }
})

const isConfirmable = computed(() => orderTableRef.value?.isConfirmable)

const isCancelled = computed(() => order.value?.status === OrderStatus.Cancelled)
const isPending = computed(() => order.value?.status === OrderStatus.Pending)

function goDocPage() {
  if (isPending.value && !confirmDialog.value) {
    confirmDialog.value = true
    return
  }

  if (order.value) {
    if (isPending.value) {
      setDocumentIndex(order.value)
      processOrder(order.value)
      order.value.status = OrderStatus.Confirmed
    }

    const routeName = getRouteNameByDocumentType(order.value.document_type)
    if (routeName) {
      router.push({
        name: routeName,
        params: { order_id: order.value?.id },
        query: { type: order.value.document_type }
      })
    }
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
    default:
      return null
  }
}

function cancelOrder() {
  if (order.value) {
    order.value.status = OrderStatus.Cancelled
    order.value.paid_price = 0
    reverseOrder(order.value)
    cancelDialog.value = false
  }
}
</script>
<style>
.wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 3rem;
}

.table {
  min-width: 70%;
}
</style>
