import { createRouter, createWebHistory } from 'vue-router'
import ReceiverView from '../views/Receiver.vue'
import BroadcasterView from "@/views/Broadcaster.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
        name: 'broadcaster',
      component: BroadcasterView,
    },
    {
      path: '/receiver',
        name: 'receiver',
      component: ReceiverView,
    }
  ],
})

export default router
