import React from 'react';
import { Switch } from '@arco-design/web-react';
import { shallow } from 'zustand/shallow';
import { useMapConfig } from '../../_store/map-config';

const TopMenuNoTree = () => {
  console.log('TopMenuNoTree render');

  const [noTree, changeNoTree] = useMapConfig(
    state => [state.noTree, state.changeNoTree],
    shallow,
  );

  return (
    <div>
      <div>无木:</div>
      <Switch
        checked={noTree}
        onChange={noTree => {
          changeNoTree(noTree);
        }}
      />
    </div>
  );
};

export default TopMenuNoTree;
