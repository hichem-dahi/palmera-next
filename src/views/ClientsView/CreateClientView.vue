<template>
  <div class="w-100 mx-auto">
    <v-row justify="center">
      <v-col sm="12" md="6">
        <CreateClient v-model="form" :title="$t('create-client')">
          <template v-slot:actions="{ validation }">
            <v-btn block @click="submitForm(validation)">{{ $t('confirm') }}</v-btn>
          </template>
        </CreateClient>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useInsertOrganizationApi } from '@/composables/api/organizations/useInsertOrganizationApi'

import organizations from '@/composables/localStore/useOrganizationsStore'

import CreateClient from './ClientForm.vue'

import type { Validation } from '@vuelidate/core'
import type { Organization } from '@/models/models'

const router = useRouter()

const insertOrganizationApi = useInsertOrganizationApi()

const form = ref({
  name: '',
  phone: '',
  rc: '',
  nif: null as number | null,
  nis: null as number | null,
  art: null as number | null,
  address: '',
  activity: '',
  updated_at: new Date().toISOString()
})

function submitForm($v: Validation) {
  insertOrganizationApi.form.value = form.value
  insertOrganizationApi.execute()
}

watch(
  () => insertOrganizationApi.isSuccess.value,
  (isSuccess) => {
    if (isSuccess && insertOrganizationApi.data.value) {
      organizations.value.push(insertOrganizationApi.data.value as Organization)
      router.go(-1)
    }
  }
)
watch(
  () => insertOrganizationApi.error.value,
  (error) => {}
)
</script>
