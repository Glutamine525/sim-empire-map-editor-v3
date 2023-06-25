import React from 'react';
import { Switch } from '@arco-design/web-react';
import { shallow } from 'zustand/shallow';
import { useMapConfig } from '../../_store/map-config';

const TopMenuRotated = () => {
  console.log('TopMenuRotated render');

  const [rotated, changeRotated] = useMapConfig(
    state => [state.rotated, state.changeRotated],
    shallow,
  );

  return (
    <div>
      <div>旋转:</div>
      <Switch
        checked={rotated}
        onChange={rotated => {
          changeRotated(rotated);
        }}
      />
    </div>
  );
};

export default TopMenuRotated;
