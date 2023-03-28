<script setup lang="ts">
import TreePain from './TreePain.vue';
import EditorPain from './EditorPain.vue';

</script>
<template>
  <main class="bg-gray-200">
    <div class="flex h-screen">
      <div class="w-1/4 bg-gray-800 text-gray-100 py-4 px-2">
        <TreePain ></TreePain>
      </div> 
      <div class="w-full py-4 px-2">
        <EditorPain ></EditorPain>
      </div>
    </div>
  </main>
</template>
<style>
.resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
}

/* 水平リサイズ */
.resize-handle:hover {
  background-color: #ddd;
}

/* 垂直リサイズ */
.resize-handle--vertical:hover {
  background-color: #ddd;
}

/* 左右のペインのリサイズ */
.resize-handle--horizontal {
  cursor: ew-resize;
}

/* 上下のペインのリサイズ */
.resize-handle--vertical {
  cursor: ns-resize;
}
</style>