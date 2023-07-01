import React, { memo } from 'react';
import { Button } from '@arco-design/web-react';
import {
  IconDelete,
  IconMoonFill,
  IconSave,
  IconSettings,
  IconSunFill,
} from '@arco-design/web-react/icon';
import useColorTheme, { ThemeType } from '@/hooks/use-color-theme';
import styles from './index.module.css';

const TopMenuButton = () => {
  const [theme, toggleTheme] = useColorTheme();

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
        disabled={true}
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
    </div>
  );
};

export default memo(TopMenuButton);
