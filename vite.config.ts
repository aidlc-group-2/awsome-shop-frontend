import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const devProxyTarget = process.env.VITE_DEV_PROXY_TARGET || 'http://localhost:8080'
const originGuard = process.env.VITE_ORIGIN_GUARD

console.log('[vite proxy] target =', devProxyTarget, '| origin-guard =', originGuard ? 'SET' : 'MISSING')

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: devProxyTarget,
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            if (originGuard) {
              proxyReq.setHeader('X-Origin-Guard', originGuard)
            }
          })
        },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
})
