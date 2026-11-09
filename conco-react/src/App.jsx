import './styles/base.css'; // primero: las páginas pueden pisar sus reglas
import './styles/app.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Analisis from './pages/Analisis.jsx';
import Orientacion from './pages/Orientacion.jsx';
import Mapa from './pages/Mapa.jsx';
import Asistente from './pages/Asistente.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analisis" element={<Analisis />} />
        <Route path="/orientacion" element={<Orientacion />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/asistente" element={<Asistente />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
