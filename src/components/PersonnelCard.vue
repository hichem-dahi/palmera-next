<template>
  <v-card class="mx-auto" :prepend-icon="mdiAccount" :title="name">
    <v-card-subtitle style="line-height: 150%">
      <div class="d-flex font-weight-bold">
        Endettement:&nbsp;
        <div>{{ total }}DA</div>
      </div>
      <div class="d-flex font-weight-bold">
        Absence:&nbsp;
        <div>{{ absence }}</div>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :icon="show ? mdiChevronUp : mdiChevronDown" @click="show = !show"></v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>
          <div class="pa-4" style="line-height: 1.8">
            <h3 class="pb-2">Historique</h3>
            <div class="d-flex align-center" v-for="(instance, i) in person.history" :key="i">
              {{ format(instance.date, 'yyyy-MM-dd') }}
              <span>
                &nbsp;{{
                  instance.type === HistoryType.Dept
                    ? `-${instance.value} DA`
                    : instance.type === HistoryType.Absence
                      ? 'Absence'
                      : ''
                }}
              </span>
            </div>
          </div>
        </div>
      </v-expand-transition>
    </v-card-subtitle>
    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn class="ml-auto" v-bind="props" variant="text" :icon="mdiDotsVertical" />
        </template>
        <v-list density="compact">
          <v-list-item density="compact">
            <v-list-item-title @click="dialog1 = true">Ajouter remaraque</v-list-item-title>
          </v-list-item>
          <v-list-item density="compact" @click="deletePerson">
            <v-list-item-title>Supprimer</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-dialog v-model="dialog1" max-width="400">
        <AddHistory v-model:dialog="dialog1" v-model:person="person" />
      </v-dialog>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { format } from 'date-fns'
import { mdiAccount, mdiChevronDown, mdiChevronUp, mdiDotsVertical } from '@mdi/js'

import personnel from '@/composables/localStore/usePersonnelStore'

import AddHistory from './addHistory.vue'

import { HistoryType } from '@/models/models'

const person = defineModel<any>()

const show = ref(false)
const dialog1 = ref(false)

const name = computed(() => `${person.value.first_name} ${person.value.last_name}`)
const total = computed(() =>
  person.value.history
    .filter((e: { type: HistoryType }) => e.type == HistoryType.Dept)
    .reduce((som: any, e: any) => Number(som) + Number(e.value), 0)
)
const absence = computed(
  () =>
    person.value.history.filter((e: { type: HistoryType }) => e.type == HistoryType.Absence).length
)

function deletePerson() {
  const index = personnel.value.indexOf(person.value)
  personnel.value.splice(index, 1)
}
</script>
