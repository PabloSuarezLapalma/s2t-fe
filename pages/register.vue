<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { useRouter } from "vue-router";

const router = useRouter();

const state = reactive({
  name: "",
  email: "",
  password: "",
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.name) errors.push({ path: "name", message: "Required" });
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!state.password) errors.push({ path: "password", message: "Required" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  alert("Registro exitoso, ahora puedes iniciar sesión.");
  router.push("/");
}
</script>

<template>
  <div>
    <div class="mx-64 my-64 w-96 justify-items-center align-middle">
      <NuxtRouteAnnouncer />
      <UCard>
        <UForm
          :validate="validate"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <h1 class="text-2xl font-bold text-center">Registro</h1>
          <UFormGroup label="Nombre" name="name">
            <UInput v-model="state.name" />
          </UFormGroup>

          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormGroup>

          <UButton type="submit" class="align-center"> Registrar </UButton>
        </UForm>
      </UCard>
    </div>
  </div>
</template>
