import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum ThemeType {
  Light = 'light',
  Dark = 'dark',
}

interface ColorThemeState {
  theme: ThemeType;
  changeTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

let defaultTheme = ThemeType.Light;

if (typeof window !== 'undefined') {
  const persistedData = localStorage.getItem('theme-store');
  if (
    (!persistedData && window.matchMedia('(prefers-color-scheme: dark)')) ||
    persistedData?.includes('dark')
  ) {
    defaultTheme = ThemeType.Dark;
    window.addEventListener('load', () => {
      document.body.setAttribute('arco-theme', 'dark');
    });
  }
}

export const useColorTheme = create<ColorThemeState>()(
  persist(
    (set, get) => ({
      theme: defaultTheme,
      changeTheme: theme => set({ theme }),
      toggleTheme: () => {
        if (get().theme === ThemeType.Light) {
          set({ theme: ThemeType.Dark });
          document.body.setAttribute('arco-theme', 'dark');
        } else {
          set({ theme: ThemeType.Light });
          document.body.removeAttribute('arco-theme');
        }
      },
    }),
    {
      name: 'theme-store',
      partialize: state => ({ theme: state.theme }),
    },
  ),
);
