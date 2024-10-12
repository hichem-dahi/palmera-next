<template>
  <v-btn
    class="mt-2"
    size="small"
    color="grey"
    variant="text"
    :prepend-icon="mdiChevronLeft"
    @click="$router.go(-1)"
    :text="$t('back')"
  />
  <div class="text-h5 pa-4 my-4">{{ $t('client-history') }}</div>
  <div class="history-wrapper">
    <div class="history-table border">
      <HistoryTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiChevronLeft } from '@mdi/js'
import HistoryTable from './HistoryTable.vue'
</script>

<style>
.history-wrapper {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.history-table {
  min-width: 70%;
}
</style>
