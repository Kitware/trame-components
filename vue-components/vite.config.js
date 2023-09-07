export default {
  base: "./",
  build: {
    lib: {
      entry: "./src/main.js",
      name: "trame_components",
      formats: ["umd"],
      fileName: "trame-components",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    outDir: "../trame_components/module/serve",
    assetsDir: ".",
  },
};
