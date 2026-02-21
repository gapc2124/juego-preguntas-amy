// src/App.tsx
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import PreparacionPage from './PreparacionPage';
import JuegoPage from './JuegoPage';
import './App.css';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '30vh', fontFamily: "'Outfit', sans-serif" }}>
      <h1>🚀 ¡Vaya! Te saliste de la galaxia</h1>
      <button 
        onClick={() => navigate('/')} 
        style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer' }}
      >
        Volver al Inicio
      </button>
    </div>
  );
}

export default function App() {
  return (
    /* Al usar HashRouter ya no necesitamos el basename que daba problemas */
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/preparacion" element={<PreparacionPage />} />
        <Route path="/juego" element={<JuegoPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}