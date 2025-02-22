<script setup>
import { useRoutingStore } from '@/stores/routing';
import { ref } from 'vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';
import { useTransactionsStore } from '@/stores/transactions'; 
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { inject } from 'vue'
import { useAuthStore } from '@/stores/auth';


const routing = useRoutingStore();
const transactionsStore = useTransactionsStore()
const route = useRoute();
const params = route.params
const alertDialog = inject('alertDialog')
const storeAuth = useAuthStore()
let selectedPack = route.params.pack 
let transaction = {}

const payementOptionsMaximum = {
    paypal_max: 10,
    iban_max: 50,
    mb_max: 20,
    visa_max: 30,
    mbway_max: 5
} 
const packPrices = {
    B: 5,
    S: 10,
    P: 20
};

const brain_coins_ammout = {
    B: 50,
    S: 100,
    P: 200
}
const packNames = {
    B: "Basic",
    S: "Standard",
    P: "Premium"
}
const errorMessageContent = ref("")
const payment_reference = ref("")
const paymentMethod = ref("")
const hasError = ref(false)

watch(paymentMethod, () => {
      payment_reference.value = ""
      hasError.value = false
      errorMessageContent.value = ""
});


const finishPurchase = () => {
    if(payment_reference.value == ""){
        hasError.value = true
        errorMessageContent.value = "The payment reference is required"
    }
    else if(hasError.value != true){
         transaction = {
            user_id: storeAuth.user.id,
            type: "P",
            brain_coins: brain_coins_ammout[selectedPack],
            euros: packPrices[selectedPack],
            payment_type: paymentMethod.value,
            payment_reference: payment_reference.value
        }
        alertDialog.value.open(insertTransaction, 'Purchase Confirmation', 'Cancel', `Yes`,
        `Are you sure you want to buy this product? You won't be able to refund this purchase.`)
    }
}

const insertTransaction = () => {
    transactionsStore.insertTransaction(transaction)
}


const validatePayment = () => {
    if(payment_reference.value == ""){
        errorMessageContent.value = ""
        hasError.value = false
    }else if (paymentMethod.value == "MBWAY") {
        if (payment_reference.value.match(/^9\d{8}$/) == null) {
            errorMessageContent.value = "Invalid MBWAY number"
            hasError.value = true
        }else{
            hasError.value=false
            errorMessageContent.value = ""
        }
    } else if (paymentMethod.value == "PAYPAL") {
        if (payment_reference.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) == null) {
            errorMessageContent.value = "Invalid Paypal email address"
            hasError.value = true
        }else{
            hasError.value=false
            errorMessageContent.value = ""

        }
    } else if (paymentMethod.value == "IBAN") {
        if (payment_reference.value.match(/^[a-zA-Z]{2}\d{23}$/) == null) {
            errorMessageContent.value = "Invalid IBAN"
            hasError.value = true
        }else{
            hasError.value=false
            errorMessageContent.value = ""
        }
    } else if (paymentMethod.value == "MB") {
        if (payment_reference.value.match(/^\d{5}-\d{9}$/) == null) {
            errorMessageContent.value = "Invalid MB"
            hasError.value = true
        }else{
            hasError.value=false
            errorMessageContent.value = ""
        }
    } else if (paymentMethod.value == "VISA") {
        if (payment_reference.value.match(/^4\d{15}$/) == null) {
            errorMessageContent.value = "Invalid VISA card number"
            hasError.value = true
        }else{
            hasError.value=false
            errorMessageContent.value = ""
        }
    }
}


</script>

<template>
<div class="w-10/12 max-w-5xl mx-auto max-h-screen rounded-lg bg-white flex flex-col shadow-md dark:bg-gray-700">
    <p class="mt-8 ms-8 text-xl font-bold dark:text-white">Payment Details</p>

  <div class="mx-8 my-8 py-4 bg-gray-100 dark:bg-gray-900 rounded shadow-md">

        <div class="bg-gray-200 m-4 p-4 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded">
            <h2 class="font-semibold mb-4">Purchase Information</h2>
            <p class="text-lg font-bold flex items-center">
                 {{ packNames[selectedPack] }} Pack ( {{ brain_coins_ammout[selectedPack] }} 
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brain text-pink-400 ms-1">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
                        <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
                        <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
                        <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
                        <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
                        <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
                    </svg> ) - {{ packPrices[selectedPack] }}.00€
            </p>
        </div>
        
        <div class="mx-4">
            <label for="payment-method" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Payment Method
            </label>
            <select id="payment-method" v-model="paymentMethod" class="mt-3 ps-2 block w-full h-8 rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option v-if="packPrices[selectedPack] <= payementOptionsMaximum.mbway_max" value="MBWAY">MBWAY</option>
                <option v-if="packPrices[selectedPack] <= payementOptionsMaximum.iban_max" value="IBAN">IBAN</option>
                <option v-if="packPrices[selectedPack] <= payementOptionsMaximum.visa_max" value="VISA">VISA</option>
                <option v-if="packPrices[selectedPack] <= payementOptionsMaximum.paypal_max" value="PAYPAL">PAYPAL</option>
                <option v-if="packPrices[selectedPack] <= payementOptionsMaximum.mb_max" value="MB">MULTIBANCO</option>
            </select>
        </div>
        <div class="mx-4">
            <label for="reference-value" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4">
            Reference Value
            </label>
            <input id="reference-value" :disabled="paymentMethod == ''" v-model="payment_reference" @keyup="validatePayment()" type="text" class="mt-3 ps-2 h-9 block w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 shadow-sm" :class="{ 'border-2 border-red-500 ': hasError }"/>
        </div>
        <div class="ms-4 mt-2">
            <ErrorMessage :errorMessage="errorMessageContent" />
        </div>
        <div>
            <div class="text-right p-4">
                <button @click="finishPurchase" class="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
                    Finish Purchase
                </button>
            </div>
        </div>
  </div>
</div>
</template>
            