<script setup>
import { ref, computed, watch } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBoardsStore } from '@/stores/boards';
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios';
import { useErrorStore } from '@/stores/error'
import { VueSpinnerPacman } from 'vue3-spinners'


const storeAuth = useAuthStore()
const storeError = useErrorStore()
const router = useRouter()

const singlePlayerChosen = ref(false);
const multiPlayerChosen = ref(false);
const isLoading = ref(false);

const boardsStore = useBoardsStore()
boardsStore.loadBoards()

const clickSingle = () =>{
    singlePlayerChosen.value = true;
    multiPlayerChosen.value = false;
}

const clickMulti = () =>{
  router.push({ name: 'multiplayerGames'})
}

const  startGame = async (board) =>{
    
    isLoading.value = true
    if(storeAuth.user == null){
        router.push({ name: 'game'})
    } else if(singlePlayerChosen.value){

        try {
            const payload = {
            created_user_id: storeAuth.user.id,
            type: 'S',
            board_id: board.id,
            };

            const response = await axios.post('/games', payload)
            isLoading.value = false
            //fazer update das coins visualmente
            console.log(response)
            if(response.request.status == 201){
              router.push({ name: 'game', query: {game_id: response.data.data.id, 
                                                board_cols: board.board_cols, 
                                                board_rows: board.board_rows}})
            }
            

        } catch (e) {
            
            isLoading.value = false
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Getting Games Error!')
        }
    } else{
      //multiplayershit here
      router.push({ name: 'multiplayerGames'})
    }
    
}

const checkAvailbleBoards = (board) =>{

    if(board.board_cols == 3 && board.board_rows ){
        return true;
    }

    if(storeAuth.user != null || storeAuth.balance >= 1){
        return true;
    }
    return false;
    
}

</script>



<template class="relative">
  
    <div v-if="isLoading"
      class="absolute inset-0 bg-gray-800 bg-opacity-50 flex flex-col justify-center items-center p-4 space-y-6 z-50">
      <div class="text-white text-xl">Creating your game...</div>
      <!-- You can use a spinner here -->
        <VueSpinnerPacman size="30" color="black" />
    </div>
    <div class="flex flex-col justify-center items-center p-4 space-y-6">
      <!-- First Card: Game Mode Selection -->
      <Card class="w-full max-w-6xl h-auto rounded-lg bg-white dark:bg-gray-800 border-0 shadow-md">
        <CardHeader class="px-4">
          <CardTitle class="text-lg md:text-xl text-black dark:text-white">Choose Game Mode</CardTitle>
          <CardDescription class="text-sm md:text-base">
            Select a game mode to start playing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <!-- Singleplayer Button -->
            <div @click="clickSingle" class="p-6 text-white rounded-lg shadow-lg cursor-pointer"
              :class="{
                'bg-blue-500 hover:bg-blue-600': !singlePlayerChosen,
                'bg-blue-800': singlePlayerChosen
              }">
              <h2 class="text-xl font-bold">Singleplayer</h2>
              <p class="text-sm mt-2">
                Play on your own and challenge yourself.
              </p>
            </div>
            <!-- Multiplayer Button -->
            <div>
              <div v-if="storeAuth.user != null || storeAuth.balance >= 5" @click="clickMulti" class="p-6 text-white rounded-lg shadow-lg cursor-pointer"
                :class="{
                  'bg-green-500 hover:bg-green-600': !multiPlayerChosen,
                  'bg-green-800': multiPlayerChosen
                }">
                <h2 class="text-xl font-bold">Multiplayer</h2>
                <p class="text-sm mt-2">
                  Create or Join a lobby. Challenge others in a battle of brains and memory.
                </p>
              </div>
              <div v-else class="p-6 text-white rounded-lg shadow-lg cursor-pointer bg-green-800">
                <h2 class="text-xl font-bold">Multiplayer</h2>
                <div class="flex justify-center">
                  <p v-if="storeAuth.user == null" class="text-sm mt-2">You need to register to play this game mode</p>
                  <p v-else class="text-sm mt-2">You need to 5 brains coins to play the game</p>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                          <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
                  </svg>
                  
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  
      <!-- Second Card: Board Selection -->
      <Card v-show="singlePlayerChosen || multiPlayerChosen" class="w-full max-w-6xl h-auto rounded-lg bg-white dark:bg-gray-800 border-0 shadow-md">
        <CardHeader class="px-4">
          <CardTitle class="text-lg md:text-xl text-black dark:text-white">Choose the Board</CardTitle>
          <CardDescription class="text-sm md:text-base">
            Select the type of board that you want to play and start the game. Its free to play the board 3x4 all other boards cost 1 brain coin!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
            <!-- Board Button -->
            <div v-for="board in boardsStore.boards" class="p-4 bg-gray-500 hover:bg-gray-600 text-white text-center rounded-lg shadow-md cursor-pointer">
                <div v-if="checkAvailbleBoards(board)" @click="startGame(board)">
                    <h2 class="text-lg font-bold">{{ board.board_cols +'x'+ board.board_rows}} Board</h2>
                </div>
                <div v-else class="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                        <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
                    </svg>
                </div> 
            </div>
            
          </div>
        </CardContent>
      </Card>
    </div>
  
</template>

  