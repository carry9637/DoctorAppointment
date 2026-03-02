import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load all env vars (including REACT_APP_ ones)
  const env = loadEnv(mode, process.cwd(), "");

  // Build a map of process.env.REACT_APP_* for CRA compatibility
  const processEnvDefines = {};
  Object.keys(env).forEach((key) => {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(env[key]);
  });

  return {
    plugins: [
      react({
        // CRA allows JSX in .js files — tell Vite's React plugin the same
        include: "**/*.{js,jsx}",
      }),
    ],
    define: processEnvDefines,
    server: {
      port: 3000,
      open: true,
      watch: {
        // WSL + Windows drive: inotify kaam nahi karta, polling use karo
        usePolling: true,
        interval: 300,
      },
    },
    build: {
      outDir: "build",
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
  };
});
