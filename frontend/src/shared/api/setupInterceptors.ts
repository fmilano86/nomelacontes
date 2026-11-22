import axios from 'axios'
import { api } from './axiosInstance'
import { useAuthStore } from '@/store/authStore'
api.interceptors.response.use(response => response, (error: unknown) => {
  if (axios.isAxiosError<{ detail?: unknown }>(error)) {
    const esAuth = ['/auth/token', '/auth/me'].some(ruta => error.config?.url?.includes(ruta))
    if (!esAuth && (error.response?.status === 401 || (error.response?.status === 400 && error.response.data?.detail === 'Cuenta de usuario desactivada'))) {
      useAuthStore.getState().clearSession()
    }
  }
  return Promise.reject(error)
})
