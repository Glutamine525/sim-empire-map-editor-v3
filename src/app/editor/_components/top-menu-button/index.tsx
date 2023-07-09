import React, { memo, useState } from 'react';
import { Button } from '@arco-design/web-react';
import {
  IconDelete,
  IconMoonFill,
  IconSave,
  IconSettings,
  IconSunFill,
} from '@arco-design/web-react/icon';
import useColorTheme, { ThemeType } from '@/hooks/use-color-theme';
import { useAutoSave } from '../../_store/auto-save';
import AutoSaveDrawer from '../auto-save-drawer';
import styles from './index.module.css';

const TopMenuButton = () => {
  const [theme, toggleTheme] = useColorTheme();
  const trigger = useAutoSave(state => state.trigger);

  const [showAutoSaveDrawer, setShowAutoSaveDrawer] = useState(false);

  return (
    <div className={styles.container}>
      <Button
        shape="square"
        status="danger"
        type="text"
        iconOnly={true}
        icon={<IconDelete />}
        disabled={true}
      />
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
      <Button
        shape="square"
        type="text"
        iconOnly={true}
        icon={<IconSettings />}
        disabled={true}
      />
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
