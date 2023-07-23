import React from 'react';
import { IconSync } from '@arco-design/web-react/icon';
import styles from './index.module.css';

const Loading = () => {
  return (
    <div className={styles.container}>
      <IconSync spin={true} style={{ fontSize: 40 }} />
    </div>
  );
};

export default Loading;
