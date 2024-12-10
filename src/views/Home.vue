<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const username = ref('')
const roomCode = ref('')
const error = ref('')

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function validateForm(checkRoomCode = false) {
  if (!username.value.trim()) {
    error.value = 'Le pseudo est obligatoire'
    return false
  }
  if (checkRoomCode && !roomCode.value.trim()) {
    error.value = 'Le code de la salle est obligatoire'
    return false
  }
  return true
}

async function createRoom() {
  if (!validateForm()) return
  
  userStore.setUser(username.value)
  const newRoomCode = generateRoomCode()
  await router.push(`/room/${newRoomCode}`)
}

async function joinRoom() {
  if (!validateForm(true)) return
  
  userStore.setUser(username.value)
  await router.push(`/room/${roomCode.value.toUpperCase()}`)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Planning Poker
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent>
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Pseudo</label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Votre pseudo"
            >
          </div>
          <div>
            <label for="room-code" class="sr-only">Code de la salle</label>
            <input
              id="room-code"
              v-model="roomCode"
              type="text"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Code de la salle (pour rejoindre)"
            >
          </div>
        </div>

        <div class="flex flex-col space-y-4">
          <button
            @click="createRoom"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Créer une nouvelle salle
          </button>
          <button
            @click="joinRoom"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Rejoindre une salle
          </button>
        </div>

        <p v-if="error" class="mt-2 text-center text-sm text-red-600">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>