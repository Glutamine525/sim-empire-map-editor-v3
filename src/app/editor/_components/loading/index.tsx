import React from 'react';
import styles from './index.module.css';

const ID = 'loading';

const Loading = () => {
  return (
    <div id={ID} className={styles.container}>
      <div className={styles['lds-spinner']}>
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div key={i} style={{ '--index': i + 1 } as any} />
          ))}
      </div>
      <div className={styles.text}>处理中...</div>
    </div>
  );
};

export default Loading;

export function showLoading() {
  document.getElementById(ID)!.style.display = 'flex';
}

export function hideLoading() {
  document.getElementById(ID)!.style.display = 'none';
}
