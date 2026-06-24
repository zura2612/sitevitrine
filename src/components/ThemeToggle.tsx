// fichier src/components/ThemeToggle.tsx
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

type ThemeMode = 'light' | 'dark'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

// Si l'utilisateur est déjà venu et a choisi un thème, on le reprend
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' ) {
    return stored
  }

  // S'il n'y a pas d'historique, on regarde la préférence du système (Windows/Mac/Linux)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

function applyThemeMode(mode: ThemeMode) {
  if (typeof window === 'undefined') return
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(mode)
  document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.style.colorScheme = mode
}

export function ThemeToggle() {
  // On initialise avec une valeur temporaire safe pour le SSR
  const [mode, setMode] = useState<ThemeMode>('light')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)
  }, [])

  
  function toggleMode() {
    const nextMode: ThemeMode = mode === 'light' ? 'dark' : 'light'
    setMode(nextMode)
    applyThemeMode(nextMode)
    window.localStorage.setItem('theme', nextMode)
  }

  const label = `Passer au thème ${mode === 'light' ? 'sombre' : 'clair'}`
  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      // "pointer-events-auto" et "isolate" pour garantir la capture du survol
      className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-accent
      transition pointer-events-auto isolate"
    >
      {/* On ajoute "pointer-events-none" sur les icônes pour que la souris traverse l'image 
        et cible directement le bouton entier */}
      {/* {mode === 'dark' ? 'Sombre' : 'Clair'} */}
      {/* Afficher l'icône correspondante avec une taille contrôlée */}
      {mode === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-500 pointer-events-none" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 pointer-events-none" />
      )}
    </button>
  )
}
