// src/composables/useTheme.js
import { ref, onMounted } from 'vue'

export function useTheme () {
  const prefersDark = typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches

  const theme = ref(
    localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light')
  )

  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-bs-theme', t)
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(theme.value)
    localStorage.setItem('theme', theme.value)
  }

  onMounted(() => applyTheme(theme.value))

  return { theme, toggleTheme, applyTheme }
}
