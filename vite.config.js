import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(async () => {
  const plugins = [];
  try {
    const react = (await import('@vitejs/plugin-react')).default;
    plugins.push(react());
  } catch {
    // Will be active once node_modules are installed
  }

  return {
    root: '.',
    plugins,
    resolve: {
      alias: {
        '@': resolve(__dirname, '.'),
      }
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          login: resolve(__dirname, 'login.html'),
          register: resolve(__dirname, 'register.html'),
          vault: resolve(__dirname, 'vault.html'),
          test: resolve(__dirname, 'test.html')
        }
      }
    }
  };
})
