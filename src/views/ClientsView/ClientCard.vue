<template>
  <v-card
    class="pa-4 mx-auto"
    prepend-icon="mdi-account"
    :title="client?.name"
>
  <v-card-subtitle style="line-height: 150%;">
    <div>Address: {{ client?.address }}</div>
    <div>Phone: <a :href="`tel:+${client?.phone}`">{{ client?.phone }}</a> </div>
  </v-card-subtitle>
  <template v-slot:append>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn class="ml-auto" 
          v-bind="props" 
          variant="text"
          icon="mdi-dots-vertical" />
        </template>
      <v-list density="compact">
        <v-list-item density="compact" >
          <v-list-item-title @click="dialog1 = true">Ajouter commande</v-list-item-title>
        </v-list-item>
        <v-list-item density="compact" @click="deleteClient">
          <v-list-item-title>Supprimer</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> 
    <v-dialog v-model="dialog1" max-width="400">
      <AddHistory v-model:dialog="dialog1" v-model:person="client" />
    </v-dialog> 
  </template>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Client } from '@/models/models';

const client = defineModel<Client>()

const show = ref(false)
const dialog1 = ref(false)

function deleteClient() {}
</script>