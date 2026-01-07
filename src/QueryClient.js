import { QueryClient } from '@tanstack/vue-query'

// TanStack Query Client oluşturuyoruz
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,         // 1 dakika cache geçerli
      refetchOnWindowFocus: false,  // pencere odaklanınca tekrar fetch etmesin
      retry: 1,                      // fetch başarısız olursa 1 kez denesin
    },
  },
})