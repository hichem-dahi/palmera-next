import type { Product } from '@/models/models'
import type { TablesInsert } from '@/types/database.types'
import type { OrderData } from './api/orders/useGetOrderApi'

// Generate stock movements for a given order based on its order lines
export function generateStockMovementsForOrder(
  order: OrderData
): TablesInsert<'stock_movements'>[] {
  const stockMovements: TablesInsert<'stock_movements'>[] = []

  order.order_lines.forEach((orderLine) => {
    const product = orderLine.product
    if (product && product.qte !== null && orderLine.qte !== null) {
      if (product.qte >= orderLine.qte) {
        product.qte -= orderLine.qte // Deduct stock
        stockMovements.push(createStockMovement(product.id, -orderLine.qte, order.id))
      }
    }
  })

  return stockMovements
}

// Restore stock quantities from a reversed order
export function restoreStockFromOrder(order: OrderData): TablesInsert<'stock_movements'>[] {
  const stockMovements: TablesInsert<'stock_movements'>[] = []

  order.order_lines.forEach((orderLine) => {
    const product = orderLine.product
    if (product && product.qte !== null && orderLine.qte !== null) {
      if (product.qte >= orderLine.qte) {
        product.qte += orderLine.qte // Add back stock
        stockMovements.push(createStockMovement(product.id, orderLine.qte, order.id))
      }
    }
  })

  return stockMovements
}

// Adjust the stock quantity of a product by a given amount
export function updateProductStock(
  product: Product,
  adjustment: number
): TablesInsert<'stock_movements'> {
  product.qte = Math.max(0, Number(product.qte || 0) + Number(adjustment)) // Ensure qte is at least 0
  return createStockMovement(product.id, adjustment)
}

// Create a stock movement entry for tracking changes in stock
export function createStockMovement(
  product_id: string,
  qte_change: number,
  order_id?: string
): TablesInsert<'stock_movements'> {
  return {
    product_id,
    qte_change,
    date: new Date().toISOString(),
    order_id
  }
}
