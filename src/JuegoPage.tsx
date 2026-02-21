// src/JuegoPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Roulette from './components/Roulette'; // Importamos el nuevo componente
import { allQuestions, deckMetadata, type Question } from './data/questions';

export default function JuegoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const selectedDeckIds: string[] = location.state?.selectedDecks || [];
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
    
    // Aumentamos a 1000ms (1 segundo) para que la animación de la ruleta se luzca
    setTimeout(() => {
      pickRandomQuestion();
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
      setIsRolling(false);
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
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '2rem 1rem', 
      fontFamily: "'Outfit', sans-serif", 
      overflow: 'hidden'
    }}>
      
      {currentQuestion && deckInfo && (
        <div style={{ 
          backgroundColor: 'white', borderRadius: '24px', 
          width: '100%', maxWidth: '420px',
          borderTop: `16px solid ${deckInfo.color}`, boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
          padding: '3rem 2rem',
          textAlign: 'center', flexShrink: 0,
          position: 'relative', 
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
           <div style={{
             position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)',
             backgroundColor: '#1a1a1a', color: 'white', padding: '8px 24px', borderRadius: '20px',
             fontSize: '0.9rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase',
             boxShadow: '0 4px 10px rgba(0,0,0,0.3)', whiteSpace: 'nowrap'
           }}>
             Turno de: <span style={{ color: deckInfo.color }}>{currentPlayerName}</span>
           </div>

           <div style={{ color: deckInfo.color, marginBottom: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '56px' }}>{deckInfo.icon}</span>
              <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
                {deckInfo.title}
              </h3>
           </div>
           
           <h2 style={{ 
             color: '#222', 
             fontSize: '1.8rem',
             fontWeight: 800, lineHeight: '1.4', 
             margin: '1.5rem 0 0', letterSpacing: '0.5px' 
            }}>
             "{currentQuestion.text}"
           </h2>
        </div>
      )}

      <div style={{ flexGrow: 1 }}></div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        marginBottom: '1rem'
      }}>
        
        {/* Usamos nuestro nuevo componente de Ruleta 2D pura */}
        <Roulette 
          isRolling={isRolling} 
          onRoll={handleRoll} 
          resultIcon={deckInfo?.icon} 
          resultColor={deckInfo?.color} 
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px' }}>
            {isRolling ? "GIRANDO..." : "TOCA PARA GIRAR"}
          </p>

          <button 
            onClick={() => navigate('/preparacion')} 
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '0.8rem 2rem', borderRadius: '30px', color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
          >
            Terminar partida
          </button>
        </div>
      </div>
    </div>
  );
}