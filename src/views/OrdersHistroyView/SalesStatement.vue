<template>
  <div>
    <!-- Back Button -->
    <v-btn
      class="mt-3 no-print"
      size="small"
      color="grey"
      variant="text"
      :prepend-icon="mdiChevronLeft"
      @click="$router.go(-1)"
    >
      {{ $t('back') }}
    </v-btn>

    <div class="statement-wrapper">
      <!-- Title -->

      <div class="statement">
        <h2 class="mt-4">Relève des ventes</h2>
        <h6>de {{ dateRange[0] }} à {{ dateRange[1] }}</h6>

        <!-- Sales Table -->
        <table cellpadding="10" cellspacing="0" width="100%">
          <thead>
            <tr>
              <th>{{ $t('date') }}</th>
              <th>{{ $t('résume') }}</th>
              <th>{{ $t('total') }} (DA)</th>
              <th>{{ $t('payé') }} (DA)</th>
              <th>{{ $t('remaining') }} (DA)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in historyItems" :key="item.date">
              <td>{{ format(item.date, 'dd-MM-yyyy') }}</td>
              <td class="text-wrap text-body-2">
                <span>
                  {{ item.productSummary }}
                </span>
              </td>
              <td>{{ formatPrice(item.total) }}</td>
              <td>{{ formatPrice(item.paid) }}</td>
              <td>{{ formatPrice(item.remaining) }}</td>
            </tr>
          </tbody>
        </table>
        <h3 class="mt-10">Total</h3>
        <table class="table">
          <thead>
            <tr>
              <th>{{ $t('résume') }}</th>
              <th>{{ $t('total') }} (DA)</th>
              <th>{{ $t('total payé (DA)') }}</th>
              <th>{{ $t('total restant (DA)') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-wrap text-body-2">
                <span> {{ productSummary(allOrderlines) }} </span>
              </td>
              <td>
                {{ `${sum(filteredOrders.map((o) => o.total_price))}` }}
              </td>
              <td>
                {{ `${sum(filteredOrders.map((o) => o.paid_price))}` }}
              </td>
              <td>
                {{ `${sum(filteredOrders.map((o) => o.total_price - o.paid_price))}` }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="actions no-print">
    <v-btn class="mr-5" @click="print()">print</v-btn>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { groupBy, sortBy, sum } from 'lodash'
import { endOfDay, format, isValid, isWithinInterval, parseISO, startOfDay } from 'date-fns'
import { formatPrice } from '@/helpers/helpers'
import { mdiChevronLeft } from '@mdi/js'

import orders from '@/composables/localStore/useOrdersStore'
import products from '@/composables/localStore/useProductStore'

import { OrderStatus, type OrderLine } from '@/models/models'

const route = useRoute()

const dateRange = ref<string[]>([])

onMounted(() => {
  const { from, to } = route.query
  if (from && to && isValid(parseISO(from as string)) && isValid(parseISO(to as string))) {
    dateRange.value = [from as string, to as string]
  }
})

const filteredOrders = computed(() => {
  if (dateRange.value.length === 2) {
    const [from, to] = dateRange.value.map((date, index) =>
      index === 0 ? startOfDay(parseISO(date)) : endOfDay(parseISO(date))
    ) // Adjust from/to to cover the entire days

    return orders.value.filter(
      (o) =>
        isWithinInterval(parseISO(o.date), { start: from, end: to }) &&
        o.status === OrderStatus.Confirmed
    )
  }
  return orders.value.filter((o) => o.status === OrderStatus.Confirmed)
})

const historyItems = computed(() => {
  let groupedSummary = []

  for (const date in groupedOrders.value) {
    const allOrderLines = allOrderlinesByDate.value[date]
    const ordersForDate = groupedOrders.value[date]

    const dateSummaryItem = {
      date, // The current date
      productSummary: productSummary(allOrderLines), // Summary of products
      total: sum(allOrderLines.map((o) => o.total_price)) || 0,
      paid: sum(ordersForDate.map((o) => o.paid_price)) || 0, // Total paid
      remaining: sum(ordersForDate.map((o) => o.total_price - o.paid_price)) || 0 // Remaining balance
    }
    debugger
    groupedSummary.push(dateSummaryItem)
  }

  return groupedSummary
})

const groupedOrders = computed(() => {
  return groupBy(sortBy(filteredOrders.value, (t) => new Date(t.date)).reverse(), (t) =>
    new Date(t.date).toDateString()
  )
})

const allOrderlinesByDate = computed(() => {
  const result: Record<string, OrderLine[]> = {}

  Object.keys(groupedOrders.value).forEach((date) => {
    const ordersForDate = groupedOrders.value[date]
    result[date] = ordersForDate.reduce<OrderLine[]>((linesAcc, order) => {
      return linesAcc.concat(order.order_lines)
    }, [])
  })

  return result
})

const allOrderlines = computed(() => {
  return filteredOrders.value.flatMap((o) => o.order_lines)
})

function productSummary(orderlines: OrderLine[]) {
  let productSummaries: string[] = []
  const orderlinesGrouped = groupBy(orderlines, (o) => o.product_id)

  for (const productId in orderlinesGrouped) {
    const product = getProduct(productId)
    const totalQte = sum(orderlinesGrouped[productId].map((o) => o.qte))
    productSummaries.push(`${totalQte}m ${product?.name}`)
  }

  return productSummaries.join(', ')
}

const getProduct = (id: string) => products.value.find((e) => e.id == id)

function print() {
  window.print()
}
</script>
<style>
.statement {
  text-transform: capitalize;
  width: 210mm; /* A4 paper width */
  height: calc(297mm - 20mm); /* A4 height minus top and bottom margins (10mm each) */
  margin: 10mm auto; /* Add 10mm margin on top and bottom, auto for centering */
  white-space: nowrap;

  @media (min-width: 1024px) {
    max-width: 70%;
  }
}

@media print {
  .statement {
    width: 210mm; /* A4 width */
    height: calc(297mm - 10mm); /* A4 height minus margins for print */
    margin: auto; /* Keep margins on print */
    transform: none; /* Remove scaling for print */
    max-width: none;
    page-break-inside: avoid; /* Prevent breaking inside the statement */
  }

  .no-print {
    display: none;
  }
}

.actions {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 2rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

table th {
  background-color: #f4f4f4;
  font-weight: bold;
  text-align: center;
}
</style>
