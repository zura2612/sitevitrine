// fichier vite.config.ts
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteTsconfigPaths from 'vite-tsconfig-paths'

const config = defineConfig({
  server: {
    port: 5173, // Le port est défini ici
    strictPort: true, // Si true, Vite coupe si le port est déjà pris au lieu d'en chercher un autre
  },
  plugins: [
    viteTsconfigPaths({ projects:["./tsconfig.json"] }),
    tanstackStart({
      prerender: {
        enabled: true, // active le prérendu (SSG) pour les pages publiques
        crawlLinks: true, // découvre automatiquement les pages liées
        //Exclusion stricte des zones privées et de l'administration
        filter: ({ path }) => !path.startsWith('/rendez-vous') && !path.startsWith('/admin'), 
      },
      sitemap: {
        enabled: true,
        host: 'http://localhost:5173',
      },
    }),
    devtools(), tailwindcss(), viteReact(),
  ],
})

export default config
