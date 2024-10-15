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
  <div class="wrapper">
    <div class="table border">
      <OrderTable ref="orderTableRef" v-model:order="order" />
    </div>
    <div class="invoice-actions d-flex flex-column align-start ga-1">
      <v-btn
        variant="text"
        :prepend-icon="mdiCashSync"
        color="green"
        @click="paymentDialog = true"
        >{{ $t('add-payment') }}</v-btn
      >
      <PaymentModal v-model:order="order" v-model:dialog="paymentDialog" />
      <v-btn
        v-if="order?.document_type == DocumentType.DeliveryNote"
        variant="text"
        :prepend-icon="mdiTruckCheck"
        :disabled="!isConfirmable"
        @click="confirmDialog = true"
        target="_blank"
        :text="$t('delivery-note')"
      />
      <v-dialog v-model="deliveryDialog" max-width="400">
        <CreateDelivery
          v-if="order?.delivery"
          v-model:dialog="deliveryDialog"
          v-model:delivery="order.delivery"
          @go-invoice="goDocPage()"
        />
      </v-dialog>
      <v-btn
        v-if="order?.document_type == DocumentType.Invoice"
        variant="text"
        :prepend-icon="mdiReceiptText"
        :disabled="!isConfirmable"
        @click="confirmDialog = true"
        target="_blank"
        :text="$t('invoice')"
      />
      <PaymentMethodModal
        v-model:dialog="paymentMethodDialog"
        v-model:order="order"
        @go-invoice="goDocPage()"
      />
      <v-btn
        v-if="order?.document_type == DocumentType.Voucher"
        variant="text"
        :prepend-icon="mdiInvoice"
        :disabled="!isConfirmable"
        @click="confirmDialog = true"
        target="_blank"
        :text="$t('voucher')"
      />
      <v-btn
        v-if="order?.document_type == DocumentType.Proforma"
        variant="text"
        :prepend-icon="mdiNote"
        :disabled="!isConfirmable"
        @click="confirmDialog = true"
        target="_blank"
        :text="$t('proforma')"
      />
    </div>
  </div>
  <ConfirmModal v-model="confirmDialog" @close="confirmDialog = false" @confirm="goDocPage" />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  mdiCashSync,
  mdiChevronLeft,
  mdiInvoice,
  mdiReceiptText,
  mdiTruckCheck,
  mdiNote
} from '@mdi/js'

import orders from '@/composables/localStore/useOrdersStore'
import { processOrder } from '@/composables/useStockManage'
import { setDocumentIndex } from '@/composables/Orders/setDocumentIndex'

import OrderTable from './OrderTable.vue'
import CreateDelivery from './CreateDelivery.vue'
import PaymentMethodModal from './PaymentMethodModal.vue'
import PaymentModal from './PaymentModal.vue'
import ConfirmModal from './ConfirmModal.vue'

import { DocumentType, OrderState } from '@/models/models'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const paymentDialog = ref(false)
const deliveryDialog = ref(false)
const paymentMethodDialog = ref(false)
const confirmDialog = ref(false)

const order = computed(() => orders.value.find((o) => o.id == route.params.order_id))

const title = computed(() => {
  if (order.value?.document_type == DocumentType.Proforma) {
    return t('preforma')
  } else {
    return `${t('order')} ${t('N°')} ${order.value?.index}`
  }
})

const orderTableRef = ref<InstanceType<typeof OrderTable>>()
const isConfirmable = computed(() => orderTableRef.value?.isConfirmable)

function goDocPage() {
  if (order.value?.document_type === DocumentType.Proforma)
    router.push({
      name: 'preforma',
      params: { order_id: order.value?.id }
    })
  else if (order.value?.company) {
    router.push({
      name: 'invoice',
      params: { order_id: order.value?.id },
      query: { type: order.value.document_type }
    })
    order.value.state = OrderState.Confirmed
    setDocumentIndex(order.value)
    processOrder(order.value)
  } else if (order.value?.individual) {
    router.push({
      name: 'voucher',
      params: { order_id: order.value?.id },
      query: { type: order.value.document_type }
    })
    order.value.state = OrderState.Confirmed
    setDocumentIndex(order.value)
    processOrder(order.value)
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
