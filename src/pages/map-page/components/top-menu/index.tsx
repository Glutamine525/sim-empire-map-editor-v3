import { CivilTypeLabel, MapType } from '@/map-core/const';
import { DisableScrollPlugin } from '@/pages/utils/disable-scroll-plugin';
import { Button, Dropdown, Menu, Switch, Typography } from '@arco-design/web-react';
import React, { useEffect, useRef } from 'react';
import Scrollbar from 'smooth-scrollbar';
import styles from './index.module.less';

const { Text } = Typography;

const MapTypeList = (
  <Menu>
    {MapType.map((v) => (
      <Menu.Item key={v.toString()}>{v}</Menu.Item>
    ))}
  </Menu>
);

const CivilTypeList = (
  <Menu>
    {Object.entries(CivilTypeLabel).map((v) => (
      <Menu.Item key={v[0]}>{v[1]}</Menu.Item>
    ))}
  </Menu>
);

const TopMenu = () => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Scrollbar.use(DisableScrollPlugin);
    Scrollbar.init(menuRef.current!, {
      damping: 0.2,
      plugins: {
        disableScroll: {
          direction: 'y',
        },
      },
    });
  }, []);

  return (
    <div ref={menuRef} className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles['map-controller']}>
          <div className={styles.panel}>
            <Button type="text" shape="circle" style={{ fontWeight: 'bold' }}>
              =
            </Button>
          </div>
          <div>
            <Text type="secondary">地图: </Text>
            <Dropdown droplist={MapTypeList} position="bl">
              <Button type="text" shape="round" style={{ fontWeight: 'bold' }}>
                5
              </Button>
            </Dropdown>
          </div>
          <div>
            <Text type="secondary">文明: </Text>
            <Dropdown droplist={CivilTypeList} position="bl">
              <Button type="text" shape="round" style={{ fontWeight: 'bold' }}>
                中国
              </Button>
            </Dropdown>
          </div>
          <div>
            <Text type="secondary">无木: </Text>
            <Switch />
          </div>
          <div>
            <Text type="secondary">旋转: </Text>
            <Switch />
          </div>
          <div>
            <Text type="secondary">暗色: </Text>
            <Switch
              onChange={(on) => {
                if (on) {
                  document.body.setAttribute('arco-theme', 'dark');
                } else {
                  document.body.removeAttribute('arco-theme');
                }
              }}
            />
          </div>
        </div>
        <div className={styles['current-operation']}>
          <Text type="secondary">当前操作: </Text>
          <Text bold>空</Text>
        </div>
        <div className={styles['building-calculator']}>
          <div>
            <div>
              <Text type="secondary">普通住宅: </Text>
              <Text bold>0</Text>
              <Text type="secondary">个</Text>
            </div>
            <div>
              <Text type="secondary">高级住宅: </Text>
              <Text bold>0</Text>
              <Text type="secondary">个</Text>
            </div>
          </div>
          <div>
            <div>
              <Text type="secondary">粮仓: </Text>
              <Text bold>0</Text>
              <Text type="secondary">个</Text>
            </div>
            <div>
              <Text type="secondary">货栈: </Text>
              <Text bold>0</Text>
              <Text type="secondary">个</Text>
            </div>
          </div>
          <div>
            <div>
              <Text type="secondary">农业: </Text>
              <Text bold>0</Text>
              <Text type="secondary"> /100个</Text>
            </div>
            <div>
              <Text type="secondary">工业: </Text>
              <Text bold>0</Text>
              <Text type="secondary"> /150个</Text>
            </div>
          </div>
          <div>
            <div>
              <Text type="secondary">通用: </Text>
              <Text bold>0</Text>
              <Text type="secondary">个</Text>
            </div>
            <div>
              <Text type="secondary">覆盖: </Text>
              <Text bold>0</Text>
              <Text type="secondary">%</Text>
            </div>
          </div>
        </div>
        <div className={styles.helper}>
          <Text bold>?</Text>
        </div>
        <div className={styles.auth}>
          <div>
            <Text type="secondary">模拟帝国地图编辑器 </Text>
            <Text bold>V3.0</Text>
          </div>
          <div>
            <Text type="secondary">作者: </Text>
            <Text bold>咕噜他命</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopMenu;
