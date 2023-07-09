import {
  FixedBuildingColor,
  FixedBuildingType,
} from '@/map-core/building/fixed';
import { GeneralBuilding } from '@/map-core/building/general';
import {
  BuildingConfig,
  BuildingType,
  CatalogType,
  CivilBuilding,
  SimpleBuildingConfig,
} from '@/map-core/building/type';
import { CivilType } from '@/map-core/type';

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
