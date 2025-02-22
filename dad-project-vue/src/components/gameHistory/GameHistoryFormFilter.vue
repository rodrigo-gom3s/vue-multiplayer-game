<script setup>
import { useGamesStore } from '@/stores/games'

const gamesStore = useGamesStore()

</script>

<template>
<div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3">
    <!-- Label -->
    <label for="input_type" class="font-medium text-sm text-gray-800 dark:text-gray-200">
        Game Type
    </label>
    
    <!-- Select Dropdown -->
    <select 
        id="input_type" 
        class="p-2 h-10 w-full md:w-48 border border-gray-300 rounded-lg text-sm bg-white dark:bg-slate-600 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        v-model="gamesStore.typeFilter">
        <option value="singleplayer">Singleplayer</option>
        <option value="multiplayer">Multiplayer</option>
    </select>
</div>

</template>