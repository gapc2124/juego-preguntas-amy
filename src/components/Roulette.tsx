// src/components/Roulette.tsx
import { useState, useEffect } from 'react';

interface RouletteProps {
  isRolling: boolean;
  onRoll: () => void;
  resultIcon?: string;
  resultColor?: string;
}

// Lista de los iconos y colores que usamos en las barajas
const ICONS = ['help', 'favorite', 'menu_book', 'family_restroom', 'psychology', 'casino', 'bolt'];
const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#A142F4', '#FF6D00', '#00ACC1'];

export default function Roulette({ isRolling, onRoll, resultIcon, resultColor }: RouletteProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRolling) {
      // Si está girando, cambiamos el icono cada 60 milisegundos para crear el efecto de carrusel
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ICONS.length);
      }, 60);
    }
    return () => clearInterval(interval);
  }, [isRolling]);

  // Si está girando muestra el carrusel falso, si se detiene muestra el real
  const displayIcon = isRolling ? ICONS[currentIndex] : (resultIcon || 'all_inclusive');
  const displayColor = isRolling ? COLORS[currentIndex] : (resultColor || '#ffffff');

  return (
    <div
      onClick={onRoll}
      style={{
        width: '130px',
        height: '130px',
        borderRadius: '50%',
        backgroundColor: '#0a0a0a',
        border: '4px solid #ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
        margin: '0 auto',
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
        overflow: 'hidden' // Corta cualquier desborde para reforzar la ilusión del carrusel
      }}
    >
      {/* Inyectamos una animación CSS nativa para el difuminado de movimiento */}
      <style>{`
        @keyframes slotMachineBlur {
          0% { transform: translateY(-40px); opacity: 0.2; }
          50% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(40px); opacity: 0.2; }
        }
        .rolling-animation {
          animation: slotMachineBlur 0.12s linear infinite;
        }
      `}</style>

      <span
        className={`material-symbols-outlined ${isRolling ? 'rolling-animation' : ''}`}
        style={{
          fontSize: '70px', // Icono masivo y perfectamente centrado
          color: displayColor,
          transition: isRolling ? 'none' : 'color 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isRolling ? 'scale(0.9)' : 'scale(1)', // Pequeño efecto de rebote al detenerse
        }}
      >
        {displayIcon}
      </span>
    </div>
  );
}