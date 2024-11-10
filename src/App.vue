<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { watchOnce } from '@vueuse/core'

import { supabase } from './supabase/supabase'

import self from './composables/localStore/useSelf'

import { useGetProfileApi } from './composables/api/auth/useGetProfileApi'

const route = useRoute()
const router = useRouter()

const getProfileApi = useGetProfileApi()

onMounted(() => {
  supabase.auth.onAuthStateChange(async (_, _session) => {
    if (_session) {
      self.value.session = _session
    } else {
      router.push('/auth')
    }
  })
})

watchOnce(
  () => self.value.session,
  (newSession) => {
    if (newSession) {
      getProfileApi.userId.value = newSession.user.id
      getProfileApi.execute()
    }
  }
)

watch(
  () => getProfileApi.isSuccess.value,
  (isSuccess) => {
    if (isSuccess) {
      self.value.user = getProfileApi.data.value
    }
  }
)
</script>
