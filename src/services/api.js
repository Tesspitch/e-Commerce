// ใช้เป็นจุดเดียวที่ยิง API
import axios from 'axios'

// baseURL มาจาก .env; ถ้าไม่มีให้ยิงตรง IP
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://54.169.154.143:3452',
  headers: { 'Accept': 'application/json' }
})

// ============ PRODUCTS ============
export const getProducts = () => api.get('http://54.169.154.143:3452/ecommerce-products')
export const getProductById = (id) => api.get(`http://54.169.154.143:3452/ecommerce-products/${id}`)

// ============ ORDERS ==============
export const getOrders = () => api.get('/ecommerce-orders')
export const getOrderById = (id) => api.get(`/ecommerce-orders/${id}`)
export const createOrder = (payload) => api.post('/ecommerce-orders', payload)
export const deleteOrder   = (id) => api.delete(`/ecommerce-orders/${id}`)
export const updateOrder  = (id, payload) => api.patch(`/ecommerce-orders/${id}`, payload)

export default api
