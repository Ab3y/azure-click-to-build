import { Toaster } from 'sonner'
import { AppShell } from './components/layout/AppShell'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

export default function App() {
  useKeyboardShortcuts()

  return (
    <>
      <AppShell />
      <Toaster
        position="bottom-right"
        richColors
        theme="system"
        toastOptions={{
          className: 'dark:bg-zinc-800 dark:text-zinc-100',
        }}
      />
    </>
  )
}
