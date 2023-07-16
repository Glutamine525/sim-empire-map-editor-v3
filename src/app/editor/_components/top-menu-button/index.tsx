import React, { memo, useState } from 'react';
import { Button, Modal, Tooltip } from '@arco-design/web-react';
import {
  IconDelete,
  IconMoonFill,
  IconSave,
  IconSettings,
  IconSunFill,
} from '@arco-design/web-react/icon';
import { useKeyPress } from 'ahooks';
import useColorTheme, { ThemeType } from '@/hooks/use-color-theme';
import useMapCore from '../../_hooks/use-map-core';
import { useAutoSave } from '../../_store/auto-save';
import { useMapConfig } from '../../_store/map-config';
import AutoSaveDrawer from '../auto-save-drawer';
import SettingsDrawer from '../settings-drawer';
import styles from './index.module.css';

enum DrawerType {
  None,
  AutoSave,
  Settings,
}

const TopMenuButton = () => {
  const [theme, toggleTheme] = useColorTheme();

  const mapCore = useMapCore();
  const triggerMapRedraw = useMapConfig(state => state.triggerMapRedraw);
  const trigger = useAutoSave(state => state.trigger);

  const [showDrawerType, setShowDrawerType] = useState(DrawerType.None);

  // button shortcut
  useKeyPress(['d', 's', 'g', 'comma'], e => {
    if (!e.ctrlKey) {
      return;
    }
    e.preventDefault();
    switch (e.key.toLowerCase()) {
      case 'd':
        onClickDelete();
        break;
      case 's':
        onClickAutoSave();
        break;
      case 'g':
        onClickChangeTheme();
        break;
      case ',':
        onClickSettings();
        break;
      default:
        return;
    }
  });

  const onClickDelete = async () => {
    if (!mapCore.hasPlacedBuilding()) {
      return;
    }
    const isOk = await new Promise<boolean>(resolve => {
      Modal.confirm({
        title: '提示',
        content:
          '重置地图会清空所有已放置的建筑和所有历史操作，是否确认需要重置？',
        onOk: () => {
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
    if (!isOk) {
      return;
    }
    triggerMapRedraw();
  };

  const onClickAutoSave = () => {
    trigger();
    setShowDrawerType(DrawerType.AutoSave);
  };

  const onClickSettings = () => {
    setShowDrawerType(DrawerType.Settings);
  };

  const onClickChangeTheme = () => {
    toggleTheme();
  };

  return (
    <div className={styles.container}>
      <Tooltip
        content={
          <div className={styles['tooltip-container']}>
            <div>重置地图</div>
            <div className={styles['key-container']}>
              <div className={styles['key-shortcut']}>Ctrl</div>+
              <div className={styles['key-shortcut']}>D</div>
            </div>
          </div>
        }
      >
        <Button
          shape="square"
          status="danger"
          type="text"
          iconOnly={true}
          icon={<IconDelete />}
          onClick={onClickDelete}
        />
      </Tooltip>
      <Tooltip
        content={
          <div className={styles['tooltip-container']}>
            <div>自动存档</div>
            <div className={styles['key-container']}>
              <div className={styles['key-shortcut']}>Ctrl</div>+
              <div className={styles['key-shortcut']}>S</div>
            </div>
          </div>
        }
      >
        <Button
          shape="square"
          type="text"
          iconOnly={true}
          icon={<IconSave />}
          onClick={onClickAutoSave}
        />
      </Tooltip>
      <Tooltip
        content={
          <div className={styles['tooltip-container']}>
            <div>设置</div>
            <div className={styles['key-container']}>
              <div className={styles['key-shortcut']}>Ctrl</div>+
              <div className={styles['key-shortcut']}>,</div>
            </div>
          </div>
        }
      >
        <Button
          shape="square"
          type="text"
          iconOnly={true}
          icon={<IconSettings />}
          onClick={onClickSettings}
        />
      </Tooltip>
      <Tooltip
        content={
          <div className={styles['tooltip-container']}>
            <div>主题切换</div>
            <div className={styles['key-container']}>
              <div className={styles['key-shortcut']}>Ctrl</div>+
              <div className={styles['key-shortcut']}>G</div>
            </div>
          </div>
        }
      >
        <Button
          shape="square"
          type="text"
          className={styles['theme-button']}
          iconOnly={true}
          icon={theme === ThemeType.Light ? <IconSunFill /> : <IconMoonFill />}
          onClick={onClickChangeTheme}
        />
      </Tooltip>
      <Button type="text" disabled={true}>
        登录
      </Button>
      <AutoSaveDrawer
        visible={showDrawerType === DrawerType.AutoSave}
        close={() => {
          setShowDrawerType(DrawerType.None);
        }}
      />
      <SettingsDrawer
        visible={showDrawerType === DrawerType.Settings}
        close={() => {
          setShowDrawerType(DrawerType.None);
        }}
      />
    </div>
  );
};

export default memo(TopMenuButton);
