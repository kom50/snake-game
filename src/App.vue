<script setup lang="ts">
import HomeView from './components/HomeView.vue'
</script>

<template>
  <div class="pt-1 h-screen w-screen p-0 m-0">
    <HomeView />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
