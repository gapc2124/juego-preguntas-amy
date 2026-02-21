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
  const [isReady, setIsReady] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  
  // ESTADO PARA EL MAZO DE ESTA PARTIDA (Para evitar repeticiones)
  const [questionsQueue, setQuestionsQueue] = useState<Question[]>([]);

  // Función para barajar (Shuffle)
  const shuffle = (array: Question[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Inicializar el mazo al empezar
  useEffect(() => {
    if (selectedDeckIds.length > 0) {
      const filtered = allQuestions.filter(q => selectedDeckIds.includes(q.deckId));
      setQuestionsQueue(shuffle([...filtered]));
    }
  }, [selectedDeckIds]);

  const pickNextQuestion = useCallback(() => {
    if (questionsQueue.length === 0) return;

    const nextQueue = [...questionsQueue];
    const nextQ = nextQueue.shift(); // Sacamos la primera carta
    
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setQuestionsQueue(nextQueue); // Actualizamos el mazo restante
    }
  }, [questionsQueue]);

  // Primera carga
  useEffect(() => {
    if (questionsQueue.length > 0 && !currentQuestion) {
      pickNextQuestion();
    }
  }, [questionsQueue, currentQuestion, pickNextQuestion]);

  const handleRoll = () => {
    if (isRolling || !isReady) return;
    
    if (questionsQueue.length === 0) {
        alert("¡Se acabaron las cartas! Regresa para elegir más mazzos.");
        return;
    }

    setIsRolling(true);
    
    setTimeout(() => {
      pickNextQuestion();
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
      setIsRolling(false);
      setIsReady(false);
    }, 1000); 
  };

  if (selectedDeckIds.length === 0) {
    return <div style={{ backgroundColor: '#0a192f', height: '100dvh' }} />;
  }

  const deckInfo = currentQuestion ? deckMetadata[currentQuestion.deckId] : null;
  const currentPlayerName = players[currentPlayerIndex];

  return (
    <div style={{ 
      backgroundColor: '#0a192f', width: '100%', height: '100dvh', 
      display: 'flex', flexDirection: 'column', padding: '0.5rem 1.2rem', 
      fontFamily: "'Outfit', sans-serif", overflow: 'hidden', boxSizing: 'border-box'
    }}>
      
      {/* NAV SUPERIOR: Botón Salir */}
      <nav style={{ display: 'flex', alignItems: 'center', paddingTop: '0.5rem' }}>
        <button 
          onClick={() => navigate('/preparacion')}
          style={{
            background: 'none', border: 'none', color: 'white',
            display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer', opacity: 0.6
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>arrow_back_ios</span>
          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Salir</span>
        </button>
      </nav>

      {/* SECCIÓN CENTRAL: CARTA (Tamaño ajustado) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {currentQuestion && deckInfo && (
          <div style={{ 
            backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '360px',
            borderTop: `18px solid ${deckInfo.color}`, 
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            padding: '1.5rem 1.2rem', textAlign: 'center',
            minHeight: '260px', // Reducción vertical sutil
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.8rem'
          }}>
             
             <h3 style={{ 
               fontSize: '0.85rem', // Texto más pequeño
               textTransform: 'uppercase', letterSpacing: '1px', 
               fontWeight: 800, color: deckInfo.color, margin: 0
              }}>
               Turno de: {currentPlayerName}
             </h3>
             
             <h2 style={{ 
               color: '#222', 
               fontSize: '1.35rem', // Pregunta más pequeña para que no sature
               fontWeight: 700, lineHeight: '1.4', margin: '0'
              }}>
               "{currentQuestion.text}"
             </h2>

             <p style={{ fontSize: '0.7rem', color: '#bbb', marginTop: '10px' }}>
                Cartas restantes: {questionsQueue.length}
             </p>
          </div>
        )}
      </div>

      {/* SECCIÓN INFERIOR */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '1rem', paddingBottom: '1.5rem'
      }}>
        
        <Roulette 
          isRolling={isRolling} isReady={isReady} onRoll={handleRoll} 
          resultIcon={deckInfo?.icon} resultColor={deckInfo?.color} 
        />

        <label style={{ 
          display: 'flex', alignItems: 'center', gap: '10px', color: 'white', 
          cursor: 'pointer', fontSize: '1rem', fontWeight: 600, userSelect: 'none',
          padding: '10px 20px',
          backgroundColor: isReady ? 'rgba(52, 168, 83, 0.2)' : 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px', border: isReady ? '1.5px solid #34A853' : '1.5px solid transparent'
        }}>
          <input 
            type="checkbox" checked={isReady} 
            onChange={(e) => setIsReady(e.target.checked)}
            disabled={isRolling}
            style={{ width: '18px', height: '18px', accentColor: '#34A853' }} 
          />
          <span>{isRolling ? "GIRANDO..." : "Toca para girar"}</span>
        </label>
      </div>
    </div>
  );
}