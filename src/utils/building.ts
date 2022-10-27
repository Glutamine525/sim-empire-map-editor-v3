import { Building } from '@/map-core/building';

export const RoadImg = new Image();
RoadImg.src =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAAE6SURBVEiJ7VVLEsIwCAWuUZe297+A9+g0LvUYLS4YkeHTVN24MJsyvPBCII/iPM8AME73tgxiwHNZzwcortulLQMiMrPFZF3biZnFjqgwVrEkH4136zzeKl51prwAQNd20k1ip3mJEe9kt3lqPXOc7sxsN2kFJXcX35ZBYm25LYrrdvEuxPN4i52Ruuv9XB1iVz21Pb/q20GUoFhV3xBxB7WGp9aT087A8y2lqHNSxKrOiEfQ+GZsrNjk0nSXcg9GUfdmYuxLjZYuzcXy6trX6qsgO51JeaGnVbJ5RdilnzorrZKembJr3yJ7V6uJGvV2rg77UzRqNVdj1bdv1Si1O6K3iFqtJmo8orcKtbFkZ7TO7q7eInuMJZ3ROn9la1dvDo2x/3+jp/7/G3/03/iWVint20G9RV4b+wB4s+9T4iL+igAAAABJRU5ErkJggg==';

export function showMarker(b: Building) {
  if (b?.isRoad) {
    return (b?.marker || 0) > 1;
  }
  return !b?.isBarrier && !b?.isDecoration && !b?.isProtection && !b?.isWonder;
}

export function canHover(b: Building) {
  return !b?.isBarrier && !b?.isRoad;
}
