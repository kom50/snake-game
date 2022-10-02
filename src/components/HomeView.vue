<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSwipe } from '@vueuse/core'

const target = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)

const { direction } = useSwipe(
  target, {
  passive: false,
})
</script>
  
<template>
  <div ref="container" class="h-full w-full select-none">
    <div ref="target" class="h-full w-full bg-green-600">
      <p>Swipe {{direction}}</p>
    </div>
  </div>
</template>