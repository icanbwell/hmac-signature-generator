import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "index.html",
    }),
    paths: {
      base: process.env.NODE_ENV === "production" ? "/hmac-signature-generator" : "",
    },
    alias: {
      "@": "src", // Set up the alias for 'src'
    },
  },
};

export default config;
