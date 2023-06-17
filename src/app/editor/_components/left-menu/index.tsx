import React from 'react';
import SiderComponent from '@arco-design/web-react/es/Layout/sider';
import { EDITOR_PAGE_UI_SETTING } from '@/config';
import styles from './index.module.css';

const LeftMenu = () => {
  return (
    <SiderComponent
      className={styles.container}
      width={EDITOR_PAGE_UI_SETTING.leftMenuWidth}
    >
      LeftMenu
    </SiderComponent>
  );
};

export default LeftMenu;
