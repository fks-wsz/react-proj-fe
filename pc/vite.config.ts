import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

const CWD = process.cwd()

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = mode === 'development' || command === 'serve'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(CWD, 'src'),
      },
    },
    define: {
      __DEV__: isDev,
    },
  }
})
