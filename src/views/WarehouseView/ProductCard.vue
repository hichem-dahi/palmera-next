<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-card
    class="pb-4"
    hover
    :title="product?.name"
    :to="{ name: 'product', params: { product_id: product?.id } }"
  >
    <v-card-subtitle class="text-caption">
      <span class="font-weight-bold">{{ $t('code') }}:</span>
      <span>&nbsp;{{ product?.code }}</span
      ><br />
      <span class="font-weight-bold">{{ $t('quantity') }}:</span>
      <span>&nbsp;{{ product?.qte }}</span
      ><br />
      <span class="font-weight-bold">{{ $t('U.P') }}:</span>
      <span>&nbsp;{{ product?.price }} DA</span>
    </v-card-subtitle>

    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            @click.prevent
            variant="text"
            size="small"
            :icon="mdiDotsVertical"
          />
        </template>
        <v-list density="compact">
          <v-list-item density="compact" @click="deleteDialog = true">
            <v-list-item-title>{{ $t('delete') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <DeleteItemModal
      v-model="deleteDialog"
      @confirm="deleteProduct"
      @close="deleteDialog = false"
    />
  </v-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { mdiDotsVertical } from '@mdi/js'

import products from '@/composables/localStore/useProductStore'

import DeleteItemModal from '../OrdersView/DeleteItemModal.vue'

import type { Product } from '@/models/models'

const product = defineModel<Product>()

const deleteDialog = ref(false)

function deleteProduct() {
  const index = products.value.indexOf(product.value!)
  products.value.splice(index, 1)
}
</script>
