// src/JuegoPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Roulette from './components/Roulette';
import { allQuestions, deckMetadata, type Question } from './data/questions';

export default function JuegoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const selectedDeckIds: string[] = location.state?.selectedDecks || [];
  const players: string[] = location.state?.players || ['Jugador'];

  const [isRolling, setIsRolling] = useState(false);
  const [isReady, setIsReady] = useState(false); // <- Estado del Checkbox
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
    if (isRolling || !isReady) return;
    setIsRolling(true);
    
    setTimeout(() => {
      pickRandomQuestion();
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
      setIsRolling(false);
      setIsReady(false); // Resetea el check para el siguiente jugador automáticamente
    }, 1000); 
  };

  if (selectedDeckIds.length === 0) {
    return <div style={{ backgroundColor: '#0a192f', height: '100dvh' }} />;
  }

  const deckInfo = currentQuestion ? deckMetadata[currentQuestion.deckId] : null;
  const currentPlayerName = players[currentPlayerIndex];

  return (
    <div style={{ 
      backgroundColor: '#0a192f', 
      width: '100%', 
      height: '100dvh', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '2rem 1.5rem', 
      fontFamily: "'Outfit', sans-serif", 
      overflow: 'hidden'
    }}>
      
      {/* SECCIÓN SUPERIOR: CARTA (Ocupa todo el espacio disponible y se centra) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {currentQuestion && deckInfo && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '24px', 
            width: '100%', 
            maxWidth: '420px',
            borderTop: `16px solid ${deckInfo.color}`, 
            boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
            padding: '4rem 2rem', // Más padding para hacerla más alta
            textAlign: 'center',
            minHeight: '420px', // Carta considerablemente más alta
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
          }}>
             
             {/* Textos gigantes y limpios */}
             <h3 style={{ 
               fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', 
               fontWeight: 900, color: deckInfo.color, marginBottom: '2rem' 
              }}>
               Turno de: {currentPlayerName}
             </h3>
             
             <h2 style={{ 
               color: '#222', fontSize: '2rem', // Letra de pregunta más grande
               fontWeight: 800, lineHeight: '1.4', margin: '0'
              }}>
               "{currentQuestion.text}"
             </h2>
          </div>
        )}
      </div>

      {/* SECCIÓN INFERIOR: RULETA Y BOTONES */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        marginBottom: '1rem',
        marginTop: '2rem'
      }}>
        
        <Roulette 
          isRolling={isRolling} 
          isReady={isReady}
          onRoll={handleRoll} 
          resultIcon={deckInfo?.icon} 
          resultColor={deckInfo?.color} 
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          
          {/* EL CHECKBOX QUE ACTIVA LA RULETA */}
          <label style={{ 
            display: 'flex', alignItems: 'center', gap: '12px', color: 'white', 
            cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, userSelect: 'none' 
          }}>
            <input 
              type="checkbox" 
              checked={isReady} 
              onChange={(e) => setIsReady(e.target.checked)}
              disabled={isRolling}
              style={{ width: '24px', height: '24px', cursor: 'pointer', accentColor: '#34A853' }} 
            />
            {isRolling ? "GIRANDO..." : "Toca para girar"}
          </label>

          <button 
            onClick={() => navigate('/preparacion')} 
            style={{ 
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', 
              padding: '0.8rem 2rem', borderRadius: '30px', color: 'white', cursor: 'pointer', 
              fontSize: '0.85rem', fontWeight: 600 
            }}
          >
            Terminar partida
          </button>
        </div>
      </div>
    </div>
  );
}