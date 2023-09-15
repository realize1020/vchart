<template>
  <div>
    <!--flex弹性盒子模型，justify-content：主抽 -->
    <div style="display: flex;justify-content: center;margin-top: 150px">
      <el-card style="width: 400px display: flex;justify-content: center">
        <div slot="header" class="clearfix">
          <span>登录</span>
        </div>
        <el-form ref="loginForm" :model="user" :rules="loginRules" class="login-form" auto-complete="on" label-position="left" label-width="100px">
            <el-form-item prop="username" label="用户名：">
              <el-input
                ref="username"
                v-model="user.username"
                placeholder="请输入用户名"
                name="username"
                type="text"
                auto-complete="off"
              /> 
            </el-form-item>

            <el-form-item prop="password" label="密码：">
              <el-input
                ref="password"
                v-model="user.password"
                type="password"
                placeholder="请输入密码"
                name="password"
                auto-complete="off"
                @keyup.enter.native="doLogin"
              />
            </el-form-item>
            <el-form-item>
              <div class="password clearfix">
                <!-- <el-image class="codeImg" :src="imgUrl" @click="resetImg"></el-image> -->
                <!-- <el-image class="codeImg" src="http://localhost:9091/api/code/verifyCode" @click="this.src='http://localhost:9091/api/code/verifyCode?d='+new Date()*1"></el-image> -->
                
                <el-image class="codeImg" :src="imgUrl" @click="resetImg"></el-image>
              </div>
            </el-form-item>
            
            <el-form-item prop="verifyCode" label="验证码：">
                <!-- <input type="text" id="verifyCode" placeholder="请输入验证码" maxlength="6"> -->
              <el-input 
                ref="verifyCode"
                v-model="user.verifyCode"  
                type="text" 
                name="verifyCode" 
                placeholder="请输入验证码" 
                auto-complete="off"  
                @keyup.enter.native="doLogin"
                />
            </el-form-item>
           

            <el-button :loading="loading"  style="width: 300px;display:flex;justify-content: center;" type="primary" @click="doLogin">登录</el-button>
          </el-form>

        <!-- <table>
          <tr id="userNametd">
            <td>用户名</td>
            <td>
              <!-- <el-input v-model="user.username" placeholder="请输入用户名" v-on:change="handleChangeUserName" ></el-input> -->
              <!-- <el-input id="el-input" v-model="user.username" placeholder="请输入用户名" v-on:change="handleChangeUserName" ></el-input> -->
              <!-- <p class="hidden"><p/> -->
            <!-- </td> -->
         <!--  </tr>
          <tr id="passWordtd"> 
            <td>密码</td>
            <td>
              <!-- <el-input type="password" v-model="user.password" placeholder="请输入密码" v-on:change="handleChangePassword" @keydown.enter.native="doLogin"></el-input> -->
              <!-- <el-input type="password" v-model="user.password" placeholder="请输入密码" v-on:change="handleChangePassword" @keydown.enter.native="doLogin"></el-input> -->
              <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
            <!-- </td>
          </tr>
          <tr>
            <!-- 占两行-->
            <!-- <td colspan="2">
              <!-- 点击事件的两种不同的写法v-on:click和 @click-->
              <!--<el-button style="width: 300px" type="primary" v-on:click="doLogin">登录</el-button>-->
           <!--    <el-button :loading="loading"  style="width: 300px;display:flex;justify-content: center;" type="primary" @click="doLogin">登录</el-button>
            </td>
          </tr>
        </table> -->
      </el-card>
    </div>
  </div>
</template>
<script>
import { MessageBox } from 'element-ui'
//import { login } from "../api/login.js"
import { login,ValidateCode } from "@/api/login.js"
// import {ValidateCode} from "@/api/login.js"
import axios from 'axios'
//import { isvalidUsername } from "../utils/validate.js"
import { isvalidUsername } from "@/utils/validate.js"
//import request from '../utils/request.js'
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
      const validateVerifyCode = (rule , value , callback) => {
          if(value.length < 1){
            callback(new Error('验证码不能为空'))
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
          verifyCode:''
          //为了登录方便，可以直接在这里写好用户名和密码的值
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePass}],
          verifyCode:[{required: true, trigger: 'blur',validator: validateVerifyCode}]
        },
        loading: false,
        //imgUrl:'http://localhost:8181/root/code?time='+new Date(),
        //imgUrl:this.resetImg(),
        //imgUrl:'http://localhost:9091/api/code/verifyCode?time='+new Date(),
        //写成接口形式，不直接把请求地址写在这
        imgUrl:"",
      }
    },
    created () {
      //this.getCaptcha()
      this.resetImg()
    },
    methods:{
      async doLogin(){//一点击登录按钮，这个方法就会执行
        this.loading = true
        await login(this.user).then(res =>{
            //alert(res.data);
            console.log(res)
            if(res.data.code !=200){
              this.loading = false
              //alert("登陆失败！");//todo 能不能把后端的详细信息输出在跳转的页面上，也就是两个页面之间的数据传递。
              MessageBox.alert("登录失败")
            }else{
              //登录成功
              this.loading = false
              this.loginSuccessMessageAndopenCenter()
              //储存token和用户信息
              localStorage.setItem("token",res.data.data.token)
              //this.$router.push({path: this.redirect || '/'})
              this.$router.push({path: '/'})
              //that.$router.push({name:'Main'});
            }
           
        })
      },
      //登录成功的提示
      loginSuccessMessageAndopenCenter() {
        this.$message({
          message: '登录成功！',
          center: true,
          type: 'success'
        });
      },
      async handleChangeUserName(){
        const para = document.createElement("p");
        para.style.color = 'tomato'
        const node = document.createTextNode("用户名为空！");
        var userNametd = document.getElementById("userNametd");
        if(this.user.username.length<=0){
            console.log(para.childNodes)
            if(para.childNodes.length==0){
              para.appendChild(node);
              userNametd.appendChild(para);
            }
             
        }else{
          if(userNametd.childElementCount == 3){
            userNametd.removeChild(userNametd.lastChild);
          }
        }
      },
      async handleChangePassword(){
        const para = document.createElement("p");
        para.style.color = 'tomato'
        const node = document.createTextNode("密码为空！");
        var passWordtd = document.getElementById("passWordtd");
        if(this.user.password.length<=0){
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
        }
      },


      // 获取验证码,直接写死请求地址不太好
      // resetImg(){
      //   this.imgUrl = 'http://localhost:9091/api/code/verifyCode?time='+new Date();
      // }
      resetImg(){
        var date = new Date();
        ValidateCode(date).then(res =>{
          console.debug("ValidateCode",res);
            let url = window.URL.createObjectURL(res.data);
            this.imgUrl = url;
          // this.imgUrl=res.data.data.verifyImage;
          // console.debug("uuid",res.data.data.uuid);
        })
        
      },
      
      

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
.codeImg {
        margin-top: 5px;
        float: right;
    }
</style>

