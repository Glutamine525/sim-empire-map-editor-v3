import Image from 'next/image';
import React, { CSSProperties, FC } from 'react';
import icon from '@/assets/images/备案.png';
import styles from './index.module.css';
import classcat from 'classcat';
import { Divider, Message, Space } from '@arco-design/web-react';
import copy from 'copy-to-clipboard';

const EMAIL = 'glutamine525@gmail.com';

interface BeiAnProps {
  className?: string;
  style?: CSSProperties;
}

const BeiAn: FC<BeiAnProps> = props => {
  const { className, style } = props;

  return (
    <div className={classcat([styles.container, className])} style={style}>
      <Image width={20} height={20} src={icon} alt="备案" />
      <a
        target="_blank"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=42010302002383">
        鄂公网安备 42010302002383号
      </a>
      <Divider type="vertical" />
      <a target="_blank" href="http://beian.miit.gov.cn">
        鄂ICP备2021017544号-1
      </a>
      <Divider type="vertical" />
      <Space>
        <span>联系邮箱:</span>
        <a
          onClick={() => {
            if (copy(EMAIL)) {
              Message.success({ id: 'copy', content: '成功复制到剪贴板' });
            } else {
              Message.error({ id: 'copy', content: '复制失败' });
            }
          }}>
          {EMAIL}
        </a>
      </Space>
    </div>
  );
};

export default BeiAn;
