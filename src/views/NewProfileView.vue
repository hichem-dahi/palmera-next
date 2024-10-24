<template>
  <div class="w-100 mx-auto">
    <v-row justify="center">
      <v-col sm="12" md="6">
        <CreateClient v-model="form" :title="$t('your-informations')">
          <template v-slot:actions="{ validation }">
            <v-btn block @click="submitNewProfile(validation)">{{ $t('confirm') }}</v-btn>
          </template>
        </CreateClient>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { cloneDeep } from 'lodash'
import { useRouter } from 'vue-router'

import self from '@/composables/localStore/useSelf'

import CreateClient from './ClientsView/ClientForm.vue'

import type { Validation } from '@vuelidate/core'
import type { Company } from '@/models/models'

const form = ref<Company>()

const router = useRouter()

onMounted(() => {
  form.value = cloneDeep(self.value.company)
})

function submitNewProfile($v: Validation) {
  $v.$touch()
  if (!$v.$invalid) {
    self.value.company = form.value
    router.push({ name: 'home' })
  }
}
</script>
