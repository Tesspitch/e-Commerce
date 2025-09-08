import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/product/:id', name: 'product', component: () => import('@/pages/ProductDetail.vue') },
  { path: '/kpi', name: 'kpi', component: () => import('@/pages/KPI.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/pages/Checkout.vue') },
  { path: '/order/:id', name: 'tracking', component: () => import('@/pages/Tracking.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(){ return { top: 0 } }
})

export default router
