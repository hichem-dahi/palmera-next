<template>
  <v-btn class="my-5" variant="tonal" size="small" :append-icon="mdiPlus" @click="dialog = true">
    {{ $t('add-product') }}
  </v-btn>
  <v-dialog max-width="400px" v-model="dialog">
    <ProductForm>
      <template v-slot:actions="{ form, v }">
        <v-btn block :loading="insertProductApi.isLoading.value" @click="submitForm(form, v)">{{
          $t('add')
        }}</v-btn>
      </template>
    </ProductForm>
  </v-dialog>
  <v-row>
    <v-col v-for="(_, i) in products" :key="i" sm="12" md="3">
      <ProductCard v-model="products[i]" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { mdiPlus } from '@mdi/js'

import { useInsertProductApi } from '@/composables/api/products/useInsertProductApi'
import { useGetProductsApi } from '@/composables/api/products/useGetProductsApi'

import ProductForm from '@/views/WarehouseView/ProductForm.vue'
import ProductCard from '@/views/WarehouseView/ProductCard.vue'

import type { Product } from '@/models/models'
import type { Validation } from '@vuelidate/core'
import type { TablesInsert } from '@/types/database.types'

const dialog = ref(false)

const insertProductApi = useInsertProductApi()
const getProductsApi = useGetProductsApi()

const products = computed(() => getProductsApi.data.value || [])

function submitForm(form: TablesInsert<'products'>, v: Validation<Product>) {
  v.$touch()
  if (!v.$invalid) {
    insertProductApi.form.value = { ...form }
    insertProductApi.execute()
    dialog.value = false
  }
}

watch(
  () => insertProductApi.isSuccess.value,
  (isSuccess) => {
    if (isSuccess && insertProductApi.data.value) {
      products.value?.push(insertProductApi.data.value)
    }
  }
)
</script>
