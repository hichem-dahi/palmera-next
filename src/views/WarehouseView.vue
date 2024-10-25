<template>
  <v-btn class="my-5" variant="tonal" size="small" :append-icon="mdiPlus" @click="dialog = true">
    {{ $t('add-product') }}
  </v-btn>
  <v-dialog max-width="400px" v-model="dialog">
    <ProductForm>
      <template v-slot:actions="{ form, v }">
        <v-btn block @click="submitForm(form, v)">{{ $t('add') }}</v-btn>
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
import { ref } from 'vue'
import { mdiPlus } from '@mdi/js'

import products from '@/composables/localStore/useProductStore'

import ProductForm from '@/views/WarehouseView/ProductForm.vue'
import ProductCard from '@/views/WarehouseView/ProductCard.vue'

import type { Product } from '@/models/models'
import type { Validation } from '@vuelidate/core'

const dialog = ref(false)

function submitForm(form: Product, v: Validation<Product>) {
  v.$touch()
  if (!v.$invalid) {
    products.value.push(form)
    dialog.value = false
  }
}
</script>
