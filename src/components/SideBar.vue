<template>
  <aside class="p-3 border-end bg-light min-vh-100">
    <h5 class="mb-3">หมวดหมู่</h5>
    <ul class="list-group">
      <li
        v-for="cat in categories"
        :key="cat"
        class="list-group-item list-group-item-action"
        :class="{ active: currentCategory === cat }"
        role="button"
        @click="go(cat)"
      >
        {{ cat }}
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// ✅ รายการหมวดหมู่
const categories = [
  'ทุกหมวดหมู่',
  'อิเล็กทรอนิกส์',
  'คอมพิวเตอร์',
  'รองเท้า',
  'เสื้อผ้า',
  'นาฬิกาและเครื่องประดับ',
  'อาหารและเครื่องดื่ม',
  'กระเป๋าและสัมภาระ',
  'กล้องและอุปกรณ์ถ่ายภาพ',
  'เครื่องใช้ไฟฟ้า',
  'สุขภาพและความงาม',
  'เกมและของเล่น',
  'กีฬาและนันทนาการ',
  'อุปกรณ์คอมพิวเตอร์',
  'แว่นตาและอุปกรณ์',
  'เฟอร์นิเจอร์',
  'หนังสือ',
  'ของใช้ในบ้าน',
  'เครื่องดนตรี',
  'ของใช้ในครัว'
]

const route = useRoute()
const router = useRouter()

// ✅ อ่านหมวดหมู่ปัจจุบันจาก query
const currentCategory = computed(() => route.query.category ?? 'ทุกหมวดหมู่')

// ✅ ฟังก์ชันเปลี่ยนหมวดหมู่
function go(cat) {
  if (cat === 'ทุกหมวดหมู่') {
    router.push({ name: 'home', query: {} })
  } else {
    router.push({ name: 'home', query: { category: cat } })
  }
}
</script>

<style scoped>
.min-vh-100 { min-height: 100vh; }
.list-group-item.active {
  background-color: #0ea5e9;
  border-color: #0ea5e9;
  color: #fff;
  font-weight: bold;
  
}

</style>
