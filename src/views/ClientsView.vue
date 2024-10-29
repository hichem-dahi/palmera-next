<template>
  <v-btn
    class="my-5"
    variant="tonal"
    size="small"
    :append-icon="mdiPlus"
    :to="{ name: 'create-client' }"
    >{{ $t('add-client') }}
  </v-btn>
  <v-row v-for="(_, i) in organizations" :key="i">
    <v-col sm="12" md="6">
      <ClientCard v-model="organizations[i]" />
    </v-col>
  </v-row>
  <v-row v-for="(_, i) in individuals" :key="i">
    <v-col sm="12" md="6">
      <ClientCard v-model="individuals[i]" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { mdiPlus } from '@mdi/js'

import organizations from '@/composables/localStore/useOrganizationsStore'
import { individuals } from '@/composables/localStore/useIndividualsStore'

import ClientCard from '@/views/ClientsView/ClientCard.vue'
</script>
