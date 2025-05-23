<script setup lang="ts">
  import staticAsync from './components/staticAsync.vue';
import DropdownMenu from './components/DropdownMenu.vue';
import Virtual from './components/Virtual.vue';
</script>

<template>
  <!-- <staticAsync /> -->
  <!-- <DropdownMenu /> -->
    <Virtual/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
