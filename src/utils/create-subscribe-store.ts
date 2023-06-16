import { useMemo, useSyncExternalStore } from 'react';

export interface UseSubscribeStore<T> extends ReturnType<typeof createSubscribeState<T>> {
  (): readonly [T, (s: T) => void];
}

function createSubscribeState<T>(state: T) {
  return (() => {
    let value: T = state;
    const subscribers = new Set<Function>();

    return {
      get: () => value,
      set: (s: T) => {
        value = s;
        subscribers.forEach((fn) => fn());
      },
      subscribe: (fn: Function) => subscribers.add(fn),
      unSubscribe: (fn: Function) => subscribers.delete(fn),
    };
  })();
}

export default function createSubscribeStore<T>(data: T) {
  return ((): UseSubscribeStore<T> => {
    const state = createSubscribeState(data);

    return Object.assign(() => {
      const subscribe = useMemo(() => {
        return (forceUpdate: Function) => {
          state.subscribe(forceUpdate);
          return () => state.unSubscribe(forceUpdate);
        };
      }, []);

      return [useSyncExternalStore(subscribe, state.get), state.set] as const;
    }, state);
  })();
}