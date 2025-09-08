<template>
  <div class="bw-container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>KPI Dashboard</h3>
      <router-link class="btn btn-outline-primary" to="/">ย้อนกลับ</router-link>
    </div>

    <div class="card p-3 mb-3">
      <div class="d-flex gap-2 align-items-end flex-wrap">
        <div>
          <label class="form-label">ตั้งแต่วันที่</label>
          <input type="date" class="form-control" v-model="fromDate">
        </div>
        <div>
          <label class="form-label">ถึงวันที่</label>
          <input type="date" class="form-control" v-model="toDate">
        </div>
        <button class="btn btn-bw" @click="refresh">รีเฟรช KPI</button>
      </div>
    </div>

    <KPIWidget :data="kpi" />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import KPIWidget from '@/components/KPIWidget.vue'

const orders = useOrdersStore()
const fromDate = ref('')
const toDate = ref('')

onMounted(()=>{ orders.fetch() })

const kpi = computed(()=> orders.kpi )
const refresh = ()=>{ orders.fetch() }
</script>
