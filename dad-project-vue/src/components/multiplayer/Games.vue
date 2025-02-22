<script setup>
import { onMounted } from 'vue'
import Game from './Game.vue'
import { useMultiplayerGamesStore } from '@/stores/multiplayerGames';

const storeMultiplayerGames = useMultiplayerGamesStore()

onMounted(() => {
    storeMultiplayerGames.fetchPlayingGames()
})
</script>

<template>
    <div class="flex flex-wrap justify-stretch">
        <Game v-for="game in storeMultiplayerGames.games" :key="game.id" :game="game">
        </Game>
    </div>
</template>