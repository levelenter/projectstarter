<script setup lang="ts">
import { ref } from 'vue';
import { GptChatService } from '../../generated/biz/remote/GptChatService';
const text = ref("");
const responseGpt = ref("");
const  onSend = async ()=>{
  const service = new GptChatService()
  const response = await service.sendMessage(text.value)
  responseGpt.value += "\n" + response.data.message.content;
  console.log(responseGpt.value);
}
</script>
<template>
  <div class="flex mb-4">
    <div class="w-1/2">
      <input type="text" class="bg-gray-100 w-full border border-gray-300 p-2 rounded-lg" placeholder="Search for files..." v-model="text">
    </div>
    <div class="w-1/2 text-right">
      <button class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600" @click="onSend">Send</button>
    </div>
  </div>

  <div class="bg-white rounded-lg p-4">
    <!-- Editor pane -->
    <textarea class="w-full h-full" placeholder="Start typing..." rows="30" v-model="responseGpt"></textarea>
  </div>
  <div class="bg-gray-800 text-gray-100 rounded-lg p-4 mt-4">
    <!-- Terminal pane -->
  </div>
</template>