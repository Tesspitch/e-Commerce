<!-- src/views/Home.vue -->
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

          <!-- ปุ่มหมวดหมู่ (มือถือ) -->
          <button
            class="btn btn-ghost d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#catDrawer"
            aria-controls="catDrawer"
          >
            หมวดหมู่
          </button>

          <div class="d-flex gap-2 mt-2 align-items-center">
            <!-- สลับโหมดแสง -->
            <button
              class="btn btn-ghost btn-icon"
              type="button"
              :aria-label="theme==='dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'"
              @click="toggleTheme"
              title="Toggle theme"
            >
              <span v-if="theme==='dark'">☀️</span>
              <span v-else>🌙</span>
            </button>

            <select class="form-select" v-model="sort">
              <option value="">จัดเรียง</option>
              <option value="price-asc">ราคาต่ำ → สูง</option>
              <option value="price-desc">ราคาสูง → ต่ำ</option>
            </select>
          </div>
        </div>

        <!-- Products -->
        <div class="row row-cols-2 row-cols-sm-1 row-cols-md-3 row-cols-xl-5 g-3">
          <div class="col" v-for="p in productsPage" :key="p.id">
            <div
              class="card h-100"
              role="button"
              tabindex="0"
              style="cursor:pointer"
              @click="openQuick(p)"
              @keydown.enter.prevent="openQuick(p)"
              @keydown.space.prevent="openQuick(p)"
            >
              <img :src="p.image || placeholder" class="card-img-top" :alt="p.name" loading="lazy" />
              <div class="card-body d-flex flex-column">
                <h6 class="card-title">{{ p.name }}</h6>
                <p class="text-muted mb-2">
                  {{ p.brand || '-' }} ·
                  <span class="badge bg-body-secondary text-body">{{ p.category || '-' }}</span>
                </p>
                <div class="mt-auto d-flex justify-content-between align-items-center">
                  <strong>{{ displayPrice(p) }}</strong>
                  <button
                    class="btn btn-cta btn-sm"
                    @click.stop="hasInventory(p) ? openQuick(p) : addToCartDirect(p)"
                  >
                    เพิ่ม
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-4">
          <Pager
            :total-items="totalItems"
            :page-size="pageSize"
            :current-page="currentPage"
            @change="goPage"
          />
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
                  <VariantPicker
                    v-if="quick?.inventory"
                    :product="quick"
                    v-model="variantKey"
                    class="mb-2"
                  />
                  <div class="mb-1 text-muted">
                    {{ quick.brand || '-' }} · {{ quick.category || '-' }}
                  </div>
                  <h4 class="mb-2">฿{{ effPrice.toLocaleString() }}</h4>
                  <p class="mb-3">{{ quick.description || '—' }}</p>

                  <div class="input-group" style="max-width:220px">
                    <span class="input-group-text">จำนวน</span>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="quickQty"
                      :min="1"
                      :max="effStock || undefined"
                    />
                  </div>

                  <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-cta" :disabled="!canAdd" @click="addToCartFromQuick(quick, quickQty)">
                      เพิ่มเข้าตะกร้า
                    </button>
                    <button class="btn btn-ghost" data-bs-dismiss="modal">ยกเลิก</button>
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
                        <span>฿{{ displayPriceNumber(r).toLocaleString() }}</span>
                        <button class="btn btn-ghost btn-sm" @click.stop="hasInventory(r) ? openQuick(r) : addToCartDirect(r)">
                          เพิ่ม
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" data-bs-dismiss="modal">ปิด</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index:2000; pointer-events:none">
      <div class="toast text-bg-success border-0 shadow" ref="cartToastEl" role="alert" aria-live="assertive" aria-atomic="true" style="pointer-events:auto">
        <div class="d-flex align-items-center">
          <div class="toast-body">
            <strong class="me-1">✓</strong> {{ cartToastMsg }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
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
import VariantPicker from '@/components/VariantPicker.vue'
import Pager from '@/components/Pager.vue'
import { useKeywordFromRoute } from '@/composables/useSearch.js'
import { useTheme } from '@/composables/useTheme.js'
import '@/styles/ui.css'                 // << สไตล์ปุ่ม/เพจเนชัน

import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'

import { hasInventory, minPrice, firstAvailableVariantKey, priceFor, stockFor } from '@/utils/product'

const { theme, toggleTheme } = useTheme()

const productsStore = useProductsStore()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()

const route = useRoute()
const router = useRouter()

/* FILTERS & SORT */
const qFromUrl = useKeywordFromRoute()
const sort = ref('')
const selectedCategory = computed(() => route.query.category ?? '')

/* PAGINATION */
const pageSize = 20
const currentPage = ref(Math.max(1, parseInt(route.query.page || '1', 10) || 1))
watch(() => route.query.page, (v) => {
  const n = Math.max(1, parseInt(v || '1', 10) || 1)
  if (n !== currentPage.value) currentPage.value = n
})

/* DATA */
const quick = ref(null)
const variantKey = ref('')
const quickQty = ref(1)
const placeholder = 'https://placehold.co/600x400?text=Product'

const items = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.subtotal)
const shipping = computed(() => (subtotal.value > 0 ? 50 : 0))
const total = computed(() => subtotal.value + shipping.value)

const form = ref({ firstName: '', lastName: '', phone: '', address: '', paymentMethod: 'cod' })
const canSubmit = computed(() => items.value.length > 0 && form.value.firstName && form.value.lastName && form.value.phone && form.value.address)

onMounted(() => { productsStore.fetch() })

/* ---------- FILTERED LIST ---------- */
const productsFiltered = computed(() => {
  let list = (productsStore.list ?? []).slice()
  const keyword = (qFromUrl.value || '').trim().toLowerCase()

  if (keyword) {
    list = list.filter(p => {
      const seo = Array.isArray(p.seo) ? p.seo.join(' ') : (p.seo || '')
      return ([p.name, p.brand, p.category, p.description, seo]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(keyword))
    })
  }
  if (selectedCategory.value) list = list.filter(p => p.category === selectedCategory.value)
  if (sort.value === 'price-asc')  list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
  if (sort.value === 'price-desc') list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
  return list
})

watch([qFromUrl, selectedCategory, sort], () => goPage(1))

/* ---------- PAGINATION COMPUTEDS ---------- */
const totalItems  = computed(() => productsFiltered.value.length)
const totalPages  = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize)))
const pageStart   = computed(() => (currentPage.value - 1) * pageSize)
const pageEnd     = computed(() => pageStart.value + pageSize)
const productsPage = computed(() => productsFiltered.value.slice(pageStart.value, pageEnd.value))

function goPage(n) {
  const page = Math.min(Math.max(1, n), totalPages.value)
  if (page === currentPage.value && String(route.query.page || '1') === String(page)) return
  currentPage.value = page
  const next = { ...route.query, page: page > 1 ? String(page) : undefined }
  router.replace({ name: route.name || 'home', query: next })
}

/* ---------- PRICE DISPLAY ---------- */
const displayPriceNumber = (p) => hasInventory(p) ? minPrice(p) : Number(p.price || 0)
const displayPrice = (p) => `฿${displayPriceNumber(p).toLocaleString()}`

/* ---------- QUICK VIEW ---------- */
let quickModal
const openQuick = async (p) => {
  const list = productsStore.list ?? []
  quick.value = typeof p === 'object' ? p : list.find(x => String(x.id) === String(p))
  if (!quick.value) return

  variantKey.value = hasInventory(quick.value) ? (firstAvailableVariantKey(quick.value) || '') : ''
  quickQty.value = 1

  quickModal = quickModal || new Modal(document.getElementById('quickModal'))
  quickModal.show()

  await nextTick()
  document.querySelector('#quickModal .modal-body')?.scrollTo({ top: 0, behavior: 'smooth' })
}

const effPrice = computed(() => priceFor(quick.value, variantKey.value))
const effStock = computed(() => stockFor(quick.value, variantKey.value))
const canAdd   = computed(() => {
  if (!quick.value) return false
  const stock = effStock.value ?? Infinity
  return stock > 0 && quickQty.value >= 1 && quickQty.value <= stock
})

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

const addToCartDirect = (p) => {
  cartStore.add({ ...p, price: Number(p.price || 0) }, 1)
  showAddedToast(p, 1)
}
const addToCartFromQuick = (p, qty = 1) => {
  const key = p?.inventory ? variantKey.value : null
  const payload = {
    ...p,
    price: key ? priceFor(p, key) : Number(p.price || 0),
    variant: key ? { key, label: key } : undefined,
  }
  cartStore.add(payload, qty)
  showAddedToast(payload, qty)
}

const changeQty = (it) => cartStore.changeQty(it.id, it.qty)
const remove    = (id) => cartStore.remove(id)

/* ---------- ORDER ---------- */
function cleanupModals() {
  document.querySelectorAll('.modal.show').forEach(el => { try { (Modal.getInstance(el) || new Modal(el)).hide() } catch {} })
  document.querySelectorAll('.modal-backdrop').forEach(el => el.remove())
  document.body.classList.remove('modal-open')
  document.body.style.removeProperty('paddingRight')
}

const placeOrder = async () => {
  const payload = {
    customer: { ...form.value },
    items: items.value.map(it => ({
      id: it.id,
      name: it.name,
      qty: it.qty,
      price: it.price,
      brand: it.brand,
      category: it.category,
      variant: it.variant?.key || it.variant || null,
      image: it.image,
      imageAlt: it.imageAlt || it.name,
    })),
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

/* ---------- TOAST ---------- */
const cartToastEl = ref(null)
let cartToast = null
const cartToastMsg = ref('')

onMounted(() => {
  if (cartToastEl.value) cartToast = new Toast(cartToastEl.value, { delay: 2200, autohide: true })
})
const showAddedToast = (item, qty = 1) => {
  const q = Number(qty) || 1
  cartToastMsg.value = `เพิ่ม "${item?.name ?? 'สินค้า'}"${item?.variant?.label ? ` (${item.variant.label})` : ''} × ${q} ลงตะกร้าแล้ว`
  if (!cartToast && cartToastEl.value) cartToast = new Toast(cartToastEl.value, { delay: 2200, autohide: true })
  cartToast?.show()
}

/* ---------- UTIL ---------- */
const toMoney = (v) => Number(v || 0).toLocaleString()
</script>

<!-- ไม่มี <style> ที่นี่แล้ว: ใช้ไฟล์ /styles/ui.css แทน -->
