import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MapPage from './pages/map';
import NotFoundPage from './pages/not-found';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="map" element={<MapPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
