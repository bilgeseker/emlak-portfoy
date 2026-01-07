import { ref, watch } from 'vue'

const isDark = ref(false)

export function useTheme() {

  const initTheme = () => {
    isDark.value = document.documentElement.classList.contains('dark')
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  watch(isDark, (val) => {
    document.documentElement.classList.toggle('dark', val)
  }, { immediate: true })

  return {
    isDark,
    toggleTheme,
    initTheme
  }
}
