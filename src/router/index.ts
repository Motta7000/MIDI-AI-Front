import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CancionesView from '../views/CancionesView.vue'
import LoginView from '../views/LoginView.vue'
import ConverterView from '../views/ConverterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
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
      path:'/converter',
      name:'converter',
      component:ConverterView
    }
  ]
})

// Navigation guard
/*
router.beforeEach(async (to, from, next) => {

  if (to.path !== '/login') {
    const sessionActive = await checkSession();
    console.log(sessionActive);
    try {
      if (!sessionActive) {
        console.error('La sesion no esta ok')
        next('/login')
      }
      else {
        console.log('Sesion ok! ;)');
        next();
      }
    } catch (e) {
      console.error(e);
      next('/login')
    }
    finally {

      store.dispatch('stopLoading');
    }
  }
  else {

    next();
    store.dispatch('stopLoading');
  }

}
  
);
*/
export default router
