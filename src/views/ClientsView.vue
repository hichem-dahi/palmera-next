<template>
  <v-btn class="my-5" :append-icon="mdiPlus" @click="dialog = true">{{ $t('add-client') }}</v-btn>
  <v-dialog v-model="dialog" max-width="400px">
    <CreateClient v-model="dialog" />
  </v-dialog>
  <v-container>
    <v-row v-for="(_, i) in companies" :key="i">
      <v-col sm="12" md="6">
        <ClientCard v-model="companies[i]"/> 
      </v-col>
    </v-row>
    <v-row v-for="(_, i) in individuals" :key="i">
      <v-col sm="12" md="6">
        <ClientCard v-model="individuals[i]"/> 
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiPlus } from '@mdi/js';

import companies from '@/composables/localStore/useCompanyStore';
import { individuals } from '@/composables/localStore/useIndividualsStore';

import ClientCard from '@/views/ClientsView/ClientCard.vue';
import CreateClient from '@/views/ClientsView/CreateClient.vue';

const dialog = ref(false)
</script>