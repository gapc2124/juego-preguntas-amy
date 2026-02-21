// src/components/Roulette.tsx
import { useState, useEffect } from 'react';

interface RouletteProps {
  isRolling: boolean;
  isReady: boolean; // <- Nueva propiedad para saber si el check está marcado
  onRoll: () => void;
  resultIcon?: string;
  resultColor?: string;
}

const ICONS = ['help', 'favorite', 'menu_book', 'family_restroom', 'psychology', 'casino', 'bolt'];
const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#A142F4', '#FF6D00', '#00ACC1'];

export default function Roulette({ isRolling, isReady, onRoll, resultIcon, resultColor }: RouletteProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRolling) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ICONS.length);
      }, 60);
    }
    return () => clearInterval(interval);
  }, [isRolling]);

  const displayIcon = isRolling ? ICONS[currentIndex] : (resultIcon || 'all_inclusive');
  const displayColor = isRolling ? COLORS[currentIndex] : (resultColor || '#ffffff');

  return (
    <div
      onClick={() => {
        // Solo permite girar si el check está activo y no está girando ya
        if (isReady && !isRolling) onRoll();
      }}
      style={{
        width: '130px',
        height: '130px',
        borderRadius: '50%',
        backgroundColor: '#0a0a0a',
        // El aro cambia a verde vibrante si el check está marcado
        border: `5px solid ${isReady ? '#34A853' : '#ffffff'}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: isReady && !isRolling ? 'pointer' : 'not-allowed',
        // También le damos un brillo verde a la sombra
        boxShadow: `0 8px 25px ${isReady ? 'rgba(52, 168, 83, 0.4)' : 'rgba(0,0,0,0.5)'}`,
        margin: '0 auto',
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
        overflow: 'hidden',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
      }}
    >
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
          fontSize: '70px',
          color: displayColor,
          transition: isRolling ? 'none' : 'color 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isRolling ? 'scale(0.9)' : 'scale(1)',
        }}
      >
        {displayIcon}
      </span>
    </div>
  );
}