import { defineNuxtPlugin, useRuntimeConfig } from '#imports';
import axios from 'axios';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const axiosInstance = axios.create({
    baseURL: config.public.axios.baseURL,
    withCredentials: config.public.axios.credentials,
  });

  axiosInstance.interceptors.request.use(request => {
    request.withCredentials = true;
    return request;
  });

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});
