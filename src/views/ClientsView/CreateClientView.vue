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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import organizations from '@/composables/localStore/useOrganizationsStore'

import CreateClient from './ClientForm.vue'

import type { Validation } from '@vuelidate/core'
import type { Organization } from '@/models/models'

const router = useRouter()

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

function submitForm($v: Validation<typeof form.value>) {
  $v.$touch()
  if (!$v.$invalid) {
    organizations.value.push(cloneDeep(form.value as any) as Organization)
    router.go(-1)
  }
}
</script>
