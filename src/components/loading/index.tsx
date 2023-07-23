import React from 'react';
import styles from './index.module.css';

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles['lds-spinner']}>
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div key={i} style={{ '--index': i + 1 } as any} />
          ))}
      </div>
      <div className={styles.text}>加载中...</div>
    </div>
  );
};

export default Loading;
