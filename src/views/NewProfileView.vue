<template>
  <div class="w-100 mx-auto">
    <v-row justify="center">
      <v-col sm="12" md="6">
        <CreateClient :title="$t('your-informations')">
          <template v-slot:actions="{form, validation}">
            <v-btn block @click="submitNewProfile(form, validation)">{{ $t('confirm') }}</v-btn>
          </template>
        </CreateClient>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';

import self from '@/composables/localStore/useSelf'

import CreateClient from './ClientsView/CreateClient.vue';

import type { Validation } from '@vuelidate/core';

const router = useRouter()

function submitNewProfile(form: any, v: Validation) {
  v.$touch()
  if (!v.$invalid) {
    self.value.company = form
    router.push({ name: 'home' })
  }
}
</script>