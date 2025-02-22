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
const actionCallBack = ref(null)

const open = (actionCallBackFunction, title = 'Title', description = '') => {
    titleText.value = title
    descriptionText.value = description
    actionCallBack.value = actionCallBackFunction
    isOpen.value = true;
}

const handleAction = () => {
    if (actionCallBack.value) {
        actionCallBack.value()
    }
}

const dissapearAlert = () => {
    isOpen.value = false;
}

defineExpose({
    open,
    dissapearAlert
})



handleAction()
</script>

<template>
  <AlertDialog v-model:open="isOpen">
    <AlertDialogContent class="dark:bg-slate-700 dark:border-0">
      <AlertDialogHeader>
        <AlertDialogTitle class="dark:text-white">{{ titleText }}</AlertDialogTitle>
        <AlertDialogDescription class="dark:text-slate-300">{{ descriptionText }}           
        </AlertDialogDescription>
      </AlertDialogHeader>
    </AlertDialogContent>
  </AlertDialog>
</template>