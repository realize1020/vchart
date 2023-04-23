<template>
  <div>
    <!--flex弹性盒子模型，justify-content：主抽 -->
    <div style="display: flex;justify-content: center;margin-top: 150px">
      <el-card style="width: 400px display: flex;justify-content: center">
        <div slot="header" class="clearfix">
          <span>登录</span>
        </div>
        <table>
          <tr id="userNametd">
            <td>用户名</td>
            <td>
              <!-- <el-input v-model="user.username" placeholder="请输入用户名" v-on:change="handleChangeUserName" ></el-input> -->
              <el-input id="el-input" v-model="user.username" placeholder="请输入用户名" v-on:change="handleChangeUserName" ></el-input>
              <!-- <p class="hidden"><p/> -->
            </td>
          </tr>
          <tr id="passWordtd"> 
            <td>密码</td>
            <td>
              <!-- <el-input type="password" v-model="user.password" placeholder="请输入密码" v-on:change="handleChangePassword" @keydown.enter.native="doLogin"></el-input> -->
              <el-input type="password" v-model="user.password" placeholder="请输入密码" v-on:change="handleChangePassword" @keydown.enter.native="doLogin"></el-input>
              <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
            </td>
          </tr>
          <tr>
            <!-- 占两行-->
            <td colspan="2">
              <!-- 点击事件的两种不同的写法v-on:click和 @click-->
              <!--<el-button style="width: 300px" type="primary" v-on:click="doLogin">登录</el-button>-->
              <el-button :loading="loading"  style="width: 300px;display:flex;justify-content: center;" type="primary" @click="doLogin">登录</el-button>
            </td>
          </tr>
        </table>
      </el-card>
    </div>
  </div>
</template>
<script>
import { MessageBox } from 'element-ui'
import { login } from "../api/login.js"
import { isvalidUsername } from "../utils/validate.js"
//import {request} from '../utils/request'
//import {Alert} from 'element-ui'
  export default {
    //单页面中不支持前面的data:{}方式
    data() {
      radio:""
      //相当于以前的function data(){},这是es5之前的写法，新版本可以省略掉function
      const validateUsername = (rule , value , callback) => {
          if(!isvalidUsername(value)){
            callback(new Error('请输入正确的用户名'))
          }else{
            callback()
          }
        };
      const validatePass = (rule , value , callback) => {
          if(value.length <3 ){
            callback(new Error('密码不能小于三位数'))
          }else{
            callback()
          }
        };

      return{
        //之前是在里面直接写username，password等等，但是这里要写return
        //因为一个组件不管要不要被其他组件用，只要这样定义了，它就会认为可能这个组件会在其他的组件中使用
        //比如说在这里定义了一个变量，然后把这个组件引入到A组件中，A组件中修改了这个变量
        //同时这个组件也在B组件中引用了，这时候A里面一修改，B里面也变了，它们用的是一个值
        //可是一般来说可能希望在不同的组件中引用的时候，使用不同的值，所以这里要用return
        //这样在A组件和B组件分别引用这个变量的时候是不会互相影响的
        user:{
          username:'zhangsan',
          password:'123',
          //为了登录方便，可以直接在这里写好用户名和密码的值
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePass}]
        },
        loading: false,
      }
    },
    //  watch: {
    //   $route: {
    //     handler: function(route) {
    //       this.redirect = route.query && route.query.redirect
    //     },
    //     immediate: true
    //   },
    //   // radio: function () {
    //   //   if (this.radio === '1') {
    //   //     this.holder = '用户名为空！'
    //   //   } else {
    //   //     this.holder = '请输入用户名'
    //   //   }
    //   // }
    // },
    methods:{
      async doLogin(){//一点击登录按钮，这个方法就会执行
        //alert(JSON.stringify(this.user))//可以直接把this.user对象传给后端进行校验用户名和密码
        // let params = {
        //     username : this.user.username,
        //     password : this.user.password,
        // };
        this.loading = true
        await login(this.user).then(res =>{
            //alert(res.data);
            console.log(res)
            if(res.data.code !=200){
              this.loading = false
              //alert("登陆失败！");//todo 能不能把后端的详细信息输出在跳转的页面上，也就是两个页面之间的数据传递。
              MessageBox.alert("登录失败")
            }else{
              this.loading = false
              this.$router.push({path: '/Main'})
              //that.$router.push({name:'Main'});
            }
           
        })
        // .catch(() =>{
        //   alert("登陆错误！");
        // })
      },
      async handleChangeUserName(){
        // if(this.user.username.length<=0){
        //   MessageBox.alert("用户名为空！")
        // }
        const para = document.createElement("p");
        para.style.color = 'tomato'
        const node = document.createTextNode("用户名为空！");
        var userNametd = document.getElementById("userNametd");
        if(this.user.username.length<=0){
            //MessageBox.alert("用户名为空！")
            //this.$refs.username.focus()
            // console.log(document.getElementById("el-input").getAttribute("placeholder"));//.style.color = "#f00";
            // document.getElementById("el-input").setAttribute("placeholder","用户名为空！");
            console.log(para.childNodes)
            if(para.childNodes.length==0){
              para.appendChild(node);
              userNametd.appendChild(para);
            }
             
        }else{
          if(userNametd.childElementCount == 3){
            userNametd.removeChild(userNametd.lastChild);
          }
           
           //userNametd.removeChild(para);
          //  userNametd.childNodes.forEach(child => {
          //     console.log(child)
          //     if(child.lastChild){
          //       userNametd.removeChild(child.child.lastChild)
          //     }
          //   });
        }
      },
      async handleChangePassword(){
        // if(this.user.password.length<=0){
        //   MessageBox.alert("密码为空！")
        // }
        const para = document.createElement("p");
        para.style.color = 'tomato'
        const node = document.createTextNode("密码为空！");
        var passWordtd = document.getElementById("passWordtd");
        if(this.user.password.length<=0){
            //MessageBox.alert("用户名为空！")
            //this.$refs.username.focus()
            // console.log(document.getElementById("el-input").getAttribute("placeholder"));//.style.color = "#f00";
            // document.getElementById("el-input").setAttribute("placeholder","用户名为空！");
            console.log(para.childNodes)
            if(para.childNodes.length==0){
              para.appendChild(node);
              //document.getElementById("passWordtd").appendChild(para);
              passWordtd.appendChild(para);
            }
             
        }else{
          if(passWordtd.childElementCount == 3){
            passWordtd.removeChild(passWordtd.lastChild);
          }
           
           //userNametd.removeChild(para);
          //  userNametd.childNodes.forEach(child => {
          //     console.log(child)
          //     if(child.lastChild){
          //       userNametd.removeChild(child.child.lastChild)
          //     }
          //   });
        }
      }
      // login(){

      //   const url = 'http://localhost:9091/login'
      //   let user = {name:this.name,password:this.password}
      //   request.post(url,user).then(
      //     res => {
      //       console.log(res)
      //       if(res.code===200) {
      //         this.$message('登录成功');
      //         console.log("成功")
      //       }else{
      //         this.$message.warning('用户密码错误');
      //         console.log("失败")
      //       }
      //     }
      //   )
      // }
    }
  }
</script>
<style scoped>
</style>

