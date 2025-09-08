import { Modal } from 'bootstrap'

const get = (id) => {
  const el = document.getElementById(id)
  if (!el) return null
  return (Modal.getOrCreateInstance?.(el)) || new Modal(el)
}

export function openCartModal() {
  const m = get('checkoutModal')
  if (!m) { console.warn('[CartModal] #checkoutModal ไม่พบใน DOM'); return }
  m.show()
}

export function closeCartModal() {
  const el = document.getElementById('checkoutModal')
  const ins = el ? (Modal.getInstance?.(el)) : null
  ins?.hide()
}
