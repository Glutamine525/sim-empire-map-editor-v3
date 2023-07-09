import { useMemo } from 'react';
import { MapCore } from '@/app/editor/_map-core';

export default function useMapCore() {
  return useMemo(() => MapCore.getInstance(), []);
}
