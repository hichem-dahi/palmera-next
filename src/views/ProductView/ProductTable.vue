<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-data-table v-if="product" :items="items" :headers="headers" style="background-color: #fefefe">
    <template v-slot:top>
      <v-card class="pb-2 d-flex align-end" color="#F7F7F7" elevation="0">
        <div class="col-1 d-flex justify-space-between w-75">
          <div>
            <v-card-title>
              <div>{{ product?.name }}</div>
            </v-card-title>
            <v-card-subtitle class="text-body-2">
              <span>{{ $t('quantity') }}:</span>
              <span>&nbsp;{{ product?.qte }}</span
              ><br />

              <span>{{ $t('code') }}:</span>
              <span>&nbsp;{{ product?.code }}</span
              ><br />

              <span>{{ $t('U.P') }}:</span>
              <span>&nbsp;{{ product?.price }} DA</span>
            </v-card-subtitle>
          </div>
        </div>
        <div class="col-2">
          <v-btn variant="text" color="primary" size="small" @click="modifyStockDialog = true">
            {{ $t('modify-stock') }}
          </v-btn>
          <ModifyStock v-model="modifyStockDialog" :product="product" />
        </div>
      </v-card>
    </template>
    <template v-slot:item.order="{ item }">
      <v-btn
        v-if="item.order"
        variant="text"
        size="small"
        color="light-blue"
        :icon="mdiOpenInNew"
        :to="{ name: 'order', params: { order_id: item.order } }"
      >
      </v-btn>
    </template>
    <template v-slot:item.date="{ item }">
      <span>{{ format(item.date, 'yyyy-MM-dd p') }}</span>
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { format } from 'date-fns'

import { mdiOpenInNew } from '@mdi/js'

import products from '@/composables/localStore/useProductStore'
import stock from '@/composables/localStore/useStockStore'

import ModifyStock from './ModifyStock.vue'

const emits = defineEmits(['close'])
const route = useRoute()

const { t } = useI18n()

const modifyStockDialog = ref(false)

const product = computed(() => products.value.find((p) => p.id == route.params.product_id))
const stockMovements = computed(() => stock.value.filter((s) => s.product_id == product.value?.id))

const items = computed(() =>
  stockMovements.value
    ?.map((s, i) => {
      return {
        id: s.id,
        index: i,
        date: s.date,
        qte: s.qte_change,
        unity_price: product.value?.price,
        order: s.order_id
      }
    })
    .reverse()
)

const headers = computed(() => [
  {
    title: t('date'),
    align: 'start',
    sortable: false,
    key: 'date'
  },
  { title: t('quantity'), key: 'qte', align: 'start' },
  { title: `${t('U.P')} (DA)`, key: 'unity_price' },
  { title: ``, key: 'order' }
]) as any
</script>
