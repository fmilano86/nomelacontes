import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Usuario, Login } from '@/features/auth/types'
import { loginRequest, meRequest, logoutRequest } from '@/features/auth/api/auth'
import { queryClient } from '@/shared/api/queryClient'
interface AuthState {
  usuario: Usuario | null;
  cargando: boolean;
  clearSession: () => void;
  checkSession: () => Promise<void>;
  login: (datos: Login) => Promise<void>;
  logout: () => Promise<void>;
}
let comprobacion: Promise<void> | null = null
export const useAuthStore = create<AuthState>()(persist((set, get) => ({
  usuario: null, cargando: true,
  clearSession: () => { queryClient.clear(); set({ usuario: null, cargando: false }) },
  checkSession: async () => {
    if (comprobacion) return comprobacion
    comprobacion = (async () => {
      try { set({ usuario: await meRequest(), cargando: false }) }
      catch { get().clearSession() }
    })()
    try { await comprobacion } finally { comprobacion = null }
  },
  login: async datos => { await loginRequest(datos); const usuario = await meRequest(); queryClient.clear(); set({ usuario, cargando: false }) },
  logout: async () => { await logoutRequest(); get().clearSession() },
}), { name: 'foodstore-tpi-auth', partialize: state => ({ usuario: state.usuario }) }))
