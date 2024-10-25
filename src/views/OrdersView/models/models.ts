import type { DocumentType } from '@/models/models'

export interface Filters {
  docType: DocumentType | null
  dateRange: Date[] | string[]
}
