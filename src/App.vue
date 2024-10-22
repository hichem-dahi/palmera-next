<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { supabase } from './supabase/supabase'

import { useGetProfileApi } from './composables/api/auth/useGetProfileApi'

import self from './composables/localStore/useSelf'
import { watchOnce } from '@vueuse/core'

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
  () => getProfileApi.isReady.value,
  (isReady) => {
    if (isReady) {
      self.value.user = getProfileApi.data.value
    }
  }
)
</script>
