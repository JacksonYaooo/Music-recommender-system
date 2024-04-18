import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { Home } from '../views/Home'
import { Personal } from '../views/Personal'
import { Songs } from '../views/Songs'
import { MyLike } from '../views/MyLike'
import { Data } from '../views/Data'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/personal',
    component: Personal,
  },
  {
    path: '/songs',
    component: Songs,
  },
  {
    path: '/mylike',
    component: MyLike,
  },
  {
    path: '/data',
    component: Data,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
