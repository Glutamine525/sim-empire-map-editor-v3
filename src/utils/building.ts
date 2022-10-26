import { Building } from '@/map-core/building';

export function showMarker(b: Building) {
  if (b.isRoad) {
    return (b.marker || 0) > 1;
  }
  return !b.isBarrier && !b.isDecoration && b.isProtection && !b.isWonder;
}
