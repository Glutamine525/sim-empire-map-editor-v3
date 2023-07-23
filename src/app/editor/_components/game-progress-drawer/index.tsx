import React, { FC } from 'react';
import { Drawer } from '@arco-design/web-react';

interface GameProgressDrawerProps {
  visible: boolean;
  close: () => void;
}

const GameProgressDrawer: FC<GameProgressDrawerProps> = props => {
  const { visible, close } = props;

  return (
    <Drawer
      width={640}
      title="游戏进程"
      visible={visible}
      focusLock={false}
      onCancel={() => {
        close();
      }}
      footer={null}
    ></Drawer>
  );
};

export default GameProgressDrawer;
