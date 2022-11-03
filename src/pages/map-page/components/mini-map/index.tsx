import { MapLength } from '@/map-core/type';
import React, { createRef } from 'react';
import styles from './index.module.less';

const canvasRef = createRef<HTMLCanvasElement>();

const MiniMap = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={MapLength * 2}
          height={MapLength * 2}
        />
      </div>
    </div>
  );
};

export default MiniMap;
