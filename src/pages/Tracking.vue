<template>
  <div class="bw-container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>Order Tracking</h3>
      <router-link class="btn btn-outline-primary" to="/">กลับหน้าหลัก</router-link>
    </div>

    <div v-if="!order" class="text-muted">กำลังโหลด...</div>
    <div v-else class="card p-3">
      <div class="mb-2"><strong>Order #{{ order.id }}</strong></div>
      <div class="text-muted">สถานะ: <span class="badge bg-primary">{{ order.status || 'processing' }}</span></div>
      <div class="mt-3">
        <h6>ที่อยู่จัดส่ง</h6>
        <div>{{ order.customer?.firstName }} {{ order.customer?.lastName }}</div>
        <div>{{ order.customer?.phone }}</div>
        <div>{{ order.customer?.address }}</div>
      </div>
      <hr/>
      <h6>รายการสินค้า</h6>
      <ul class="list-group">
        <li v-for="it in order.items" :key="it.id" class="list-group-item d-flex justify-content-between">
          <div>{{ it.name }} × {{ it.qty }}</div>
          <div>฿{{ (Number(it.price)*it.qty).toLocaleString() }}</div>
        </li>
      </ul>
      <div class="d-flex justify-content-between mt-3 fw-bold">
        <div>Total</div>
        <div>฿{{ Number(order.total||0).toLocaleString() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'

const route = useRoute()
const orders = useOrdersStore()
const order = ref(null)

onMounted(async ()=>{
  order.value = await orders.getById(route.params.id)
})
</script>
