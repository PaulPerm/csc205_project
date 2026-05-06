import { createRouter, createWebHistory } from 'vue-router'
import StudentListView from '@/views/StudentListView.vue'
import ChecksheetView from '@/views/ChecksheetView.vue'
import BuildModeView from '@/views/BuildModeView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/students',
      name: 'students',
      component: StudentListView,
    },
    {
      path: '/checksheet/:id',
      name: 'checksheet',
      component: ChecksheetView,
    },
    {
      path: '/build/:id',
      name: 'build',
      component: BuildModeView,
    },
    {
      path: '/print-schedule/:id',
      name: 'PrintSchedule',
      component: () => import('../views/PrintScheduleView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

export default router
