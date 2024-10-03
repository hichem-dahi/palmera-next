import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import WarehouseView from '@/views/WarehouseView.vue'
import PersonnelView from '@/views/PersonnelView.vue'
import ClientsView from '@/views/ClientsView.vue'
import OrdersView from '@/views/OrdersView.vue'
import OrderView from '@/views/OrderView.vue'
import InvoiceView from '@/views/InvoiceView.vue'
import ProductView from '@/views/ProductView.vue'
import TransactionHistoryView from '@/views/TransactionHistoryView.vue'
import CreateOrder from '@/views/CreateOrder.vue'
import ClientHistoryView from '@/views/ClientsView/ClientHistory.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/clients',
          name: 'clients',
          component: ClientsView
        },
        {
          path: '/personnel',
          name: 'personnel',
          component: PersonnelView
        },
        {
          path: '/warehouse',
          name: 'warehouse',
          component: WarehouseView
        },
        {
          path: '/orders',
          name: 'orders',
          component: OrdersView
        },
        {
          path: '/create-order',
          name: 'create-order',
          component: CreateOrder
        },
        {
          path: '/order/:order_id',
          name: 'order',
          component: OrderView
        },
        {
          path: '/client-history/:client_id',
          name: 'client-history',
          component: ClientHistoryView
        },
        {
          path: '/product/:product_id',
          name: 'product',
          component: ProductView
        },
        {
          path: '/transaction-history',
          name: 'transaction-history',
          component: TransactionHistoryView
        }
      ]
    },
    {
      path: '/invoice/:order_id',
      name: 'invoice',
      component: InvoiceView
    }
  ]
})

export default router
