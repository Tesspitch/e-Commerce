<template>
  <div class="bw-container">
    <h3 class="mb-3">Checkout</h3>

    <div class="row g-3">
      <div class="col-12 col-lg-7">
        <div class="card p-3">
          <h5>ข้อมูลผู้สั่งซื้อ</h5>
          <div class="row g-2 mt-1">
            <div class="col-12 col-md-6">
              <label class="form-label">ชื่อ</label>
              <input v-model.trim="form.firstName" class="form-control" required aria-required="true" />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">นามสกุล</label>
              <input v-model.trim="form.lastName" class="form-control" required />
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">เบอร์โทร</label>
              <input v-model.trim="form.phone" class="form-control" type="tel" required />
            </div>
            <div class="col-12">
              <label class="form-label">ที่อยู่</label>
              <textarea v-model.trim="form.address" class="form-control" rows="3" required></textarea>
            </div>
          </div>
        </div>

        <div class="card p-3 mt-3">
          <h5>ช่องทางชำระเงิน</h5>
          <div class="form-check mt-2">
            <input class="form-check-input" type="radio" id="pm1" value="cod" v-model="form.paymentMethod">
            <label class="form-check-label" for="pm1">เก็บเงินปลายทาง (COD)</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" id="pm2" value="bank" v-model="form.paymentMethod">
            <label class="form-check-label" for="pm2">โอนผ่านธนาคาร</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" id="pm3" value="card" v-model="form.paymentMethod">
            <label class="form-check-label" for="pm3">บัตรเครดิต/เดบิต</label>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <div class="card p-3">
          <h5>สรุปรายการ</h5>
          <div v-for="it in cart.items" :key="it.id" class="d-flex justify-content-between py-1">
            <div>{{ it.name }} × {{ it.qty }}</div>
            <div>฿{{ (Number(it.price)*it.qty).toLocaleString() }}</div>
          </div>
          <hr/>
          <div class="d-flex justify-content-between">
            <div>Subtotal</div>
            <div>฿{{ cart.subtotal.toLocaleString() }}</div>
          </div>
          <div class="d-flex justify-content-between">
            <div>Shipping</div>
            <div>฿{{ shipping.toLocaleString() }}</div>
          </div>
          <div class="d-flex justify-content-between fw-bold fs-5 mt-2">
            <div>Total</div>
            <div>฿{{ total.toLocaleString() }}</div>
          </div>
          <button :disabled="!canSubmit" class="btn btn-bw w-100 mt-3" @click="placeOrder">ยืนยันสั่งซื้อ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'

const router = useRouter()
const cart = useCartStore()
const orders = useOrdersStore()

const form = reactive({ firstName:'', lastName:'', phone:'', address:'', paymentMethod:'cod' })
const shipping = computed(()=> cart.subtotal>0? 50 : 0)
const total = computed(()=> cart.subtotal + shipping.value)
const canSubmit = computed(()=> cart.items.length>0 && form.firstName && form.lastName && form.phone && form.address)

const placeOrder = async()=>{
  const payload = {
    customer: { ...form },
    items: cart.items.map(it=>({ id:it.id, name:it.name, qty:it.qty, price:it.price })),
    total: total.value,
    status: 'processing',
    createdAt: new Date().toISOString(),
  }
  const saved = await orders.create(payload)
  cart.clear()
  router.push(`/order/${saved?.id ?? ''}`)
}
</script>
