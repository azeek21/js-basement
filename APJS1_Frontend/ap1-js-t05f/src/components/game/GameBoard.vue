<script setup lang="ts">
interface Props {
  map: string
  onClick?: (clickCordinates: [number, number]) => unknown
}
const props = defineProps<Props>()
</script>

<template>
  <div
    class="w-full h-full grid grid-cols-3 grid-rows-3 rounded-lg border overflow-hidden shadow-lg gap-0"
  >
    <div
      class="border drop-shadow-lg aspect-square min-h-4 flex items-center justify-center text-4xl text-red-600 font-extrabold"
      v-for="(cell, i) in props.map"
      :key="`${cell}-${i}`"
      :onclick="() => props.onClick && props.onClick([Math.floor(i % 3), Math.floor(i / 3)])"
    >
      {{ cell }}
    </div>
  </div>
</template>
