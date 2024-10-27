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
import { v4 as uuidv4 } from 'uuid'

import self from '@/composables/localStore/useSelf'

import CreateClient from './ClientsView/ClientForm.vue'

import type { Validation } from '@vuelidate/core'
import type { Company } from '@/models/models'

const form = ref({
  id: uuidv4(),
  name: '',
  phone: '',
  rc: '',
  nif: null as number | null,
  nis: null as number | null,
  art: null as number | null,
  address: '',
  activity: ''
})

const router = useRouter()

onMounted(() => {
  if (self.value.company) {
    form.value = cloneDeep(self.value.company)
  }
})

function submitNewProfile($v: Validation) {
  $v.$touch()
  if (!$v.$invalid) {
    self.value.company = form.value as Company
    router.push({ name: 'home' })
  }
}
</script>
