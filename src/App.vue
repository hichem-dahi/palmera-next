<script setup lang="ts">
</script>

<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar color="light-blue" title="Palmera next"></v-app-bar>

      <!-- <v-navigation-drawer>
        <v-list>
          <v-list-item title="Navigation drawer"></v-list-item>
        </v-list>
      </v-navigation-drawer> --> 

      <v-main>
        <v-container>
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style scoped>
</style>
