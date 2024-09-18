<template>
  <v-card
    class="mx-auto"
    prepend-icon="mdi-account"
    :title="client?.name"
  >
  <v-card-subtitle style="line-height: 150%;">
    <div>Address: {{ client?.address }}</div>
    <div>Phone: {{ client?.phone }}</div>
  </v-card-subtitle>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
      ></v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
      </div>
    </v-expand-transition>
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