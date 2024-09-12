<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-card class="ma-5 mr-0">
    <v-img
      :src="product.image"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      height="200px"
      cover
    >
      <div class="d-flex flex-column justify-space-between fill-height">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn class="ml-auto" 
              v-bind="props" 
              color="white"
              variant="text"
              icon="mdi-dots-vertical" />
            </template>
          <v-list>
            <v-list-item density="compact" @click="deleteProduct">
              <v-list-item-title >Supprimer</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>       
        <v-card-title class="text-white" v-text="product.name"></v-card-title>
      </div>
    </v-img>
    <div class="line-1 d-flex align-center px-4 mr-6">
      <div class="col-1">
        <v-text-field 
          max-width="60px"
          prefix="x"
          hide-details 
          type="number" 
          variant="underlined"
          density="compact" 
          v-model="proxyValue" 
          @update:model-value="isModify = true"/>
      </div>
      <div class="col-2">
        <v-expand-transition>
          <div class="actions" v-show="isModify">
            <v-btn size="small" variant="text" icon="mdi-check" 
              @click="product.qte = proxyValue; isModify = false;"/>
            <v-btn size="small" variant="text" icon="mdi-cancel" 
              @click="proxyValue = product.qte; isModify = false;"/>
          </div>
        </v-expand-transition>
      </div>
    </div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
        size="small"
      ></v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
          <div class="d-flex align-center" v-for="(instance, i) in product.history" :key="i">
            <div class="text-medium-emphasis">{{ instance.date }}</div>
            <div class="d-flex align-center ml-3">            
              x{{ instance.value }}, 
              <div class="ml-2" :class="{'text-green': instance.diff > 0, 'text-red': instance.diff < 0}">
                {{ instance.diff > 0  ? `+${instance.diff}` : instance.diff }}
              </div>
            </div>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { format } from 'date-fns'

import products from '@/composables/localStore/useProductStore';

const product = defineModel<any>()

const proxyValue = ref(product.value.qte)
const show = ref(false)
const isModify = ref(false)

function deleteProduct() {
  const index = products.value.indexOf(product.value);
  products.value.splice(index, 1);
}

watch(() => product.value.qte, async (newQte, oldQte) => {
  const transaction = {
    value: newQte,
    diff: newQte - oldQte,
    date: format(new Date(), 'yyyy-MM-dd, hh:mm'),
  };
  product.value.history.push(transaction)
},
{ flush: 'sync' }
);
</script>