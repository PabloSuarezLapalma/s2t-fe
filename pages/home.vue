<script setup lang="ts">
import { useRouter } from "vue-router";

const user = ref<{ name: string } | null>(null);
const router = useRouter();

const audioSrc = ref<string | null>(null);
const audioName = ref<string | null>(null);

function handleFileChange(file: File | null) {
  // Validar que el archivo no sea nulo
  if (!file) {
    console.warn("No se seleccionó ningún archivo.");
    return;
  }

  // Validar que sea un archivo de audio
  if (!file.type || !file.type.startsWith("audio/")) {
    alert("Por favor, selecciona un archivo de audio.");
    return;
  }

  // Asignar el archivo al reproductor
  audioSrc.value = URL.createObjectURL(file);
  audioName.value = file.name;

  console.log("Archivo cargado:", {
    name: file.name,
    type: file.type,
    size: file.size,
  });
}
</script>

<template>
  <div class="home-container">
    <UCard class="w-96 text-center space-y-4">
      <h1>Home</h1>
      <p>Bienvenido</p>

      <!-- Input para subir archivo -->
      <UInput
        type="file"
        accept="audio/*"
        size="sm"
        icon="i-heroicons-folder"
        class="file-input"
        @update:modelValue="handleFileChange($event?.[0] ?? null)"
      />

      <!-- Reproductor de audio estilado -->
      <UCard v-if="audioSrc" bordered shadow class="audio-player w-full space-y-2">
        <p class="font-bold">{{ audioName }}</p>
        <audio :src="audioSrc" controls class="w-full"></audio>
      </UCard>
    </UCard>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.logout-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: red;
  color: white;
}

.file-input {
  margin: 1rem auto;
}

.audio-player {
  background-color: #f9fafb; /* Fondo claro para resaltar el reproductor */
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
