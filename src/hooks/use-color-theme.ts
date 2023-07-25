import { useEffect } from 'react';
import { useLocalStorageState } from 'ahooks';

export enum ThemeType {
  Light = 'light',
  Dark = 'dark',
}

export default function useColorTheme(): [ThemeType, () => void] {
  const [theme, setTheme] = useLocalStorageState<ThemeType>('color-theme');

  const changeTheme = (type: ThemeType) => {
    setTheme(type);
    if (type === ThemeType.Light) {
      document.body.removeAttribute('arco-theme');
    } else {
      document.body.setAttribute('arco-theme', 'dark');
    }
  };

  const toggleTheme = () => {
    if (theme === ThemeType.Light) {
      changeTheme(ThemeType.Dark);
    } else {
      changeTheme(ThemeType.Light);
    }
  };

  useEffect(() => {
    if (typeof theme !== 'undefined') {
      changeTheme(theme);
      return;
    }
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkThemeMq.matches) {
      changeTheme(ThemeType.Dark);
    } else {
      changeTheme(ThemeType.Light);
    }
  }, []);

  return [theme || ThemeType.Light, toggleTheme];
}
