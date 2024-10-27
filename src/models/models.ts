export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  company_id: string | null
}

export interface Order {
  id: string
  index: number
  docIndex: number | null
  company?: Company | string
  individual?: Individual
  date: Date
  order_lines: OrderLine[]
  delivery?: Delivery
  document_type: DocumentType
  status: OrderStatus
  payments_ids: string[]
  payment_method?: string
  paid_price: number
  total_price: number
  tva?: number
  ttc?: number
}

export interface Payment {
  id: string
  date: Date | string
  amount: number
}

export interface OrderLine {
  id: string
  product_id: string
  qte: number | null
  unit_price: number | null
  total_price: number
}

export interface Proforma {
  id: string
  company?: Company | string
  date: Date
  order_lines: OrderLine[]
  total_price: number
  tva: number
  ttc: number
}

export interface Individual {
  id: string
  name: string
  phone: string | undefined
}

export interface Delivery {
  id: string
  driver_name: string
  phone: string | undefined
  matricule: string //xxxxx xxx xx
  destination: string
}

export interface Company {
  id: string
  name: string
  phone: string
  rc: string
  nif: number
  nis: number
  art: number
  address: string
  activity: string
}

export interface Product {
  id?: string
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
  DeliveryNote,
  Voucher,
  Proforma
}

export enum OrderStatus {
  Pending = 0,
  Confirmed,
  Cancelled
}

export enum HistoryType {
  Dept = 1,
  Absence
}

export enum ConsumerType {
  Company = 1,
  Individual
}
