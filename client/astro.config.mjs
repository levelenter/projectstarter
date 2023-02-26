import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';
// https://astro.build/config
export default defineConfig({
  output: "server",
  server: { port: 3000, host: true },
  integrations: [vue(),tailwind()]
});
