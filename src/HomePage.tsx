// src/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import ThreeBackground from './components/ThreeBackground';
import Home from './components/Home';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100vw', height: '100dvh', position: 'relative' }}>
      <ThreeBackground />
      <Home onStart={() => navigate('/preparacion')} />
    </div>
  );
}