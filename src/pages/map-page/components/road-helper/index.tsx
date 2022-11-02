import { settingSelector } from '@/store/selectors';
import { getArcoColor } from '@/utils/color';
import React, { FC, useMemo } from 'react';
import { Group } from 'react-konva';
import { useSelector } from 'react-redux';
import BorderBlock from '../border-block';

interface RoadHelperProps {
  initLi: number;
  initCo: number;
  curLi: number;
  curCo: number;
  hidden?: boolean;
}

const RoadHelper: FC<RoadHelperProps> = (props) => {
  const { initLi, initCo, curLi, curCo, hidden = true } = props;

  const { theme } = useSelector(settingSelector);

  const color = useMemo(
    () => (theme === 'light' ? getArcoColor('--blue-3') : getArcoColor('--blue-8')),
    [theme],
  );

  const deltaLi = curLi - initLi;
  const deltaCo = curCo - initCo;
  const w = deltaCo > 0 ? deltaCo + 1 : Math.abs(deltaCo - 1);
  const h = deltaLi > 0 ? deltaLi + 1 : Math.abs(deltaLi - 1);

  return (
    <Group visible={!hidden}>
      {(initLi === curLi || initCo === curCo) && (
        <BorderBlock
          mode="absolute"
          line={deltaLi < 0 ? initLi + deltaLi : initLi}
          column={deltaCo < 0 ? initCo + deltaCo : initCo}
          width={w}
          height={h}
          borderColor={color}
          backgroundColor={color}
          backgroundOpacity={0.4}
        />
      )}
    </Group>
  );
};

export default RoadHelper;
