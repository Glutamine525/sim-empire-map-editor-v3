import React from 'react';
import HeaderComponent from '@arco-design/web-react/es/Layout/header';
import { EDITOR_PAGE_UI_SETTING } from '@/config';
import styles from './index.module.css';

const TopMenu = () => {
  return (
    <HeaderComponent
      className={styles.container}
      style={{
        height: EDITOR_PAGE_UI_SETTING.topMenuHeight,
      }}
    >
      TopMenu
    </HeaderComponent>
  );
};

export default TopMenu;
