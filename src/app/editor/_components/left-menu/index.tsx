import React, { useEffect, useRef, useState } from 'react';
import { Button, Menu, Tooltip } from '@arco-design/web-react';
import SiderComponent from '@arco-design/web-react/es/Layout/sider';
import { IconMenuFold, IconMenuUnfold } from '@arco-design/web-react/icon';
import { useKeyPress } from 'ahooks';
import classcat from 'classcat';
import Image from 'next/image';
import PerfectScrollbar from 'perfect-scrollbar';
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
  mapShortcutToMenu,
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

  const [menuWidth, setMenuWidth] = useState(
    EDITOR_PAGE_UI_SETTING.leftMenuWidth,
  );
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
  const [subMenuOpened, setSubMenuOpened] = useState<{
    [key in CatalogType]: boolean;
  }>({
    [CatalogType.Road]: false,
    [CatalogType.Residence]: false,
    [CatalogType.Agriculture]: false,
    [CatalogType.Industry]: false,
    [CatalogType.Commerce]: false,
    [CatalogType.Municipal]: false,
    [CatalogType.Culture]: false,
    [CatalogType.Religion]: false,
    [CatalogType.Military]: false,
    [CatalogType.Decoration]: false,
    [CatalogType.Wonder]: false,
    [CatalogType.General]: false,
    [CatalogType.Special]: false,
    [CatalogType.Cancel]: false,
    [CatalogType.Move]: false,
    [CatalogType.Delete]: false,
    [CatalogType.Undo]: false,
    [CatalogType.Redo]: false,
    [CatalogType.ImportExport]: false,
    [CatalogType.WatermarkMode]: false,
  });

  const container = useRef<HTMLDivElement>();
  const lastOpenedMenu = useRef<CatalogType>();

  const isCollapsed =
    menuWidth === EDITOR_PAGE_UI_SETTING.leftMenuWidthCollapsed;

  useKeyPress(
    Object.keys(mapShortcutToMenu),
    e => {
      const key = e.key === ' ' ? e.code : e.key.toUpperCase();
      if (key === 'Space') {
        e.preventDefault();
      }
      const catalog = mapShortcutToMenu[key] as CatalogType;
      console.log(key, catalog, lastOpenedMenu.current);
      if (subMenuContent[catalog].length === 0) {
        if (lastOpenedMenu.current) {
          setSubMenuOpened(state => ({
            ...state,
            [lastOpenedMenu.current!]: false,
          }));
        }
        return;
      }
      if (!lastOpenedMenu.current) {
        // 没有打开的子菜单，打开当前选中的子菜单
        setSubMenuOpened(state => ({ ...state, [catalog]: true }));
        lastOpenedMenu.current = catalog;
      } else if (lastOpenedMenu.current !== catalog) {
        // 有打开的子菜单，且和当前选中的子菜单不同，关闭前一个子菜单，打开当前选中的子菜单
        setSubMenuOpened(state => ({
          ...state,
          [catalog]: true,
          [lastOpenedMenu.current!]: false,
        }));
        lastOpenedMenu.current = catalog;
      } else {
        // 有打开的子菜单，且和当前选中的子菜单相同，关闭该子菜单
        setSubMenuOpened(state => ({ ...state, [catalog]: false }));
        lastOpenedMenu.current = undefined;
      }
    },
    { useCapture: true },
  );

  useEffect(() => {
    const scrollbar = new PerfectScrollbar(container.current!, {
      wheelPropagation: true,
      suppressScrollX: true,
    });

    return () => {
      scrollbar.destroy();
    };
  }, []);

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
      ref={container}
      className={styles.container}
      width={menuWidth}
    >
      <Menu
        accordion={true}
        className={classcat({
          [styles['menu-container']]: true,
          [styles['collapsed']]: isCollapsed,
        })}
        mode="pop"
        selectable={false}
        tooltipProps={{ content: null }}
        collapse={isCollapsed}
      >
        {Object.entries(subMenuContent).map(([_catalog, subMenu]) => {
          const catalog = _catalog as CatalogType;
          if (subMenu.length === 0) {
            return (
              <MenuItem key={catalog}>
                <Tooltip
                  content={isCollapsed ? catalog : null}
                  position="right"
                >
                  <div className={styles['main-menu-container']}>
                    <Icon catalog={catalog} />
                    <div className={styles.text}>{catalog}</div>
                    <div className={styles['key-shortcut']}>
                      {mapMenuToShortcut[catalog] === 'Space'
                        ? '⎵'
                        : mapMenuToShortcut[catalog]}
                    </div>
                  </div>
                </Tooltip>
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
              triggerProps={{
                className: styles['pop-sub-menu-container'],
                popupVisible: subMenuOpened[catalog],
                onVisibleChange: visible => {
                  setSubMenuOpened(state => ({ ...state, [catalog]: visible }));
                },
              }}
            >
              {isCollapsed && (
                <div className={styles['pop-sub-menu-title']} key="title">
                  {catalog}
                </div>
              )}
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
      <div
        className={styles['collapse-button-container']}
        style={{
          left: menuWidth - 20,
        }}
      >
        <Button
          shape="circle"
          type="text"
          className={styles['collapse-button']}
          icon={isCollapsed ? <IconMenuUnfold /> : <IconMenuFold />}
          onClick={() => {
            if (isCollapsed) {
              setMenuWidth(EDITOR_PAGE_UI_SETTING.leftMenuWidth);
              return;
            }
            setMenuWidth(EDITOR_PAGE_UI_SETTING.leftMenuWidthCollapsed);
          }}
        />
      </div>
    </SiderComponent>
  );
};

export default LeftMenu;
