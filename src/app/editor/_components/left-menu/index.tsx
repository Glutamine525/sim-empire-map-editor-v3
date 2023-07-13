import React, { useEffect, useRef, useState } from 'react';
import { Button, Layout, Menu, Message, Tooltip } from '@arco-design/web-react';
import { IconMenuFold, IconMenuUnfold } from '@arco-design/web-react/icon';
import { useKeyPress, useLocalStorageState } from 'ahooks';
import classcat from 'classcat';
import Image from 'next/image';
import PerfectScrollbar from 'perfect-scrollbar';
import { shallow } from 'zustand/shallow';
import { EDITOR_PAGE_UI_SETTING } from '@/app/editor/_config';
import { GeneralBuilding } from '@/app/editor/_map-core/building/general';
import {
  BuildingType,
  CatalogType,
  CivilBuilding,
  ImportExportSubmenu,
  SimpleBuildingConfig,
} from '@/app/editor/_map-core/building/type';
import { OperationType } from '@/app/editor/_map-core/type';
import {
  getGeneralBuilding,
  getRoadBuilding,
  getSelectedBuilding,
} from '@/utils/building';
import { exportMapData } from '@/utils/import-export';
import { getScreenshot } from '@/utils/screenshot';
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
import { useCommand } from '../../_store/command';
import { useMapConfig } from '../../_store/map-config';
import { useSpecialBuilding } from '../../_store/special-building';
import ImportDataModal, { ImportDataModalType } from '../import-data-modal';
import styles from './index.module.css';

const Sider = Layout.Sider;
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
  const [
    showSpecialBuildingModal,
    setShowSpecialBuildingModal,
    specialBuildings,
  ] = useSpecialBuilding(
    state => [state.show, state.setShow, state.buildings],
    shallow,
  );
  const [commands, undoCommands, undo, redo] = useCommand(
    state => [state.commands, state.undoCommands, state.undo, state.redo],
    shallow,
  );

  const [importDataModalType, setImportDataModalType] = useState(
    ImportDataModalType.None,
  );
  const [menuWidth, setMenuWidth] = useLocalStorageState('left-menu-width', {
    defaultValue: EDITOR_PAGE_UI_SETTING.leftMenuWidth,
  });
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
      if (showSpecialBuildingModal) {
        return;
      }
      const key = e.key === ' ' ? e.code : e.key.toUpperCase();
      if (key === 'Space') {
        e.preventDefault();
      }
      const catalog = mapShortcutToMenu[key] as CatalogType;
      resetSubMenuOpened();
      if (catalog === CatalogType.Special && subMenuOpened[catalog]) {
        // 连按两次F，打开特殊建筑编辑窗口
        setShowSpecialBuildingModal(true);
        resetSubMenuOpened();
        return;
      }
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
    if (showSpecialBuildingModal) {
      return;
    }
    if (!openedSubMenu.current) {
      return;
    }
    onClickMenuItem(openedSubMenu.current + '-' + mapShortcutToIdx[e.key]);
  });

  useKeyPress(protectionShortcut, e => {
    if (showSpecialBuildingModal || e.ctrlKey) {
      return;
    }
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

  useEffect(() => {
    setSubMenuContent(state => ({
      ...state,
      [CatalogType.Special]: Object.keys(specialBuildings).map(
        v => ({ name: v } as SimpleBuildingConfig),
      ),
    }));
  }, [specialBuildings]);

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
      case CatalogType.Special:
        if (subMenuContent[CatalogType.Special].length === 0) {
          changeOperation(OperationType.Empty);
          Message.warning('当前特殊建筑数据为空，请在编辑窗口中添加！');
          setShowSpecialBuildingModal(true);
          return;
        }
        changeBrush({
          ...specialBuildings[subMenuContent[CatalogType.Special][index].name],
          catalog: CatalogType.Special,
        });
        changeOperation(OperationType.PlaceBuilding);
        return;
      case CatalogType.Cancel:
        changeOperation(OperationType.Empty);
        return;
      case CatalogType.Move:
        changeOperation(OperationType.MoveBuilding);
        return;
      case CatalogType.Delete:
        changeOperation(OperationType.DeleteBuilding);
        return;
      case CatalogType.Undo:
        undo();
        return;
      case CatalogType.Redo:
        redo();
        return;
      case CatalogType.ImportExport:
        const { name } = subMenuContent[catalog][index];
        if (name === ImportExportSubmenu.Screenshot) {
          getScreenshot(document.getElementById('building-layer')!);
        } else if (name === ImportExportSubmenu.ImportMapData) {
          setImportDataModalType(ImportDataModalType.Map);
        } else if (name === ImportExportSubmenu.ExportMapData) {
          exportMapData();
        } else if (name === ImportExportSubmenu.ImportNewCivil) {
        }
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
    <Sider ref={container} className={styles.container} width={menuWidth}>
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
              <MenuItem
                key={catalog}
                disabled={
                  catalog === CatalogType.WatermarkMode ||
                  (catalog === CatalogType.Undo && !commands.length) ||
                  (catalog === CatalogType.Redo && !undoCommands.length)
                }
              >
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
                <MenuItem
                  key={catalog + '-' + i}
                  disabled={
                    catalog === CatalogType.ImportExport &&
                    v.name === ImportExportSubmenu.ImportNewCivil
                  }
                >
                  <div>
                    {i + 1}. {v.name}
                  </div>
                  <div>
                    <div className={styles['building-info']}>
                      {(Object.values(BuildingType) as CatalogType[])
                        .concat(CatalogType.General)
                        .includes(catalog) && (
                        <>
                          {v.range > 0 && <div>范围: {v.range}</div>}
                          <div>
                            大小: {v.size}x{v.size}
                          </div>
                        </>
                      )}
                      {catalog === CatalogType.Special && (
                        <>
                          {(specialBuildings[v.name]?.range || 0) > 0 && (
                            <div>范围: {specialBuildings[v.name]?.range}</div>
                          )}
                          <div>
                            大小: {specialBuildings[v.name]?.w}x
                            {specialBuildings[v.name]?.h}
                          </div>
                        </>
                      )}
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
                  </div>
                </MenuItem>
              ))}
              {catalog === CatalogType.Special && (
                <div
                  className={classcat([
                    styles['pop-sub-menu-item'],
                    styles['pop-sub-menu-container'],
                  ])}
                  onClick={() => {
                    setShowSpecialBuildingModal(true);
                  }}
                >
                  <div>编辑</div>
                  <div className={styles['key-container']}>
                    <div className={styles['key-shortcut']}>
                      {mapMenuToShortcut[catalog]}
                    </div>
                    +
                    <div className={styles['key-shortcut']}>
                      {mapMenuToShortcut[catalog]}
                    </div>
                  </div>
                </div>
              )}
            </SubMenu>
          );
        })}
      </Menu>
      <div
        className={styles['collapse-button-container']}
        style={{
          left: (menuWidth || EDITOR_PAGE_UI_SETTING.leftMenuWidth) - 20,
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
      <ImportDataModal
        type={importDataModalType}
        setType={setImportDataModalType}
      />
    </Sider>
  );
};

export default LeftMenu;
