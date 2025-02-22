<script setup>
import { ref } from 'vue'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const isOpen = ref(false)
const titleText = ref('Title')
const descriptionText = ref('')
const cancelText = ref('Cancel')
const actionText = ref('OK')
const actionCallBack = ref(null)

const open = (actionCallBackFunction, title = 'Title',  cancelLabel = 'Cancel', actionLabel = 'Continuar', description = '') => {
    titleText.value = title
    descriptionText.value = description
    cancelText.value = cancelLabel
    actionText.value = actionLabel 
    actionCallBack.value = actionCallBackFunction
    isOpen.value = true;
}

const handleAction = () => {
    if (actionCallBack.value) {
        actionCallBack.value()
    }
}

defineExpose({
    open
})
</script>

<template>
  <AlertDialog v-model:open="isOpen">
    <AlertDialogContent class="dark:bg-slate-700 dark:border-0">
      <AlertDialogHeader>
        <AlertDialogTitle class="dark:text-white">{{ titleText }}</AlertDialogTitle>
        <AlertDialogDescription class="dark:text-slate-300">{{ descriptionText }}           
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ cancelText }}</AlertDialogCancel>
        <AlertDialogAction @click="handleAction">{{ actionText }}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>