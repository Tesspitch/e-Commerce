<template>
  <div class="row g-3">
    <div class="col-12 col-md-6 col-lg-3" v-for="k in cards" :key="k.title">
      <div class="card p-3 h-100">
        <div class="text-muted">{{ k.title }}</div>
        <div class="fs-3 fw-bold">{{ k.value }}</div>
        <small class="text-muted">{{ k.subtitle }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ data: { type: Object, required: true } })
const cards = [
  { title:'Total Revenue', value: new Intl.NumberFormat().format(props.data.totalRevenue), subtitle:'รวมยอดขายทั้งหมด (฿)' },
  { title:'Total Orders', value: props.data.totalOrders, subtitle:'จำนวนคำสั่งซื้อ' },
  { title:'Avg Order Value', value: new Intl.NumberFormat().format(props.data.avgOrderValue.toFixed? Number(props.data.avgOrderValue.toFixed(0)) : props.data.avgOrderValue), subtitle:'มูลค่าเฉลี่ย/ออเดอร์ (฿)' },
  { title:'Top Cat / Brand', value: `${props.data.topCategory} / ${props.data.topBrand}` , subtitle:'ขายดีที่สุด' },
]
</script>
