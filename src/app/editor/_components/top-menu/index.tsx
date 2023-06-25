import React from 'react';
import { Button } from '@arco-design/web-react';
import HeaderComponent from '@arco-design/web-react/es/Layout/header';
import {
  IconDelete,
  IconMoonFill,
  IconSave,
  IconSettings,
  IconSunFill,
} from '@arco-design/web-react/icon';
import { EDITOR_PAGE_UI_SETTING } from '@/config';
import useColorTheme, { ThemeType } from '@/hooks/use-color-theme';
import TopMenuCivil from '../top-menu-civil';
import TopMenuCounter from '../top-menu-counter';
import TopMenuMapType from '../top-menu-map-type';
import TopMenuNoTree from '../top-menu-no-tree';
import TopMenuRotated from '../top-menu-rotated';
import styles from './index.module.css';

const TopMenu = () => {
  console.log('TopMenu render');

  const [theme, toggleTheme] = useColorTheme();

  return (
    <HeaderComponent
      className={styles.container}
      style={{
        height: EDITOR_PAGE_UI_SETTING.topMenuHeight,
      }}
    >
      <div className={styles.title}>模拟帝国布局图编辑器</div>
      <div className={styles['controller-container']}>
        <TopMenuMapType />
        <TopMenuCivil />
        <TopMenuNoTree />
        <TopMenuRotated />
      </div>
      <div className={styles['operation-container']}>
        <div>当前操作:</div>
        <div className={styles.operation}>无</div>
      </div>
      <TopMenuCounter />
      <div className={styles['button-container']}>
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
    </HeaderComponent>
  );
};

export default TopMenu;
