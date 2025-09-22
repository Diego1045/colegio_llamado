import { defineStore } from 'pinia'
import { authService } from '../services/authService.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),

  actions: {
    async initialize() {
      try {
        this.loading = true
        if (authService.hasValidToken()) {
          const user = await authService.getCurrentUser()
          this.user = user
        }
      } catch (err) {
        this.error = err.message
        // Si hay error, limpiar token
        authService.logout()
      } finally {
        this.loading = false
      }
    },

    async signIn(email, password) {
      try {
        this.loading = true
        this.error = null
        const data = await authService.login(email, password)
        this.user = data.user
        return data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async signUp(userData) {
      try {
        this.loading = true
        this.error = null
        const data = await authService.register(userData)
        return data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      try {
        this.loading = true
        await authService.logout()
        this.user = null
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async validateCode(code) {
      try {
        this.loading = true
        this.error = null
        const data = await authService.validateInvitationCode(code)
        return data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    isAdmin: (state) => state.user?.role === 'admin',
    isPadre: (state) => state.user?.role === 'padre'
  }
}) 