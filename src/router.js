import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

let router = new Router({     
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "portal" */ './views/Dashboard.vue'),
      meta: { 
        requiresAuth: true
      }
    },    
    {
      path: '/signup',
      name: 'signup',
      component: () => import(/* webpackChunkName: "signup" */ './views/SignUp.vue')
    },    
    {
      path: '/signin',
      name: 'signin',
      component: () => import(/* webpackChunkName: "auth" */ './views/SignIn.vue')
    },        
    { path: '/login', redirect: '/signin' },
    {
      path: '/signout',
      name: 'signout',
      component: () => import(/* webpackChunkName: "auth" */ './views/SignOut.vue'),      
      meta: { 
        requiresAuth: true
      }
    },        
    { path: '/logout', redirect: '/signout' },  
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

  
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {          
    const user = store.getters.authenticatedUser
    if(user){
      if(to.matched.some(record => record.meta.is_admin)) {
        if(user.is_admin == 1){
            next()
        }
        else{
            next({ name: 'dashboard'})
        }
      }else {          
            next()
      }
    }else{
      next({
        path: '/signin',
        params: { nextUrl: to.fullPath }
      })
    }      
  }else {
      next() 
  }
})

export default router