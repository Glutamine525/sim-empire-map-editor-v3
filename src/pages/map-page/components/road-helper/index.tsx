import { BorderStyleType } from '@/map-core/building';
import { settingSelector } from '@/store/selectors';
import { getArcoColor } from '@/utils/color';
import React, { FC, useMemo } from 'react';
import { Group } from 'react-konva';
import { useSelector } from 'react-redux';
import BorderBlock from '../border-block';
import FunctionalBlock from '../functional-block';

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

  return (
    <Group visible={!hidden}>
      <BorderBlock
        mode="absolute"
        line={initLi}
        column={initCo}
        width={1}
        height={1}
        borderColor={color}
        backgroundColor={color}
        backgroundOpacity={0.6}
      />
      {(initLi === curLi || initCo === curCo) && (
        <FunctionalBlock
          {...props}
          borderColor={color}
          backgroundColor={color}
          backgroundOpacity={0.4}
        />
      )}
    </Group>
  );
};

export default RoadHelper;
