// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  plugins: ["~/plugins/firebase.ts"],
  runtimeConfig: {
    public: {
      axios: {
        baseURL: 'http://localhost:7000', // Backend API URL
        credentials: true, // Include credentials in requests
      }
    }
  },
})