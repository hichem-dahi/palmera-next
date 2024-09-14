<script setup lang="ts">

</script>

<template>
  <div class="menu">
    <v-btn 
      color="high-emphasis" 
      class="mr-5" 
      size="x-large" 
      variant="text" 
      stacked   
      prepend-icon="mdi-account-group"
      :to="{ name: 'personnel' }"
      >
      عمال
    </v-btn>
    <v-btn 
      color="high-emphasis" 
      class="mr-5" 
      size="x-large" 
      variant="text" 
      stacked 
      prepend-icon="mdi-warehouse"
      :to="{ name: 'warehouse' }">
      مستودع
    </v-btn>
  </div>
</template>
