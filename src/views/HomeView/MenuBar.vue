<template>
  <div class="menu mx-8">
    <v-row>
      <v-btn 
        color="medium-emphasis"
        variant="text"
        rounded="xl"
        stacked   
        :prepend-icon="mdiAccountGroup"
        :to="{ name: 'clients' }">
        {{ $t('clients') }}
      </v-btn>
      <v-btn 
        color="medium-emphasis"
        variant="text"
        rounded="xl"
        stacked 
        :prepend-icon="mdiWarehouse"
        :to="{ name: 'warehouse' }">
        {{ $t('warehouse') }}
      </v-btn>
      <v-btn 
        color="medium-emphasis"
        variant="text"
        rounded="xl"
        stacked 
        :prepend-icon="mdiReceiptText"
        :to="{ name: 'orders' }">
        {{ $t('orders') }}
      </v-btn>
      <v-btn 
        color="medium-emphasis"
        variant="text"
        rounded="xl"
        stacked 
        :prepend-icon="mdiHistory"
        :to="{ name: 'transaction-history' }">
        {{ $t('history') }}
      </v-btn>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { mdiAccountGroup, mdiHistory, mdiWarehouse, mdiReceiptText } from '@mdi/js'
</script>