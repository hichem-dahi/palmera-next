<script setup lang="ts">

</script>

<template>
  <div class="menu">
    <v-btn 
      class="text-white mr-5" 
      size="x-large" 
      variant="elevated"
      rounded="xl"
      color="grey"      
      stacked   
      prepend-icon="mdi-account-group"
      :to="{ name: 'clients' }">
      زبون
    </v-btn>
    <v-btn 
      class="text-white mr-5" 
      size="x-large" 
      variant="elevated"
      rounded="xl"
      color="green-lighten-2"      
      stacked   
      prepend-icon="mdi-account-hard-hat"
      :to="{ name: 'personnel' }">
      عمال
    </v-btn>
    <v-btn 
      class="text-white mr-5" 
      size="x-large" 
      variant="elevated"
      rounded="xl"
      color="red-lighten-2"
      stacked 
      prepend-icon="mdi-warehouse"
      :to="{ name: 'warehouse' }">
      مستودع
    </v-btn>
    <v-btn 
      class="text-white mr-5" 
      size="x-large" 
      variant="elevated"
      rounded="xl"
      color="blue-lighten-2"
      stacked 
      prepend-icon="mdi-receipt-text"
      :to="{ name: 'orders' }">
      طلبات
    </v-btn>
  </div>
</template>
