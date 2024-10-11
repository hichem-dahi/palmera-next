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
    <v-col sm="12" md="4">
      <v-list density="compact" class="overflow-y" style="max-height: 200px">
        <template v-for="item in historyItems" :key="item.orderId || item.title">
          <v-list-item>
            <v-list-item-subtitle>
              <div v-html="item.subtitle"></div>
            </v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-list>
      <div class="total text-end pa-4 font-italic" v-html="productSummary(allOrderlines)"></div>
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

import type { OrderLine } from '@/models/models'

const { t } = useI18n()

const dateRange = ref([])

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const dateFilter = dateRange.value.length
      ? dateRange.value.some((selectedDate) => isSameDay(o.date, selectedDate))
      : true
    return dateFilter
  })
})

const historyItems = computed(() => {
  let groupedSummary: any[] = []
  for (const date in groupedOrders.value) {
    const intro = `<span class="text-primary">${format(date, 'dd-MM-yyyy')}</span>&nbsp;&nbsp;`
    const dateSummary = {
      subtitle: `${intro} ${productSummary(allOrderlinesByDate.value[date])}`
    }
    groupedSummary.push(dateSummary)
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
  const totalPrice = sum(orderlines.map((o) => o.total_price))

  for (const productId in orderlinesGrouped) {
    const product = getProduct(productId)
    const totalQte = sum(orderlinesGrouped[productId].map((o) => o.qte))
    productSummaries.push(`${totalQte}m ${product?.name}`)
  }

  return `${productSummaries.join(', ')} &mdash; ${totalPrice} ${t('DA')}`
}

const getProduct = (id: string) => products.value.find((e) => e.id == id)
</script>

<style scoped>
.router-link {
  text-decoration: none;
  color: inherit;
}
</style>
