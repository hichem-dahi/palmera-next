<template>
  <div class="menu mx-8">
    <v-row>
      <v-btn 
        v-for="(item, index) in menuItems"
        :key="index"
        :color="item.color"
        variant="text"
        rounded="xl"
        stacked
        :prepend-icon="item.icon"
        :to="{ name: item.route }"
      >
        {{ $t(item.label) }}
      </v-btn>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { mdiAccountGroup, mdiHistory, mdiWarehouse, mdiReceiptText } from '@mdi/js'

const menuItems = [
  { label: 'clients', route: 'clients', icon: mdiAccountGroup, color: 'medium-emphasis' },
  { label: 'warehouse', route: 'warehouse', icon: mdiWarehouse, color: 'medium-emphasis' },
  { label: 'orders', route: 'orders', icon: mdiReceiptText, color: 'medium-emphasis' },
  { label: 'history', route: 'orders-history', icon: mdiHistory, color: 'medium-emphasis' }
]
</script>