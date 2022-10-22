import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home-page';
import MapPage from './pages/map-page';
import NotFoundPage from './pages/not-found-page';
import './arco-override.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
