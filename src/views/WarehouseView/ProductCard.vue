<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-card
    v-if="product"
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
      <div v-if="product?.cost_price">
        <span class="font-weight-bold">{{ $t('C.P') }}:</span>
        <span>&nbsp;{{ product?.cost_price }} DA</span>
      </div>
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
          <v-list-item density="compact" @click="editDialog = true">
            <v-list-item-title>{{ $t('modify') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <DeleteItemModal
      v-model="deleteDialog"
      @confirm="deleteProduct"
      @close="deleteDialog = false"
    />
    <v-dialog max-width="500px" v-model="editDialog">
      <ProductForm v-model="proxyForm">
        <template v-slot:actions>
          <v-btn block :loading="updateProductApi.isLoading.value" @click="editProduct()">
            {{ $t('confirm') }}
          </v-btn>
        </template>
      </ProductForm>
    </v-dialog>
  </v-card>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { mdiDotsVertical } from '@mdi/js'
import { clone, isEqual, omitBy } from 'lodash'
import useVuelidate from '@vuelidate/core'

import { useUpdateProductApi } from '@/composables/api/products/useUpdateProductApi'

import DeleteItemModal from '@/views/OrderView/DeleteItemModal.vue'
import ProductForm from './ProductForm.vue'

import type { Product } from '@/models/models'

const $v = useVuelidate()

const product = defineModel<Product>()
const proxyForm = ref(clone(product.value))

const updateProductApi = useUpdateProductApi()

const deleteDialog = ref(false)
const editDialog = ref(false)

function editProduct() {
  $v.value.$touch()
  if (!$v.value.$invalid && product.value) {
    const modifiedFields = omitBy(proxyForm.value, (value, key) => {
      if (key == 'id') return false
      return isEqual(value, product.value?.[key as keyof Product])
    })
    updateProductApi.form.value = modifiedFields
    updateProductApi.execute()
  }
}

function deleteProduct() {}

watch(
  () => updateProductApi.isSuccess.value,
  (isSuccess) => {
    if (isSuccess && updateProductApi.data.value) {
      const originalProduct = product.value
      if (originalProduct) Object.assign(originalProduct, updateProductApi.data.value)
      editDialog.value = false
    }
  }
)
</script>
