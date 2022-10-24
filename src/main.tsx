import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import Scrollbar from 'smooth-scrollbar';
import DisableScrollPlugin from './utils/smooth-scrollbar-plugins/disable-scroll-plugin';
import DraggablePlugin from './utils/smooth-scrollbar-plugins/draggable-plugin';
import InitPositionPlugin from './utils/smooth-scrollbar-plugins/init-position-plugin';

Scrollbar.use(DraggablePlugin, DisableScrollPlugin, InitPositionPlugin);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
