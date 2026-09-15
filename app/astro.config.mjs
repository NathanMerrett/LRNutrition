import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import sanity from "@sanity/astro";
// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    // 👇 update these lines
    sanity({
      projectId: "kavbcyru",
      dataset: "development",
      useCdn: false, // for static builds
    }),
  ],
});