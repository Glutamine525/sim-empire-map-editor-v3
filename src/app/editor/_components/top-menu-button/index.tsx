import React, { memo, useState } from 'react';
import { Button, Modal, Tooltip } from '@arco-design/web-react';
import {
  IconDelete,
  IconMoonFill,
  IconSave,
  IconSettings,
  IconSunFill,
} from '@arco-design/web-react/icon';
import useColorTheme, { ThemeType } from '@/hooks/use-color-theme';
import useMapCore from '../../_hooks/use-map-core';
import { useAutoSave } from '../../_store/auto-save';
import { useMapConfig } from '../../_store/map-config';
import AutoSaveDrawer from '../auto-save-drawer';
import styles from './index.module.css';

const TopMenuButton = () => {
  const [theme, toggleTheme] = useColorTheme();

  const mapCore = useMapCore();
  const triggerMapRedraw = useMapConfig(state => state.triggerMapRedraw);
  const trigger = useAutoSave(state => state.trigger);

  const [showAutoSaveDrawer, setShowAutoSaveDrawer] = useState(false);

  return (
    <div className={styles.container}>
      <Tooltip content="重置地图">
        <Button
          shape="square"
          status="danger"
          type="text"
          iconOnly={true}
          icon={<IconDelete />}
          onClick={async () => {
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
          }}
        />
      </Tooltip>
      <Tooltip content="自动存档">
        <Button
          shape="square"
          type="text"
          iconOnly={true}
          icon={<IconSave />}
          onClick={() => {
            trigger();
            setShowAutoSaveDrawer(true);
          }}
        />
      </Tooltip>
      <Tooltip content="设置">
        <Button
          shape="square"
          type="text"
          iconOnly={true}
          icon={<IconSettings />}
          disabled={true}
        />
      </Tooltip>
      <Tooltip content="主题切换">
        <Button
          shape="square"
          type="text"
          className={styles['theme-button']}
          iconOnly={true}
          icon={theme === ThemeType.Light ? <IconSunFill /> : <IconMoonFill />}
          onClick={() => {
            toggleTheme();
          }}
        />
      </Tooltip>
      <Button type="text" disabled={true}>
        登录
      </Button>
      <AutoSaveDrawer
        visible={showAutoSaveDrawer}
        setVisible={setShowAutoSaveDrawer}
      />
    </div>
  );
};

export default memo(TopMenuButton);
