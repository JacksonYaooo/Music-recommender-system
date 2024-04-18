import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { Home } from '../views/Home'
import { Personal } from '../views/Personal'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/personal',
    component: Personal,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
