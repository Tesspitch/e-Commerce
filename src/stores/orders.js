// src/stores/orders.js
import { defineStore } from 'pinia'
import {
  getOrders,
  getOrderById,
  createOrder,
  deleteOrder,
  updateOrder
} from '../services/api.js'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    list: [],
    loading: false,
    error: null
  }),
  getters: {
    kpi: (s) => {
      const totalOrders = s.list.length
      const totalRevenue = s.list.reduce((a, o) => a + (Number(o.total) || 0), 0)
      const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0
      return { totalOrders, totalRevenue, avgOrderValue }
    }
  },
  actions: {
    async fetch() {
      this.loading = true; this.error = null
      try {
        const { data } = await getOrders()
        this.list = Array.isArray(data) ? data : []
      } catch (e) {
        this.error = e?.message || 'โหลดออเดอร์ไม่ได้'
        this.list = []
      } finally {
        this.loading = false
      }
    },
    async getById(id) {
      const { data } = await getOrderById(id)
      // sync cache เผื่ออยู่ใน KPI/รายการ
      if (data) {
        const idx = this.list.findIndex(o => String(o.id) === String(id))
        if (idx >= 0) this.list[idx] = data
      }
      return data
    },
    async create(payload) {
      const { data } = await createOrder(payload)
      if (data) this.list.unshift(data)
      return data
    },
    // ✅ ลบคำสั่งซื้อ
    async remove(id) {
      this.loading = true; this.error = null
      try {
        await deleteOrder(id)
        this.list = this.list.filter(o => String(o.id) !== String(id))
      } catch (e) {
        this.error = e?.message || 'ลบออเดอร์ไม่ได้'
        throw e
      } finally {
        this.loading = false
      }
    },
    // (ทางเลือก) ยกเลิกคำสั่งซื้อ หากหลังบ้านไม่รองรับ DELETE
    async cancel(id) {
      this.loading = true; this.error = null
      try {
        const { data } = await updateOrder(id, { status: 'cancelled' })
        if (data) {
          const idx = this.list.findIndex(o => String(o.id) === String(id))
          if (idx >= 0) this.list[idx] = data
        }
        return data
      } catch (e) {
        this.error = e?.message || 'ยกเลิกออเดอร์ไม่ได้'
        throw e
      } finally {
        this.loading = false
      }
    }
  }
})
