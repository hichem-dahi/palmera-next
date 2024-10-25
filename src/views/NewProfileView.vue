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
        <ClientForm v-model="companyForm" :title="$t('your-informations')">
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
import { reactive, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'

import self from '@/composables/localStore/useSelf'

import { useGetProfileApi } from '@/composables/api/auth/useGetProfileApi'
import { useUpdateProfileApi } from '@/composables/api/auth/useUpdateProfileApi'
import { useUpsertCompanyApi } from '@/composables/api/companies/useUpsertCompanyApi'

import ClientForm from './ClientsView/ClientForm.vue'

import type { Validation } from '@vuelidate/core'
import type { Company } from '@/models/models'

interface Form {
  id: string
  name: string
  phone: string
  rc: string
  nif: string | null
  nis: string | null
  art: string | null
  address: string
  activity: string
}

const userForm = reactive({
  full_name: '',
  phone: ''
})

const companyForm = reactive({
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

const updateProfileApi = useUpdateProfileApi()
const upsertCompanyApi = useUpsertCompanyApi()

const getProfileApi = useGetProfileApi()

watchEffect(() => {
  if (self.value.user.id) {
    getProfileApi.userId.value = self.value.user.id
    getProfileApi.execute()
  }
})

function submitProfile() {
  updateProfileApi.params.profileForm = {
    id: self.value.user.id,
    full_name: userForm.full_name,
    phone: userForm.phone
  }
  updateProfileApi.execute()
}

function submitNewProfile(v: Validation) {
  v.$touch()
  if (!v.$invalid) {
    upsertCompanyApi.form.value = companyForm as Company
    upsertCompanyApi.execute()
  }
}

watch(
  () => getProfileApi.isReady.value,
  (isReady) => {
    if (isReady) {
      Object.assign(userForm, {
        full_name: getProfileApi.data?.value?.full_name ?? '',
        phone: getProfileApi.data?.value?.phone ?? ''
      })
    }
  }
)

watch(
  () => upsertCompanyApi.isReady.value,
  (isReady) => {
    if (isReady && upsertCompanyApi.data.value?.id) {
      Object.assign(updateProfileApi.params.form, {
        id: self.value.user.id,
        company_id: upsertCompanyApi.data.value.id
      })
      updateProfileApi.execute()
    }
  }
)
</script>
