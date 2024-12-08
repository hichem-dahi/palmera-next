import { v4 as uuidv4 } from 'uuid'

import stock from './localStore/useStockStore'
import products from './localStore/useProductStore'

import type { Order, StockMovement } from '@/models/models'

export function processOrder(order: Order): void {
  order.order_lines.forEach((orderLine) => {
    const product = products.value.find((p) => p.id === orderLine.product_id)
    if (product && product.qte !== null && orderLine.qte !== null) {
      if (product.qte >= orderLine.qte) {
        product.qte -= orderLine.qte // Deduct stock
        logStockMovement(product.id, -orderLine.qte, order.id)
      }
    }
  })
}
export function reverseOrder(order: Order): void {
  order.order_lines.forEach((orderLine) => {
    const product = products.value.find((p) => p.id === orderLine.product_id)
    if (product && product.qte !== null && orderLine.qte !== null) {
      if (product.qte >= orderLine.qte) {
        product.qte += orderLine.qte // Deduct stock
        logStockMovement(product.id, +orderLine.qte, order.id)
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

  stock.value = [...stock.value, movement]
}

export function adjustStock(product_id: string, adjustment: number): void {
  const product = products.value.find((p) => p.id === product_id)
  if (product) {
    product.qte = Math.max(0, Number(product.qte || 0) + Number(adjustment)) // Ensure qte is at least 0
    logStockMovement(product_id, adjustment)
  }
}
