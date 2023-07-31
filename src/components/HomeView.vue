<template>
  <div ref="container" class="h-full w-full select-none">
    <svg ref="target" class="h-full w-full bg-green-600 border-[10px] border-gray-500">
      <text y='20' x='10'>Status : {{ status }}</text>
      <text y='20' :x='width - 100'> Score : {{ score }}</text>
      <rect class='rect' width='10' height='10' x='60' y='130' style='fill: red; stroke-width:2px; '></rect>
      <rect class='rect' width='10' height='10' x='50' y='130' style='fill: blue; stroke-width:2px; '></rect>
      <rect class='rect' width='10' height='10' x='40' y='130' style='fill: blue; stroke-width:2px; '></rect>
      <rect ref="food" width='10' rx='20' height='10' x='150' y='230'
        style='fill: rgb(0, 195, 255); stroke-width:0px; stroke:blue'></rect>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, } from 'vue'
import { SwipeDirection, useSwipe, useWindowSize } from '@vueuse/core'

const target = ref<HTMLCanvasElement | null>(null);
const container = ref<HTMLElement | null>(null);
const food = ref<HTMLElement | null>(null);

const snakeX = ref([] as number[])
const snakeY = ref([] as number[])
const x = ref(60);
const y = ref(130);

const foodX = ref(150);
const foodY = ref(230);

const snakeSize = ref(3);
const score = ref(0);
const status = ref('PAUSE');
const snakeBody = ref<HTMLCollectionOf<Element> | null>(null);

const previousDirection = ref('LEFT' as SwipeDirection)
const timer = ref(0)

// Window height and width 
const { width, height } = useWindowSize()

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
        // if (direction as string === 'SPACE') {
        // return;
        // }
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

function addSnakeBody() {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect')
  rect.setAttribute('class', 'rect')
  rect.setAttribute('x', snakeX.value[snakeSize.value - 1] + '')
  rect.setAttribute('y', snakeY.value[snakeSize.value - 1] + '')
  rect.setAttribute('height', '10');
  rect.setAttribute('width', '10');
  rect.setAttribute('fill', 'blue');

  // Add snake body in last position
  snakeX.value[snakeSize.value] = Number(snakeBody.value![snakeSize.value - 1].getAttribute('x'));
  snakeY.value[snakeSize.value] = Number(snakeBody.value![snakeSize.value - 1].getAttribute('y'));
  snakeSize.value++;
  target.value!.appendChild(rect)
}

function eatFood() {
  if (foodX.value === x.value && foodY.value === y.value) {
    score.value++;
    generateFood();
    addSnakeBody();
  }
}

function printFood() {
  if (food.value) {
    food.value.setAttribute('x', String(foodX.value));
    food.value.setAttribute('y', String(foodY.value));
  }
}

function generateFood() {
  foodX.value = Math.floor(Math.random() * (width.value - 10) / 10) * 10;
  foodY.value = Math.floor(Math.random() * (height.value - 10) / 10) * 10;

  printFood()
}

function full() {
  container.value?.requestFullscreen()
}

function run(directionValue: SwipeDirection) {

  timer.value = setInterval(function start() {
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
    eatFood()

    return start;
  }(), 75);

}

onMounted(() => {
  window.addEventListener('click', full)
  if (target.value)
    snakeBody.value = target.value.getElementsByClassName('rect');

  for (let i = 0; i < snakeBody.value!.length; i++) {
    const body = snakeBody.value![i];
    snakeX.value[i] = parseInt(body.getAttribute('x')!)
    snakeY.value[i] = parseInt(body.getAttribute('y')!)
  }

  //keyboard for desktop devices
  window.addEventListener('keydown', function (event: KeyboardEvent) {
    const dir = event.code.replace('Arrow', '').toUpperCase() as SwipeDirection
    if (['DOWN', 'LEFT', "RIGHT", "UP", "SPACE"].includes(dir)) {
      if (previousDirection.value === 'LEFT' && dir !== 'RIGHT'
        || previousDirection.value === 'RIGHT' && dir !== 'LEFT'
        || previousDirection.value === 'UP' && dir !== 'DOWN'
        || previousDirection.value === 'DOWN' && dir !== 'UP') {
        clearInterval(timer.value)
        if (dir as string === 'SPACE') {
          status.value = 'PAUSE'
          return;
        }
        status.value = 'PLAYING'
        previousDirection.value = dir
        run(previousDirection.value)
      }
    }
  })
})
</script>