<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: number | null;
}>();

const imageUrl = computed(() => {
  if (!props.value) return '/images/question.svg';
  if (props.value <= 13) return '/images/easy.svg';
  if (props.value <= 34) return '/images/medium.svg';
  return '/images/hard.svg';
});

const getMessage = computed(() => {
  if (!props.value) return 'En attente des votes...';
  if (props.value <= 13) return 'Facile comme bonjour ! 🌟';
  if (props.value <= 34) return 'Un bon défi ! 💪';
  return 'Ouh là, ça va être costaud ! 🏋️‍♂️';
});
</script>

<template>
  <div class="text-center">
    <img :src="imageUrl" alt="Estimation result" class="w-32 h-32 mx-auto mb-4">
    <p class="text-lg font-medium text-gray-700">{{ getMessage }}</p>
  </div>
</template>