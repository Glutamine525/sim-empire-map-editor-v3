import { CSSProperties } from 'react';

export function isCssPropertySupported(property: keyof CSSProperties) {
  if (property in document.body.style) return true;
  const prefixes = ['Moz', 'Webkit', 'O', 'ms'];
  const prefProperty = property.charAt(0).toUpperCase() + property.slice(1);
  for (let i = 0; i < prefixes.length; i++) {
    if (prefixes[i] + prefProperty in document.body.style) {
      return true;
    }
  }
  return false;
}
