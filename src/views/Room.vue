<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useSessionStore } from '../stores/session'
import VotingBoard from '../components/VotingBoard.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const sessionStore = useSessionStore()

const roomCode = ref(route.params.id as string)
const showShareDialog = ref(false)
const roomUrl = ref('')

onMounted(() => {
  roomUrl.value = window.location.href
  sessionStore.createSession(roomCode.value)
})

function leaveRoom() {
  userStore.clearUser()
  router.push('/')
}

async function copyRoomUrl() {
  await navigator.clipboard.writeText(roomUrl.value)
  showShareDialog.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Salle: {{ roomCode }}</h1>
          <p class="text-sm text-gray-600">Connecté en tant que {{ userStore.username }}</p>
        </div>
        <div class="flex space-x-4">
          <button
            @click="showShareDialog = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Partager
          </button>
          <button
            @click="leaveRoom"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Quitter
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <VotingBoard />
    </main>

    <!-- Modal de partage -->
    <div v-if="showShareDialog" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Partager la salle
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Partagez ce lien avec vos collègues :
              </p>
              <div class="mt-2 flex rounded-md shadow-sm">
                <input
                  type="text"
                  readonly
                  :value="roomUrl"
                  class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                >
                <button
                  @click="copyRoomUrl"
                  class="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 text-gray-500 sm:text-sm"
                >
                  Copier
                </button>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-6">
            <button
              @click="showShareDialog = false"
              class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>