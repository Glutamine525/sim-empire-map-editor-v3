import { Menu, Trigger } from '@arco-design/web-react';
import { IconCaretUp, IconClose } from '@arco-design/web-react/icon';
import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import { getImgUrl } from '@/utils/url';

const MenuItem = Menu.Item;

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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div>
      <Trigger
        popup={renderMenu}
        trigger={['click']}
        position="bottom"
        popupVisible={visible}
        clickOutsideToClose={false}
        onClick={(v) => {
          setVisible(!v);
        }}
        onVisibleChange={(v) => {
          if (v) {
            setVisible(v);
          }
        }}>
        <div className={`${styles['button-trigger']} ${visible ? styles['button-trigger-active'] : ''}`}>
          {visible ? <IconClose /> : <IconCaretUp />}
        </div>
      </Trigger>
    </div>
  );
};

export default LeftMenu;
