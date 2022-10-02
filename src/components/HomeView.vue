<template>
  <div ref="container" class="h-full w-full select-none">
    <svg ref="target" class="h-full w-full bg-green-600" width='330' height='400'>
      <text y='16' x='10'>Status : Pause </text>
      <text y='16' x='250'> Score : 0</text>
      <rect class='rect' width='10' height='10' x='60' y='130' style='fill: red; stroke-width:2px; '></rect>
      <rect class='rect' width='10' height='10' x='50' y='130' style='fill: blue; stroke-width:2px; '></rect>
      <rect class='rect' width='10' height='10' x='40' y='130' style='fill: blue; stroke-width:2px; '></rect>
      <rect id='food' width='10' rx='20' height='10' x='150' y='230'
        style='fill: rgb(0, 195, 255); stroke-width:0px; stroke:blue'></rect>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { SwipeDirection, useSwipe, useWindowSize } from '@vueuse/core'

const target = ref<HTMLCanvasElement | null>(null);
const container = ref<HTMLElement | null>(null);
const element = ref<HTMLElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);

const snakeX = ref([] as number[])
const snakeY = ref([] as number[])
const x = ref(60);
const y = ref(130);
const snakeSize = ref(3);
const score = ref(0);
const snakeBody = ref<HTMLCollectionOf<Element> | null>(null);

const previousDirection = ref('LEFT' as SwipeDirection)
const timer = ref(0)
const speed = ref(90)

// Window height and width 
const { width, height } = useWindowSize()

watch([width, height], () => {
  console.log("🚀 ~ file: HomeView.vue ~ line 38 ~ width, height", width.value, height.value)
})

const { direction } = useSwipe(
  target, {
  passive: false,
  onSwipe: () => {

    if (direction.value !== 'NONE' && direction.value !== previousDirection.value) {
      if (previousDirection.value === 'LEFT' && direction.value !== 'RIGHT'
        || previousDirection.value === 'RIGHT' && direction.value !== 'LEFT'
        || previousDirection.value === 'UP' && direction.value !== 'DOWN'
        || previousDirection.value === 'DOWN' && direction.value !== 'UP') {
        clearInterval(timer.value)
        if (direction.value)
          previousDirection.value = direction.value
        run(previousDirection.value)
      }
    }
  }
})


function generateSnakePosition() {
  snakeX.value.pop();
  snakeX.value.unshift(x.value);
  snakeY.value.pop();
  snakeY.value.unshift(y.value);
}

function printSnake() {
  generateSnakePosition()
  for (let i = 0; i < snakeSize.value; i++) {
    snakeBody.value![i].setAttribute('x', snakeX.value[i].toString());
    snakeBody.value![i].setAttribute('y', snakeY.value[i].toString());
  }
}

function full() {
  target.value?.requestFullscreen()
}

function run(directionValue: SwipeDirection) {
  timer.value = setInterval(() => {
    switch (directionValue) {
      case 'RIGHT':
        x.value += 10
        break
      case 'LEFT':
        x.value -= 10
        break
      case 'UP':
        y.value -= 10
        break
      case 'DOWN':
        y.value += 10
        break
    }
    printSnake()
  }, speed.value);

}

onMounted(() => {
  if (target.value)
    snakeBody.value = target.value.getElementsByClassName('rect');

  for (let i = 0; i < snakeBody.value!.length; i++) {
    const body = snakeBody.value![i];
    snakeX.value[i] = parseInt(body.getAttribute('x')!)
    snakeY.value[i] = parseInt(body.getAttribute('y')!)
  }

  //keyboard for desktop devices
  window.addEventListener('keydown', function (event: KeyboardEvent) {
    const dir = event.key.replace('Arrow', '').toUpperCase() as SwipeDirection
    if (['DOWN', 'LEFT', "RIGHT", "UP"].includes(dir) && dir !== previousDirection.value) {
      if (previousDirection.value === 'LEFT' && dir !== 'RIGHT'
        || previousDirection.value === 'RIGHT' && dir !== 'LEFT'
        || previousDirection.value === 'UP' && dir !== 'DOWN'
        || previousDirection.value === 'DOWN' && dir !== 'UP') {
        clearInterval(timer.value)
        previousDirection.value = dir
        run(previousDirection.value)
      }
    }
  })
})
</script>