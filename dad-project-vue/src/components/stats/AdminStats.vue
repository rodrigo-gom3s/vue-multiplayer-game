<script setup>
import { useErrorStore } from '@/stores/error';
import { VueSpinnerPacman } from 'vue3-spinners';
import { ref } from 'vue';
import axios from 'axios';
import RevenuePerMonth from './RevenuePerMonth.vue';
import TransactionsPerMonth from './TransactionsPerMonth.vue';

const errorStore = useErrorStore()
const stats = ref(null)
const isLoading = ref(true)

axios.get(axios.defaults.baseURL + '/stats/admin')
    .then(response => {
        stats.value = response.data
        isLoading.value = false
    })
    .catch(() => {
        errorStore.setErrorMessages('Could not provide the business statistics.')
    })

</script>

<template>
    <div v-if="isLoading" class="flex justify-center items-center h-32">
        <VueSpinnerPacman size="30" color="gray" />
    </div>
    <div v-else class="space-y-2 m-4">
        <p class="text-slate-700 dark:text-slate-300 m-4">The following information is about the business.</p>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">Total Revenue(€):</span>
            <span class="dark:text-slate-300">{{ stats.total_revenue }}</span>
        </div>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">User that spent the most money (€):</span>
            <span class="dark:text-slate-300">{{ stats.user_most_money_spent.user.nickname + " - " + stats.user_most_money_spent.total_euros_spent }}</span>
        </div>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">Total blocks on the platform:</span>
            <span class="dark:text-slate-300">{{ stats.total_blocks }}</span>
        </div>
        <div class="flex justify-between items-center">
            <span class="font-semibold dark:text-slate-100">Average Euros spent on a purchase (€):</span>
            <span class="dark:text-slate-300">{{ parseFloat(stats.average_euros_per_transaction).toFixed(2) }}</span>
        </div>
        <div>
            <!-- GRAPHS -->
            <RevenuePerMonth :stats="stats.revenue_per_month"/>
            <TransactionsPerMonth :stats="stats.transactions_per_month"/>
        </div>
    </div>
</template>