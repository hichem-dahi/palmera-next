<template>
  <v-card
    v-if="client"
    class="pa-4 pb-0 mx-auto"
    :prepend-icon="consumerType == ConsumerType.Company ? mdiDomain : mdiAccount"
    :title="client?.name"
  >
    <v-card-subtitle style="line-height: 150%">
      <div v-if="'address' in client">{{ $t('address') }}: {{ client?.address }}</div>
      <div>
        {{ $t('phone') }}: <a :href="`tel:${client?.phone}`">{{ client?.phone }}</a>
      </div>
    </v-card-subtitle>

    <v-card-actions class="ma-0 pa-0">
      <v-spacer></v-spacer>
      <v-btn
        class="my-5"
        size="small"
        variant="plain"
        :append-icon="mdiPlus"
        :to="{
          name: 'create-order',
          query: {
            consumer: client.id
          }
        }"
      >
        {{ $t('add-order') }}
      </v-btn>
      <v-btn
        v-if="client.id"
        size="small"
        :append-icon="mdiHistory"
        variant="plain"
        :to="{ name: 'client-history', params: { client_id: client.id } }"
      >
        {{ $t('history') }}
      </v-btn>
    </v-card-actions>

    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn class="ml-auto" v-bind="props" variant="text" :icon="mdiDotsVertical" />
        </template>
        <v-list density="compact">
          <v-list-item density="compact" @click="deleteDialog = true">
            <v-list-item-title>{{ $t('delete') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <DeleteItemModal v-model="deleteDialog" @confirm="deleteClient" @close="deleteDialog = false" />
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { mdiAccount, mdiDomain, mdiDotsVertical, mdiHistory, mdiPlus } from '@mdi/js'

import companies from '@/composables/localStore/useCompanyStore'
import { individuals } from '@/composables/localStore/useIndividualsStore'

import DeleteItemModal from '../OrdersView/DeleteItemModal.vue'

import { ConsumerType, type Company, type Individual } from '@/models/models'

const client = defineModel<Company | Individual>()

const deleteDialog = ref(false)

const consumerType = computed(() => {
  return client.value && 'rc' in client.value ? ConsumerType.Company : ConsumerType.Individual
})

function deleteClient() {
  if (consumerType.value == ConsumerType.Company && client.value) {
    const index = companies.value.indexOf(client.value as Company)
    companies.value.splice(index, 1)
  } else if (consumerType.value == ConsumerType.Individual && client.value) {
    const index = individuals.value.indexOf(client.value as Individual)
    individuals.value.splice(index, 1)
  }
}
</script>
