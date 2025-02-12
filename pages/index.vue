<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { useRouter } from "vue-router";

const router = useRouter();

const state = reactive({
  email: "",
  password: "",
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!state.password) errors.push({ path: "password", message: "Required" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  alert("Inicio de sesión exitoso.");
  router.push("/home");
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-96">
      <NuxtRouteAnnouncer />
      <UCard>
        <UForm
          :validate="validate"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <h1 class="text-2xl font-bold text-center">Login</h1>
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormGroup>

          <div class="flex justify-center">
            <UButton type="submit" class="align-center"> Login </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>
