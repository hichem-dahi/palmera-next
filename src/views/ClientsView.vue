<template>
  <v-btn class="mb-5" append-icon="mdi-plus" @click="dialog = true">{{ $t('add-client') }}</v-btn>
  <v-dialog v-model="dialog" max-width="400px">
    <CreateClient v-model="dialog" />
  </v-dialog>
  <v-container>
    <v-row v-for="(_, i) in clients" :key="i">
      <v-col cols="8">
        <ClientCard v-model="clients[i]"/> 
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import clients from '@/composables/localStore/useClientsStore';

import ClientCard from '@/views/ClientsView/ClientCard.vue';
import CreateClient from '@/views/ClientsView/CreateClient.vue';

const dialog = ref(false)
</script>