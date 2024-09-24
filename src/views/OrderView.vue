<template>    
  <v-btn 
    class="my-5" 
    size="small" 
    color="grey" 
    variant="text" 
    prepend-icon="mdi-chevron-left" 
    @click="$router.go(-1)" 
    text="back" />
  <div class="wrapper">
    <div class="table border">
      <OrderTable :order="order" />
    </div>          
    <div class="invoice-actions d-flex flex-column align-start">
      <v-btn 
        variant="text" 
        prepend-icon="mdi-cash-sync"  
        color="green" 
        @click="paymentDialog = true">add payment</v-btn>
      <PaymentModal v-model:order="order" v-model:dialog="paymentDialog" />
      <v-btn 
        variant="text" 
        prepend-icon="mdi-truck-check" 
        @click="goInvoicePage(InvoiceType.DeliveryNote)"
        target="_blank"
        text="Delivery note" />
        <v-dialog v-model="deliveryDialog" max-width="400">
          <CreateDelivery 
            v-if="order" 
            v-model:dialog="deliveryDialog" 
            v-model:order="order" 
            @go-invoice="goInvoicePage()" />
        </v-dialog>
      <v-btn 
        variant="text" 
        prepend-icon="mdi-receipt-text" 
        @click="goInvoicePage(InvoiceType.Receipt)"
        target="_blank"
        text="invoice" />
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
import { processOrder } from '@/composables/useStockManage';

import OrderTable from './OrdersView/OrderTable.vue';
import CreateDelivery from './OrdersView/CreateDelivery.vue';
import PaymentMethodModal from './OrdersView/PaymentMethodModal.vue'
import PaymentModal from './OrdersView/PaymentModal.vue';

import { InvoiceType } from '@/models/models';

const route = useRoute()
const router = useRouter()

const paymentDialog = ref(false)
const deliveryDialog = ref(false)
const paymentMethodDialog = ref(false)
const selectedInvoiceType = ref()

const order = computed(() => orders.value.find(o => o.id == route.params.order_id))

function goInvoicePage(type?: InvoiceType) {
  if (type) {
    selectedInvoiceType.value = type
  }
  if (!order.value?.payment_method) { 
    paymentMethodDialog.value = true 
    return
  }
  if (!order.value?.delivery && 
    (selectedInvoiceType.value == InvoiceType.DeliveryNote)) {
    deliveryDialog.value = true
    return
  }
  processOrder(order.value)
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
}

.table {
  min-width: 70%;
}
</style>
