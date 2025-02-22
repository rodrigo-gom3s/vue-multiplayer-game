import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/components/ui/toast/use-toast'

export const useMultiplayerGamesStore = defineStore('multiplayerGames', () => {
    const storeAuth = useAuthStore()
    const storeError = useErrorStore()
    const { toast } = useToast()
    const socket = inject('socket')

    const games = ref([])

    const totalGames = computed(() => games.value.length)

    // Use this function to update the game object in the games array
    const updateGame = (game) => {
        const gameIndex = games.value.findIndex((g) => g.id === game.id)
        if (gameIndex !== -1) {
            games.value[gameIndex] = { ...game } // shallow copy
        }
    }

    const playerNumberOfCurrentUser = (game) => {
        if (game.player1_id === storeAuth.user.id) {
            return 1
        }
        if (game.player2_id === storeAuth.user.id) {
            return 2
        }
        return null
    }  

    const webSocketServerResponseHasError = (response) => {
        if (response.errorCode) {
            storeError.setErrorMessages(response.errorMessage, [], response.errorCode)
            return true
        }
        return false
    }

    const removeGameFromList = (game) => {
        const gameIndex = games.value.findIndex((g) => g.id === game.id)
        if (gameIndex >= 0) {
            games.value.splice(gameIndex, 1)
        }
        
    }

    // fetch playing games from the Websocket server
    const fetchPlayingGames = () => {
        storeError.resetMessages()
        socket.emit('fetchPlayingGames', (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            games.value = response
        })
    }

    const play = (game, idx, time) => {
        storeError.resetMessages()
        socket.emit('play', {
                index: idx,
                gameId: game.id,
                time: time,
        }, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            updateGame(response)
        })
    }
    
    const quit = (game) => {
        storeError.resetMessages()
        socket.emit('quitGame', game.id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            removeGameFromList(game)
        })
    } 

    const close = (game) => {
        storeError.resetMessages()
        socket.emit('closeGame', game.id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            removeGameFromList(game)
            storeAuth.getUserDataAfterUpdate()
        })
    }

    const userStoppedPlaying = (game) => {
        storeError.resetMessages()
        socket.emit('userStopppedPlaying', {gameId: game.id, type: 1}, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            storeAuth.getUserDataAfterUpdate()
        })
    }

    const leaveTabMultiplayerGames = () =>{
        games.value.forEach(game => {
            socket.emit('userStopppedPlaying', {gameId: game.id, type: 2}, (response) => {
                if (webSocketServerResponseHasError(response)) {
                    return
                }
                
            })
        });
    }
    
    socket.on('gameStarted', async (game) => {
        if (game.player1_id === storeAuth.user.id) {
            toast({
                    title: 'Game Started',
                    description: `Game #${game.id} has started!`,
                })
        }
        fetchPlayingGames()
    })

    socket.on('gameEnded', async (game) => {
        updateGame(game)
        // Player that created the game is responsible for updating on the database
        if (playerNumberOfCurrentUser(game) === 1) {
            const APIresponse = await axios.put('games/multiplayer/' + game.id, {
                status: 'E',
                winner_user_id: game.gameStatus === 1 ? game.player1_id : (game.gameStatus === 2 ? game.player2_id : null),
                creator_user_id: game.player1_id,
                total_time: game.total_time,
                player1_pairs_discovered: game.pairsFoundPlayerOne,
                player2_user_id: game.player2_id,
                player2_pairs_discovered: game.pairsFoundPlayerTwo,
                turns: game.turn
            })
            
        }
        if( storeAuth.user.id == (game.gameStatus === 1 ? game.player1_id : (game.gameStatus === 2 ? game.player2_id : null))){
            toast({
                title: 'Game has ended',
                description: `You won the game #${game.id}! Congratulations!!`,
            })
        }else{
            toast({
                title: 'Game has ended',
                description: `You lost the game #${game.id}! Better luck next time!!`,
            })
        }
        
        removeGameFromList(game)
    })

    socket.on('gameChanged', (game) => {
        updateGame(game)
    })

    socket.on('gameQuitted', async (payload) => {
        if (payload.userQuit.id != storeAuth.user.id) {
            toast({
                title: 'Game Quit',
                description: `${payload.userQuit.name} has quitted game #${payload.game.id}, giving you the win!`,
            })
        }
        updateGame(payload.game)
    })

    socket.on('gameInterrupted', async (payload) => {
        if (payload.userInterrumpted.id != storeAuth.user.id) {
            toast({
                title: 'Game Interrumpted',
                description: `${payload.userInterrumpted.name} has not played a move in 20 seconds. On the game #${payload.game.id}, it will count has a win!`,
            })
        }else{
            toast({
                title: 'Game Interrumpted',
                description: `You have not played a move in 20 seconds. The game #${payload.game.id} will count has a loss!`,
            })
        }
        updateGame(payload.game)
    })

    socket.on('gameLeaveTab', async (payload) => {
        
        toast({
            title: 'Game Interrumpted',
            description: `${payload.userInterrumpted.name} has not lefted the tab of multiplayerGames. On the game #${payload.game.id}, it will count has a win!`,
        })
        
        updateGame(payload.game)
    })

    socket.on('gameEndedInterrumpted', async (payload) => {
        updateGame(payload.game)
        // o que ganha é que faz o post
        //(playerNumberOfCurrentUser(game) === 1)
        if (payload.userInterrumpted.id != storeAuth.user.id) {
            const APIresponse = await axios.put('games/multiplayer/' + payload.game.id, {
                status: 'I',
                winner_user_id: storeAuth.user.id,
                creator_user_id: payload.game.player1_id,
                total_time: payload.game.total_time,
                player1_pairs_discovered: payload.game.pairsFoundPlayerOne,
                player2_user_id: payload.game.player2_id,
                player2_pairs_discovered: payload.game.pairsFoundPlayerTwo,
                turns: payload.game.turn
            })
            const updatedGameOnDB = APIresponse.data.data
            
        }

        removeGameFromList(payload.game)
    })

    //socket.on opponent stop playing
    
    return {
        games, totalGames, playerNumberOfCurrentUser, fetchPlayingGames, play, quit, close, userStoppedPlaying, leaveTabMultiplayerGames
    }
})
