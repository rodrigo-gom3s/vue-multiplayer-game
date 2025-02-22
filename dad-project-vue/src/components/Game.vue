<script setup>
import { ref, computed, watch, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import Card from './Card.vue'
import { inject } from 'vue' 
import { useRoute, useRouter } from 'vue-router'
import {  } from 'vue-router'
import { Card as CardComponent } from '@/components/ui/card'
import { useMemoryGame } from '../composables/memoryGame.js'
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/error'
import axios from 'axios';
import { useToast } from '@/components/ui/toast/use-toast'


const { toast } = useToast()
const storeAuth = useAuthStore()
const storeError = useErrorStore()

const route = useRoute()
const router = useRouter()

const game_id = ref(null);
const board_cols = ref(null);
const board_rows = ref(null);
const lastMoveDone = ref(0);
const total_turns = ref(1);

onBeforeMount(() => {

  if(game_id.value != null && storeAuth.user == null ){
    gameAlert.value.open(
        goToGamemode,  
          'Start the game the right way!', 
          `You cant start the game with game_id`
        ) 
        new Promise(r => setTimeout(r, 5000))
            .then(() =>{
              goToGamemode()
            })
  }
  else if(game_id.value != null){
    
    const response = axios.get(`/games/${game_id.value}`)
    .then((response) => {
         
      if(response.data.data.status == 'E' || response.data.data.status == 'I'){
        gameAlert.value.open(
        goToGamemode,  
          'the game has already finished!', 
          `You will be redirected to the chooseGame mode page in 5 seconds`
        ) 
        new Promise(r => setTimeout(r, 5000))
            .then(() =>{
              goToGamemode()
            })
      }
          
    })
  }else if(storeAuth.user != null){
    gameAlert.value.open(
        goToGamemode,  
          'Start the game the right way!', 
          `You will be redirected to the chooseGame mode page in 5 seconds`
        ) 
        new Promise(r => setTimeout(r, 5000))
            .then(() =>{
              goToGamemode()
            })
  }
  
});

onMounted(() => {
  if(storeAuth.user != null){
    storeAuth.getUserDataAfterUpdate()
  }
  

});

//STOPWATCH SHITTTTTTTTTTTTTTTTTTTTTTTTTTTTT


const startTime = ref(null); // When the stopwatch starts
const elapsedTime = ref(0); // Elapsed time in milliseconds
const isRunning = ref(false);
let intervalId = null;

// Compute formatted time
const formattedTime = computed(() => {
      const totalSeconds = elapsedTime.value / 1000; // Convert milliseconds to seconds
      return totalSeconds.toFixed(2); // Keep 3 decimal places for milliseconds
  });

// Start the stopwatch
const startStopwatch = () => {
  if (!isRunning.value) {
    isRunning.value = true;
    startTime.value = Date.now() - elapsedTime.value; // Account for paused time
    intervalId = setInterval(updateElapsedTime, 10);
  }
};

// Update the elapsed time
const updateElapsedTime = () => {
  elapsedTime.value = Date.now() - startTime.value;
};

// Stop the stopwatch
const stop = () => {
  isRunning.value = false;
  clearInterval(intervalId);
};

//STOP WATCH SHIT STOPS NOWWWWWWWWWWWWWWWWWWWWWWWWW


const gameInterrupted = computed(() => {

        return (formattedTime.value - lastMoveDone.value) >= 20 
})

game_id.value = route.query?.game_id ?? null;
board_cols.value = route.query?.board_cols ?? 3;
board_rows.value = route.query?.board_rows ?? 4;
//mudar para int. util
if((typeof board_cols.value) === "string"){
  board_cols.value = parseInt(board_cols.value)
  board_rows.value = parseInt(board_rows.value)
}

const {
    status,
    currentPlayer: player,
    cardsImages,
    pairsFound,
    gameWon,
    startGame
} = useMemoryGame(board_rows.value, board_cols.value)

const gameAlert = inject('gameAlert') 
//isto provalmente vai para dentro do composoble

const isMyTurn = ref(true);

let flippedPair = []

const resetTurn = () =>{
    lastMoveDone.value = formattedTime.value;
    isMyTurn.value = true;
}

const flipCard = (card) => {
    
    if(!isMyTurn.value || card.matched || card.flipped){
      return;
    }

    card.flipped = !card.flipped

    

    flippedPair.push(card)
    if (flippedPair.length === 2) {
        isMyTurn.value = false;
        total_turns.value = total_turns.value + 1;
        if (flippedPair[0].pair_id === flippedPair[1].pair_id 
                && flippedPair[0].id !== flippedPair[1].id) {
            pairsFound.value = pairsFound.value + 1;
            setTimeout(() => {
              flippedPair[0].matched = true
              flippedPair[1].matched = true
              flippedPair.splice(0, 2)
              resetTurn()
            }, 2000);
        }else{
          setTimeout(() => {
            flippedPair[0].flipped = false
            flippedPair[1].flipped = false
            flippedPair.splice(0, 2)
            resetTurn()
        }, 2000);
        }
        
    }
    lastMoveDone.value = formattedTime.value;
}

const goToGamemode = () =>{
    
  gameAlert.value.dissapearAlert()
  router.push({ name: 'gameMode'})
}

startGame(board_rows.value , board_cols.value)



startStopwatch()


watch(gameWon, (newValue, oldValue) => {
  if (newValue === true) {
    stop()
    gameAlert.value.open(
      goToGamemode,  
        'Congratulations!', 
        `You Cleared The board in ${formattedTime.value} and in ${total_turns.value - 1} turns.
        You will be redirected to game mode page in approximately 5 seconds. You can see the stats of your game in the game history 
        if you are a registered user`
    )

    if(storeAuth.user != null){
      try {
        const payload = {
          status: 'E',
          total_time: formattedTime.value,
          turns: total_turns.value == 1 ? total_turns.value : total_turns.value - 1
        };
        
        const response = axios.put(`/games/${game_id.value}`, payload)
        .then((response) => {
            //isto é um sleep
          new Promise(r => setTimeout(r, 5000))
          .then(() =>{
            goToGamemode()
          })
        });

      } catch (e) {
          
          storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Getting Games Error!')
      }
    }else{
        //isto é um sleep
        new Promise(r => setTimeout(r, 5000))
          .then(() =>{
            goToGamemode()
          })
    }
    
  }
});

watch(gameInterrupted, (newValue, oldValue) => {
  if (newValue === true) {
    stop()
    gameAlert.value.open(
      goToGamemode,  
        'You Stop playing the game', 
        `If you dont make a move in 20 seconds. your game will be interrupted. You will be
        redirect to the gameMode menu in approximately 5 seconds`
    )

    if(storeAuth.user != null){
      try {
        
        const payload = {
          status: 'I',
          total_time: formattedTime.value,
          turns: total_turns.value == 1 ? total_turns.value : total_turns.value - 1
        };
        const response = axios.put(`/games/${game_id.value}`, payload)
        .then((response) => {
            
          //isto é um sleep
          new Promise(r => setTimeout(r, 5000))
          .then(() =>{
            goToGamemode()
          })
            
        });

      } catch (e) {
          storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Getting Games Error!')
      }
    }else{
        //isto é um sleep
        new Promise(r => setTimeout(r, 5000))
          .then(() =>{
            goToGamemode()
          })
    }
    
  }
});

onBeforeUnmount(() => {
  if(game_id.value != null && !gameWon.value){
    toast({
        title: 'Game Interrumpted',
        description: `You left the game #${game_id.value}!`,
    })

    const response = axios.get(`/games/${game_id.value}`)
    .then((response) => {
         
      if(response.data.data.status == 'PL' ){
        const payload = {
          status: 'I',
          total_time: formattedTime.value,
          turns: total_turns.value == 1 ? total_turns.value : total_turns.value - 1
        };
        const response = axios.put(`/games/${game_id.value}`, payload)
        .then((response) => {
            
        });
      }
          
    })
  }
})

</script>

<template>
  <div class="flex justify-center items-center p-4">
    <CardComponent class="max-w-6xl h-auto rounded-lg bg-white dark:bg-gray-800 border-0 shadow-md p-4">
      <div class="text-center">
        <div class="space-y-6">
          <!-- Static Info: Game ID and Time -->
          <div class="space-y-2">
            <p v-if="game_id" class="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              Game #{{ game_id }}
            </p>
            <p v-else class="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              Game
            </p>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              {{ formattedTime }}
            </p>
          </div>

          <!-- Dynamic Info: Turn Indicator and Pairs Found -->
          <div class="space-y-2">
            
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
              Turn: 
              <span class="text-blue-600 dark:text-blue-400 font-bold">
                {{ total_turns }}
              </span>
            </p>
          </div>
        </div>
      </div>
        <div class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${board_cols}, minmax(0, 1fr))` }">
          <!-- Iterate over rows -->
          <div 
            v-for="cardsRow in cardsImages" 
            :key="cardsRow[0]?.id" 
            class="contents"
          >
            <!-- Iterate over cards in a row -->
            <div 
              v-for="card in cardsRow" 
              :key="card.id" 
              class="bg-white w-24 aspect-[3/4] dark:bg-gray-700 rounded p-1"
            >
              <Card 
                v-if="!card.matched" 
                :card="card" 
                @flip="flipCard" 
              />
            </div>
          </div>
        </div>
    </CardComponent>
  </div>
</template>
