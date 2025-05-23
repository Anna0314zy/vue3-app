
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const open = ref(false)
  const menuRef = ref(null)
  </script>

<template>
  <div class="dropdown" @mouseenter="open = true" @mouseleave="open = false">
    <button class="dropdown-button">菜单</button>
    <div
      class="dropdown-content"
      :class="{ show: open }"
      ref="menuRef"
    >
      <div class="auto-div">除了默认的大小，按钮组件还提供了几种额外的尺寸可供选择，以便适配不同的场景。

使用 size 属性额外配置尺寸，可使用 large和small两种值。</div>
    </div>
  </div>
</template>
  
  <style scoped>
  .auto-div {
    width: 200px;
  }
  .dropdown {
    position: relative;
    display: inline-block;
  }
  
  .dropdown-button {
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 6px;
  }
  
  .dropdown-content {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease, padding 0.3s ease;
    background-color: #ecf0f1;
    border-radius: 6px;
    margin-top: 8px;
    padding: 0 10px;
  }
  
  .dropdown-content.show {
    max-height: 5000px; /* 足够大容纳内容 */
    padding: 10px;
  }
  
  .dropdown-item {
    padding: 5px 0;
    border-bottom: 1px solid #ccc;
  }
  
  .dropdown-item:last-child {
    border-bottom: none;
  }
  </style>
  