<template>
  <v-card
    v-if="client"
    class="pa-4 pb-0 mx-auto"
    :prepend-icon="consumerType == ConsumerType.Company ? mdiDomain : mdiAccount"
    :title="client?.name"
  >
    <v-card-subtitle style="line-height: 150%;">
      <div v-if="'address' in client">{{ $t('address') }}: {{ client?.address }}</div>
      <div>{{ $t('phone') }}: <a :href="`tel:${client?.phone}`">{{ client?.phone }}</a> </div>
    </v-card-subtitle>

    <v-card-actions class="ma-0 pa-0">
      <v-spacer></v-spacer>
      <v-btn v-if="client.id"
        size="small"
        :append-icon="mdiHistory" 
         :to="{ name:'client-history', params: { client_id: client.id }}">
        {{ $t('history') }}
      </v-btn>
    </v-card-actions>

    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn class="ml-auto" 
            v-bind="props" 
            variant="text"
            :icon="mdiDotsVertical" />
          </template>
        <v-list density="compact">
          <v-list-item density="compact" @click="deleteClient">
            <v-list-item-title>Supprimer</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> 
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { mdiAccount, mdiDomain, mdiDotsVertical, mdiHistory } from '@mdi/js';

import { ConsumerType, type Company, type Individual } from '@/models/models';

const client = defineModel<Company | Individual>()

const consumerType = computed(() => {
  return client.value && 'rc' in client.value
    ? ConsumerType.Company
    : ConsumerType.Individual;
});

function deleteClient() {}
</script>