import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
  },
  plugins: [
    vue(),
    vueJsx({
      transformOn: false,
      mergeProps: false,
    }),
  ],
  server: {
    proxy: {
      '/api': {
        // target: 'http://124.70.188.74/',
        target: 'http://localhost:3001',
      }
    }
  },
});
