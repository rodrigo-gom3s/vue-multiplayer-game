import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

export const useScoreboardsStore = defineStore('scoreboards', () => {
    const storeError = useErrorStore()
    const storeAuth = useAuthStore()
    const scoreboards = ref([])
    const filter = ref('null')
    const isLoading = ref(false)
    const showTable = ref(false)
    const isPersonal = ref(false)
    const gameMode = ref('')
    const filterMultiplayer = ref('')
    const originalScoreboards = ref([])
    const boards = ref([])

    const loadScores = async () => {
        clearScores()
        storeError.resetMessages()
        isLoading.value = true
        try {
            const response = await axios.get('/scoreboards/' + gameMode.value + (!isPersonal.value ? '/global/' : '/personal/')  + filter.value)
            .then((response) => {
                isLoading.value = false
                showTable.value = true
                return response
            })
            scoreboards.value = response.data
            // the global multiplayer scoreboard is a bit different from the rest
            if (gameMode.value === 'multiplayer' && !isPersonal.value) {
                boards.value = scoreboards.value.map(score => score.board)
                originalScoreboards.value = scoreboards.value
                filterMultiplayer.value = boards.value[0]
                scoreboards.value = originalScoreboards.value.filter(score => score.board === filterMultiplayer.value)
                scoreboards.value = scoreboards.value[0].players
            }

        } catch (e) {loadScores()
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Getting Games Error!')
        }
    }

    const showSingleplayerGlobal = () => {
        isPersonal.value = false
        filter.value = 'turns'
        gameMode.value = 'singleplayer'
        loadScores()
    }

    const showSingleplayerPersonal = () => {
        isPersonal.value = true
        filter.value = 'turns'
        gameMode.value = 'singleplayer'
        loadScores()
    }

    const showMultiplayerGlobal = () => {
        isPersonal.value = false
        filter.value = 'wins'
        gameMode.value = 'multiplayer'
        loadScores()
    }

    const showMultiplayerPersonal = () => {
        isPersonal.value = true
        filter.value = 'wins'
        gameMode.value = 'multiplayer'
        loadScores()
    }

    const clearScores = () => {
        showTable.value = false
        scoreboards.value = []
    }

    //reloads scores after changing the filter
    watch(filter, () => {
        loadScores()
    })

    //this one only applies the filter locally
    watch(filterMultiplayer, () => {
        scoreboards.value = originalScoreboards.value.filter(score => score.board === filterMultiplayer.value)
        //after filtering the boards, we get the players for a board
        scoreboards.value = scoreboards.value[0].players
    })

   
  return { loadScores, showSingleplayerGlobal, showSingleplayerPersonal, clearScores, showMultiplayerGlobal, showMultiplayerPersonal,
     showTable, scoreboards, filter, isLoading, isPersonal, gameMode, filterMultiplayer, boards }
})
