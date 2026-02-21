// src/JuegoPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import Dice3D from './components/Dice3D';
import { allQuestions, deckMetadata, type Question } from './data/questions';

export default function JuegoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const selectedDeckIds: string[] = location.state?.selectedDecks || [];
  // Si por algún motivo llegan sin jugadores, le ponemos un comodín
  const players: string[] = location.state?.players || ['Jugador'];

  const [isRolling, setIsRolling] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

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
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
      setIsRolling(false);
    }, 600); 
  };

  if (selectedDeckIds.length === 0) {
    return <div style={{ backgroundColor: '#0a192f', height: '100dvh' }} />;
  }

  const deckInfo = currentQuestion ? deckMetadata[currentQuestion.deckId] : null;
  const currentPlayerName = players[currentPlayerIndex];

  return (
    <div style={{ 
      backgroundColor: '#0a192f', width: '100%', height: '100dvh', display: 'flex', flexDirection: 'column', 
      justifyContent: 'space-evenly', alignItems: 'center', padding: '1rem', fontFamily: "'Outfit', sans-serif", overflow: 'hidden'
    }}>
      
      {currentQuestion && deckInfo && (
        <div style={{ 
          backgroundColor: 'white', borderRadius: '24px', width: '90%', maxWidth: '380px',
          borderTop: `12px solid ${deckInfo.color}`, boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
          padding: '2rem 1.5rem', textAlign: 'center', flexShrink: 0,
          position: 'relative',
          minHeight: '300px', // Tarjeta más alta
          display: 'flex', flexDirection: 'column', justifyContent: 'center' // Mantiene el contenido centrado
        }}>
           
           <div style={{
             position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)',
             backgroundColor: '#1a1a1a', color: 'white', padding: '6px 20px', borderRadius: '20px',
             fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase',
             boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
           }}>
             Turno de: <span style={{ color: deckInfo.color }}>{currentPlayerName}</span>
           </div>

           <div style={{ color: deckInfo.color, marginBottom: '0.5rem', marginTop: '10px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>{deckInfo.icon}</span>
              <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
                {deckInfo.title}
              </h3>
           </div>
           
           <h2 style={{ 
             color: '#222', 
             fontSize: '1.5rem', 
             fontWeight: 800, 
             lineHeight: '1.4', 
             margin: '1.5rem 0 0',
             letterSpacing: '1px' // Mayor espaciado entre letras
            }}>
             "{currentQuestion.text}"
           </h2>
        </div>
      )}

      <div style={{ width: '100%', height: '35vh', maxHeight: '280px', cursor: 'pointer' }}>
        <Canvas camera={{ position: [0, 2, 4], fov: 40 }}>
          <Dice3D isRolling={isRolling} onRoll={handleRoll} resultIcon={deckInfo?.icon} resultColor={deckInfo?.color} />
        </Canvas>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.85rem' }}>
          {isRolling ? "SORTEANDO..." : "TOCA EL DADO"}
        </p>

        {/* Botón actualizado con nuevo texto */}
        <button 
          onClick={() => navigate('/preparacion')} 
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.7rem 1.8rem', borderRadius: '30px', color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontFamily: "'Outfit', sans-serif" }}
        >
          Terminar partida
        </button>
      </div>
    </div>
  );
}