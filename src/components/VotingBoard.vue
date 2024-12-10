<script setup lang="ts">
import { useSessionStore } from '../stores/session';
import { useUserStore } from '../stores/user';
import VotingCard from './VotingCard.vue';
import ResultImage from './ResultImage.vue';
import ParticipantsList from './ParticipantsList.vue';
import { ref } from 'vue';

const sessionStore = useSessionStore();
const userStore = useUserStore();
const selectedValue = ref<number | null>(null);

const handleVote = (value: number | null) => {
  if (sessionStore.revealed) return;
  selectedValue.value = value;
  sessionStore.vote(userStore.userId, userStore.username, value);
};
</script>

<template>
  <div class="p-8">
    <ParticipantsList />

    <div class="grid grid-cols-6 gap-4 mb-8">
      <VotingCard
        v-for="number in sessionStore.fibonacciNumbers"
        :key="number"
        :value="number"
        :selected="selectedValue === number"
        :revealed="sessionStore.revealed"
        @vote="handleVote"
      />
      <VotingCard
        value="?"
        :selected="selectedValue === null"
        :revealed="sessionStore.revealed"
        @vote="() => handleVote(null)"
      />
      <VotingCard
        value="☕"
        :selected="selectedValue === -1"
        :revealed="sessionStore.revealed"
        @vote="() => handleVote(-1)"
      />
    </div>

    <div class="flex justify-center gap-4">
      <button
        @click="sessionStore.revealVotes"
        class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        :disabled="sessionStore.revealed"
      >
        Révéler tous les votes
      </button>
      <button
        @click="sessionStore.resetVotes"
        class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Nouvelle estimation
      </button>
    </div>

    <div v-if="sessionStore.revealed" class="mt-8">
      <h2 class="text-xl font-bold mb-4">Résultats</h2>
      <div class="flex justify-center gap-8 mb-8">
        <div class="text-center">
          <p class="text-gray-600">Moyenne</p>
          <p class="text-3xl font-bold">{{ sessionStore.average || '-' }}</p>
        </div>
        <div class="text-center">
          <p class="text-gray-600">Vote le plus haut</p>
          <p class="text-3xl font-bold">{{ sessionStore.highestVote || '-' }}</p>
        </div>
      </div>
      <ResultImage :value="sessionStore.average" />
    </div>
  </div>
</template>