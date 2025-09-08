import { defineStore } from 'pinia'
import { getOrders, getOrderById, createOrder } from '../services/api.js'

export const useOrdersStore = defineStore('orders', {
  state: () => ({ list: [], loading:false, error:null }),
  getters: {
    // KPI ง่าย ๆ
    kpi: (s) => {
      const totalOrders = s.list.length
      const totalRevenue = s.list.reduce((a,o)=> a + (Number(o.total)||0), 0)
      const avgOrderValue = totalOrders ? totalRevenue/totalOrders : 0
      return { totalOrders, totalRevenue, avgOrderValue }
    }
  },
  actions: {
    async fetch(){
      this.loading = true; this.error = null
      try {
        const { data } = await getOrders()
        this.list = Array.isArray(data) ? data : []
      } catch (e) {
        this.error = e?.message || 'โหลดออเดอร์ไม่ได้'
        this.list = []
      } finally { this.loading = false }
    },
    async getById(id){
      const { data } = await getOrderById(id)
      return data
    },
    async create(payload){
      const { data } = await createOrder(payload)
      // เพิ่มเข้า list เพื่ออัปเดต KPI ทันที
      if (data) this.list.unshift(data)
      return data
    }
  }
})
