<script setup>
import { useAuthStore } from '@/stores/auth';
import { VueSpinnerPacman } from 'vue3-spinners';
import { ref } from 'vue';
import axios from 'axios';
import WinsPerMonth from './WinsPerMonth.vue';
import { useErrorStore } from '@/stores/error';

const isLoading = ref(true)
const errorStore = useErrorStore()
const stats = ref(null)

axios.get(axios.defaults.baseURL + '/stats/my')
    .then(response => {
        stats.value = response.data
        isLoading.value = false
    })
    .catch(() => {
        errorStore.setErrorMessages('Could not provide your statistics.')
    })

</script>

<template>
    <div v-if="isLoading" class="flex justify-center items-center h-32">
        <VueSpinnerPacman size="30" color="gray" />
    </div>
    <div v-else class="space-y-2 m-4">
        <p class="text-slate-700 dark:text-slate-300 m-4">The following information is about all your stats on the platform.</p>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">Total Games Played:</span>
            <span class="dark:text-slate-300">{{ stats.singleplayer_games_played + stats.multiplayer_games_played }}</span>
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
            <span class="font-semibold dark:text-slate-100">Total Transactions:</span>
            <span class="dark:text-slate-300">{{ stats.transactions }}</span>
        </div>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">Total Euro Spent (€):</span>
            <span class="dark:text-slate-300">{{ stats.total_euro_spent }}</span>

        </div>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">Total Balance (Brain Coins):</span>
            <span class="dark:text-slate-300">{{ stats.brain_coins_balance }}</span>
        </div>
        <div>
            <!-- GRAPH -->
            <WinsPerMonth :stats="stats"/>
        </div>
    </div>
</template>