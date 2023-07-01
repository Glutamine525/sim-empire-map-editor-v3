import React from 'react';
import HeaderComponent from '@arco-design/web-react/es/Layout/header';
import { EDITOR_PAGE_UI_SETTING } from '@/config';
import TopMenuButton from '../top-menu-button';
import TopMenuController from '../top-menu-controller';
import TopMenuCounter from '../top-menu-counter';
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
      <div className={styles['operation-container']}>
        <div>当前操作:</div>
        <div className={styles.operation}>无</div>
      </div>
      <TopMenuCounter />
      <TopMenuButton />
    </HeaderComponent>
  );
};

export default TopMenu;
