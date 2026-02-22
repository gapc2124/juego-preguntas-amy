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

  // Función para barajar un arreglo aleatoriamente
  const shuffle = (array: Question[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // NUEVO ALGORITMO: Balanceo estricto con tolerancia de +2
  const buildBalancedQueue = useCallback(() => {
    if (selectedDeckIds.length === 0) return [];
    
    // 1. Agrupar las preguntas barajadas por categoría (deck)
    const groups: Record<string, Question[]> = {};
    selectedDeckIds.forEach(id => { groups[id] = []; });
    
    allQuestions.forEach(q => {
      if (groups[q.deckId]) groups[q.deckId].push(q);
    });

    for (const id in groups) {
      groups[id] = shuffle(groups[id]);
    }

    // 2. Controladores de aparición
    const appearanceCounts: Record<string, number> = {};
    selectedDeckIds.forEach(id => { appearanceCounts[id] = 0; });

    const finalQueue: Question[] = [];
    let lastDeckId: string | null = null;

    // 3. Bucle de extracción balanceada
    while (true) {
      // Filtrar solo los mazos que aún tienen cartas
      const availableDecks = selectedDeckIds.filter(id => groups[id].length > 0);
      if (availableDecks.length === 0) break; // Fin: Ya no hay cartas en ningún mazo

      // Calcular el mínimo de apariciones SOLO entre los mazos que aún tienen cartas
      const minAppearances = Math.min(...availableDecks.map(id => appearanceCounts[id]));

      // Filtrar mazos válidos: No pueden superar por 2 al que menos ha salido
      let validDecks = availableDecks.filter(id => appearanceCounts[id] < minAppearances + 2);

      // Si por alguna razón matemática no hay válidos, el respaldo de seguridad usa todos los disponibles
      if (validDecks.length === 0) validDecks = availableDecks;

      // Intentar no repetir la categoría exactamente anterior (si hay opciones)
      let candidateDecks = validDecks.filter(id => id !== lastDeckId);
      if (candidateDecks.length === 0) candidateDecks = validDecks; 

      // Elegir el mazo con más cartas restantes para vaciarlos uniformemente
      candidateDecks.sort((a, b) => groups[b].length - groups[a].length);
      const pickedDeck = candidateDecks[0];

      // Extraer la carta y registrarla
      const card = groups[pickedDeck].pop();
      if (card) {
        finalQueue.push(card);
        appearanceCounts[pickedDeck]++;
        lastDeckId = pickedDeck;
      }
    }

    return finalQueue;
  }, [selectedDeckIds]);

  // Inicializar el mazo balanceado al empezar
  useEffect(() => {
    const newQueue = buildBalancedQueue();
    setQuestionsQueue(newQueue);
  }, [buildBalancedQueue]);

  const pickNextQuestion = useCallback(() => {
    if (questionsQueue.length === 0) return;

    const nextQueue = [...questionsQueue];
    const nextQ = nextQueue.shift(); 
    
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setQuestionsQueue(nextQueue);
    }
  }, [questionsQueue]);

  // Mostrar la primera carta automáticamente
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
            height: '280px', 
            display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
            position: 'relative' // Necesario para el ID en la esquina
          }}>
             
             {/* ID DE LA CARTA EN LA ESQUINA SUPERIOR DERECHA */}
             <span style={{
               position: 'absolute',
               top: '12px',
               right: '16px',
               fontSize: '0.65rem',
               fontWeight: 800,
               color: '#d1d1d1',
               letterSpacing: '1px'
             }}>
               #{currentQuestion.id}
             </span>

             {/* HEADER DE LA CARTA */}
             <h3 style={{ 
               fontSize: '0.8rem', 
               textTransform: 'uppercase', letterSpacing: '1px', 
               fontWeight: 800, color: deckInfo.color, margin: '0 0 12px 0',
               flexShrink: 0
              }}>
               Turno de: {currentPlayerName}
             </h3>
             
             {/* CONTENEDOR DE LA PREGUNTA (Con Scroll) */}
             <div style={{
               flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center',
               justifyContent: 'center', padding: '0 5px'
             }}>
               <h2 style={{ 
                 color: '#222', 
                 fontSize: '1.15rem',
                 fontWeight: 700, lineHeight: '1.4', margin: '0',
                 textAlign: 'center'
                }}>
                 "{currentQuestion.text}"
               </h2>
             </div>

             {/* FOOTER DE LA CARTA */}
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