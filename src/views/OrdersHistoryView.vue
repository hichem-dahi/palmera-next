<template>
  <v-date-input
    variant="underlined"
    hide-details
    v-model="dateRange"
    :label="$t('date')"
    max-width="368"
    min-width="150"
    multiple="range"
  />
  <v-row class="mt-10">
    <v-col sm="12" md="6">
      <v-list density="compact" class="overflow-y" style="max-height: 200px">
        <template v-for="item in historyItems" :key="item.orderId || item.title">
          <v-list-item>
            <v-list-item-subtitle>
              <div v-html="item.subtitle"></div>
            </v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-list>
      <div class="total text-end pa-4">
        {{ $t('total') }}:
        <span v-html="productSummary(allOrderlines)"></span>
        <span> {{ `&mdash; ${sum(filteredOrders.map((o) => o.paid_price))} ${t('DA')}` }}</span>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { groupBy, sortBy, sum } from 'lodash'
import { format } from 'date-fns'
import { useI18n } from 'vue-i18n'

import products from '@/composables/localStore/useProductStore'
import { useGetOrdersApi } from '@/composables/api/orders/useGetOrdersApi'

import { OrderStatus } from '@/models/models'
import type { OrderLineData } from '@/composables/api/orders/useGetOrderApi'

const { t } = useI18n()

const dateRange = ref([])

const getOrdersApi = useGetOrdersApi()
getOrdersApi.params.status = OrderStatus.Confirmed
getOrdersApi.execute()

const filteredOrders = computed(() => getOrdersApi.data.value || [])

const historyItems = computed(() => {
  let groupedSummary = []
  for (const date in groupedOrders.value) {
    const intro = `<span class="text-primary">${format(date, 'dd-MM-yyyy')}</span>&nbsp;&nbsp;`
    const dateSummaryitem = {
      subtitle: `${intro} ${productSummary(allOrderlinesByDate.value[date])} 
      &mdash; ${sum(groupedOrders.value[date].map((o) => o.paid_price))} ${t('DA')}`
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
  const result: Record<string, OrderLineData[]> = {}

  Object.keys(groupedOrders.value).forEach((date) => {
    const ordersForDate = groupedOrders.value[date]
    result[date] = ordersForDate.reduce<OrderLineData[]>((linesAcc, order) => {
      return linesAcc.concat(order.order_lines)
    }, [])
  })

  return result
})

const allOrderlines = computed(() => {
  return Object.keys(groupedOrders.value).reduce<OrderLineData[]>((acc: OrderLineData[], date) => {
    const ordersForDate = groupedOrders.value[date]
    const orderLinesForDate = ordersForDate.reduce<OrderLineData[]>(
      (linesAcc, order) => linesAcc.concat(order.order_lines),
      []
    )
    return acc.concat(orderLinesForDate)
  }, [])
})

function productSummary(orderlines: OrderLineData[]) {
  let productSummaries: string[] = []
  const orderlinesGrouped = groupBy(orderlines, (o) => o.product_id)

  for (const productId in orderlinesGrouped) {
    const orderlines = orderlinesGrouped[productId]
    const product = orderlinesGrouped[productId][0].product
    const totalQte = sum(orderlines.map((o) => o.qte))
    productSummaries.push(`${totalQte}m ${product?.name}`)
  }

  return `${productSummaries.join(', ')}`
}

watch(
  dateRange,
  (newDateRange) => {
    if (newDateRange?.length === 2) {
      getOrdersApi.params.dateRange[0] = newDateRange[0]
      getOrdersApi.params.dateRange[1] = newDateRange[1]
    } else {
      getOrdersApi.params.dateRange = []
    }
    getOrdersApi.execute()
  },
  { deep: true }
)
</script>

<style scoped>
.router-link {
  text-decoration: none;
  color: inherit;
}
</style>
