<script setup>
import { useScoreboardsStore } from '@/stores/scoreboards'

const storeScoreboards = useScoreboardsStore()

</script>

<template>
    <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3">
        <!-- Label -->
        <label for="input_type" class="font-medium text-sm text-gray-800 dark:text-gray-200">
            See performance by:
        </label>
        
        <!-- Select Dropdown -->
        <select 
            id="input_type" 
            class="p-2 h-10 w-full md:w-48 border border-gray-300 rounded-lg text-sm bg-white dark:bg-slate-600 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            v-model="storeScoreboards.filter">
            <option v-show="storeScoreboards.gameMode == 'singleplayer'" value="turns">Turns</option>
            <option v-show="storeScoreboards.gameMode == 'singleplayer'" value="time">Total Time</option>
            <option v-show="storeScoreboards.gameMode == 'multiplayer'" value="wins">Wins</option>
            <option v-show="storeScoreboards.gameMode == 'multiplayer'" value="losses">Losses</option>
        </select>

        <br>

        <div v-if="storeScoreboards.gameMode == 'multiplayer' && !storeScoreboards.isPersonal">
            <!-- Label -->
            <label for="input_board_type" class="font-medium text-sm text-gray-800 dark:text-gray-200">
                Board:
            </label>
            <!-- Select Boards Dropdown -->
            <select 
                id="input_board_type" 
                class="p-2 h-10 w-full md:w-48 border border-gray-300 rounded-lg text-sm bg-white dark:bg-slate-600 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                v-model="storeScoreboards.filterMultiplayer">
                <option v-for="score in storeScoreboards.boards" 
                    :value="score">{{ score }}</option>            
            </select>
        </div>
    </div>
    
</template>
