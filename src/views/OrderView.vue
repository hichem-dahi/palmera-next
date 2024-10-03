<template>    
  <v-btn 
    class="mt-3" 
    size="small" 
    color="grey" 
    variant="text" 
    prepend-icon="mdi-chevron-left" 
    @click="$router.go(-1)" 
    :text="$t('back')" />
  <div class="text-h5 pa-4 my-4">{{ $t('order') }} {{ $t('N°') }} {{ order?.index  }}</div>
  <div class="wrapper">
    <div class="table border">
      <OrderTable :order="order" />
    </div>          
    <div class="invoice-actions d-flex flex-column align-start ga-1">
      <v-btn 
        variant="text" 
        prepend-icon="mdi-cash-sync"  
        color="green" 
        size="small"
        @click="paymentDialog = true">{{ $t('add-payment') }}</v-btn>
      <PaymentModal v-model:order="order" v-model:dialog="paymentDialog" />
      <v-btn v-if="documentType == DocumentType.DeliveryNote"
        variant="text" 
        prepend-icon="mdi-truck-check" 
        size="small"
        @click="goInvoicePage(DocumentType.DeliveryNote)"
        target="_blank"
        :text="$t('delivery-note')" />
        <v-dialog v-model="deliveryDialog" max-width="400">
          <CreateDelivery 
            v-if="order" 
            v-model:dialog="deliveryDialog" 
            v-model:order="order" 
            @go-invoice="goInvoicePage()" />
        </v-dialog>
      <v-btn v-if="documentType == DocumentType.Invoice"
        variant="text" 
        prepend-icon="mdi-receipt-text" 
        size="small"
        @click="goInvoicePage(DocumentType.Invoice)"
        target="_blank"
        :text="$t('invoice')" />
        <PaymentMethodModal 
          v-model:dialog="paymentMethodDialog" 
          v-model:order="order" 
          @go-invoice="goInvoicePage()" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import orders from '@/composables/localStore/useOrdersStore';

import OrderTable from './OrdersView/OrderTable.vue';
import CreateDelivery from './OrdersView/CreateDelivery.vue';
import PaymentMethodModal from './OrdersView/PaymentMethodModal.vue'
import PaymentModal from './OrdersView/PaymentModal.vue';

import { ConsumerType, DocumentType } from '@/models/models';

const route = useRoute()
const router = useRouter()

const paymentDialog = ref(false)
const deliveryDialog = ref(false)
const paymentMethodDialog = ref(false)
const selectedInvoiceType = ref()

const order = computed(() => orders.value.find(o => o.id == route.params.order_id))

const documentType = computed(() => order.value?.delivery ? DocumentType.DeliveryNote : DocumentType.Invoice)
const consumerType = computed(() => order.value?.company ? ConsumerType.Company : ConsumerType.Individual)

function goInvoicePage(type?: DocumentType) {
  if (type) {
    selectedInvoiceType.value = type
  }
  if (!order.value?.payment_method && consumerType.value == ConsumerType.Company) { 
    paymentMethodDialog.value = true 
    return
  }
  if (!order.value?.delivery && 
    (selectedInvoiceType.value == DocumentType.DeliveryNote)) {
    deliveryDialog.value = true
    return
  }
  router.push({  
    name: 'invoice', 
    params: { order_id: order.value?.id }, 
    query: { type: selectedInvoiceType.value }
  })
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
