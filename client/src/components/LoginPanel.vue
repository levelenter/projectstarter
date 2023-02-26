<script lang='ts' setup>
import { ref } from "vue";
import Axios from 'axios';
import { AuthService } from '../generated/biz/remote/AuthService';
const mail = ref("")
const password = ref("")
const login = async ()=>{
  const data = {
    mail:  mail.value,
    password: password.value
  }
  const response = await Axios.post<{"ok":string}>("/api/login", data)
    .catch(error=>{
      alert(error.message)
    })
  if(!response){return }
  const json = response.data;
  console.log(json);
}

const test = async ()=>{
  console.log("test");
  const response = await Axios.get("/api/test");
  const json = response.data;
  console.log(json);
}
const authTest = async ()=>{
  console.log("test");
  const response = await Axios.post("/api/test_auth");
  const json = response.data;
  console.log(json);
}

const getUser = async ()=>{
  const biz = new AuthService()
  const user = await biz.getLoginUserInfo("hoge")
  console.log("user",user);
}

const getConfig = async ()=>{
  const response = await Axios.post("/api/config");
  const json = response.data;
  console.log(json);
}


</script>
<template>
  <div class="container">
    <label class="w-10 me-3">mail</label><input class="w-124 h-10 rounded border shadow m-3" type="text"  v-model="mail" ><br>
    <label class="w-10 me-3">pass</label><input class="w-124 h-10 rounded border shadow m-3" type="password"  v-model="password"><br>
    <button class="btn" @click="login">Loginボタン</button><br/>
    
    <button class="btn" @click="test">testボタン</button>
    <button class="btn" @click="authTest">authTestButton</button>
    <button class="btn" @click="getUser">getuser</button>
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