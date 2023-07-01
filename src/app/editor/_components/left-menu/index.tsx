import React, { useEffect, useRef, useState } from 'react';
import { Menu } from '@arco-design/web-react';
import SiderComponent from '@arco-design/web-react/es/Layout/sider';
import Image from 'next/image';
import PerfectScrollbar from 'perfect-scrollbar';
import { EDITOR_PAGE_UI_SETTING } from '@/app/editor/_config';
import {
  CatalogType,
  ImportExportSubmenu,
  SimpleBuildingConfig,
} from '@/map-core/building';
import { GeneralBuilding } from '@/map-core/building/general';
import { catalogImageMap } from '../../_config/images';
import { useMapConfig } from '../../_store/map-config';
import styles from './index.module.css';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

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

  const container = useRef<HTMLDivElement>();

  useEffect(() => {
    const scrollbar = new PerfectScrollbar(container.current!, {
      wheelPropagation: true,
    });

    return () => {
      scrollbar.destroy();
    };
  }, []);

  return (
    <SiderComponent
      ref={container}
      className={styles.container}
      width={EDITOR_PAGE_UI_SETTING.leftMenuWidth}
    >
      <Menu accordion={true}>
        {Object.entries(subMenuContent).map(([catalog, subMenu]) => {
          if (!subMenu.length) {
            return (
              <MenuItem key={catalog} className={styles['main-menu-container']}>
                <Image
                  src={catalogImageMap[catalog as CatalogType].src}
                  alt={catalog}
                  className={styles.icon}
                  width={28}
                  height={28}
                />
                {catalog}
              </MenuItem>
            );
          }
          return (
            <SubMenu
              key={catalog}
              title={
                <div className={styles['main-menu-container']}>
                  <Image
                    src={catalogImageMap[catalog as CatalogType].src}
                    alt={catalog}
                    className={styles.icon}
                    width={28}
                    height={28}
                  />
                  {catalog}
                </div>
              }
            >
              {subMenu.map(v => (
                <MenuItem key={v.name}>{v.name}</MenuItem>
              ))}
            </SubMenu>
          );
        })}
      </Menu>
    </SiderComponent>
  );
};

export default LeftMenu;
