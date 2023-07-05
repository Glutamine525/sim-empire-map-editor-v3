import React, { useEffect, useRef, useState } from 'react';
import { Button, Menu, Tooltip } from '@arco-design/web-react';
import SiderComponent from '@arco-design/web-react/es/Layout/sider';
import { IconMenuFold, IconMenuUnfold } from '@arco-design/web-react/icon';
import { useKeyPress } from 'ahooks';
import classcat from 'classcat';
import Image from 'next/image';
import PerfectScrollbar from 'perfect-scrollbar';
import { shallow } from 'zustand/shallow';
import { EDITOR_PAGE_UI_SETTING } from '@/app/editor/_config';
import {
  BuildingType,
  CatalogType,
  CivilBuilding,
  ImportExportSubmenu,
  SimpleBuildingConfig,
} from '@/map-core/building';
import { GeneralBuilding } from '@/map-core/building/general';
import { OperationType } from '@/map-core/type';
import {
  getGeneralBuilding,
  getRoadBuilding,
  getSelectedBuilding,
} from '@/utils/building';
import { catalogImageMap } from '../../_config/images';
import {
  ahooksIdxKeyFilter,
  mapIdxToShortcut,
  mapMenuToShortcut,
  mapProtectionShortcutToIdx,
  mapShortcutToIdx,
  mapShortcutToMenu,
  protectionShortcut,
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

const defaultSubMenuOpenedState = {
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
};

const LeftMenu = () => {
  console.log('LeftMenu render');

  const [civil, changeOperation, changeBrush] = useMapConfig(
    state => [state.civil, state.changeOperation, state.changeBrush],
    shallow,
  );

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
  }>(defaultSubMenuOpenedState);

  const container = useRef<HTMLDivElement>();
  const openedSubMenu = useRef<CatalogType>();

  const resetSubMenuOpened = () => {
    setSubMenuOpened(defaultSubMenuOpenedState);
  };

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
      resetSubMenuOpened();
      if (subMenuContent[catalog].length === 0) {
        openedSubMenu.current = undefined;
        onClickMenuItem(catalog);
        return;
      }
      setSubMenuOpened(state => ({ ...state, [catalog]: true }));
      openedSubMenu.current = catalog;
    },
    { useCapture: true },
  );

  useKeyPress(ahooksIdxKeyFilter, e => {
    if (!openedSubMenu.current) {
      return;
    }
    onClickMenuItem(openedSubMenu.current + '-' + mapShortcutToIdx[e.key]);
  });

  useKeyPress(protectionShortcut, e => {
    const key = e.key.toUpperCase();
    const index = mapProtectionShortcutToIdx[key];
    if (index >= CivilBuilding[civil]['防护'].length) {
      return;
    }
    const name = CivilBuilding[civil]['防护'][index];
    const buildingIndex = subMenuContent[CatalogType.Municipal].findIndex(
      v => v.name === name,
    );
    if (buildingIndex === -1) {
      return;
    }
    onClickMenuItem(CatalogType.Municipal + '-' + buildingIndex);
  });

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

  const onClickMenuItem = (key: string) => {
    resetSubMenuOpened();
    const [catalog, _index] = key.split('-') as [CatalogType, string];
    const index = Number(_index);
    console.log({ catalog, index });
    switch (catalog) {
      case CatalogType.Road:
        changeOperation(OperationType.PlaceBuilding);
        changeBrush(getRoadBuilding());
        return;
      case CatalogType.General:
        changeOperation(OperationType.PlaceBuilding);
        changeBrush(getGeneralBuilding(index + 2));
        return;
      case CatalogType.Cancel:
        changeOperation(OperationType.Empty);
        return;
      case CatalogType.ImportExport:
        return;
      default:
        if (isNaN(index)) {
          return;
        }
        changeOperation(OperationType.PlaceBuilding);
        changeBrush(
          getSelectedBuilding(
            civil,
            catalog as BuildingType,
            subMenuContent[catalog][index],
          ),
        );
    }
  };

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
        onClickMenuItem={onClickMenuItem}
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
                  <div
                    className={classcat([
                      styles['key-shortcut'],
                      styles['key-shortcut-arrow'],
                    ])}
                  >
                    {mapMenuToShortcut[catalog]}
                  </div>
                </div>
              }
              triggerProps={{
                className: styles['pop-sub-menu-container'],
                popupVisible: subMenuOpened[catalog],
                trigger: ['hover', 'click'],
                onVisibleChange: visible => {
                  resetSubMenuOpened();
                  setSubMenuOpened(state => ({ ...state, [catalog]: visible }));
                  if (visible) {
                    openedSubMenu.current = catalog;
                  } else {
                    openedSubMenu.current = undefined;
                  }
                },
                onClick: () => {
                  setSubMenuOpened(state => {
                    if (state[catalog]) {
                      openedSubMenu.current = undefined;
                    } else {
                      openedSubMenu.current = catalog;
                    }
                    return {
                      ...state,
                      [catalog]: !state[catalog],
                    };
                  });
                },
                onClickOutside: () => {
                  resetSubMenuOpened();
                  openedSubMenu.current = undefined;
                },
              }}
            >
              {isCollapsed && (
                <div className={styles['pop-sub-menu-title']} key="title">
                  {catalog}
                </div>
              )}
              {subMenu.map((v, i) => (
                <MenuItem key={catalog + '-' + i}>
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
