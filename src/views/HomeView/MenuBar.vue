<template>
  <div class="menu">
    <v-btn 
      class="mr-5" 
      color="medium-emphasis"
      variant="text"
      rounded="xl"
      stacked   
      prepend-icon="mdi-account-group"
      :to="{ name: 'clients' }">
      {{ $t('clients') }}
    </v-btn>
    <v-btn 
      class="mr-5" 
      color="medium-emphasis"
      variant="text"
      rounded="xl"
      stacked 
      prepend-icon="mdi-warehouse"
      :to="{ name: 'warehouse' }">
      {{ $t('warehouse') }}
    </v-btn>
    <v-btn 
      class="mr-5" 
      color="medium-emphasis"
      variant="text"
      rounded="xl"
      stacked 
      prepend-icon="mdi-receipt-text"
      :to="{ name: 'orders' }">
      {{ $t('orders') }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">


</script>