<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from "~/composables/useAuth"; // Ajusta la ruta si es necesario

const { user, login, logout, loginWithEmail } = useAuth();

const email = ref('');
const password = ref('');
const router = useRouter();

const handleEmailLogin = async () => {
  try {
    await loginWithEmail(email.value, password.value);
    router.push('/home');
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

const handleGoogleLogin = async () => {
  try {
    await login();
    router.push('/home');
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-96">
      <h1 class="text-2xl font-bold text-center">Login</h1>
      <div v-if="!user">
        <button
          @click="handleGoogleLogin"
          class="w-full flex items-center justify-center py-2 px-4 bg-white border text-black border-gray-300 rounded mt-4 hover:bg-gray-100"
        >
          <img src="/public/google.png" alt="Google Icon" class="w-6 h-6 mr-2" />
          Iniciar sesión con Google
        </button>
        <div class="mt-4">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full py-2 px-4 border rounded mt-2"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full py-2 px-4 border rounded mt-2"
          />
          <button
            @click="handleEmailLogin"
            class="w-full py-2 px-4 bg-blue-500 text-white rounded mt-4"
          >
            Iniciar sesión
          </button>
          <button
            @click="navigateTo('/register')"
            class="w-full py-2 px-4 text-blue-500 mt-2"
          >
            No tienes cuenta? Regístrate
          </button>
        </div>
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
