<template>
  <v-btn class="my-5" :append-icon="mdiPlus" @click="dialog = true">Add person</v-btn>
  <v-dialog v-model="dialog" max-width="400px">
    <CreatePerson v-model="dialog" />
  </v-dialog>
  <v-container>
    <v-row v-for="(_, i) in personnel" :key="i">
      <v-col cols="8">
        <PersonnelCard v-model="personnel[i]"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiPlus } from '@mdi/js';

import CreatePerson from '@/components/CreatePerson.vue';
import PersonnelCard from '@/components/PersonnelCard.vue';

import personnel from '@/composables/localStore/usePersonnelStore';

const dialog = ref(false)
</script>