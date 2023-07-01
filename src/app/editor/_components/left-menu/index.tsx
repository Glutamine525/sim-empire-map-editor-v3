import React, { useEffect, useState } from 'react';
import { Menu } from '@arco-design/web-react';
import SiderComponent from '@arco-design/web-react/es/Layout/sider';
import Image from 'next/image';
import { EDITOR_PAGE_UI_SETTING } from '@/app/editor/_config';
import {
  BuildingType,
  CatalogType,
  CivilBuilding,
  ImportExportSubmenu,
  SimpleBuildingConfig,
} from '@/map-core/building';
import { GeneralBuilding } from '@/map-core/building/general';
import { catalogImageMap } from '../../_config/images';
import {
  mapIdxToShortcut,
  mapMenuToShortcut,
  shortcutIdxCap,
} from '../../_config/shortcut';
import { useMapConfig } from '../../_store/map-config';
import styles from './index.module.css';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const Icon = ({ catalog }: { catalog: CatalogType }) => (
  <Image
    src={catalogImageMap[catalog].src}
    alt={catalog}
    className={styles.icon}
    width={28}
    height={28}
  />
);

const LeftMenu = () => {
  const civil = useMapConfig(state => state.civil);

  const [subMenuContent, setSubMenuContent] = useState<{
    [key in CatalogType]: SimpleBuildingConfig[];
  }>({
    [CatalogType.Road]: [],
    [CatalogType.Residence]: [],
    [CatalogType.Agriculture]: [],
    [CatalogType.Industry]: [],
    [CatalogType.Commerce]: [],
    [CatalogType.Municipal]: [],
    [CatalogType.Culture]: [],
    [CatalogType.Religion]: [],
    [CatalogType.Military]: [],
    [CatalogType.Decoration]: [],
    [CatalogType.Wonder]: [],
    [CatalogType.General]: GeneralBuilding,
    [CatalogType.Special]: [],
    [CatalogType.Cancel]: [],
    [CatalogType.Move]: [],
    [CatalogType.Delete]: [],
    [CatalogType.Undo]: [],
    [CatalogType.Redo]: [],
    [CatalogType.ImportExport]: Object.values(ImportExportSubmenu).map(
      v => ({ name: v } as SimpleBuildingConfig),
    ),
    [CatalogType.WatermarkMode]: [],
  });

  useEffect(() => {
    const buildingConfig = CivilBuilding[civil];
    setSubMenuContent(state => ({
      ...state,
      [BuildingType.Residence]: buildingConfig[BuildingType.Residence],
      [BuildingType.Agriculture]: buildingConfig[BuildingType.Agriculture],
      [BuildingType.Industry]: buildingConfig[BuildingType.Industry],
      [BuildingType.Commerce]: buildingConfig[BuildingType.Commerce],
      [BuildingType.Municipal]: buildingConfig[BuildingType.Municipal],
      [BuildingType.Culture]: buildingConfig[BuildingType.Culture],
      [BuildingType.Religion]: buildingConfig[BuildingType.Religion],
      [BuildingType.Military]: buildingConfig[BuildingType.Military],
      [BuildingType.Decoration]: buildingConfig[BuildingType.Decoration],
      [BuildingType.Wonder]: buildingConfig[BuildingType.Wonder],
    }));
  }, [civil]);

  return (
    <SiderComponent
      className={styles.container}
      width={EDITOR_PAGE_UI_SETTING.leftMenuWidth}
    >
      <Menu accordion={true} className={styles['menu-container']} mode="pop">
        {Object.entries(subMenuContent).map(([_catalog, subMenu]) => {
          const catalog = _catalog as CatalogType;
          if (!subMenu.length) {
            return (
              <MenuItem key={catalog} className={styles['main-menu-container']}>
                <Icon catalog={catalog} />
                <div className={styles.text}>{catalog}</div>
                <div className={styles['key-shortcut']}>
                  {mapMenuToShortcut[catalog].trim() || '⎵'}
                </div>
              </MenuItem>
            );
          }
          return (
            <SubMenu
              key={catalog}
              title={
                <div className={styles['main-menu-container']}>
                  <Icon catalog={catalog} />
                  <div className={styles.text}>{catalog}</div>
                  <div className={styles['key-shortcut']}>
                    {mapMenuToShortcut[catalog]}
                  </div>
                </div>
              }
              triggerProps={{ className: styles['pop-sub-menu-container'] }}
            >
              {subMenu.map((v, i) => (
                <MenuItem key={v.name} className={styles['sub-menu-container']}>
                  <div>
                    {i + 1}. {v.name}
                  </div>
                  {i < shortcutIdxCap && (
                    <div className={styles['key-container']}>
                      <div className={styles['key-shortcut']}>
                        {mapMenuToShortcut[catalog]}
                      </div>
                      +
                      <div className={styles['key-shortcut']}>
                        {mapIdxToShortcut[i]}
                      </div>
                    </div>
                  )}
                </MenuItem>
              ))}
            </SubMenu>
          );
        })}
      </Menu>
    </SiderComponent>
  );
};

export default LeftMenu;
