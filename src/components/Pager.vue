<!-- src/components/Pager.vue -->
<template>
  <div class="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
    <small class="text-muted">
      แสดง {{ start + 1 }}–{{ Math.min(end, totalItems) }} จาก {{ totalItems }} รายการ
    </small>

    <nav aria-label="pagination" class="w-100 w-sm-auto">
      <ul class="pagination justify-content-center mb-0 pagination-sm elegant-pagination">
        <li class="page-item" :class="{ disabled: currentPage <= 1 }">
          <button class="page-link" @click="$emit('change', currentPage - 1)" :disabled="currentPage <= 1">
            ก่อนหน้า
          </button>
        </li>

        <li class="page-item disabled">
          <span class="page-link">หน้า {{ currentPage }} / {{ totalPages || 1 }}</span>
        </li>

        <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
          <button class="page-link" @click="$emit('change', currentPage + 1)" :disabled="currentPage >= totalPages">
            ถัดไป
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalItems: { type: Number, required: true },
  pageSize:   { type: Number, default: 20 },
  currentPage:{ type: Number, default: 1 }
})
defineEmits(['change'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / props.pageSize)))
const start      = computed(() => (props.currentPage - 1) * props.pageSize)
const end        = computed(() => start.value + props.pageSize)
</script>
