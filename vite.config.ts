import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mapEnvironment } from "./map-env";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: mapEnvironment(mode),
}));
