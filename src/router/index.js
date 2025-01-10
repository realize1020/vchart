import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import NotFoundComponent from '../views/404'
import { Icon } from 'element-ui'
import User from '../views/system/user/list.vue'
//import { component } from 'vue/types/umd'



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
    component: () => import('@/views/login/index'),
    hidden: false,
    name: 'login',
  },
  {
    path: '/',
    component: () => import('@/views/Main'),
    name: 'Main',
    meta: { requireAuth: true },
    children: [
      {
        path: 'user/list',
        name: '用户管理',
        component: User,
        meta: {
          title: '用户管理',  // 侧边栏显示的名称
          icon: 'el-icon-s-tools',
        }
      },
      {
        path: 'role/list',
        name: '角色管理',
        component: () => import('@/views/system/role/list'),
        meta: {
          title: '用户管理',  // 侧边栏显示的名称
          icon: 'el-icon-s-tools',
        }
      },
      {
        path: 'menu/list',
        name: '菜单管理',
        component: () => import('@/views/system/menu/list'),
        meta: {
          title: '菜单管理',  // 侧边栏显示的名称
          icon: 'el-icon-s-tools',
        }
      },
    ]
  },
  {
    path: '/error',
    component: () => import('@/views/404'),
    name: '404',
    meta: { requireAuth: false },
  },
  //访问不存在的路径就会跳转到自定义的404页面，path: '*' 也行，下面的也行
  {
    path: '/:path(.*)',
    component: () => import('@/views/404'),
    name: '404',
  },
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
