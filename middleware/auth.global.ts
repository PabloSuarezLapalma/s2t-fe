import { defineNuxtRouteMiddleware, navigateTo, useState, watch } from '#imports';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Allow public access for the login page
  if (to.path === '/' || to.path === '/index') return;
  
  const user = useState("user");
  const authReady = useState("authReady", () => false);
  
  // Wait until the auth initialization is complete.
  if (!authReady.value) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(authReady, (value) => {
        if (value) {
          unwatch();
          resolve();
        }
      });
    });
  }
  
  if (!user.value) {
    return navigateTo('/');
  }
});
