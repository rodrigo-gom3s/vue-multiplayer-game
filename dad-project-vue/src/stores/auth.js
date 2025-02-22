import { ref, computed, inject, watch } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import avatarNoneAssetURL from '@/assets/avatar_none.jpg'
import { useToast } from '@/components/ui/toast/use-toast'
import { useTransactionsStore } from '@/stores/transactions'


export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const storeError = useErrorStore()
    const socket = inject('socket')
    const transactions = useTransactionsStore()
    const equippedCard = ref('/cards/semFace.png')
    const { toast } = useToast()
    const user = ref(null)
    const token = ref('')

    const userName = computed(() => {
        return user.value ? user.value.name : ''
    })

    watch(user, () => {
        getEquippedCard()
    })

    const userFirstLastName = computed(() => {
        const names = userName.value.trim().split(' ')
        const firstName = names[0] ?? ''
        const lastName = names.length > 1 ? names[names.length -1 ] : ''
        return (firstName + ' ' + lastName).trim()
    })

    const gamesWon = computed(() => {
        return user.value ? user.value.games_won : 0
    })

    const userEmail = computed(() => {
        return user.value ? user.value.email : ''
    })

    const userType = computed(() => {
        return user.value ? user.value.type : ''
    })

    const cards = computed(() => {
        return user.value ? user.value.custom : null
    })

    const getEquippedCard = () => {
        if(user.value && user.value.custom){
                let has_one_equipped = false
                let cards_user 
                try{
                cards_user = JSON.parse(user.value.custom)
                }catch(e){
                    return
                }
                cards_user.forEach(card => {
                    if(card.equiped){
                        equippedCard.value = card.image
                        has_one_equipped = true
                    }
                })
                if(!has_one_equipped){
                    equippedCard.value = '/cards/semFace.png'
                }
        }else{
            equippedCard.value = '/cards/semFace.png'
        }
    } 

    const userGender = computed(() => {
        return user.value ? user.value.gender : ''
    })
    
    const nickname = computed(() => {   
        return user.value ? user.value.nickname : ''
    })

    const balance = computed(() => {
        return user.value ? user.value.brain_coins_balance : 0
    })

    const userPhotoUrl = computed(() => {
        const photoFile = user.value ? user.value.photo_filename ?? '' : ''
        if (photoFile) {
            return axios.defaults.baseURL.replaceAll("sslip.io/api","sslip.io"+photoFile)
        }
        return avatarNoneAssetURL
    })

    // This function is "private" - not exported by the store
    const clearUser = () => {
        resetIntervalToRefreshToken()
        if (user.value) {
            socket.emit('logout', user.value)
        }     
        user.value = null
        token.value = ''
        localStorage.removeItem('token')
        axios.defaults.headers.common.Authorization = ''
        router.push({ name: 'login' })
    }

    const validatePassword = async (password) => {
        storeError.resetMessages()
        try {
            const response = await axios.post('auth/validatepassword', { password })
            return response.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Current password is incorrect')
            return false
        }
    }

    const login = async (credentials) => {
        storeError.resetMessages()
        try {
            const responseLogin = await axios.post('auth/login', credentials)
            token.value = responseLogin.data.token
            localStorage.setItem('token', token.value)
            axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
            const responseUser = await axios.get('users/me')
            user.value = responseUser.data.data
            socket.emit('login', user.value)
            repeatRefreshToken()
            router.push({ name:'gameMode' })
            return user.value
        } catch (e) {
            clearUser()
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Authentication Error!')
            return false
        }
    }

    const logout = async () => {
        storeError.resetMessages()
        transactions.resetValues()
        try {
            await axios.post('auth/logout')
            clearUser()
            return true
        } catch (e) {
            clearUser()
            storeError.setErrorMessages(e.response.data.message, [], e.response.status, 'Authentication Error!')
            return false
        }
    }

    // These 2 functions and intervalToRefreshToken variable are "private" - not exported by the store
    let intervalToRefreshToken = null

    const resetIntervalToRefreshToken = () => {
        if (intervalToRefreshToken) {
            clearInterval(intervalToRefreshToken)
        }
        intervalToRefreshToken = null
    }

    const repeatRefreshToken = () => {
        if (intervalToRefreshToken) {
            clearInterval(intervalToRefreshToken)
        }
        intervalToRefreshToken = setInterval(async () => {
            try {
                const response = await axios.post('auth/refreshtoken')
                token.value = response.data.token
                localStorage.setItem('token', token.value)
                axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
                return true
            } catch (e) {
                clearUser()
                storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Authentication Error!')
                return false
            }
        }, 1000 * 60 * 110)  // repeat every 110 minutes

        // To test the refresh token, replace previous line with the following code
        // This will repeat the refreshtoken endpoint every 10 seconds:
        //}, 1000 * 10)

        return intervalToRefreshToken
    }

    const restoreToken = async function () {
        let storedToken = localStorage.getItem('token')
            if (storedToken) {
                try {
                    token.value = storedToken
                    axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
                    const responseUser = await axios.get('users/me')
                    user.value = responseUser.data.data
                    socket.emit('login', user.value)
                    repeatRefreshToken()
                    return true
                } catch {
                    clearUser()
                    return false
                }
        }
        return false
    }

    const canUpdateDeleteProject = (project) => {
        return project && user.value && (userType.value === 'A' || user.value.id === project.created_by_id)
    }

    /*const signup = async (credentials) => {
        storeError.resetMessages()
        try {
            const response = await axios.post('/users', credentials)
            router.push({ name:'login' })
            return response.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Signup Error!')
            return false
        }
    }*/

        /*
        const signup = async (credentials) => {
            const formData = new FormData()
            formData.append('email', credentials.email)
            formData.append('password', credentials.password)
            formData.append('name', credentials.name)
            formData.append('nickname', credentials.nickname)
            if (credentials.photo_filename) {
                formData.append('photo_filename', credentials.photo_filename)
            }
        
            try {
                const response = await axios.post('/users', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                router.push({ name: 'login' })
                return response.data
            } catch (e) {
                if (e.response) {
                    storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Signup Error!')
                } else {
                    storeError.setErrorMessages('An unexpected error occurred.')
                }
                return false
            }
        }*/

        const signup = async (credentials) => {
            const payload = {
                email: credentials.email,
                password: credentials.password,
                name: credentials.name,
                nickname: credentials.nickname,
                type: credentials.type,
                photo_filename: credentials.photo_filename // Base64 encoded image
            }
        
            try {
                let response = null;
                if(credentials.type === 'P'){
                     response = await axios.post('/users', payload, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                
                    router.push({ name: 'login' })
                }else{
                    response = await axios.post('/users/admin', payload, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                }
                toast({
                    description: 'User has been created correctly!',
                    })
                return response.data
            } catch (e) {
                if (e.response) {
                    storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Signup Error!')
                } else {
                    storeError.setErrorMessages('An unexpected error occurred.')
                }
                return false
            }
        }
        

        /*
        const updateProfile = async (credentials) => {
            //laravel nao aceira metodo put diretamente com o formData: problema ao dar update na info do user,isto nao atualiza logo tem de se dar reload a app

            const formData = new FormData()
            formData.append('_method', 'PUT')
            if (credentials.email) {
                formData.append('email', credentials.email)
            }
            if (credentials.name) {
                formData.append('name', credentials.name)
            }
            if (credentials.nickname) {
                formData.append('nickname', credentials.nickname)
            }
            if (credentials.password) {
                formData.append('password', credentials.password)
            }
            if (credentials.photo_filename) {
                formData.append('photo_filename', credentials.photo_filename)
            }
            
            try {
                const response = await axios.post(`/users/${user.value.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })

                await getUserDataAfterUpdate();
                
                router.push({ name: 'game' })

                return response.data
            } catch (e) {
                if (e.response) {
                    storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Signup Error!')
                } else {
                    storeError.setErrorMessages('An unexpected error occurred.')
                }
                return false
            }
        }*/

        const updateProfile = async (credentials) => {
            const payload = {}

            

            // Conditionally add fields to the payload
            if (credentials.email) {
                payload.email = credentials.email
            }
            if (credentials.name) {
                payload.name = credentials.name
            }
            if (credentials.nickname) {
                payload.nickname = credentials.nickname
            }
            if (credentials.photo_filename) {
                payload.photo_filename = credentials.photo_filename // Base64 encoded image
            }
            
            try {
                const response = await axios.put(`/users/${user.value.id}`, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                await getUserDataAfterUpdate();
        
                router.push({ name: 'myprofile' });

                toast({
                    description: 'Account info has been updated correctly!',
                    })
                    
                
                return response.data
            } catch (e) {
                if (e.response) {
                    storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Update Profile Error!')
                } else {
                    storeError.setErrorMessages('An unexpected error occurred.')
                }
                return false
            }
        }

        const updateProfilePassword = async (password) => {
            const payload = {}

            // Conditionally add fields to the payload
            if (password) {
                payload.password = password
            }
            
            
            try {
                const response = await axios.put(`/users/${user.value.id}`, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                await getUserDataAfterUpdate();
        
                router.push({ name: 'myprofile' });

                toast({
                    description: 'Password has been updated correctly!',
                    })
                
                return response.data
            } catch (e) {
                if (e.response) {
                    storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Update Profile Error!')
                } else {
                    storeError.setErrorMessages('An unexpected error occurred.')
                }
                return false
            }
        }

        const getUserDataAfterUpdate = async () => {
            try {
                const response = await axios.get('users/me')
                user.value = response.data.data
                return user.value
            } catch (e) {
                clearUser()
                storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Authentication Error!')
                return false
            
            }
        }

        const removeAccount = async () => {
            storeError.resetMessages()
            try {
                await axios.delete(`/users/${user.value.id}`)
                toast({
                    description: 'Your account has been deleted!',
                    })
                clearUser()
                return true
            } catch (e) {
                clearUser()
                storeError.setErrorMessages(e.response.data.message, [], e.response.status, 'Authentication Error!')
                return false
            }
        }

        const canDeleteOwnAccount = () => {
            return user.value && userType.value === 'P'
        }

        const isAdmin = () => {
            return user.value && userType.value === 'A'
        }

        const getFirstLastName = (fullName) => {
            const names = fullName.trim().split(' ')
            const firstName = names[0] ?? ''
            const lastName = names.length > 1 ? names[names.length -1 ] : ''
            return (firstName + ' ' + lastName).trim()
        }
    
        const updateUserCards = async (cards) => {
            let custom = {
             "data": cards
            }
            storeError.resetMessages()
            try {
                let response = await axios.put(`/users/${user.value.id}/card`, custom, {
                    headers: { 'Content-Type': 'application/json' },
                })
                user.value = response.data.data
                return true
            } catch (e) {
                storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error registering card!')
                return false
            }
        }
    return {
        user, userName, equippedCard, userFirstLastName, userEmail, cards, userType, userGender, userPhotoUrl, gamesWon, nickname, balance,
        login, logout, restoreToken, canUpdateDeleteProject, signup, updateProfile, validatePassword, updateProfilePassword, removeAccount, canDeleteOwnAccount, isAdmin,
        getFirstLastName, getUserDataAfterUpdate, updateUserCards
    }
})
