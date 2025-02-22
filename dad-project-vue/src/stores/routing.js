import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

export const useRoutingStore = defineStore('routing', () => {
    const route = ref(null);
    return{
        route
    }
});