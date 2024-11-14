<template>
  <v-btn class="my-5" variant="tonal" size="small" :append-icon="mdiPlus" @click="dialog = true">
    {{ $t('add-product') }}
  </v-btn>
  <v-dialog max-width="400px" v-model="dialog">
    <ProductForm v-model="form">
      <template v-slot:actions>
        <v-btn block :loading="insertProductApi.isLoading.value" @click="submitForm()">
          {{ $t('add') }}
        </v-btn>
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
import { useVuelidate } from '@vuelidate/core'
import { mdiPlus } from '@mdi/js'

import self from '@/composables/localStore/useSelf'

import { useInsertProductApi } from '@/composables/api/products/useInsertProductApi'
import { useGetProductsApi } from '@/composables/api/products/useGetProductsApi'

import ProductForm from '@/views/WarehouseView/ProductForm.vue'
import ProductCard from '@/views/WarehouseView/ProductCard.vue'

const $v = useVuelidate()

const insertProductApi = useInsertProductApi()
const getProductsApi = useGetProductsApi()

const dialog = ref(false)

const form = ref({
  code: '',
  name: '',
  organization_id: self.value.user?.organization_id || '',
  qte: 0,
  price: 0,
  cost_price: null as number | null
})

const products = computed(() => getProductsApi.data.value || [])

function submitForm() {
  $v.value.$touch()
  if (!$v.value.$invalid) {
    insertProductApi.form.value = { ...form.value }
    insertProductApi.execute()
  }
}

watch(
  () => insertProductApi.isSuccess.value,
  (isSuccess) => {
    if (isSuccess && insertProductApi.data.value) {
      dialog.value = false
      getProductsApi.execute()
    }
  }
)
</script>
