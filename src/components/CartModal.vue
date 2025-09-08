<template>
  <div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="cartLabel">ตะกร้าสินค้า</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="!items.length" class="text-center py-5 text-muted">ยังไม่มีสินค้าในตะกร้า</div>
          <div v-else>
            <div v-for="it in items" :key="it.id" class="d-flex align-items-center gap-3 py-2 border-bottom">
              <img :src="it.image || ph" alt="" style="width:72px; height:72px; object-fit:cover" class="rounded">
              <div class="flex-fill">
                <div class="fw-semibold">{{ it.name }}</div>
                <small class="text-muted">฿{{ Number(it.price).toLocaleString() }}</small>
              </div>
              <div class="d-flex align-items-center gap-2">
                <input type="number" min="1" class="form-control" style="width:90px" v-model.number="it.qty"
                  @change="changeQty(it)">
                <button class="btn btn-outline-danger" @click="remove(it.id)">ลบ</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <div>
            <strong>รวม:</strong> ฿{{ subtotal.toLocaleString() }}
          </div>
          <div>
            <router-link to="/checkout" class="btn btn-bw" data-bs-dismiss="modal">ไปหน้า Checkout</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
const ph = 'https://placehold.co/400x300?text=Item'
const cart = useCartStore()
const { items, subtotal } = storeToRefs(cart)

const changeQty = (it) => cart.changeQty(it.id, it.qty)
const remove = (id) => cart.remove(id)
</script>
