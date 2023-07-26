import React, { memo } from 'react';
import styles from './index.module.css';

const ID = 'loading';
const TEXT_ID = 'loading-text';

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
      <div id={TEXT_ID} className={styles.text}>
        加载中...
      </div>
    </div>
  );
};

export default memo(Loading);

export function showLoading(text = '处理中...') {
  document.getElementById(ID)!.style.display = 'flex';
  document.getElementById(TEXT_ID)!.innerText = text;
}

export function hideLoading() {
  document.getElementById(ID)!.style.display = 'none';
}
