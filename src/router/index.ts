import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CancionesView from '../views/CancionesView.vue'
import LoginView from '../views/LoginView.vue'
import ConverterView from '../views/ConverterView.vue'
import RegisterView from '../views/RegisterView.vue'
import GenerarView from '../views/GenerarView.vue'
import { computed } from 'vue';
import { useUserStore } from '@/stores/counter';
import ConfirmarView from '@/views/ConfirmarView.vue'
import ForgotView from '@/views/ForgotView.vue'
import ResetView from '@/views/ResetView.vue'

const base = import.meta.env.BASE_URL

const router = createRouter({
  history: createWebHistory(base),
  routes: [    
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path:'/canciones',
      name:'canciones',
      component: CancionesView
    },
    {
      path:'/login',
      name:'login',
      component: LoginView
    },
    {
      path:'/register',
      name:'register',
      component: RegisterView
    },
    {
      path:'/confirmar',
      name:'confirmar',
      component: ConfirmarView
    },
    {
      path:'/forgot',
      name:'forgot',
      component: ForgotView
    },
    {
      path:'/reset',
      name:'reset',
      component: ResetView
    },
    {
      path:'/converter',
      name:'converter',
      component:ConverterView
    },
    {
      path:'/generar',
      name:'generar',
      component:GenerarView
    },
    {
      path: '/',
      redirect:'/login'
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/login'
    }
  ]
})


router.beforeEach(async (to, from, next) => {
  if (to.path !== '/login' && to.path != '/register' &&  to.path != '/confirmar' &&  to.path != '/reset' && to.path != '/forgot' ) {
    const userStore = useUserStore();
    const storedUsername = computed(() => userStore.username);
    if(storedUsername.value == '')
    {
      next('/login')
    }
    else
    {
      next()
    }
  }
  else {
    next();
  
  }

}
  
);

export default router
