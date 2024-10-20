<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { supabase } from './supabase/supabase'

import { useGetProfileApi } from './composables/api/auth/useGetProfileApi'

import self from './composables/localStore/useSelf'

const route = useRoute()
const router = useRouter()

const getProfileApi = useGetProfileApi()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) self.value.session = data.session
  })

  supabase.auth.onAuthStateChange(async (_, _session) => {
    if (_session) {
      self.value.session = _session
      if (route.path === '/') router.push('/')
    } else {
      router.push('/auth')
    }
  })
})

watch(
  () => self.value.session,
  (newSession) => {
    if (newSession) getProfileApi.userId.value = newSession.user.id
  }
)

watch(
  () => getProfileApi.data.value,
  (profileData) => {
    if (profileData) self.value.user = profileData
  }
)
</script>
