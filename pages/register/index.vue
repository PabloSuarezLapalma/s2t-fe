<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from "../../composables/useAuth"; // Ajusta la ruta si es necesario

const { registerWithEmail } = useAuth();

const email = ref('');
const password = ref('');
const username = ref('');
const errorMessage = ref('');
const router = useRouter();
const handleRegister = async () => {
  try {
    await registerWithEmail(email.value, password.value, username.value);
    router.push('/');
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = 'Error al registrar: ' + error.message;
    } else {
      errorMessage.value = 'Error al registrar: ' + String(error);
    }
  }
};

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-96">
      <h1 class="text-2xl font-bold text-center">Registrarse</h1>
      <div class="mt-4">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full py-2 px-4 border rounded mt-2"
        />
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
          @click="handleRegister"
          class="w-full py-2 px-4 bg-blue-500 text-white rounded mt-4"
        >
          Registrarse
        </button>
        <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
        <button
          @click="navigateTo('/')"
          class="w-full py-2 px-4 text-blue-500 mt-2"
        >
          Ya tienes una cuenta? Inicia sesión
        </button>
      </div>
    </div>
  </div>
</template>
