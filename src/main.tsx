import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import Scrollbar from 'smooth-scrollbar';
import DisableScrollPlugin from './utils/smooth-scrollbar-plugins/disable-scroll-plugin';
import DraggablePlugin from './utils/smooth-scrollbar-plugins/draggable-plugin';
import InitCenterPlugin from './utils/smooth-scrollbar-plugins/init-center-plugin';

Scrollbar.use(DraggablePlugin, DisableScrollPlugin, InitCenterPlugin);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
