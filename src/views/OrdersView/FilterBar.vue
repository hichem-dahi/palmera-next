<template>
  <div class="filters d-flex align-center ga-4">
    <v-select
      variant="underlined"
      hide-details
      :items="docItems"
      v-model="model.docType"
      max-width="368"
      min-width="100"
      :label="$t('document-type')"
      clearable
    />
    <v-date-input
      variant="underlined"
      hide-details
      prepend-icon=""
      v-model="model.dateRange"
      :label="$t('date')"
      max-width="368"
      min-width="150"
      multiple="range"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { kebabCase } from 'lodash'

import { DocumentType } from '@/models/models'
import type { Filters } from './models/models'

const { t } = useI18n()

const model = defineModel<Filters>({ required: true })

const docItems = [
  { title: t(kebabCase(DocumentType[1])), value: DocumentType.Invoice },
  { title: t(kebabCase(DocumentType[2])), value: DocumentType.DeliveryNote },
  { title: t(kebabCase(DocumentType[3])), value: DocumentType.Voucher },
  { title: t(kebabCase(DocumentType[4])), value: DocumentType.Proforma }
]
</script>
