import  { createRouter, createWebHistory } from "vue-router";
import LoginPage from '@/app/views/login/LoginPage.vue';
import ApartamentsPage from '@/app/views/apartaments/ApatamentsPage.vue';
import ApartamentPage from '@/app/views/apartament/ApartamentPage.vue';
import WorkersPage from '@/app/views/workers/WorkersPage.vue';
import WorkerPage from '@/app/views/worker/WorkerPage.vue';
import { AuthService } from "../services/AuthService";


export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/app/shared/layouts/AuthLayout.vue'),
      children: [
        {
          path: '/',
          redirect: {
            path: '/login',
          }
        },
        {
          path: '/login',
          component: LoginPage
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/app/shared/layouts/MainLayout.vue'),
      children: [
        {
          path: 'apartaments',
          component: ApartamentsPage,
        },
        {
          path: 'apartaments/:id',
          component: ApartamentPage,
        },
        {
          path: 'workers',
          component: WorkersPage,
        },
        {
          path: 'workers/:id',
          component: WorkerPage,
        },
      ],
      beforeEnter: (_, __, next) => {
        if (!AuthService.isAuth) {
          return next('/login');
        }

        return next();
      }
    },
  ],
});
