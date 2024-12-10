import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Room from '../views/Room.vue'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/room/:id',
      name: 'room',
      component: Room,
      beforeEnter: (to, from) => {
        const userStore = useUserStore()
        if (!userStore.username) {
          return { name: 'home', query: { redirect: to.fullPath } }
        }
      }
    }
  ]
})

export default router