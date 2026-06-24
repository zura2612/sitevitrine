// fichier fvelec47/vite.config.ts
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
    devtools(), tailwindcss(), tanstackStart(), viteReact(),
  ],
})

export default config
