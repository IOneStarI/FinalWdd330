import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
  outDir: "../dist",
  rollupOptions: {
    input: {
      main: resolve(__dirname, "src/index.html"),
      video: resolve(__dirname, "src/video/index.html"),
      image: resolve(__dirname, "src/image/index.html"),
      history: resolve(__dirname, "src/history/index.html"),
    },
  },
},
});
