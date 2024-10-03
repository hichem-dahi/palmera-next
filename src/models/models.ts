export interface Order {
  id: string
  index: number
  company?: Company | string
  individual?: Individual
  date: Date
  order_lines: OrderLine[]
  delivery?: Delivery
  payment_method?: string
  paid_price: number
  total_price: number
  tva?: number
  ttc?: number
}

export interface Individual {
  id: string
  name: string
  phone: string
}

export interface Delivery {
  id: string
  driver_name: string
  phone: string
  matricule: string //xxxxx xxx xx
  destination: string
}

export interface OrderLine {
  id: string
  product_id: string
  qte: number | null
  total_price: number
}

export interface Company {
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
  code: string
  name: string
  price: number | null
  qte: number | null
}

export interface StockMovement {
  id: string
  product_id: string
  qte_change: number
  date: Date
  order_id?: string // To track the order related to the stock reduction
}

export enum DocumentType {
  Invoice = 1,
  DeliveryNote
}

export enum HistoryType {
  Dept = 1,
  Absence
}

export enum ConsumerType {
  Company = 1,
  Individual
}
