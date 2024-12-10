<script setup lang="ts">
defineProps<{
  value: number | string;
  selected: boolean;
  revealed: boolean;
}>();

defineEmits<{
  (e: 'vote', value: number | null): void;
}>();
</script>

<template>
  <button
    @click="$emit('vote', typeof value === 'number' ? value : null)"
    :class="[
      'w-20 h-32 rounded-lg shadow-md transition-transform transform hover:scale-105',
      selected ? 'bg-blue-500 text-white' : 'bg-white',
      revealed ? 'cursor-default' : 'cursor-pointer'
    ]"
    :disabled="revealed"
  >
    <span class="text-2xl font-bold">{{ value }}</span>
  </button>
</template>