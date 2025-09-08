<template>
  <div class="container-fluid px-5">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-12 col-lg-2 p-0 order-2 order-lg-1">
        <Sidebar />
      </div>

      <!-- Main -->
      <div class="col-12 col-lg-10 order-1 order-lg-2">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h3 class="m-0">สินค้า</h3>

          <!-- ปุ่มหมวดหมู่ (สำหรับจอเล็ก) — ย้ายมาไว้ด้านบนสินค้า -->
          <button class="btn btn-outline-primary d-lg-none" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#catDrawer" aria-controls="catDrawer">
            หมวดหมู่
          </button>

          <div class="d-flex gap-2 mt-2">
            <select class="form-select" v-model="sort">
              <option value="">จัดเรียง</option>
              <option value="price-asc">ราคาต่ำ → สูง</option>
              <option value="price-desc">ราคาสูง → ต่ำ</option>
            </select>
          </div>
        </div>

        <!-- Products -->
        <div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-3">
          <div class="col" v-for="p in productsView" :key="p.id">
            <div class="card h-100" role="button" tabindex="0" style="cursor:pointer" @click="openQuick(p)"
              @keydown.enter.prevent="openQuick(p)" @keydown.space.prevent="openQuick(p)">
              <img :src="p.image || placeholder" class="card-img-top" :alt="p.name" loading="lazy" />
              <div class="card-body d-flex flex-column">
                <h6 class="card-title">{{ p.name }}</h6>
                <p class="text-muted mb-2">
                  {{ p.brand || '-' }} ·
                  <span class="badge bg-light text-dark">{{ p.category || '-' }}</span>
                </p>
                <div class="mt-auto d-flex justify-content-between align-items-center">
                  <strong>฿{{ toMoney(p.price) }}</strong>
                  <button class="btn btn-bw btn-sm" @click.stop="addToCart(p)">เพิ่ม</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> <!-- /main -->
    </div> <!-- /row -->

    <!-- Quick View Modal -->
    <div class="modal fade" id="quickModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ quick?.name || 'รายละเอียดสินค้า' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="ปิด"></button>
          </div>
          <div class="modal-body">
            <div v-if="!quick" class="text-center text-muted py-5">กำลังโหลด...</div>
            <template v-else>
              <div class="row g-4">
                <div class="col-12 col-lg-6">
                  <img :src="quick.image || placeholder" class="img-fluid rounded" :alt="quick.name" />
                </div>
                <div class="col-12 col-lg-6">
                  <div class="mb-1 text-muted">
                    {{ quick.brand || '-' }} · {{ quick.category || '-' }}
                  </div>
                  <h4 class="mb-2">฿{{ toMoney(quick.price) }}</h4>
                  <p class="mb-3">{{ quick.description || '—' }}</p>

                  <div class="input-group" style="max-width:200px">
                    <span class="input-group-text">จำนวน</span>
                    <input type="number" class="form-control" v-model.number="quickQty" min="1" />
                  </div>

                  <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-bw" @click="addToCart(quick, quickQty)">เพิ่มเข้าตะกร้า</button>
                  </div>
                </div>
              </div>

              <hr class="my-4" />
              <h6>สินค้าในหมวดเดียวกัน</h6>
              <div class="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
                <div class="col" v-for="r in related" :key="r.id">
                  <div class="card h-100" role="button" style="cursor:pointer" @click="openQuick(r)">
                    <img :src="r.image || placeholder" class="card-img-top" :alt="r.name" />
                    <div class="card-body d-flex flex-column">
                      <small class="text-muted mb-1">{{ r.brand || '-' }}</small>
                      <div class="fw-semibold">{{ r.name }}</div>
                      <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span>฿{{ toMoney(r.price) }}</span>
                        <button class="btn btn-sm btn-outline-primary" @click.stop="addToCart(r)">เพิ่ม</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal">ปิด</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart + Checkout Modal -->
    <div class="modal fade" id="checkoutModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">ตะกร้า & ชำระเงิน</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="ปิด"></button>
          </div>
          <div class="modal-body">
            <div v-if="!items.length" class="text-center text-muted py-5">ยังไม่มีสินค้าในตะกร้า</div>

            <div v-else>
              <div v-for="it in items" :key="it.id" class="d-flex align-items-center gap-3 py-2 border-bottom">
                <img :src="it.image || placeholder" alt="" style="width:72px;height:72px;object-fit:cover"
                  class="rounded" />
                <div class="flex-fill">
                  <div class="fw-semibold">{{ it.name }}</div>
                  <small class="text-muted">฿{{ toMoney(it.price) }}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <input type="number" min="1" class="form-control" style="width:90px" v-model.number="it.qty"
                    @change="changeQty(it)" />
                  <button class="btn btn-outline-danger" @click="remove(it.id)">ลบ</button>
                </div>
              </div>

              <div class="row g-3 mt-3">
                <div class="col-12 col-lg-7">
                  <div class="card p-3">
                    <h6 class="mb-2">ข้อมูลผู้สั่งซื้อ</h6>
                    <div class="row g-2">
                      <div class="col-md-6">
                        <label class="form-label">ชื่อ</label>
                        <input v-model.trim="form.firstName" class="form-control" required />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">นามสกุล</label>
                        <input v-model.trim="form.lastName" class="form-control" required />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">เบอร์โทร</label>
                        <input v-model.trim="form.phone" class="form-control" type="tel" required />
                      </div>
                      <div class="col-12">
                        <label class="form-label">ที่อยู่</label>
                        <textarea v-model.trim="form.address" class="form-control" rows="3"></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-12 col-lg-5">
                  <div class="card p-3">
                    <h6 class="mb-2">ช่องทางชำระเงิน</h6>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" id="pm1" value="cod" v-model="form.paymentMethod" />
                      <label class="form-check-label" for="pm1">เก็บเงินปลายทาง (COD)</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" id="pm2" value="bank" v-model="form.paymentMethod" />
                      <label class="form-check-label" for="pm2">โอนผ่านธนาคาร</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" id="pm3" value="card" v-model="form.paymentMethod" />
                      <label class="form-check-label" for="pm3">บัตรเครดิต/เดบิต</label>
                    </div>

                    <hr />
                    <div class="d-flex justify-content-between">
                      <div>Subtotal</div>
                      <div>฿{{ toMoney(subtotal) }}</div>
                    </div>
                    <div class="d-flex justify-content-between">
                      <div>Shipping</div>
                      <div>฿{{ toMoney(shipping) }}</div>
                    </div>
                    <div class="d-flex justify-content-between fw-bold fs-5 mt-2">
                      <div>Total</div>
                      <div>฿{{ toMoney(total) }}</div>
                    </div>
                    <button :disabled="!canSubmit" class="btn btn-bw w-100 mt-3"
                      @click="placeOrder">ยืนยันสั่งซื้อ</button>
                  </div>
                </div>
              </div>
            </div>
          </div><!-- /modal-body -->
        </div>
      </div>
    </div> <!-- ปิด Cart Modal -->

    <!-- Toast (อยู่นอกทุก modal) -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index:2000; pointer-events:none">
      <div class="toast text-bg-success border-0 shadow" ref="cartToastEl" role="alert" aria-live="assertive"
        aria-atomic="true" style="pointer-events:auto">
        <div class="d-flex align-items-center">
          <div class="toast-body">
            <strong class="me-1">✓</strong> {{ cartToastMsg }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
            aria-label="Close"></button>
        </div>
      </div>
    </div>
  </div> <!-- /container -->
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal, Toast } from 'bootstrap'
import Sidebar from '@/components/Sidebar.vue'
import { useKeywordFromRoute } from '@/composables/useSearch.js'

import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'

const productsStore = useProductsStore()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()

const route = useRoute()
const router = useRouter()

const qFromUrl = useKeywordFromRoute()
const sort = ref('')

const quick = ref(null)
const quickQty = ref(1)
const placeholder = 'https://placehold.co/600x400?text=Product'

const items = computed(() => cartStore.items)
const cartCount = computed(() => cartStore.count)
const subtotal = computed(() => cartStore.subtotal)
const shipping = computed(() => (subtotal.value > 0 ? 50 : 0))
const total = computed(() => subtotal.value + shipping.value)

const form = ref({ firstName: '', lastName: '', phone: '', address: '', paymentMethod: 'cod' })
const canSubmit = computed(() =>
  items.value.length > 0 && form.value.firstName && form.value.lastName && form.value.phone && form.value.address
)

onMounted(() => { productsStore.fetch() })

/* ---------- FILTERS ---------- */
const selectedCategory = computed(() => route.query.category ?? '')

const productsView = computed(() => {
  let list = (productsStore.list ?? []).slice()

  const keyword = (qFromUrl.value || '').trim().toLowerCase()
  if (keyword) {
    list = list.filter(p =>
      ([p.name, p.brand, p.category, p.description, p.seo].filter(Boolean).join(' ').toLowerCase()).includes(keyword)
    )
  }
  if (selectedCategory.value) list = list.filter(p => p.category === selectedCategory.value)
  if (sort.value === 'price-asc') list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
  if (sort.value === 'price-desc') list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
  return list
})

/* ---------- QUICK VIEW ---------- */
let quickModal
const openQuick = async (p) => {
  const list = productsStore.list ?? []
  quick.value = typeof p === 'object' ? p : list.find(x => String(x.id) === String(p))
  if (!quick.value) return

  quickQty.value = 1
  quickModal = quickModal || new Modal(document.getElementById('quickModal'))
  quickModal.show()

  await nextTick()
  document.querySelector('#quickModal .modal-body')?.scrollTo({ top: 0, behavior: 'smooth' })
}

const related = computed(() => {
  if (!quick.value) return []
  return (productsStore.list ?? [])
    .filter(x => x.category === quick.value.category && x.id !== quick.value.id)
    .slice(0, 8)
})

/* ---------- CART / CHECKOUT ---------- */
let checkoutModal
const openCart = () => {
  checkoutModal = checkoutModal || new Modal(document.getElementById('checkoutModal'))
  checkoutModal.show()
}
const addToCart = (p, qty = 1) => { cartStore.add(p, qty); showAddedToast(p, qty) }
const changeQty = (it) => cartStore.changeQty(it.id, it.qty)
const remove = (id) => cartStore.remove(id)

/* ---------- ORDER ---------- */
function cleanupModals() {
  document.querySelectorAll('.modal.show').forEach(el => {
    try { (Modal.getInstance(el) || new Modal(el)).hide() } catch { }
  })
  document.querySelectorAll('.modal-backdrop').forEach(el => el.remove())
  document.body.classList.remove('modal-open')
  document.body.style.removeProperty('paddingRight')
}

const placeOrder = async () => {
  const payload = {
    customer: { ...form.value },
    items: items.value.map(it => ({ id: it.id, name: it.name, qty: it.qty, price: it.price, brand: it.brand, category: it.category })),
    total: total.value,
    status: 'processing',
    createdAt: new Date().toISOString(),
  }
  try {
    const saved = await ordersStore.create(payload)
    cartStore.clear()

    const el = document.getElementById('checkoutModal')
    if (el) {
      const inst = Modal.getInstance(el) || new Modal(el)
      el.addEventListener('hidden.bs.modal', () => {
        cleanupModals()
        router.push(`/order/${saved?.id ?? ''}`)
      }, { once: true })
      inst.hide()
    } else {
      cleanupModals()
      router.push(`/order/${saved?.id ?? ''}`)
    }
  } catch (e) {
    alert('เกิดข้อผิดพลาดในการสั่งซื้อ: ' + (e?.message || 'ไม่ทราบสาเหตุ'))
  }
}

/* ---------- TOAST (Add to cart) ---------- */
const cartToastEl = ref(null)
let cartToast = null
const cartToastMsg = ref('')

onMounted(() => {
  if (cartToastEl.value) cartToast = new Toast(cartToastEl.value, { delay: 2200, autohide: true })
})
const showAddedToast = (item, qty = 1) => {
  const q = Number(qty) || 1
  cartToastMsg.value = `เพิ่ม "${item?.name ?? 'สินค้า'}" × ${q} ลงตะกร้าแล้ว`
  if (!cartToast && cartToastEl.value) cartToast = new Toast(cartToastEl.value, { delay: 2200, autohide: true })
  cartToast?.show()
}

/* ---------- UTIL ---------- */
const toMoney = (v) => Number(v || 0).toLocaleString()
</script>

<style scoped>
.btn-bw {
  background: #0ea5e9;
  color: #fff;
}

.btn-bw:hover {
  background: #0369a1;
  color: #fff;
}
</style>
