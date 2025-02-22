<script setup>
import axios from 'axios';
import { VueSpinnerPacman } from 'vue3-spinners';
import { useErrorStore } from '@/stores/error';
import { ref } from 'vue';
import GamesPerMonth from './GamesPerMonth.vue';

const errorStore = useErrorStore()
const stats = ref(null)
const isLoading = ref(true)

axios.get(axios.defaults.baseURL + '/stats')
    .then(response => {
        stats.value = response.data
        isLoading.value = false
    })
    .catch(() => {
        errorStore.setErrorMessages('Could not provide the general statistics.')
    })

</script>

<template>
    <div v-if="isLoading" class="flex justify-center items-center h-32">
        <VueSpinnerPacman size="30" color="gray" />
    </div>
    <div v-else class="space-y-2 m-4">
        <p class="text-slate-700 dark:text-slate-300 m-4">The following information is about all the users on the platform</p>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">Total Games Registered:</span>
            <span class="dark:text-slate-300">{{ stats.games_registered }}</span>
        </div>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">Total Games Played:</span>
            <span class="dark:text-slate-300">{{ stats.games_played }}</span>
        </div>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">Total Singleplayer Games:</span>
            <span class="dark:text-slate-300">{{ stats.singleplayer_games_played }}</span>
        </div>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">Total Multiplayer Games:</span>
            <span class="dark:text-slate-300">{{ stats.multiplayer_games_played }}</span>
        </div>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">Total Users:</span>
            <span class="dark:text-slate-300">{{ stats.users }}</span>
        </div>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">Total Boards:</span>
            <span class="dark:text-slate-300">{{ stats.boards }}</span>
        </div>
        <div>
            <!-- GRAPH -->
            <GamesPerMonth :stats="stats.games_per_month"/>
        </div>
    </div>
</template>