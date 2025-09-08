<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary py-3">
    <div class="container bw-container">
      <router-link class="navbar-brand bw-brand" to="/">BlueWhite</router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="nav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><router-link class="nav-link" to="/">Home</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/kpi">KPI</router-link></li>
        </ul>
        <div class="d-flex" role="group" aria-label="Cart and Checkout">
          <button class="btn btn-outline-primary me-2" @click="$emit('open-cart')" aria-label="Open cart">
            ตะกร้า <span class="badge text-bg-primary ms-1">{{ cartCount }}</span>
          </button>
          <router-link class="btn btn-bw" to="/checkout" aria-label="Go to checkout">Checkout</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
const { count: cartCount } = storeToRefs(cart)
</script>
