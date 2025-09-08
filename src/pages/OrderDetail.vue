<template>
  <div class="bw-container">
    <div class="d-flex align-items-center justify-content-between mb-3 gap-2">
      <div class="d-flex align-items-center gap-3">
        <h3 class="m-0">รายละเอียดคำสั่งซื้อ</h3>
        <span v-if="order" class="badge rounded-pill fs-6" :class="badgeOf(order.status)">
          {{ order.status || '—' }}
        </span>
      </div>
      <div class="d-flex gap-2">
        <router-link class="btn btn-outline-secondary" to="/tracking">ย้อนกลับ</router-link>
        <button
          v-if="order"
          class="btn btn-outline-danger"
          @click="openDeleteConfirm"
          :disabled="removing"
        >
          <span v-if="!removing">ลบคำสั่งซื้อ</span>
          <span v-else class="spinner-border spinner-border-sm"></span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="card p-5 text-center text-muted">กำลังโหลด…</div>
    <div v-else-if="!order" class="card p-5 text-center text-danger">ไม่พบคำสั่งซื้อ</div>

    <template v-else>
      <!-- Header -->
      <div class="card mb-3 p-3">
        <div class="row g-3 align-items-center">
          <div class="col-12 col-md-3">
            <div class="text-muted small">รหัสคำสั่งซื้อ</div>
            <div class="fs-5 fw-semibold">#{{ order.id }}</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-muted small">วันที่สั่งซื้อ</div>
            <div class="fw-semibold">{{ dt(order.createdAt) }}</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-muted small">ยอดรวม</div>
            <div class="fs-5 fw-semibold">฿{{ money(order.total) }}</div>
          </div>
          <div class="col-12 col-md-3">
            <div class="text-muted small">ช่องทางชำระเงิน</div>
            <div class="fw-semibold">{{ payLabel(order.customer?.paymentMethod) }}</div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <!-- รายการสินค้า -->
        <div class="col-12 col-lg-7">
          <div class="card">
            <div class="card-header bg-light fw-semibold">สินค้า</div>
            <div class="list-group list-group-flush">
              <div class="list-group-item" v-for="it in order.items || []" :key="it.id">
                <div class="d-flex align-items-center gap-3">
                  <img
                    :src="it.image || placeholder"
                    :alt="it.name"
                    style="width:72px;height:72px;object-fit:cover"
                    class="rounded"
                  />
                  <div class="flex-fill">
                    <div class="fw-semibold">{{ it.name }}</div>
                    <div class="text-muted small">{{ it.brand || '-' }} · {{ it.category || '-' }}</div>

                    <!-- ✅ แสดงตัวเลือกสเปก/ไซส์/รอม ถ้ามี -->
                    <div v-if="variantText(it)" class="small">
                      <span class="badge bg-light text-dark">{{ variantText(it) }}</span>
                    </div>

                    <div class="text-muted small">฿{{ money(it.price) }} × {{ it.qty }}</div>
                  </div>
                  <div class="fw-semibold">฿{{ money(lineTotal(it)) }}</div>
                </div>
              </div>
              <div v-if="!order.items?.length" class="list-group-item text-center text-muted py-4">
                ไม่มีสินค้าในคำสั่งซื้อนี้
              </div>
            </div>
          </div>
        </div>

        <!-- ผู้สั่งซื้อ + ชำระเงิน -->
        <div class="col-12 col-lg-5">
          <div class="card mb-3">
            <div class="card-header bg-light fw-semibold">ข้อมูลผู้สั่งซื้อ</div>
            <div class="card-body">
              <div class="mb-2">
                <div class="text-muted small">ชื่อ-นามสกุล</div>
                <div class="fw-semibold">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</div>
              </div>
              <div class="mb-2">
                <div class="text-muted small">เบอร์โทร</div>
                <div class="fw-semibold">{{ order.customer?.phone || '—' }}</div>
              </div>
              <div>
                <div class="text-muted small">ที่อยู่</div>
                <div class="fw-semibold white-space-pre">{{ order.customer?.address || '—' }}</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header bg-light fw-semibold">สรุปยอด</div>
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>Subtotal</div>
                <div>฿{{ money(subtotal) }}</div>
              </div>
              <div class="d-flex justify-content-between">
                <div>Shipping</div>
                <div>฿{{ money(shipping) }}</div>
              </div>
              <hr />
              <div class="d-flex justify-content-between fw-bold fs-5 mt-2">
                <div>Total</div>
                <div>฿{{ money(order.total) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ✅ Confirm Delete Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true" ref="deleteModalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">ลบคำสั่งซื้อ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="ปิด"></button>
          </div>
          <div class="modal-body">
            คุณต้องการลบคำสั่งซื้อ <strong>#{{ order?.id }}</strong> ใช่หรือไม่?
            <div class="text-muted small mt-2">การลบจะไม่สามารถย้อนกลับได้</div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" data-bs-dismiss="modal" :disabled="removing">ยกเลิก</button>
            <button class="btn btn-danger" @click="doDelete" :disabled="removing">
              <span v-if="!removing">ยืนยันลบ</span>
              <span v-else class="spinner-border spinner-border-sm"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /Confirm Delete Modal -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { useOrdersStore } from '../stores/orders.js'

const route = useRoute()
const router = useRouter()
const orders = useOrdersStore()

const order = ref(null)
const loading = ref(true)
const removing = ref(false)
const placeholder = 'https://placehold.co/600x400?text=Product'

// Load order
onMounted(async () => {
  loading.value = true
  try {
    const id = route.params.id
    order.value = await orders.getById(id)
  } catch (e) {
    console.error('[order.detail]', e)
    order.value = null
  } finally {
    loading.value = false
  }
})

/* ---------- Money / Date ---------- */
const lineTotal = (it) => (+it.price || 0) * (+it.qty || 0)
const subtotal = computed(() => (order.value?.items || []).reduce((s, it) => s + lineTotal(it), 0))
const shipping = computed(() => {
  const t = +order.value?.total || 0
  const sub = subtotal.value
  return Math.max(0, t - sub)
})
const money = (v) => Number(v || 0).toLocaleString()
const dt = (v) => {
  const d = v ? new Date(v) : null
  return d ? d.toLocaleString() : '—'
}
const badgeOf = (status) => {
  const s = (status || '').toLowerCase()
  if (['processing', 'pending'].includes(s)) return 'text-bg-warning'
  if (['shipped', 'shipping'].includes(s)) return 'text-bg-info'
  if (['delivered', 'success'].includes(s)) return 'text-bg-success'
  if (['cancelled', 'canceled', 'failed'].includes(s)) return 'text-bg-danger'
  return 'text-bg-secondary'
}
const payLabel = (v) => {
  const s = (v || '').toLowerCase()
  if (s === 'cod') return 'เก็บเงินปลายทาง (COD)'
  if (s === 'bank') return 'โอนผ่านธนาคาร'
  if (s === 'card') return 'บัตรเครดิต/เดบิต'
  return '—'
}

/* ---------- Variant/Inventory text (optional fields tolerant) ---------- */
function variantText(it) {
  // รองรับทั้ง it.variantLabel / it.variantKey / it.options (object)
  if (it?.variantLabel) return it.variantLabel
  if (it?.variantKey) return it.variantKey
  if (it?.options && typeof it.options === 'object') {
    const pairs = Object.entries(it.options)
      .filter(([k, v]) => v != null && v !== '')
      .map(([k, v]) => `${k}: ${v}`)
    return pairs.length ? pairs.join(' · ') : ''
  }
  return ''
}

/* ---------- Delete dialog ---------- */
const deleteModalRef = ref(null)
let deleteModalIns = null

onMounted(() => {
  if (deleteModalRef.value) deleteModalIns = new Modal(deleteModalRef.value)
})

const openDeleteConfirm = () => deleteModalIns?.show()
const closeDeleteConfirm = () => deleteModalIns?.hide()

const doDelete = async () => {
  if (!order.value?.id) return
  removing.value = true
  try {
    // ลบจาก store (เรียก API DELETE)
    await orders.remove(order.value.id)
    closeDeleteConfirm()
    // กลับไปหน้ารายการคำสั่งซื้อ
    router.push('/tracking')
  } catch (e) {
    console.error('[order.delete]', e)
    alert('ลบคำสั่งซื้อไม่สำเร็จ: ' + (e?.message || 'ไม่ทราบสาเหตุ'))
  } finally {
    removing.value = false
  }
}
</script>

<style scoped>
.white-space-pre { white-space: pre-line; }
.badge { font-weight: 600; }
</style>
