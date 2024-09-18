import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import WarehouseView from '@/views/WarehouseView.vue'
import PersonnelView from '@/views/PersonnelView.vue'
import ClientsView from '@/views/ClientsView.vue'
import OrdersView from '@/views/OrdersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
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
    }
  ]
})

export default router
