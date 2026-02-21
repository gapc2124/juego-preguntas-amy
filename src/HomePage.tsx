// src/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import ThreeBackground from './components/ThreeBackground';
import Home from './components/Home';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      width: '100vw', 
      height: '100dvh', // Respeta la barra de navegación de iOS/Android
      position: 'relative',
      overflow: 'hidden', // Bloquea el scroll en X e Y de forma estricta
      backgroundColor: '#0a0a0a', // Fondo oscuro base
      margin: 0,
      padding: 0
    }}>
      {/* CAPA 1: El fondo 3D */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <ThreeBackground />
      </div>
      
      {/* CAPA 2: La interfaz de usuario */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        <Home onStart={() => navigate('/preparacion')} />
      </div>
    </div>
  );
}