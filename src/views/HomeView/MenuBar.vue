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
      زبون
    </v-btn>
    <v-btn 
      class="mr-5" 
      color="medium-emphasis"
      variant="text"
      rounded="xl"
      stacked   
      prepend-icon="mdi-account-hard-hat"
      :to="{ name: 'personnel' }">
      عمال
    </v-btn>
    <v-btn 
      class="mr-5" 
      color="medium-emphasis"
      variant="text"
      rounded="xl"
      stacked 
      prepend-icon="mdi-warehouse"
      :to="{ name: 'warehouse' }">
      مستودع
    </v-btn>
    <v-btn 
      class="mr-5" 
      color="medium-emphasis"
      variant="text"
      rounded="xl"
      stacked 
      prepend-icon="mdi-receipt-text"
      :to="{ name: 'orders' }">
      طلبات
    </v-btn>
  </div>
</template>

<script setup lang="ts"></script>