import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { Home } from '../views/Home'
import { Personal } from '../views/Personal'
import { Songs } from '../views/Songs'
import { MyLike } from '../views/MyLike'
import { Data } from '../views/Data'
import { Login } from '../views/Login'

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
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function isLoggedIn() {
  return !!localStorage.getItem('loginInfo');
}

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isLoggedIn()) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
