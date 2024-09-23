import { v4 as uuidv4 } from 'uuid'
import type { Order, StockMovement } from '@/models/models'

import stock from './localStore/useStockStore'
import products from './localStore/useProductStore'

export function processOrder(order: Order): void {
  order.order_lines.forEach((orderLine) => {
    const product = products.value.find((p) => p.id === orderLine.product_id)
    if (product && product.qte !== null && orderLine.qte !== null) {
      if (product.qte >= orderLine.qte) {
        product.qte -= orderLine.qte // Deduct stock
        logStockMovement(product.id, -orderLine.qte, order.id)
      } else {
        throw new Error(`Insufficient stock for product ${product.name}`)
      }
    }
  })
}

export function logStockMovement(product_id: string, qte_change: number, order_id?: string): void {
  const movement: StockMovement = {
    id: uuidv4(),
    product_id,
    qte_change,
    date: new Date(),
    order_id
  }
  //saveStockMovement(movement) // Implement save to database or in-memory store
  stock.value.push(movement)
}

export function adjustStock(product_id: string, adjustment: number): void {
  const product = products.value.find((p) => p.id === product_id)
  if (product && product.qte !== null) {
    product.qte += adjustment // Adjust stock
    logStockMovement(product_id, adjustment)
  }
}
