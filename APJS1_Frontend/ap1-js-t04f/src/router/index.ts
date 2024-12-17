import { createRouter, createWebHistory } from 'vue-router'
import ActiveGames from '../views/ActiveGames.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sign-in',
      name: 'signin',
      component: () => import('@/views/SignIn.vue'),
      meta: { title: 'Sign In' },
    },
    {
      path: '/sign-up',
      name: 'signup',
      component: () => import('@/views/SignUp.vue'),
      meta: { title: 'Sign Up' },
    },
    {
      path: '/',
      name: 'home',
      component: ActiveGames,
      meta: { title: 'Home | Join a game' },
    },
    {
      path: '/active-games',
      name: 'active-games',
      component: ActiveGames,
      meta: { title: 'Active Games | Join a game now' },
    },
    {
      path: '/new-game',
      name: 'new-game',
      component: () => import('@/views/NewGame.vue'),
      meta: { title: 'New Game' },
    },
    {
      path: '/current-game',
      name: 'current-game',
      component: () => import('@/views/CurrentGame.vue'),
      meta: { title: 'Current Game' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (typeof to.meta.title !== 'string') {
    console.log(`Route ${to.path} doens't have a page title. is it intentional ?`)
  } else {
    document.title = to.meta.title as string
  }
  next()
})

export default router
