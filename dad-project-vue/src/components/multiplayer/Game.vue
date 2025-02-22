<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Card from '@/components/Card.vue'
import { inject } from 'vue' 
import { useRoute, useRouter } from 'vue-router'
import { Card as CardComponent } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/error'
import { useMultiplayerGamesStore } from '@/stores/multiplayerGames'
import axios from 'axios';
//import { useStopwatch } from 'vue-timer-hook';


const storeAuth = useAuthStore()
const storeError = useErrorStore()
const storeGames = useMultiplayerGamesStore()

const props = defineProps({
    game: {
        type: Object,
        required: true
    }
})

const route = useRoute()
const router = useRouter()

/*const game_id = ref(null);
const board_cols = ref(null);
const board_rows = ref(null);
*/
const lastMoveDone = ref(999);
//STOPWATCH 


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
const start = () => {
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

//STOPwatch COde stops now


const gameInterrupted = computed(() => {
        return (formattedTime.value - lastMoveDone.value) >= 20 
})

const gameAlert = inject('gameAlert') 
//isto provalmente vai para dentro do composoble

const flipCard = (card) => {
    
    //meter aqui um emit
    //props.game.total_time = formattedTime.value;
    storeGames.play(props.game,
      { 
        row: card.row,
        col: card.col,
      },
      formattedTime.value
    )
}

const closeGame = () => {
    
    //meter aqui um emit
    //props.game.total_time = formattedTime.value;
    storeGames.close(props.game)
}

const goToGamehistory = () =>{
    
  gameAlert.value.dissapearAlert()
  router.push('myprofile')
}

start()

const pairsFound = computed(() => {
  if(storeGames.playerNumberOfCurrentUser(props.game) == 1){
    return props.game.pairsFoundPlayerOne;
  }
  
  if(storeGames.playerNumberOfCurrentUser(props.game) == 2){
    return props.game.pairsFoundPlayerTwo;
  }  
  
});

const isMyTurn = computed(() => {
  return storeGames.playerNumberOfCurrentUser(props.game) == props.game.currentPlayer
  
});

onMounted(() => {
  storeAuth.getUserDataAfterUpdate()
});

watch(isMyTurn, (newValue, oldValue) => {
  if(newValue === true){
    
    lastMoveDone.value = formattedTime.value
    
  }else{
    lastMoveDone.value = 999
  }
});

watch(gameInterrupted, (newValue, oldValue) => {
  if(gameInterrupted.value == true){
    props.game.total_time = formattedTime.value;
    
    storeGames.userStoppedPlaying(props.game)
    
  }
});

if(storeGames.playerNumberOfCurrentUser(props.game) == props.game.currentPlayer){
  lastMoveDone.value = formattedTime.value
}

onBeforeUnmount(() => {

  storeAuth.getUserDataAfterUpdate()

});

</script>

<template>
  <div class="flex justify-center items-center p-4">
    <CardComponent class="max-w-6xl h-auto rounded-lg bg-white dark:bg-gray-800 border-0 shadow-md p-4">
      <div class="text-center">
        <div class="space-y-6">
          <!-- Static Info: Game ID and Time -->
          <div class="space-y-2">
            <p class="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              Game #{{ game.id }}
            </p>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              {{ formattedTime }}
            </p>
          </div>

          <!-- Dynamic Info: Turn Indicator and Pairs Found -->
          <div class="space-y-2">
            <p 
              v-if="isMyTurn" 
              class="text-lg font-medium text-green-600 dark:text-green-400"
            >
              Your turn
            </p>
            <p 
              v-else 
              class="text-lg font-medium text-red-600 dark:text-red-400"
            >
              Opponent's Turn
            </p>
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
              Pairs Found: 
              <span class="text-blue-600 dark:text-blue-400 font-bold">
                {{ pairsFound }}
              </span>
            </p>
          </div>

          <!-- Close Button -->
          <div class="flex justify-center">
            <button 
              @click="closeGame"
              class="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-800"
            >
              Close
            </button>
          </div>
        </div>
      <br>
        <!-- Grid container with dynamic columns -->
        <div class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${game.board_id.board_cols}, minmax(0, 1fr))` }">
          <!-- Iterate over rows -->
          <div 
            v-for="cardsRow in game.board" 
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
      </div>
    </CardComponent>
  </div>
</template>

