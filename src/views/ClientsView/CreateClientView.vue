<template>
  <div class="w-100 mx-auto">
    <v-row justify="center">
      <v-col sm="12" md="6">
        <CreateClient @success="$router.go(-1)" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import CreateClient from './CreateClient.vue'
</script>
