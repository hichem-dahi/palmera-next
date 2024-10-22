<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-app-bar color="blue-grey-lighten-3" class="text-white" title="LogiNext">
        <template v-slot:append>
          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="text" :icon="mdiDotsVertical" />
            </template>
            <v-card class="px-4 py-2">
              <v-btn variant="text" :icon="mdiAccount" :to="{ name: 'self' }" />
              <v-select
                density="compact"
                v-model="$i18n.locale"
                :items="$i18n.availableLocales"
                hide-details
              />
            </v-card>
          </v-menu>
        </template>
      </v-app-bar>
      <v-banner
        v-if="deferredPrompt"
        class="text-left"
        position="fixed"
        bg-color="blue"
        style="bottom: 0"
      >
        Get our free app. It won't take up space on your phone and also works offline!
        <template v-slot:actions>
          <v-btn variant="text" @click="dismiss">Dismiss</v-btn>
          <v-btn variant="text" @click="install">Install</v-btn>
        </template>
      </v-banner>
      <v-main>
        <v-container>
          <v-row class="my-10" align="center">
            <MenuBar />
          </v-row>
          <v-divider class="my-5" />
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiDotsVertical } from '@mdi/js'

import self from '@/composables/localStore/useSelf'

import MenuBar from './HomeView/MenuBar.vue'

const deferredPrompt = ref()
const router = useRouter()

onMounted(() => {
  if (!self.value.session) {
    router.push({ name: 'self' })
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt.value = null
  })
})

async function install() {
  deferredPrompt.value.prompt()
}

async function dismiss() {
  deferredPrompt.value = null
}
</script>
