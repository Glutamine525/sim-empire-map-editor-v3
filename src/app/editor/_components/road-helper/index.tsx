import React, { FC, useMemo } from 'react';
import Block from '../block';
import styles from './index.module.css';

interface RoadHelperProps {
  initRow: number;
  initCol: number;
  curRow: number;
  curCol: number;
  isHidden: boolean;
}

const RoadHelper: FC<RoadHelperProps> = props => {
  const { initRow, initCol, curRow, curCol, isHidden } = props;

  const helper = useMemo(() => {
    if (!initRow || !initCol) {
      return { show: false };
    } else if (initRow === curRow && initCol === curCol) {
      return { show: false };
    } else if (initRow !== curRow && initCol !== curCol) {
      return { show: false };
    }
    const w = Math.abs(curCol - initCol) + 1;
    const h = Math.abs(curRow - initRow) + 1;
    const row = curRow > initRow ? initRow : curRow;
    const col = curCol > initCol ? initCol : curCol;
    return { w, h, row, col, show: true };
  }, [initRow, initCol, curRow, curCol]);

  if (isHidden) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {initRow > 0 && initCol > 0 && (
        <Block className={styles.start} row={initRow} col={initCol} />
      )}
      {helper.show && <Block className={styles.container} {...helper} />}
    </div>
  );
};

export default RoadHelper;
