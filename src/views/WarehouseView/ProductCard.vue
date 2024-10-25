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
    <v-dialog max-width="400px" v-model="editDialog">
      <ProductForm :form="product">
        <template v-slot:actions="{ form, v }">
          <v-btn block @click="editProduct(form, v)">{{ $t('confirm') }}</v-btn>
        </template>
      </ProductForm>
    </v-dialog>
  </v-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { mdiDotsVertical } from '@mdi/js'
import { isEqual, omitBy } from 'lodash'

import products from '@/composables/localStore/useProductStore'

import DeleteItemModal from '@/views/OrderView/DeleteItemModal.vue'
import ProductForm from './ProductForm.vue'

import type { Product } from '@/models/models'
import type { Validation } from '@vuelidate/core'

const product = defineModel<Product>()

const deleteDialog = ref(false)
const editDialog = ref(false)

function deleteProduct() {
  const index = products.value.indexOf(product.value!)
  products.value.splice(index, 1)
}

function editProduct(form: Product, v: Validation<Product>) {
  v.$touch()
  if (!v.$invalid && product.value) {
    const index = products.value.findIndex((p) => p.id === product.value!.id)

    if (index !== -1) {
      const originalProduct = products.value[index]
      const modifiedFields = omitBy(form, (value, key) => {
        return isEqual(value, originalProduct[key as keyof Product])
      })
      Object.assign(originalProduct, modifiedFields)
    }

    editDialog.value = false
  }
}
</script>
