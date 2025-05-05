import { defineStore } from 'pinia'
import { auth } from '../supabase'

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
        const { user, error } = await auth.getCurrentUser()
        if (error) throw error
        this.user = user
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async signIn(email, password) {
      try {
        this.loading = true
        const { data, error } = await auth.signIn(email, password)
        if (error) throw error
        this.user = data.user
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async signUp(email, password) {
      try {
        this.loading = true
        const { data, error } = await auth.signUp(email, password)
        if (error) throw error
        this.user = data.user
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      try {
        this.loading = true
        const { error } = await auth.signOut()
        if (error) throw error
        this.user = null
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async resetPassword(email) {
      try {
        this.loading = true
        const { error } = await auth.resetPassword(email)
        if (error) throw error
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    isAdmin: (state) => state.user?.user_metadata?.role === 'admin'
  }
}) 