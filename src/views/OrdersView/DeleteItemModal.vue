<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card 
      prepend-icon="mdi-delete-outline" 
      title="Are you sure you want to delete this item?">
      <template v-slot:prepend>
        <v-icon color="red" size="x-large"></v-icon>
      </template>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="emits('close')">Cancel</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="emits('confirm')">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const dialog = defineModel<boolean>()
const emits = defineEmits(['close', 'confirm'])
</script>