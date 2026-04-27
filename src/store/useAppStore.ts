import { create } from 'zustand';
import type { CodeLanguage, ThemeMode } from '../types';

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem('theme') as ThemeMode | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyThemeClass(theme: ThemeMode) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

interface AppState {
  theme: ThemeMode;
  codeLanguage: CodeLanguage;
  sidebarOpen: boolean;
  codePanelOpen: boolean;
  toggleTheme: () => void;
  setCodeLanguage: (lang: CodeLanguage) => void;
  toggleSidebar: () => void;
  toggleCodePanel: () => void;
}

// Apply initial theme class on load
const initialTheme = getInitialTheme();
applyThemeClass(initialTheme);

export const useAppStore = create<AppState>((set) => ({
  theme: initialTheme,
  codeLanguage: 'bicep',
  sidebarOpen: true,
  codePanelOpen: true,

  toggleTheme: () =>
    set((state) => {
      const next: ThemeMode = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      applyThemeClass(next);
      return { theme: next };
    }),

  setCodeLanguage: (lang) => set({ codeLanguage: lang }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleCodePanel: () =>
    set((state) => ({ codePanelOpen: !state.codePanelOpen })),
}));
