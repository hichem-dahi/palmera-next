<template>
  <v-btn
    class="my-5"
    variant="tonal"
    size="small"
    :append-icon="mdiPlus"
    :to="{ name: 'create-client' }"
    >{{ $t('add-client') }}
  </v-btn>
  <v-row v-for="(_, i) in organizations" :key="i">
    <v-col sm="12" md="6">
      <ClientCard v-model="organizations[i]" />
    </v-col>
  </v-row>
  <v-row v-for="(_, i) in individuals" :key="i">
    <v-col sm="12" md="6">
      <ClientCard v-model="individuals[i]" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mdiPlus } from '@mdi/js'

import { individuals } from '@/composables/localStore/useIndividualsStore'

import ClientCard from '@/views/ClientsView/ClientCard.vue'
import { useGetOrganizationsApi } from '@/composables/api/organizations/useGetOrganizationsApi'

const getOrganizationsApi = useGetOrganizationsApi()
getOrganizationsApi.execute()

const organizations = computed(() => getOrganizationsApi.data.value)
</script>
