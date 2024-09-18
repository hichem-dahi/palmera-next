export enum HistoryType {
  Dept = 1,
  Absence
}

export interface Order {
  id: string
  client_id: string
  order_lines: OrderLine[]
  total_price: number
  paid_price: number
  date: Date
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
}
