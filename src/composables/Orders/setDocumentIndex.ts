import { max } from 'lodash'
import orders from '../localStore/useOrdersStore'

import type { Order } from '@/models/models'

export function setDocumentIndex(order: Order) {
  order.docIndex =
    (max(
      orders.value.filter((o) => o.document_type == order.document_type).map((o) => o.docIndex)
    ) || 0) + 1
}
