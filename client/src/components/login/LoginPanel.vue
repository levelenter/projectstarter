<script lang='ts' setup>
import { ref } from "vue";
import Axios from 'axios';
import { AuthService } from '../../generated/biz/remote/AuthService';
import { MessageDialog } from "../../generated/biz/MessageDialog";
import { UserInSession } from "./UserInSession";
import { Session } from "../../generated/biz/Session";
const mail = ref("")
const password = ref("")
const login = async ()=>{
  const biz = new AuthService()
  try{
    console.log("log")
    const response = await biz.login(mail.value,password.value);
    console.log(response)
    if(!response){
      console.log("レスポンスがありません")
      return 
    }
    console.log("ログイン時のサーバー問い合わせに失敗しました。")

    // 認証エラーが返ってきている場合
    if(response.hasError){
      MessageDialog.error(response.errorDescription)
      return;
    }

    // ログイン成功
    console.log(response)
    const authUser = response.data;
    console.log(authUser);
    const user = new UserInSession()
    user.user_id = authUser.user_id;
    user.auth_tags = authUser.auth_tags;
    user.name = authUser.user_name;
    user.mail = authUser.mail;
    user.token  = authUser.token;
    Session.set("session_user",user);
    location.href = "./assessment"
  }catch(e){
    MessageDialog.error(`ログイン時のサーバー問い合わせに失敗しました。`)
    console.log(e);
  }
}

const test = async ()=>{
  console.log("test");
  try{
    const response = await Axios.get("http://localhost:8888/test");
    const json = response.data;
    console.log(json);
  }catch(e){
    MessageDialog.info("エラー",e.message)
    console.log(e);
  }
}

const authTest = async ()=>{
  try{
    console.log("test");
    const response = await Axios.post("http://localhost:8888/test_auth");
    const json = response.data;
    console.log(json);
  }catch(e){
    MessageDialog.info("エラー",e.message)
    console.log(e);
  }
}

const getUser = async ()=>{
  const biz = new AuthService()
  const user = await biz.getLoginUserInfo("hoge")
  console.log("user",user);
}

const getConfig = async ()=>{
  const response = await Axios.post("http://localhost:8888/config");
  const json = response.data;
  console.log(json);
}

const message = async ()=>{
  MessageDialog.info("message",true)
}

</script>
<template>
  <div class="container">
    <form @submit.prevent="login">
      <label class="w-10 me-3">mail</label><input class="w-124 h-10 rounded border shadow m-3" type="text"  v-model="mail" ><br>
      <label class="w-10 me-3">pass</label><input class="w-124 h-10 rounded border shadow m-3" type="password"  v-model="password"><br>  
      <input  class="btn" type="submit"  value="Loginボタン">
    </form>
    
    <button class="btn" @click="test">testボタン</button>
    <button class="btn" @click="authTest">authTestButton</button>
    <button class="btn" @click="getUser">getuser</button>
    <button class="btn" @click="message">Message</button>
  </div>

</template>
<style>
.btn {
  @apply w-1/2 border rounded h-10 bg-blue-400
}
.container{
  height: 10rem;
  width:1/2
}
</style>