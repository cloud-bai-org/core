<template>
  <div class="flex gap-2">
    <input
      v-model="customName"
      type="text"
      class="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      placeholder="輸入自訂物品名稱"
      maxlength="20"
      @keyup.enter="addCustom"
    >
    <Button
      size="sm"
      variant="outline"
      :disabled="!customName.trim()"
      @click="addCustom"
    >
      新增
    </Button>
  </div>
</template>

<script setup lang="ts">
import { usePaperCraftStore } from '~/stores/paper-craft'

const store = usePaperCraftStore()
const customName = ref('')

function addCustom() {
  if (!customName.value.trim()) return
  store.addCustomItem(customName.value)
  customName.value = ''
}
</script>
