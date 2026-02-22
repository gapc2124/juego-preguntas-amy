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
  const [questionsQueue, setQuestionsQueue] = useState<Question[]>([]);

  // Función para barajar un arreglo
  const shuffle = (array: Question[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Algoritmo avanzado para intercalar mazos
  const buildInterleavedQueue = useCallback(() => {
    if (selectedDeckIds.length === 0) return [];
    
    // Filtramos todas las preguntas de los mazos seleccionados
    const filtered = allQuestions.filter(q => selectedDeckIds.includes(q.deckId));
    
    // Si solo hay un mazo, simplemente lo barajamos
    if (selectedDeckIds.length === 1) return shuffle(filtered);

    // Agrupamos las preguntas por deckId
    const groups: Record<string, Question[]> = {};
    selectedDeckIds.forEach(id => { groups[id] = []; });
    filtered.forEach(q => {
      if (groups[q.deckId]) groups[q.deckId].push(q);
    });

    // Barajamos internamente cada grupo
    for (const id in groups) {
      groups[id] = shuffle(groups[id]);
    }

    const finalQueue: Question[] = [];
    let lastDeckId: string | null = null;

    // Intercalamos las cartas
    while (true) {
      let bestDeckId: string | null = null;
      let maxCards = 0;

      // Buscamos el mazo válido (diferente al anterior) con más cartas restantes
      for (const id in groups) {
        if (id === lastDeckId) continue;
        if (groups[id].length > maxCards) {
          maxCards = groups[id].length;
          bestDeckId = id;
        }
      }

      // Si no encontramos uno diferente, tomamos el que quede (ocurre si un mazo es mucho más grande que los demás)
      if (!bestDeckId) {
        bestDeckId = Object.keys(groups).find(id => groups[id].length > 0) || null;
        if (!bestDeckId) break; // Ya no quedan cartas en ningún mazo
      }

      // Sacamos la carta y la añadimos a la cola final
      const card = groups[bestDeckId].pop();
      if (card) {
        finalQueue.push(card);
        lastDeckId = bestDeckId;
      }
    }

    return finalQueue;
  }, [selectedDeckIds]);

  // Inicializar el mazo al empezar
  useEffect(() => {
    const newQueue = buildInterleavedQueue();
    setQuestionsQueue(newQueue);
  }, [buildInterleavedQueue]);

  const pickNextQuestion = useCallback(() => {
    if (questionsQueue.length === 0) return;

    const nextQueue = [...questionsQueue];
    const nextQ = nextQueue.shift(); // Sacamos la primera carta
    
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setQuestionsQueue(nextQueue);
    }
  }, [questionsQueue]);

  // Primera carga automática
  useEffect(() => {
    if (questionsQueue.length > 0 && !currentQuestion) {
      pickNextQuestion();
    }
  }, [questionsQueue, currentQuestion, pickNextQuestion]);

  const handleRoll = () => {
    if (isRolling || !isReady) return;
    
    if (questionsQueue.length === 0) {
        alert("¡Se acabaron las cartas! Regresa para elegir más mazos.");
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

      {/* SECCIÓN CENTRAL: CARTA CON TAMAÑO FIJO Y SCROLL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {currentQuestion && deckInfo && (
          <div style={{ 
            backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '360px',
            borderTop: `18px solid ${deckInfo.color}`, 
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            padding: '1.2rem', textAlign: 'center',
            height: '280px', // Tamaño fijo obligatorio
            display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
          }}>
             
             {/* HEADER DE LA CARTA (Fijo) */}
             <h3 style={{ 
               fontSize: '0.8rem', 
               textTransform: 'uppercase', letterSpacing: '1px', 
               fontWeight: 800, color: deckInfo.color, margin: '0 0 12px 0',
               flexShrink: 0
              }}>
               Turno de: {currentPlayerName}
             </h3>
             
             {/* CONTENEDOR DE LA PREGUNTA (Permite Scroll) */}
             <div style={{
               flex: 1,
               overflowY: 'auto',
               display: 'flex',
               alignItems: 'center', // Centra verticalmente si el texto es corto
               justifyContent: 'center',
               padding: '0 5px'
             }}>
               <h2 style={{ 
                 color: '#222', 
                 fontSize: '1.15rem', // Texto más pequeño
                 fontWeight: 700, lineHeight: '1.4', margin: '0',
                 textAlign: 'center'
                }}>
                 "{currentQuestion.text}"
               </h2>
             </div>

             {/* FOOTER DE LA CARTA (Fijo) */}
             <p style={{ fontSize: '0.7rem', color: '#bbb', margin: '12px 0 0 0', flexShrink: 0 }}>
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