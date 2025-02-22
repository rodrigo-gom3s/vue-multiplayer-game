<script setup>
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { onMounted, ref, computed, watch} from 'vue'
import ListGamesLobby from './ListGamesLobby.vue'
import { useLobbyStore } from '@/stores/lobby'
import { useBoardsStore } from '@/stores/boards'
import { useAuthStore } from '@/stores/auth'

const storeAuth = useAuthStore()
const storeLobby = useLobbyStore()
const storeboard = useBoardsStore()
//id board por defeito
const board_id = ref(1)
const cols = ref(3)
const rows = ref(4)

watch(board_id, (newValue, oldValue) => {
    
    storeboard.boards.forEach(board => {
        if (board.id == board_id.value ){
            cols.value = board.board_cols
            rows.value = board.board_rows
        }
    });  

});

/*const board = computed(() => {
    storeboard.boards.forEach(board => {
        if (board.id == board_id ){
            return board.board_rows
        }
    });    
})*/
onMounted(() => {
    storeLobby.fetchGames()
    storeboard.loadBoards()
})
</script>

<template>
    <Card class="my-8 py-2 px-1">
        <CardHeader class="pb-0">
            <CardTitle>Lobby</CardTitle>
            <CardDescription>{{ storeLobby.totalGames == 1 ? '1 game' : storeLobby.totalGames + ' games'}} waiting.</CardDescription>
        </CardHeader>
        <CardContent class="p-4">
            <div v-if="storeAuth.balance >= 5" class="py-2 flex items-center space-x-4">
                <Button @click="storeLobby.addGame(board_id, cols, rows)">
                    New Game
                </Button>
                <select v-model="board_id" class="p-2 border rounded">
                    <option v-for="board in storeboard.boards" :value="board.id">{{ board.board_cols + 'x' + board.board_rows }}</option>
                </select>
            </div>
            <div v-else class="py-2 flex items-center space-x-4">
                <Button >
                    Can´t play Games 
                </Button>
                <p>Buy more brain coins</p>
            </div>
            <div v-if="storeLobby.totalGames > 0">
                <ListGamesLobby></ListGamesLobby>
            </div>
            <div v-else>
                <h2 class="text-xl">The lobby is empty!</h2>
            </div>
        </CardContent>
    </Card>
</template>