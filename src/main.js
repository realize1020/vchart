import Vue from 'vue'
import VCharts from 'v-charts'
import App from './App.vue'
import Login from './components/LoginComponent.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VCharts)
Vue.use(ElementUI)
Vue.config.productionTip = false

//路由守卫，如果没有登录，不能直接上来就访问首页
router.beforeEach((to,from,next)=>{
  console.log(to);
  console.log(from);
  if(to.meta.requireAuth){
    if(localStorage.getItem('token')){
      next();
    }else{
      if(to.path === '/login'){
        next();
      }else{
        next({
          //有一个问题，怎么清除之前跳转的时的请求路径（使用VueRouter的history模式）
          path: '/login'
        })
        // next({
        //   name: "login",
        //   query: {redirect: to.meta.redirect} //登录后再跳回此页面时要做的配置
        // });
      }
    }
  }else{
    next();
  }
  /*如果本地 存在 token 则 不允许直接跳转到 登录页面*/
  if(to.fullPath == "/login"){
    if(localStorage.getItem('token')){
      next({
        path: from.fullPath
      });
    }else{
      next();
    }
  }

})

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})
