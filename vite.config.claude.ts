import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true, // active le prérendu (SSG) pour les pages publiques
        crawlLinks: true, // découvre automatiquement les pages liées
        // ✅ Sécurisation : Exclusion stricte des zones privées et de l'administration
        filter: ({ path }) => !path.startsWith('/rendez-vous') && !path.startsWith('/admin'), 
      },
      sitemap: {
        enabled: true,
        host: 'https://tonsite.com', // ⚠️ À remplacer par ton vrai domaine
      },
    }),
    viteReact(),
  ],
})