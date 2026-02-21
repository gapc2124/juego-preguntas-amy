// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import PreparacionPage from './PreparacionPage';
import JuegoPage from './JuegoPage'; // Asegúrate de crear este archivo después
import './App.css';

// Componente para manejar errores de ruta (404)
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
    /* El basename es CRUCIAL para que funcione en la carpeta de tu proyecto */
    <Router basename="/juego-preguntas-amy">
      <Routes>
        {/* Ruta principal con el fondo de estrellas */}
        <Route path="/" element={<HomePage />} />
        
        {/* Ruta de preparación con fondo blanco y selección de barajas */}
        <Route path="/preparacion" element={<PreparacionPage />} />

        {/* Ruta del juego donde se mostrarán las preguntas aleatorias */}
        <Route path="/juego" element={<JuegoPage />} />

        {/* Ruta de respaldo para errores */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}