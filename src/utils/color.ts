import { ThemeType } from '@/store/reducers/setting-reducer';

export function getColors(theme: ThemeType) {
  return theme === 'light'
    ? {
        //  backgroundOuterColor: '#e0e0e0',
        backgroundOuterColor: getArcoColor('--gray-2'),
        backgroundInnerColor: '#f5f5f5',
        borderColor: '#eceff1',
      }
    : {
        //  backgroundOuterColor: '#161823',
        backgroundOuterColor: getArcoColor('--gray-2'),
        backgroundInnerColor: '#353b48',
        borderColor: '#2f3640',
      };
}

export function getArcoColor(name: string) {
  return `rgb(${getComputedStyle(document.body).getPropertyValue(name).replace(/\s/, '')})`;
}
