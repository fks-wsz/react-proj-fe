import { defineConfig, UserConfig } from 'vite'
import ProjBaseConfig from '../vite.config'
import deepmerge from 'deepmerge'
import path from 'path'

const CWD = process.cwd()

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = mode === 'development' || command === 'serve'

  return deepmerge<UserConfig, UserConfig>(ProjBaseConfig, {
    resolve: {
      alias: {
        '@': path.resolve(CWD, 'src'),
      },
    },
    define: {
      __DEV__: isDev,
    },
  })
})
