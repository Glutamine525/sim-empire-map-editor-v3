import { configureStore } from '@reduxjs/toolkit';
import { batchedSubscribe } from 'redux-batched-subscribe';
import { debounce } from 'lodash';
import mapReducer from './reducers/map-reducer';
import { MapState } from './reducers/map-reducer';

const debounceNotify = debounce((notify) => notify());

const rootReducer = {
  map: mapReducer,
};

export interface RootState {
  map: MapState;
}

const preloadedState = {};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: [batchedSubscribe(debounceNotify)],
  preloadedState,
});

export default store;
