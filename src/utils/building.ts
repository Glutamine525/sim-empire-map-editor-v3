import {
  BuildingConfig,
  BuildingType,
  CatalogType,
  CivilBuilding,
  SimpleBuildingConfig,
} from '@/map-core/building';
import {
  FixedBuildingColor,
  FixedBuildingType,
} from '@/map-core/building/fixed';
import { GeneralBuilding } from '@/map-core/building/general';
import { CivilType } from '@/map-core/type';

export const RoadImg = new Image();
RoadImg.src =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAAE6SURBVEiJ7VVLEsIwCAWuUZe297+A9+g0LvUYLS4YkeHTVN24MJsyvPBCII/iPM8AME73tgxiwHNZzwcortulLQMiMrPFZF3biZnFjqgwVrEkH4136zzeKl51prwAQNd20k1ip3mJEe9kt3lqPXOc7sxsN2kFJXcX35ZBYm25LYrrdvEuxPN4i52Ruuv9XB1iVz21Pb/q20GUoFhV3xBxB7WGp9aT087A8y2lqHNSxKrOiEfQ+GZsrNjk0nSXcg9GUfdmYuxLjZYuzcXy6trX6qsgO51JeaGnVbJ5RdilnzorrZKembJr3yJ7V6uJGvV2rg77UzRqNVdj1bdv1Si1O6K3iFqtJmo8orcKtbFkZ7TO7q7eInuMJZ3ROn9la1dvDo2x/3+jp/7/G3/03/iWVint20G9RV4b+wB4s+9T4iL+igAAAABJRU5ErkJggg==';

export function showMarker(b: BuildingConfig) {
  if (b?.isRoad) {
    return b?.isRoadVertex;
  }
  return (
    !b?.isEmpty &&
    !b?.isBarrier &&
    !b?.isDecoration &&
    !b?.isProtection &&
    !b?.isWonder
  );
}

export function canHover(b: BuildingConfig) {
  return !b?.isBarrier && !b?.isRoad;
}

export function getRoadBuilding(): BuildingConfig {
  return {
    w: 1,
    h: 1,
    name: CatalogType.Road,
    catalog: CatalogType.Road,
    bg: FixedBuildingColor[FixedBuildingType.Road],
    isRoad: true,
  };
}

export function getSelectedBuilding(
  civil: CivilType,
  catalog: BuildingType,
  record: SimpleBuildingConfig,
): BuildingConfig {
  return {
    w: record.size,
    h: record.size,
    range: record.range,
    bg: record.background,
    name: record.name,
    text: record.text,
    catalog: catalog,
    isProtection:
      catalog === BuildingType.Municipal &&
      CivilBuilding[civil]['防护'].includes(record.name),
    isWonder: catalog === BuildingType.Wonder || record.isPalace,
    isDecoration: catalog === BuildingType.Decoration,
  };
}

export function getGeneralBuilding(size: number): BuildingConfig {
  return {
    w: size,
    h: size,
    bg: GeneralBuilding[size - 2].background,
    name: GeneralBuilding[size - 2].name,
    text: GeneralBuilding[size - 2].text,
    catalog: CatalogType.General,
    isGeneral: true,
  };
}
