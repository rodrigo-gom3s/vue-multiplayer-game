import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { useToast } from '@/components/ui/toast/use-toast'
import { useRoutingStore } from '@/stores/routing'



export const useTransactionsStore = defineStore('transactions', () => {
    const filter = ref("");
    const nickname = ref("");
    const isLoading = ref(true);
    const transactions = ref([]);
    const pages = ref(0)
    const currentPage = ref(1)
    const totalItems = ref(0)
    const storeAuth = useAuthStore();
    const storeError = useErrorStore();
    const { toast }  = useToast()
    let response
    const routing = useRoutingStore();

    const nextPage = () => {
        if (currentPage.value < pages.value) {
            currentPage.value++
            loadTransactions()
        }
    }

    const previousPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--
            loadTransactions()
        }
    }

    const toPage = (page) => {
        currentPage.value = page
        loadTransactions()
    }
    const lastPage = () => {
        currentPage.value = pages.value
        loadTransactions()
    }

    const loadTransactions = async () => {
        isLoading.value = true;
        storeError.resetMessages();
        let apiUrl = '/transactions';

        if (nickname.value != "") {
            apiUrl += '/users/' + nickname.value;
        }
        if (filter.value != "") {
            apiUrl += '/type/' + filter.value;
        }

        try {
                response = await axios.get(apiUrl + '?page=' + currentPage.value)
                transactions.value = response.data.data
                pages.value = response.data.meta.last_page
                currentPage.value = response.data.meta.current_page
                totalItems.value = response.data.meta.total*2
                isLoading.value = false
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error Loading the Transactions!')
        }
    }

    const resetValues = () => {
        filter.value = ""
        nickname.value = ""
        isLoading.value = true
        transactions.value = []
        pages.value = 0        
        currentPage.value = 1        
        totalItems.value = 0    
    }

    const resetPaginator = () => {
        pages.value = 0
        currentPage.value = 1
        totalItems.value = 0
    }    

    const insertTransaction = async (transaction) =>{
        storeError.resetMessages();
        const external_verification_url = "https://dad-202425-payments-api.vercel.app/api/debit"
        const external_verification_payload = {
            type: transaction['payment_type'],
            reference: transaction['payment_reference'],
            value: transaction['euros']
        } 

        try {
            await axios.post(external_verification_url, external_verification_payload, {
              headers: {
                'Content-Type': 'application/json',
                'X-Allow-This-Request': 'true',
              },
              withCredentials: false,
            });

            await axios.post('/transactions', transaction, {
              headers: { 'Content-Type': 'application/json' },
            });

            toast({
              title: 'Purchase Completed',
              description: `Your product has been bought successfully. Please refresh the page if the credits are not appearing`,
              variant: "destructive",
              class: "group border-green-500 bg-green-500 text-neutral-50",
            });

            storeAuth.getUserDataAfterUpdate();
            routing.route = { name: 'home' };
        
          } catch (e) {
            const errorMessage = e.response?.data?.message || 'An unexpected error occurred';
            const errorDetails = e.response?.data?.errors || [];
            const errorStatus = e.response?.status || 500;
        
            storeError.setErrorMessages(errorMessage, errorDetails, errorStatus, 'Error buying the product! You will not be charged.');
          }
        }

    const registerCardPurchase = async (userCards, card) => {
        storeError.resetMessages();
        const transaction = {
            user_id: storeAuth.user.id,
            brain_coins: -card.price,
            type: 'I'
        }    
        try{
            await axios.post('/transactions', transaction).then(response => {   
                let response_cards = storeAuth.updateUserCards(userCards)
                if(response_cards){
                    toast({
                        title: 'Purchase Completed',
                        description: `Your product has been bought successfully. Please refresh the page if the credits are not appearing`,
                        variant: "destructive",
                        class: "group border-green-500 bg-green-500 text-neutral-50",
                      })
                }
            })
            return true
        }catch(e){
            const errorMessage = e.response?.data?.message || 'You do not have enough credits to buy this card';
            storeError.setErrorMessages(errorMessage, e.response.data.errors, e.response.status, 'Error Buying the Card. You will not be charged.')
            return false
        }
    }

    return{
        filter,
        nickname,
        isLoading,
        transactions,
        pages,
        currentPage,
        totalItems,
        loadTransactions,
        toPage,
        previousPage,
        nextPage,
        lastPage,
        resetValues,
        resetPaginator,
        insertTransaction,
        registerCardPurchase,
    }
});