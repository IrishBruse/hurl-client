import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    base: "http://localhost:5173",
    plugins: [react()],
    server: {
        origin: "http://localhost:5173",
    },
});
