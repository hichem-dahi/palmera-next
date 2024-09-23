export interface Order {
  id: string
  client_id: string
  date: Date
  order_lines: OrderLine[]
  delivery: string | Delivery
  payment_method: string
  paid_price: number
  total_price: number
}

export interface OrderLine {
  id: string
  product_id: string
  qte: number | null
  total_price: number
}

export interface Client {
  id: string
  name: string
  phone: string
  rc: string
  nif: string
  art: string
  address: string
  activity: string
}

export interface Product {
  id: string
  name: string
  price: number | null
  qte: number | null
  history: ProductHistory[]
}

export interface ProductHistory {
  id: string
  date: Date
  qte: number
}

export interface Delivery {
  id: string
  driver_name: string
  phone: string
  matricule: string //xxxxx xxx xx
  destination: string
}

export interface StockMovement {
  id: string
  product_id: string
  qte_change: number
  date: Date
  order_id?: string // To track the order related to the stock reduction
}

export enum StockMovementType {
  Addition = 'Addition',
  Subtraction = 'Subtraction'
}

export enum InvoiceType {
  Receipt = 1,
  DeliveryNote
}

export enum HistoryType {
  Dept = 1,
  Absence
}
