<template>
  <div class="d-flex justify-center align-center pa-4" style="height: 100vh">
    <div class="inner flex-grow-1">
      <div v-if="step === Steps.SendEmail">
        <v-text-field label="email" v-model="form.email" />
        <v-btn block :loading="signUpApi.isLoading.value" @click="submitEmail">
          {{ $t('confirm') }}
        </v-btn>
      </div>
      <div v-else-if="step === Steps.SendCode">
        <v-otp-input label="code" v-model="form.code" />
        <v-btn block @click="submitCode">{{ $t('confirm') }}</v-btn>
      </div>
      <div v-else-if="step === Steps.FillForm">
        <v-text-field :label="$t('name')" v-model="form.full_name" />
        <v-text-field :label="$t('phone')" v-model="form.phone" />

        <v-btn block @click="submitProfile">{{ $t('confirm') }}</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import self from '@/composables/localStore/useSelf'

import { useSignUpApi } from '@/composables/api/auth/useSignUpApi'
import { useVerifyCodeApi } from '@/composables/api/auth/useVerifyOtpApi'
import { useUpdateProfileApi } from '@/composables/api/auth/useUpdateProfileApi'
import { useGetProfileApi } from '@/composables/api/auth/useGetProfileApi'

enum Steps {
  SendEmail = 1,
  SendCode,
  FillForm
}

const router = useRouter()

const step = ref(Steps.SendEmail)

const signUpApi = useSignUpApi()
const veryifyOtpApi = useVerifyCodeApi()
const updateProfileApi = useUpdateProfileApi()
const getProfileApi = useGetProfileApi()

const form = reactive({
  email: '',
  code: '',
  full_name: '',
  phone: ''
})

function submitEmail() {
  signUpApi.params.email = form.email
  signUpApi.execute()
}

function submitCode() {
  veryifyOtpApi.params.email = form.email
  veryifyOtpApi.params.code = form.code
  veryifyOtpApi.execute()
}

function submitProfile() {
  updateProfileApi.params.profileForm = {
    id: self.value.session?.user.id,
    full_name: form.full_name,
    phone: form.phone
  }
  updateProfileApi.execute()
}

watch(
  () => signUpApi.isReady.value,
  (isReady) => {
    if (isReady) {
      step.value = Steps.SendCode
    }
  }
)

watch(
  () => veryifyOtpApi.isReady.value,
  (isReady) => {
    if (isReady) {
      step.value = Steps.FillForm
      getProfileApi.userId.value = veryifyOtpApi.state.value?.data.user?.id
      getProfileApi.execute()
    }
  }
)

watch(
  () => getProfileApi.isReady.value,
  (isReady) => {
    if (isReady && getProfileApi.data.value?.full_name) {
      router.push({ name: 'home' })
    } else if (isReady) {
      step.value = Steps.FillForm
    }
  }
)

watch(
  () => updateProfileApi.isReady.value,
  (isReady) => {
    if (isReady) {
      self.value.user = updateProfileApi.state.value?.data
      router.push({ name: 'home' })
    }
  }
)
</script>
