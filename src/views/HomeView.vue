<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar color="light-blue" title="Palmera next"></v-app-bar>
      <v-main>
        <v-container>
          <v-row class="mt-5">
            <MenuBar />
          </v-row>
          <v-divider class="mt-5 mb-2"></v-divider>
          <v-row no-gutters>
            <router-view></router-view>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
<script setup lang="ts">
import MenuBar from './HomeView/MenuBar.vue';
</script>

