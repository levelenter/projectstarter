<script lang="ts" setup>
import { reactive } from 'vue';
import DropDownTriangle from "../ui/DropDownTriangle.vue";
import { Assessment } from '../../generated/dto/Assessment';
import { Session } from '../../generated/biz/Session';
import { MessageDialog } from '../../generated/biz/MessageDialog';
import { AssessmentService } from '../../generated/biz/remote/AssessmentService';
const assessment = reactive({
  language: "",
  skillLevel: "",
  target: "",
  jobContent: "",
});

const submitForm = async ()=>{
  const user = Session.getSessionUser()
  if(!user || !user.user_id){
    MessageDialog.error("ログインしてください。")
    return;
  }

  const dto = new Assessment();
  dto.assessment_time = new Date();
  dto.language_learn = assessment.language;
  dto.skill_level = assessment.skillLevel;
  dto.target_learn = assessment.target;
  dto.job_content = assessment.jobContent;
  dto.user_id = user.user_id;

  const biz = new AssessmentService();
  const result = await biz.save(dto);
  location.href = "./editor"
}
</script>
<template>
  <div class="container p-4   w-full flex justify-center">
    <div class="border shadow w-3/4 p-4 bg-white">
      <h1 class="text-2xl font-bold mb-4">プログラミング能力アセスメントフォーム</h1>
      <section class="  rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="language">言語</label>
          <div class="relative">
            <select v-model="assessment.language"
              class="block appearance-none w-full bg-gray-100 border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id="language" name="language">
              <option value="">選択してください</option>
              <option value="Java">Java</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python</option>
              <option value="PHP">PHP</option>
              <option value="C#">C#</option>
              <option value="C++">C++</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <DropDownTriangle></DropDownTriangle>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="skill-level">
            現在のスキルレベル
          </label>
          <div class="relative">
            <select v-model="assessment.skillLevel"
              class="block appearance-none w-full bg-gray-100 border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id="skill-level" name="skill-level">
              <option value="">選択してください</option>
              <option value="超初心者">超初心者</option>
              <option value="初心者">初心者</option>
              <option value="他言語経験者">他言語経験者</option>
              <option value="経験1−2年">経験1−2年</option>
              <option value="経験3−4年">経験3−4年</option>
              <option value="経験5年以上">経験5年以上</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <DropDownTriangle></DropDownTriangle>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="target">
          ターゲット
          </label>
          <div class="relative">
            <select 
              v-model="assessment.target"
              class="block appearance-none w-full bg-gray-100 border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id="target" name="target">
              <option value="">選択してください</option>
              <option value="Webサーバーサイド">Webサーバーサイド</option>
              <option value="Webフロントエンド">Webフロントエンド</option>
              <option value="組み込み">組み込み</option>
              <option value="機械学習">機械学習</option>
              <option value="ゲーム">ゲーム</option>
              <option value="デザイン">デザイン</option>
            </select>
            <DropDownTriangle></DropDownTriangle>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="job-content">
        業務内容(簡潔に記述してください)
        </label>
        <textarea 
          v-model="assessment.jobContent"
          class="block appearance-none w-full bg-gray-100 border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id="job-content" name="job-content" rows="5"></textarea>
      </div>
      <div class="flex items-center justify-between">
        <button @click="submitForm"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >
        送信する
        </button>
      </div>
    </section>
  </div>
</div>
</template>