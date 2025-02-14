<script setup lang="ts">
import { useAuth } from "../composables/useAuth"; // Ajusta la ruta si es necesario

const { user, login, logout } = useAuth();
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-96">
      <h1 class="text-2xl font-bold text-center">Login con Google</h1>
      <div v-if="!user">
        <button
          @click="login"
          class="w-full flex items-center justify-center py-2 px-4 bg-white border text-black border-gray-300 rounded mt-4 hover:bg-gray-100"
        >
          <img src="/public/google.png" alt="Google Icon" class="w-6 h-6 mr-2" />
          Iniciar sesión con Google
        </button>
      </div>
      <div v-else class="text-center mt-4">
        <p>Bienvenido, {{ user.displayName }}</p>
        <button
          @click="logout"
          class="w-full py-2 px-4 bg-red-500 text-white rounded mt-4"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  </div>
</template>
