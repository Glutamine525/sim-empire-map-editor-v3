import { useMemo } from 'react';
import { MapCore } from '@/map-core';

export default function useMapCore() {
  return useMemo(() => MapCore.getInstance(), []);
}
