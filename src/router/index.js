import Vue from 'vue'
import Router from 'vue-router'
import NotFoundComponent from '../views/404'

Vue.use(Router)

export const constantRoutes = [
    // {
    //     path: '/',
    //     component: ()=> import('@/components/LoginComponent'),
    //     hidden: false,
    //     name: 'login',
    // },
    //没有加路由守卫的时候用'/'作为默认，每次都跳转到登录页。加了路由守卫之后要改为'/login'，'/Main'改为'/'
    // {
    //   path: '/',
    //   component: ()=> import('@/views/login/index'),
    //   hidden: false,
    //   name: 'login',
    // },
    {
      path: '/login',
      component: ()=> import('@/views/login/index'),
      hidden: false,
      name: 'login',
    },
    // {
    //     path: '/Main',
    //     component: () => import('@/views/Main'),
    //     name: 'Main',
    //     meta:{requireAuth: true},
        //\redirect: '/Main',
        // children: [
        //   {
        //     path: '/home',
        //     name: 'home',
        //     component: () => import('../views/home/Home.vue')
        //   },
        //   {
        //     path: '/user',
        //     name: 'user',
        //     component: () => import('../views/User/User.vue')
        //   },
        //   {
        //     path: '/page1',
        //     name: 'page1',
        //     component: () => import('../views/Page1.vue')
        //   },
        //   {
        //     path: '/page2',
        //     name: 'page2',
        //     component: () => import('../views/Page2.vue')
        //   }
        // ],
      //   children: []
      // },

       {
        path: '/',
        component: () => import('@/views/Main'),
        name: 'Main',
        meta:{requireAuth: true},
        children: []
       },
       {
        path: '/error',
        component: () => import('@/views/404'),
        name: '404',
        meta:{requireAuth: false},
       },
       //访问不存在的路径就会跳转到自定义的404页面，path: '*' 也行，下面的也行
       {
        path: '/:path(.*)',
        component: () => import('@/views/404'),
        name: '404',
       },
      //  {
      //   path: '*',
      //   component: () => import('@/views/404'),
      //   name: '404',
      //  },

]
const createRouter = () => new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
    // routes: [
    //   {path: '*',component:NotFoundComponent}
    // ]
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router