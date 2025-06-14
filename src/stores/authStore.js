import { defineStore } from 'pinia'
import { authService } from '../services/authService.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.profile?.role === 'admin',
    isProfesor: (state) => state.profile?.role === 'profesor',
    isPadre: (state) => state.profile?.role === 'padre'
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const data = await authService.login(email, password)
        this.user = data.user
        this.profile = await authService.getUserProfile(data.user.id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        await authService.logout()
        this.user = null
        this.profile = null
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkAuth() {
      this.loading = true
      try {
        const user = await authService.getCurrentUser()
        if (user) {
          this.user = user
          this.profile = await authService.getUserProfile(user.id)
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
}) 