import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-redux'],
  },
  // Pre-bundle heavy UI libs so dynamic imports do not thrash the dep optimizer
  // (avoids "504 Outdated Optimize Dep" when chunks are invalidated mid-session).
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-redux',
      '@reduxjs/toolkit',
      '@mui/material',
      '@mui/material/styles',
      '@mui/icons-material',
      '@mui/x-date-pickers',
      '@mui/x-date-pickers/AdapterDayjs',
      'dayjs',
    ],
  },
  build:{
    sourcemap:true,
    minify: false,
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      // Needed for workspace symlinks
      followSymlinks: true,
    },
  }
})
