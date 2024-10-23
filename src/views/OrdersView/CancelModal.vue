<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card :prepend-icon="mdiCancel">
      <template v-slot:title> Attention </template>
      <template v-slot:text>
        <div>Vous ne pourrez plus modifier cette commande après cela. Voulez-vous continuer ?</div>
      </template>
      <template v-slot:prepend>
        <v-icon color="red" size="x-large" />
      </template>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="emits('close')">
          {{ $t('cancel') }}
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="emits('confirm')">
          {{ $t('confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { mdiAlert, mdiCancel } from '@mdi/js'

const dialog = defineModel<boolean>()
const emits = defineEmits(['close', 'confirm'])
</script>
<style scoped>
.v-card {
  white-space: normal;
}
</style>
