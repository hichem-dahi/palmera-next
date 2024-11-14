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
        {{ t('total') }}:
        <span v-html="productSummary(allOrderlines)"></span>
        &mdash;
        <span>
          <span class="text-blue">{{ t('revenue') }}:</span>
          {{ `${sum(filteredOrders.map((o) => o.paid_price))} ${t('DA')}` }},
          <span class="text-green">{{ t('profit') }}:</span>
          {{ `${calculateProfit(allOrderlines)} ${t('DA')}` }}
        </span>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { groupBy, sortBy, sum } from 'lodash'
import { format } from 'date-fns'
import { useI18n } from 'vue-i18n'

import { useGetOrdersApi } from '@/composables/api/orders/useGetOrdersApi'

import { OrderStatus } from '@/models/models'
import type { OrderLineData } from '@/composables/api/orders/useGetOrderApi'

const { t } = useI18n()

const dateRange = ref<Date[]>([])

const getOrdersApi = useGetOrdersApi()
getOrdersApi.params.status = OrderStatus.Confirmed
getOrdersApi.execute()

const filteredOrders = computed(() => getOrdersApi.data.value || [])

const historyItems = computed(() => {
  let groupedSummary = []
  for (const date in groupedOrders.value) {
    const intro = `<span class="text-primary">${format(date, 'dd-MM-yyyy')}</span>&nbsp;&nbsp;`
    const totalBenefits = calculateProfit(allOrderlinesByDate.value[date])
    const totalPaid = sum(groupedOrders.value[date].map((o) => o.paid_price))

    const dateSummaryitem = {
      subtitle: `${intro} ${productSummary(allOrderlinesByDate.value[date])} 
      &mdash; ${t('revenue')}: ${totalPaid} ${t('DA')}, ${t('profit')}: ${totalBenefits} ${t('DA')}`
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
  let productsSummaries: string[] = []
  const orderlinesGrouped = groupBy(orderlines, (o) => o.product_id)

  for (const productId in orderlinesGrouped) {
    const orderlines = orderlinesGrouped[productId]
    const product = orderlinesGrouped[productId][0].product
    const totalQte = sum(orderlines.map((o) => o.qte))

    productsSummaries.push(`${totalQte}m ${product?.name} `)
  }

  return `${productsSummaries.join(', ')}`
}

function calculateProfit(orderlines: OrderLineData[]) {
  let profit = 0
  orderlines.forEach((o) => {
    if (o.unit_cost_price) profit += o.total_price - o.qte * o.unit_cost_price
  })
  return profit
}

watch(
  dateRange,
  (newDateRange) => {
    if (newDateRange?.length === 1) {
      const date1 = new Date(newDateRange[0])
      const date2 = new Date(newDateRange[0])

      date2.setHours(24, 0, 0, 0)
      getOrdersApi.params.dateRange[0] = date1.toISOString()
      getOrdersApi.params.dateRange[1] = date2.toISOString()
    } else if (newDateRange?.length !== 1) {
      getOrdersApi.params.dateRange[0] = newDateRange[0].toISOString()
      getOrdersApi.params.dateRange[1] = newDateRange[newDateRange.length - 1].toISOString()
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
