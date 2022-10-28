import { MapCore } from '@/map-core';
import { CatalogType } from '@/map-core/building';
import { CivilType, CivilTypeLabel, MapType, OperationType } from '@/map-core/type';
import {
  changeCivil,
  changeMapType,
  changeNoTree,
  changeRotated,
} from '@/store/reducers/map-reducer';
import { changeTheme } from '@/store/reducers/setting-reducer';
import { mapSelector, settingSelector } from '@/store/selectors';
import { Button, Dropdown, Menu, Switch, Typography } from '@arco-design/web-react';
import { IconMenu, IconQuestionCircle } from '@arco-design/web-react/icon';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Scrollbar from 'smooth-scrollbar';
import styles from './index.module.less';

const { Text } = Typography;

const TopMenu = () => {
  const topMenuRef = useRef<HTMLDivElement>(null);

  const { mapType, civil, noTree, rotated, operation, brush, mapUpdater } =
    useSelector(mapSelector);
  const { theme } = useSelector(settingSelector);
  const d = useDispatch();

  const { emptyCells, counter } = useMemo(() => MapCore.getInstance(), [mapType, noTree]);

  useEffect(() => {
    Scrollbar.init(topMenuRef.current!, {
      damping: 0.2,
      alwaysShowTracks: true,
      plugins: {
        disableScroll: {
          direction: 'y',
        },
      },
    });
    // const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    // if (darkThemeMq.matches) {
    //   document.body.setAttribute('arco-theme', 'dark');
    // } else {
    //   document.body.removeAttribute('arco-theme');
    // }
  }, []);

  const MapTypeList = (
    <Menu
      onClickMenuItem={(_key) => {
        const key = Number(_key);
        const core = MapCore.getInstance();
        core.mapType = key;
        core.init(key, civil, noTree);
        d(changeMapType(key));
      }}>
      {MapType.map((v) => (
        <Menu.Item key={v.toString()}>{v}</Menu.Item>
      ))}
    </Menu>
  );

  const CivilTypeList = (
    <Menu onClickMenuItem={(key) => d(changeCivil(key as CivilType))}>
      {Object.entries(CivilTypeLabel).map((v) => {
        const [civilType, civilLabel] = v;
        if (civilType === CivilType.Custom) {
          return null;
        }
        return <Menu.Item key={civilType}>{civilLabel}</Menu.Item>;
      })}
    </Menu>
  );

  return (
    <div className={styles.wrapper}>
      <div ref={topMenuRef}>
        <div className={styles.container}>
          <div className={styles['map-controller']}>
            <div className={styles.panel}>
              <Button type="text" shape="circle" icon={<IconMenu />} />
            </div>
            <div>
              <Text type="secondary">地图: </Text>
              <Dropdown droplist={MapTypeList} position="bl">
                <Button type="text" shape="round" style={{ fontWeight: 'bold' }} iconOnly>
                  {mapType}
                </Button>
              </Dropdown>
            </div>
            <div>
              <Text type="secondary">文明: </Text>
              <Dropdown droplist={CivilTypeList} position="bl">
                <Button type="text" shape="round" style={{ fontWeight: 'bold' }}>
                  {CivilTypeLabel[civil]}
                </Button>
              </Dropdown>
            </div>
            <div>
              <Text type="secondary">无木: </Text>
              <Switch
                checked={noTree}
                onChange={(v) => {
                  MapCore.getInstance().toggleNoTree(v);
                  d(changeNoTree(v));
                }}
              />
            </div>
            <div>
              <Text type="secondary">旋转: </Text>
              <Switch checked={rotated} onChange={(v) => d(changeRotated(v))} />
            </div>
            <div>
              <Text type="secondary">暗色: </Text>
              <Switch
                checked={theme === 'dark'}
                onChange={(on) => {
                  if (on) {
                    document.body.setAttribute('arco-theme', 'dark');
                    d(changeTheme('dark'));
                  } else {
                    document.body.removeAttribute('arco-theme');
                    d(changeTheme('light'));
                  }
                }}
              />
            </div>
          </div>
          <div className={styles['current-operation']}>
            <Text type="secondary">当前操作: </Text>
            <Text bold>
              {operation}{' '}
              {operation === OperationType.PlaceBuilding
                ? Array.from(new Set([brush.catalog, brush.name])).join('-')
                : ''}
            </Text>
          </div>
          <div className={styles['building-calculator']}>
            <div>
              <div>
                <Text type="secondary">普通住宅: </Text>
                <Text bold>{counter.house}</Text>
                <Text type="secondary">个</Text>
              </div>
              <div>
                <Text type="secondary">高级住宅: </Text>
                <Text bold>{counter.villa}</Text>
                <Text type="secondary">个</Text>
              </div>
            </div>
            <div>
              <div>
                <Text type="secondary">粮仓: </Text>
                <Text bold>{counter.granary}</Text>
                <Text type="secondary">个</Text>
              </div>
              <div>
                <Text type="secondary">货栈: </Text>
                <Text bold>{counter.warehouse}</Text>
                <Text type="secondary">个</Text>
              </div>
            </div>
            <div>
              <div>
                <Text type="secondary">农业: </Text>
                <Text bold>{counter.agriculture}</Text>
                <Text type="secondary"> /100个</Text>
              </div>
              <div>
                <Text type="secondary">工业: </Text>
                <Text bold>{counter.industry}</Text>
                <Text type="secondary"> /150个</Text>
              </div>
            </div>
            <div>
              <div>
                <Text type="secondary">通用: </Text>
                <Text bold>{counter.general}</Text>
                <Text type="secondary">个</Text>
              </div>
              <div>
                <Text type="secondary">覆盖: </Text>
                {/* <Text bold>
                  {counter.coverage}/{emptyCells}
                </Text> */}
                <Text bold>{Math.ceil((counter.coverage / emptyCells) * 100)}</Text>
                <Text type="secondary">%</Text>
              </div>
            </div>
          </div>
          <div className={styles.helper}>
            <Button type="text" shape="circle" icon={<IconQuestionCircle />} />
          </div>
          <div className={styles.auth}>
            <div>
              <Text type="secondary">模拟帝国地图编辑器 </Text>
              <Text bold>V3.0</Text>
            </div>
            <div>
              <Text type="secondary">作者: </Text>
              <Text bold>咕噜他命</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopMenu;
