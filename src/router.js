import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "portal" */ './views/Dashboard.vue')
    },    
    {
      path: '/signup',
      name: 'signup',
      component: () => import(/* webpackChunkName: "signup" */ './views/SignUp.vue')
    },    
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "auth" */ './views/SignIn.vue')
    },        
    {
      path: '/logout',
      name: 'logout',
      component: () => import(/* webpackChunkName: "auth" */ './views/SignOut.vue')
    },            
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    },
  ]
})
