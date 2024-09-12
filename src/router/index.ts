import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import WarehouseView from '@/views/WarehouseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/warehouse',
      name: 'warehouse',
      component: WarehouseView
    }
  ]
})

export default router
