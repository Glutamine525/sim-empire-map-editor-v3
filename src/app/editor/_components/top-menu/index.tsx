import React from 'react';
import HeaderComponent from '@arco-design/web-react/es/Layout/header';
import { EDITOR_PAGE_UI_SETTING } from '@/app/editor/_config';
import TopMenuButton from '../top-menu-button';
import TopMenuController from '../top-menu-controller';
import TopMenuCounter from '../top-menu-counter';
import TopMenuOperation from '../top-menu-operation';
import styles from './index.module.css';

const TopMenu = () => {
  console.log('TopMenu render');

  return (
    <HeaderComponent
      className={styles.container}
      style={{
        height: EDITOR_PAGE_UI_SETTING.topMenuHeight,
      }}
    >
      <div className={styles.title}>模拟帝国布局图编辑器</div>
      <TopMenuController />
      <TopMenuOperation />
      <TopMenuCounter />
      <TopMenuButton />
    </HeaderComponent>
  );
};

export default TopMenu;
