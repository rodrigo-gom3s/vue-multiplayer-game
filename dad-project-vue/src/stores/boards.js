import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useErrorStore } from '@/stores/error'
import axios from 'axios'

export const useBoardsStore = defineStore('boards', () => {
    const storeError = useErrorStore()
    const boards = ref([])

    const loadBoards = async () => {
        storeError.resetMessages()
        try {
            const response = await axios.get('/boards')
            boards.value = response.data.data

        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Getting Games Error!')
        }
    }


  return { loadBoards, boards }
})