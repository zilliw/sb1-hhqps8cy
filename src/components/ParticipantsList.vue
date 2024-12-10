<script setup lang="ts">
import { computed } from 'vue';
import { useSessionStore } from '../stores/session';
import { useUserStore } from '../stores/user';
import type { Vote } from '../types';

const sessionStore = useSessionStore();
const userStore = useUserStore();

const participants = computed(() => {
  return sessionStore.votes.map(vote => ({
    ...vote,
    revealed: sessionStore.revealed || (vote.userId === userStore.userId && vote.individuallyRevealed)
  }));
});

function revealIndividualVote(userId: string) {
  if (userId === userStore.userId) {
    sessionStore.revealIndividualVote(userId);
  }
}

function getDisplayValue(vote: Vote & { revealed: boolean }) {
  if (!vote.value && vote.value !== 0) return '?';
  if (vote.value === -1) return '☕';
  if (!vote.revealed) return '?';
  return vote.value;
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6 mb-8">
    <h2 class="text-xl font-bold mb-4">Participants</h2>
    <div class="space-y-4">
      <div v-for="vote in participants" :key="vote.userId" 
           class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center space-x-4">
          <span class="font-medium">{{ vote.username || 'Anonyme' }}</span>
          <span class="text-2xl font-bold" :class="{
            'text-gray-400': !vote.value && vote.value !== 0,
            'text-blue-500': vote.value || vote.value === 0
          }">
            {{ getDisplayValue(vote) }}
          </span>
        </div>
        <button
          v-if="vote.userId === userStore.userId && !vote.revealed && vote.value !== null"
          @click="revealIndividualVote(vote.userId)"
          class="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          Révéler mon vote
        </button>
      </div>
    </div>
  </div>
</template>