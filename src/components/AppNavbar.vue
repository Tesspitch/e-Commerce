<script setup>
import { ref, onMounted, onUnmounted, toRefs } from 'vue'
import { useSearchBox } from '../composables/useSearch.js'
import { openCartModal } from '../composables/useCartUI.js'

const props = defineProps({
  brand: { type: String, default: 'SkyShop' },
  logoSrc: { type: String, default: '/logo.png' },
  cartCount: { type: Number, default: 0 },
})
const { brand, logoSrc, cartCount } = toRefs(props)

const { query, submit } = useSearchBox()
const open = ref(false)

function onSearch() { submit(); open.value = false }

// ▼ โปรไฟล์: ค้างอยู่จนกว่าคลิกนอก/กด Esc
const profileOpen = ref(false)
const profileEl = ref(null)
const toggleProfile = () => (profileOpen.value = !profileOpen.value)
const closeProfile = () => (profileOpen.value = false)

const onDocClick = (e) => { if (profileEl.value && !profileEl.value.contains(e.target)) closeProfile() }
const onEsc = (e) => { if (e.key === 'Escape') closeProfile() }
// ▲

const onResize = () => { if (window.innerWidth >= 1024) open.value = false }

onMounted(() => {
  window.addEventListener('resize', onResize)
  document.addEventListener('click', onDocClick, true)
  document.addEventListener('keydown', onEsc)
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  document.removeEventListener('click', onDocClick, true)
  document.removeEventListener('keydown', onEsc)
})
</script>

<template>
  <header class="nav">
    <div class="nav__inner">
      <!-- Brand -->
      <router-link class="brand" to="/" aria-label="Home">
        <img v-if="logoSrc" :src="logoSrc" alt="Logo" class="brand__logo" />
        <span class="brand__text">{{ brand }}</span>
      </router-link>

      <!-- Search (desktop) -->
      <form class="search search--desktop" @submit.prevent="onSearch" role="search" aria-label="ค้นหา">
        <input v-model.trim="query" type="search" class="search__input" placeholder="ค้นหา: ชื่อ/แบรนด์/หมวดหมู่"
          aria-label="ค้นหาสินค้า" />
      </form>

      <!-- Actions -->
      <nav class="actions" aria-label="User actions">
        <!-- Cart -->
        <button class="icon-btn" @click="openCartModal()" aria-label="เปิดตะกร้า">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1
               0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.16 14h9.45c.75 0 1.41-.41
               1.75-1.03l3.58-6.49A1 1 0 0 0 21 5H6.21l-.94-2H1v2h3l3.6 7.59-1.35
               2.44C5.52 15.37 6.48 17 8 17h12v-2H8l1.16-1z" />
          </svg>
          <span v-if="cartCount > 0" class="badge" :aria-label="`${cartCount} รายการในตะกร้า`">{{ cartCount }}</span>
        </button>

        <!-- Profile dropdown -->
        <div class="profile" ref="profileEl">
          <button class="icon-btn" @click.stop="toggleProfile" :aria-expanded="profileOpen ? 'true' : 'false'"
            aria-haspopup="menu" aria-controls="profileMenu" aria-label="โปรไฟล์ / เมนูผู้ใช้">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"
              focusable="false">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z" />
            </svg>
          </button>

          <div id="profileMenu" class="profile__menu" v-show="profileOpen" role="menu">
            <router-link class="profile__item" to="/kpi" role="menuitem" @click="closeProfile()">KPI</router-link>
            <!-- TODO: แก้ path ให้ตรง route จริงของคุณ ถ้าไม่ใช่ /tracking -->
            <router-link class="profile__item" to="/order" role="menuitem"
              @click="closeProfile()">คำสั่งซื้อ</router-link>
          </div>
        </div>

        <!-- Hamburger (mobile) -->
        <button class="hamburger" @click="open = !open" :aria-expanded="open ? 'true' : 'false'"
          aria-controls="mobileMenu" aria-label="สลับเมนู">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79L20 20.5 21.5 19 15.5 14zM9.5 14a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
          </svg>
        </button>
      </nav>
    </div>

    <!-- Mobile drawer -->
    <div id="mobileMenu" class="mobile" v-show="open">
      <form class="search search--mobile" @submit.prevent="onSearch" role="search" aria-label="ค้นหา">
        <input v-model.trim="query" type="search" class="search__input" placeholder="ค้นหาสินค้า…"
          aria-label="ค้นหาสินค้า" />
      </form>
    </div>
  </header>
</template>

<style scoped>
:root {
  --nav-bg-left: rgba(255, 255, 255, 0.95);
  --nav-bg-right: rgba(224, 242, 254, 0.95);
  --nav-fg: #0b3d5c;
  --nav-ring: rgba(14, 165, 233, 0.45);
}

.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
  background: linear-gradient(10deg, var(--nav-bg-left), var(--nav-bg-right));
  box-shadow: 0 1px 0 rgba(12, 74, 110, 0.08);
  color: var(--nav-fg);
}

/* ชิดซ้าย–ขวาสุดของ navbar */
.nav__inner {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 1%;
  margin-top: 8px;
}

/* Search */
.search {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search__input {
  flex: 1 1 auto;
  min-width: 280px;
  height: 38px;
  border: 1px solid rgba(12, 74, 110, .18);
  border-radius: 10px;
  padding: 0 12px;
  outline: none;
  color: var(--nav-fg);
  background: rgba(255, 255, 255, .75);
}

.search__input:focus {
  border-color: var(--nav-ring);
  box-shadow: 0 0 0 3px var(--nav-ring);
}

/* Brand */
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  margin-left: 10px;
}

.brand__logo {
  width: 34px;
  height: 34px;
  object-fit: contain;
  border-radius: 8px;
}

.brand__text {
  font-weight: 700;
  letter-spacing: .3px;
}

/* Actions */
.actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  justify-self: end;
}

.icon-btn {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid rgba(12, 74, 110, .18);
  background: #fff;
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #0284c7;
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
}

/* Profile dropdown */
.profile {
  position: relative;
}

.profile__menu {
  position: absolute;
  right: 0;
  top: 110%;
  min-width: 180px;
  padding: 8px;
  background: #fff;
  border: 1px solid rgba(12, 74, 110, .18);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(12, 74, 110, .12);
  z-index: 60;
}

.profile__item {
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  color: #0b3d5c;
  text-decoration: none;
}

.profile__item:hover,
.profile__item:focus {
  background: rgba(14, 165, 233, .12);
}

/* Mobile search: จัดกลาง ระยะขอบซ้าย-ขวา 1% */
.search--mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
}

.search--mobile .search__input {
  width: calc(100% - 2%);
  /* รวมระยะ 1% ต่อข้าง */
  margin-inline: 1%;
}

/* Hamburger + Mobile drawer */
.hamburger {
  display: none;
  border: 1px solid rgba(12, 74, 110, .18);
  background: #fff;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  padding: 8px;
}

.mobile {
  padding: 0%;
}

/* Responsive */
@media (max-width:1023px) {
  .search--desktop {
    display: none;
  }

  .hamburger {
    display: inline-grid;
    place-items: center;
  }

  .mobile {
    display: block;
  }
}
</style>
