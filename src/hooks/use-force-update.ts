import { useReducer } from 'react';

export default function useForceUpdate() {
  const [updater, forceUpdate] = useReducer(() => Object.create(null), null);

  return [updater, forceUpdate];
}
