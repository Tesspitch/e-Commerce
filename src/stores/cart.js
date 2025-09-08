import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] }), // {id, name, price, qty, image}
  getters: {
    count: (s) => s.items.reduce((a,c)=>a+c.qty,0),
    subtotal: (s) => s.items.reduce((a,c)=>a+(Number(c.price)||0)*c.qty,0),
  },
  actions: {
    add(product, qty=1){
      const idx = this.items.findIndex(i => i.id === product.id)
      if(idx>-1){ this.items[idx].qty += qty }
      else{
        this.items.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty })
      }
    },
    remove(id){ this.items = this.items.filter(i => i.id !== id) },
    changeQty(id, qty){ const it = this.items.find(i => i.id===id); if(it) it.qty = Math.max(1, qty) },
    clear(){ this.items = [] },
  },
  // persist flag for optional persistedstate plugin (safe to leave here if plugin isn't installed)
  persist: true
})
