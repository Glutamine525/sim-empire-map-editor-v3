import React, { memo, useState } from 'react';
import { Button, Modal, Notification, Tooltip } from '@arco-design/web-react';
import {
  IconDelete,
  IconMindMapping,
  IconMoonFill,
  IconSave,
  IconSettings,
  IconSunFill,
} from '@arco-design/web-react/icon';
import { useKeyPress } from 'ahooks';
import { shallow } from 'zustand/shallow';
import useColorTheme, { ThemeType } from '@/hooks/use-color-theme';
import { getCtrlKeyText } from '@/utils/env';
import { IS_MAC, IS_WINDOWS } from '../../_config';
import useMapCore from '../../_hooks/use-map-core';
import { useAutoSave } from '../../_store/auto-save';
import { useMapConfig } from '../../_store/map-config';
import { useSetting } from '../../_store/settings';
import AutoSaveDrawer from '../auto-save-drawer';
import GameProgressDrawer from '../game-progress-drawer';
import SettingDrawer from '../setting-drawer';
import styles from './index.module.css';

enum DrawerType {
  None,
  AutoSave,
  Setting,
  GameProgress,
}

const TopMenuButton = () => {
  const [theme, toggleTheme] = useColorTheme();

  const mapCore = useMapCore();
  const [triggerMapRedraw, triggerResetArea] = useMapConfig(
    state => [state.triggerMapRedraw, state.triggerResetArea],
    shallow,
  );
  const trigger = useAutoSave(state => state.trigger);
  const enableTopMenuShortcut = useSetting(
    state => state.enableTopMenuShortcut,
  );

  const [showDrawerType, setShowDrawerType] = useState(DrawerType.None);

  // button shortcut
  useKeyPress(['d', 's', 'g', 'comma'], e => {
    e.preventDefault();
    if (!enableTopMenuShortcut) {
      return;
    }
    if ((IS_WINDOWS && !e.ctrlKey) || (IS_MAC && !e.metaKey)) {
      return;
    }
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
        onClickSetting();
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
    triggerResetArea();
    triggerMapRedraw();
  };

  const onClickGameProgress = () => {
    if (showDrawerType !== DrawerType.None) {
      return;
    }
    Notification.clear();
    triggerResetArea();
    setShowDrawerType(DrawerType.GameProgress);
  };

  const onClickAutoSave = () => {
    if (showDrawerType !== DrawerType.None) {
      return;
    }
    Notification.clear();
    triggerResetArea();
    trigger();
    setShowDrawerType(DrawerType.AutoSave);
  };

  const onClickSetting = () => {
    if (showDrawerType !== DrawerType.None) {
      return;
    }
    Notification.clear();
    triggerResetArea();
    setShowDrawerType(DrawerType.Setting);
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
            {enableTopMenuShortcut && (
              <div className={styles['key-container']}>
                <div className={styles['key-shortcut']}>{getCtrlKeyText()}</div>
                +<div className={styles['key-shortcut']}>D</div>
              </div>
            )}
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
            <div>游戏进程</div>
            {enableTopMenuShortcut && (
              <div className={styles['key-container']}>
                <div className={styles['key-shortcut']}>{getCtrlKeyText()}</div>
                +<div className={styles['key-shortcut']}>.</div>
              </div>
            )}
          </div>
        }
      >
        <Button
          shape="square"
          type="text"
          iconOnly={true}
          icon={<IconMindMapping />}
          onClick={onClickGameProgress}
        />
      </Tooltip>
      <Tooltip
        content={
          <div className={styles['tooltip-container']}>
            <div>自动存档</div>
            {enableTopMenuShortcut && (
              <div className={styles['key-container']}>
                <div className={styles['key-shortcut']}>{getCtrlKeyText()}</div>
                +<div className={styles['key-shortcut']}>S</div>
              </div>
            )}
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
            {enableTopMenuShortcut && (
              <div className={styles['key-container']}>
                <div className={styles['key-shortcut']}>{getCtrlKeyText()}</div>
                +<div className={styles['key-shortcut']}>,</div>
              </div>
            )}
          </div>
        }
      >
        <Button
          shape="square"
          type="text"
          iconOnly={true}
          icon={<IconSettings />}
          onClick={onClickSetting}
        />
      </Tooltip>
      <Tooltip
        content={
          <div className={styles['tooltip-container']}>
            <div>主题切换</div>
            {enableTopMenuShortcut && (
              <div className={styles['key-container']}>
                <div className={styles['key-shortcut']}>{getCtrlKeyText()}</div>
                +<div className={styles['key-shortcut']}>G</div>
              </div>
            )}
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
      <GameProgressDrawer
        visible={showDrawerType === DrawerType.GameProgress}
        close={() => {
          setShowDrawerType(DrawerType.None);
        }}
      />
      <AutoSaveDrawer
        visible={showDrawerType === DrawerType.AutoSave}
        close={() => {
          setShowDrawerType(DrawerType.None);
        }}
      />
      <SettingDrawer
        visible={showDrawerType === DrawerType.Setting}
        close={() => {
          setShowDrawerType(DrawerType.None);
        }}
      />
    </div>
  );
};

export default memo(TopMenuButton);
