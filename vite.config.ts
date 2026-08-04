import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/ccarf-trainer/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'CCAR-F Trainer',
        short_name: 'CCAR-F',
        description: 'Entrenador adaptativo para el examen Claude Certified Architect – Foundations.',
        theme_color: '#5b5bd6',
        background_color: '#f5f7fb',
        display: 'standalone',
        scope: '/ccarf-trainer/',
        start_url: '/ccarf-trainer/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
