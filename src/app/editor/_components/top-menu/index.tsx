import React from 'react';
import { Layout } from '@arco-design/web-react';
import TopMenuButton from '../top-menu-button';
import TopMenuController from '../top-menu-controller';
import TopMenuCounter from '../top-menu-counter';
import TopMenuOperation from '../top-menu-operation';
import { UI_SETTING } from '@/app/editor/_config';
import styles from './index.module.css';

const Header = Layout.Header;

const TopMenu = () => {
  console.log('TopMenu render');

  return (
    <Header
      className={styles.container}
      style={{
        height: UI_SETTING.topMenuHeight,
      }}>
      <div className={styles.title}>模拟帝国布局图编辑器</div>
      <TopMenuController />
      <TopMenuOperation />
      <TopMenuCounter />
      <TopMenuButton />
    </Header>
  );
};

export default TopMenu;
