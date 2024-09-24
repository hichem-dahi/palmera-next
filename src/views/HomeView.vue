<template>
  <v-responsive class="border rounded">
    <v-app>

      <v-app-bar color="light-blue" title="LogiNext"></v-app-bar>
      <v-banner 
        v-if="deferredPrompt"
        class="text-left"
        position="fixed"
        bg-color="blue"
        style="bottom: 0;"
      >
        Get our free app. It won't take up space on your phone and also works offline!
        <template v-slot:actions>
          <v-btn variant="text" @click="dismiss">Dismiss</v-btn>
          <v-btn variant="text"  @click="install">Install</v-btn>
        </template>
      </v-banner>

      <v-main>
        <v-container>
          <v-row class="mt-5">
            <MenuBar />
          </v-row>
          <v-divider class="mt-5 mb-2"></v-divider>
            <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MenuBar from './HomeView/MenuBar.vue';

const deferredPrompt = ref()

onMounted(()=>{
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt.value = e;
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt.value = null;
  });
})

async function install() {
  deferredPrompt.value.prompt();
}

async function dismiss() {
  deferredPrompt.value = null;
}
</script>

