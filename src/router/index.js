import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
    // {
    //     path: '/',
    //     component: ()=> import('@/components/LoginComponent'),
    //     hidden: false,
    //     name: 'login',
    // },
    {
      path: '/',
      component: ()=> import('@/views/login/index'),
      hidden: false,
      name: 'login',
    },
    {
        path: '/Main',
        component: () => import('@/views/Main'),
        name: 'Main',
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
        children: []
      },
]
const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router