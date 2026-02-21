// src/JuegoPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import Dice3D from './components/Dice3D';
// 1. CORRECCIÓN: Importación de tipo explícita para TS
import { allQuestions, deckMetadata, type Question } from './data/questions';

export default function JuegoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDeckIds: string[] = location.state?.selectedDecks || [];

  const [isRolling, setIsRolling] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const pickRandomQuestion = useCallback(() => {
    if (selectedDeckIds.length === 0) return;
    const randomDeckId = selectedDeckIds[Math.floor(Math.random() * selectedDeckIds.length)];
    const possibleQuestions = allQuestions.filter(q => q.deckId === randomDeckId);
    const randomQ = possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)];
    setCurrentQuestion(randomQ);
  }, [selectedDeckIds]);

  useEffect(() => {
    if (selectedDeckIds.length > 0) pickRandomQuestion();
  }, [selectedDeckIds, pickRandomQuestion]);

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    setTimeout(() => {
      pickRandomQuestion();
      setIsRolling(false);
    }, 600); 
  };

  if (selectedDeckIds.length === 0) {
    return <div style={{ backgroundColor: '#0a192f', height: '100dvh' }} />;
  }

  const deckInfo = currentQuestion ? deckMetadata[currentQuestion.deckId] : null;

  return (
    <div style={{ 
      backgroundColor: '#0a192f', // Fondo que cubre TODA la pantalla
      width: '100vw',
      height: '100dvh', // Usa el alto dinámico del móvil
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-evenly', // Distribuye los elementos sin dejar huecos vacíos
      alignItems: 'center', 
      padding: '1rem',
      // 2. CORRECCIÓN: Sintaxis de comillas y comas corregida
      fontFamily: "'Outfit', sans-serif",
      overflow: 'hidden' // Prohíbe el scroll
    }}>
      
      {/* SECCIÓN 1: LA CARTA */}
      {currentQuestion && deckInfo && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '24px', 
          width: '90%', // Ajuste responsive
          maxWidth: '380px',
          borderTop: `12px solid ${deckInfo.color}`, //
          boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          flexShrink: 0 // Evita que la carta se aplaste
        }}>
           <div style={{ color: deckInfo.color, marginBottom: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
                {deckInfo.icon}
              </span>
              <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
                {deckInfo.title}
              </h3>
           </div>
           
           <h2 style={{ 
             color: '#222', 
             fontSize: '1.5rem', 
             fontWeight: 800, 
             lineHeight: '1.3',
             margin: '1rem 0 0'
           }}>
             "{currentQuestion.text}"
           </h2>
        </div>
      )}

      {/* SECCIÓN 2: EL DADO (Contenedor más compacto) */}
      <div style={{ 
        width: '100%', 
        height: '35vh', // Altura relativa para que siempre quepa
        maxHeight: '280px',
        cursor: 'pointer' 
      }}>
        <Canvas camera={{ position: [0, 2, 4], fov: 40 }}>
          <Dice3D 
            isRolling={isRolling} 
            onRoll={handleRoll} 
            resultIcon={deckInfo?.icon} 
            resultColor={deckInfo?.color}
          />
        </Canvas>
      </div>

      {/* SECCIÓN 3: BOTÓN Y TEXTO */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.85rem' }}>
          {isRolling ? "SORTEANDO..." : "TOCA EL DADO 🎲"}
        </p>

        <button 
          onClick={() => navigate('/preparacion')} 
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            padding: '0.7rem 1.8rem', 
            borderRadius: '30px', 
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Cambiar barajas
        </button>
      </div>
    </div>
  );
}