<template>
  <div class="d-flex align-end ga-6">
    <v-date-input
      variant="underlined"
      hide-details
      v-model="dateRange"
      :label="$t('date')"
      max-width="368"
      min-width="150"
      multiple="range"
    />
    <v-btn
      size="small"
      :disabled="!dateRange.length"
      :to="{
        name: 'sales-statement',
        query: {
          from: dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : null,
          to: dateRange[dateRange.length - 1]
            ? format(dateRange[dateRange.length - 1], 'yyyy-MM-dd')
            : null
        }
      }"
    >
      {{ $t('voir relevé') }}
    </v-btn>
  </div>

  <v-row class="mt-10">
    <v-col sm="12" md="7">
      <v-list lines="three">
        <template v-for="item in historyItems" :key="item.orderId || item.title">
          <v-list-item>
            <v-list-item-title> <div v-html="item.title"></div> </v-list-item-title>
            <v-list-item-subtitle class="pa-2"> {{ item.summary }} </v-list-item-subtitle>
            <v-list-item-subtitle class="pa-4">
              <div v-html="item.total"></div
            ></v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-list>
      <div class="total pa-4">
        <div>{{ $t('total') }}: <span v-html="productSummary(allOrderlines)"></span> <br /></div>
        <div
          class="pa-4"
          v-html="
            `
              &mdash; Total: ${sum(filteredOrders.map((o) => o.total_price))} ${t('DA')}<br />
              &mdash; Payé: ${sum(filteredOrders.map((o) => o.paid_price))} ${t('DA')}<br />
              &mdash; Restant: ${sum(filteredOrders.map((o) => o.total_price - o.paid_price))} ${t('DA')}
            `
          "
        ></div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { groupBy, sortBy, sum } from 'lodash'
import { format, isSameDay } from 'date-fns'
import { useI18n } from 'vue-i18n'

import orders from '@/composables/localStore/useOrdersStore'
import products from '@/composables/localStore/useProductStore'

import { OrderStatus, type OrderLine } from '@/models/models'

const { t } = useI18n()

const dateRange = ref([])

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const dateFilter = dateRange.value.length
      ? dateRange.value.some((selectedDate) => isSameDay(o.date, selectedDate))
      : true
    return dateFilter && o.status === OrderStatus.Confirmed
  })
})

const historyItems = computed(() => {
  let groupedSummary = []
  for (const date in groupedOrders.value) {
    const intro = `<span class="text-primary">${format(date, 'dd-MM-yyyy')}</span>`
    const dateSummaryitem = {
      title: `${intro}`,
      summary: productSummary(allOrderlinesByDate.value[date]),
      total: `
        &mdash; Total: ${sum(groupedOrders.value[date].map((o) => o.total_price))} ${t('DA')}<br>
        &mdash; Payé: ${sum(groupedOrders.value[date].map((o) => o.paid_price))} ${t('DA')}<br>
        &mdash; Restant: ${sum(groupedOrders.value[date].map((o) => o.total_price - o.paid_price))} ${t('DA')}
      `
    }
    groupedSummary.push(dateSummaryitem)
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
  return Object.keys(groupedOrders.value).reduce<OrderLine[]>((acc: OrderLine[], date) => {
    const ordersForDate = groupedOrders.value[date]
    const orderLinesForDate = ordersForDate.reduce<OrderLine[]>(
      (linesAcc, order) => linesAcc.concat(order.order_lines),
      []
    )
    return acc.concat(orderLinesForDate)
  }, [])
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
</script>

<style>
.router-link {
  text-decoration: none;
  color: inherit;
}
</style>
