import { useEffect, type ReactNode } from 'react'
import { useThemeStore } from '@/store/themeStore'
interface Props { children: ReactNode }
export function ThemeLayout({ children }: Props) {
  const darkMode = useThemeStore(s => s.darkMode)
  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode) }, [darkMode])
  return <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">{children}</div>
}
