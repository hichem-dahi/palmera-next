<template>
  <div class="w-100 mx-auto">
    <v-row justify="center">
      <v-col sm="12" md="5">
        <v-card class="pa-4" elevation="1">
          <template v-slot:title>
            {{ $t('profile') }}
          </template>
          <v-text-field :label="$t('name')" v-model="userForm.full_name" />
          <v-text-field :label="$t('phone')" v-model="userForm.phone" />

          <v-btn block :loading="updateProfileApi.isLoading.value" @click="submitProfile">
            {{ $t('confirm') }}
          </v-btn>
        </v-card>
      </v-col>
      <v-col sm="12" md="5">
        <ClientForm v-model="organizationForm" :title="$t('your-informations')">
          <template v-slot:actions="{ validation }">
            <v-btn
              block
              :loading="updateProfileApi.isLoading.value"
              @click="submitNewProfile(validation)"
            >
              {{ $t('confirm') }}</v-btn
            >
          </template>
        </ClientForm>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'

import self from '@/composables/localStore/useSelf'

import { useUpdateProfileApi } from '@/composables/api/auth/useUpdateProfileApi'
import { useUpsertOrganizationApi } from '@/composables/api/organizations/useUpsertOrganizationApi'

import ClientForm from './ClientsView/ClientForm.vue'

import type { Validation } from '@vuelidate/core'
import type { Organization } from '@/models/models'

const userForm = reactive({
  full_name: '',
  phone: ''
})

const organizationForm = reactive({
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

const updateProfileApi = useUpdateProfileApi()
const upsertOrganizationApi = useUpsertOrganizationApi()

onMounted(() => {
  Object.assign(userForm, {
    full_name: self.value.user?.full_name,
    phone: self.value.user?.phone
  })
  Object.assign(organizationForm, self.value.user?.organizations)
})

function submitProfile() {
  updateProfileApi.params.profileForm = {
    id: self.value.user?.id,
    full_name: userForm.full_name,
    phone: userForm.phone
  }
  updateProfileApi.execute()
}

function submitNewProfile(v: Validation) {
  v.$touch()
  if (!v.$invalid) {
    upsertOrganizationApi.form.value = organizationForm as Organization
    upsertOrganizationApi.execute()
  }
}

watch(
  () => upsertOrganizationApi.isReady.value,
  (isReady) => {
    if (isReady && upsertOrganizationApi.data.value?.id) {
      Object.assign(updateProfileApi.params.form, {
        id: self.value.user?.id,
        organization_id: upsertOrganizationApi.data.value.id
      })
      updateProfileApi.execute()
    }
  }
)
</script>
