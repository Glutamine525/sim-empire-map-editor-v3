import React from 'react';
import { Button, Dropdown, Menu, Switch } from '@arco-design/web-react';
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
import TopMenuCounter from '../top-menu-counter';
import styles from './index.module.css';

const dropList = (
  <Menu>
    <Menu.Item key="1">Beijing</Menu.Item>
    <Menu.Item key="2">Shanghai</Menu.Item>
    <Menu.Item key="3">Guangzhou</Menu.Item>
  </Menu>
);

const TopMenu = () => {
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
        <div>
          <div>地图:</div>
          <Dropdown droplist={dropList}>
            <Button type="text" className={styles['dropdown-button']}>
              5
            </Button>
          </Dropdown>
        </div>
        <div>
          <div>文明:</div>
          <Dropdown droplist={dropList}>
            <Button type="text" className={styles['dropdown-button']}>
              中国
            </Button>
          </Dropdown>
        </div>
        <div>
          <div>无木:</div>
          <Switch />
        </div>
        <div>
          <div>旋转:</div>
          <Switch />
        </div>
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
