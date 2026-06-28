// fichier src/components/ThemeToggle.tsx
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

type ThemeMode = 'light' | 'dark'

interface ThemeToggleProps {
  labels?: {
    light: string;
    dark: string;
  };
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
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

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const [mode, setMode] = useState<ThemeMode>('light')

  // Fallback sur les labels français si les props ne sont pas fournies
  const defaultLabels = {
    light: 'Passer au thème sombre',
    dark: 'Passer au thème clair'
  }
  
  const t = labels ?? defaultLabels

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

  // Utiliser le label approprié selon le thème actuel
  const label = mode === 'light' ? t.light : t.dark

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-accent transition pointer-events-auto isolate"
    >
      {mode === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-500 pointer-events-none" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 pointer-events-none" />
      )}
    </button>
  )
}