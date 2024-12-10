import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Session, Vote } from '../types';

export const useSessionStore = defineStore('session', () => {
  const currentSession = ref<Session | null>(null);
  const votes = ref<Vote[]>([]);
  const revealed = ref(false);
  const participants = ref<Map<string, { username: string }>>(new Map());

  const fibonacciNumbers = [1, 2, 3, 5, 8, 13, 21, 34, 55];
  const specialValues = ['?', '☕'];

  const average = computed(() => {
    if (!votes.value.length) return null;
    const validVotes = votes.value.filter(v => v.value !== null && v.value >= 0);
    if (!validVotes.length) return null;
    const sum = validVotes.reduce((acc, vote) => acc + (vote.value || 0), 0);
    return Math.round(sum / validVotes.length);
  });

  const highestVote = computed(() => {
    if (!votes.value.length) return null;
    const validVotes = votes.value.filter(v => v.value !== null && v.value >= 0);
    if (!validVotes.length) return null;
    return Math.max(...validVotes.map(v => v.value || 0));
  });

  function createSession(sessionId: string) {
    currentSession.value = {
      id: sessionId,
      votes: [],
      revealed: false,
      average: null,
      highestVote: null
    };
  }

  function addParticipant(userId: string, username: string) {
    participants.value.set(userId, { username });
  }

  function removeParticipant(userId: string) {
    participants.value.delete(userId);
    votes.value = votes.value.filter(v => v.userId !== userId);
  }

  function updateVote(userId: string, username: string, value: number | null) {
    const existingVoteIndex = votes.value.findIndex(v => v.userId === userId);
    const voteData = {
      userId,
      username,
      value,
      individuallyRevealed: false
    };

    if (existingVoteIndex !== -1) {
      votes.value[existingVoteIndex] = voteData;
    } else {
      votes.value.push(voteData);
    }
  }

  function updateSessionState(state: any) {
    participants.value = new Map(state.participants);
    votes.value = Array.from(state.votes.values());
    revealed.value = state.revealed;
  }

  function revealVotes() {
    revealed.value = true;
  }

  function resetVotes() {
    votes.value = [];
    revealed.value = false;
  }

  return {
    currentSession,
    votes,
    revealed,
    participants,
    average,
    highestVote,
    fibonacciNumbers,
    specialValues,
    createSession,
    addParticipant,
    removeParticipant,
    updateVote,
    updateSessionState,
    revealVotes,
    resetVotes
  };
});