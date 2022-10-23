import { Button, Menu } from '@arco-design/web-react';
import { IconLeft, IconPlus, IconRight } from '@arco-design/web-react/icon';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { getImgUrl } from '@/utils/url';
import Scrollbar from 'smooth-scrollbar';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const MenuList = [
  '道路',
  '住宅',
  '农业',
  '工业',
  '商业',
  '市政',
  '文化',
  '宗教',
  '军事',
  '美化',
  '奇迹',
  '通用',
  '特殊建筑',
  '取消操作',
  '选中建筑',
  '删除建筑',
  '水印模式',
  '导入导出',
];

const renderMenu = () => {
  return (
    <Menu style={{ marginBottom: -4 }} mode="popButton" tooltipProps={{ position: 'left' }}>
      {MenuList.map((v) => (
        <MenuItem key={v}>
          <img className={styles['menu-icon']} src={getImgUrl(`${v}.png`)} />
          {v}
        </MenuItem>
      ))}
    </Menu>
  );
};

const LeftMenu = () => {
  const menuRef = useRef<HTMLDivElement>();

  const [collapse, setCollapse] = useState(true);

  useEffect(() => {
    Scrollbar.init(menuRef.current!, { damping: 0.2 });
  }, []);

  return (
    <div>
      <div className={[styles.container, collapse ? styles['collapsed'] : ''].join(' ')}>
        <Menu
          ref={menuRef}
          style={{ width: 140, height: '100%' }}
          mode="pop"
          selectable={false}
          tooltipProps={{ disabled: true }}
          collapse={collapse}>
          {MenuList.map((v) => (
            <MenuItem key={v}>
              <img className={'arco-icon ' + styles['menu-icon']} src={getImgUrl(`${v}.png`)} />
              {' ' + v}
            </MenuItem>
          ))}
          <div className={styles['collapse-button-placeholder']} />
        </Menu>
        <Button
          className={styles['collapse-button']}
          size="mini"
          shape="circle"
          type="secondary"
          icon={collapse ? <IconRight /> : <IconLeft />}
          onClick={() => setCollapse((v) => !v)}
        />
      </div>
    </div>
  );
};

export default LeftMenu;
