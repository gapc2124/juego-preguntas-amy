// src/JuegoPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Roulette from './components/Roulette';
import { allQuestions, deckMetadata, type Question } from './data/questions';

// LLAVE ÚNICA PARA EL STORAGE
const STORAGE_KEY = "juego_aniversario_proceso";

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

  // --- LÓGICA DE PERSISTENCIA ---
  
  // Función para obtener IDs jugados
  const getPlayedIds = (): string[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  // Función para guardar un nuevo ID jugado
  const savePlayedId = (id: string) => {
    const played = getPlayedIds();
    if (!played.includes(id)) {
      const updated = [...played, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Función para reiniciar todo el progreso
  const handleResetProgress = () => {
    if (window.confirm("¿Seguro que quieren reiniciar todo el mazo? Volverán a salir todas las cartas.")) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload(); // Recargamos para reconstruir el mazo
    }
  };

  // --- ALGORITMO DE BALANCEO (Modificado para filtrar jugadas) ---
  const shuffle = (array: Question[]) => [...array].sort(() => Math.random() - 0.5);

  const buildBalancedQueue = useCallback(() => {
    if (selectedDeckIds.length === 0) return [];
    
    const playedIds = getPlayedIds(); // <--- Obtenemos lo guardado

    // Filtramos: Solo mazos seleccionados Y preguntas que NO han salido antes
    const groups: Record<string, Question[]> = {};
    selectedDeckIds.forEach(id => { groups[id] = []; });
    
    allQuestions.forEach(q => {
      if (groups[q.deckId] && !playedIds.includes(q.id)) {
        groups[q.deckId].push(q);
      }
    });

    for (const id in groups) {
      groups[id] = shuffle(groups[id]);
    }

    const appearanceCounts: Record<string, number> = {};
    selectedDeckIds.forEach(id => { appearanceCounts[id] = 0; });

    const finalQueue: Question[] = [];
    let lastDeckId: string | null = null;

    while (true) {
      const availableDecks = selectedDeckIds.filter(id => groups[id].length > 0);
      if (availableDecks.length === 0) break;

      const minAppearances = Math.min(...availableDecks.map(id => appearanceCounts[id]));
      let validDecks = availableDecks.filter(id => appearanceCounts[id] < minAppearances + 2);
      if (validDecks.length === 0) validDecks = availableDecks;

      let candidateDecks = validDecks.filter(id => id !== lastDeckId);
      if (candidateDecks.length === 0) candidateDecks = validDecks; 

      candidateDecks.sort((a, b) => groups[b].length - groups[a].length);
      const pickedDeck = candidateDecks[0];

      const card = groups[pickedDeck].pop();
      if (card) {
        finalQueue.push(card);
        appearanceCounts[pickedDeck]++;
        lastDeckId = pickedDeck;
      }
    }

    return finalQueue;
  }, [selectedDeckIds]);

  // Inicialización
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
      savePlayedId(nextQ.id); // <--- GUARDAMOS AL MOSTRAR LA CARTA
    }
  }, [questionsQueue]);

  useEffect(() => {
    if (questionsQueue.length > 0 && !currentQuestion) {
      pickNextQuestion();
    }
  }, [questionsQueue, currentQuestion, pickNextQuestion]);

  const handleRoll = () => {
    if (isRolling || !isReady) return;
    
    if (questionsQueue.length === 0) {
        alert("¡Felicidades! Han completado todas las cartas de estos mazos.");
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

  if (selectedDeckIds.length === 0) return <div style={{ backgroundColor: '#0a192f', height: '100dvh' }} />;

  const deckInfo = currentQuestion ? deckMetadata[currentQuestion.deckId] : null;
  const currentPlayerName = players[currentPlayerIndex];

  return (
    <div style={{ 
      backgroundColor: '#0a192f', width: '100%', height: '100dvh', 
      display: 'flex', flexDirection: 'column', padding: '0.5rem 1.2rem', 
      fontFamily: "'Outfit', sans-serif", overflow: 'hidden', boxSizing: 'border-box'
    }}>
      
      {/* NAV SUPERIOR: Salir y Reiniciar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingTop: '0.5rem' 
      }}>
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

        <button 
          onClick={handleResetProgress}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
            color: 'white', borderRadius: '12px', padding: '6px 12px',
            fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', opacity: 0.5
          }}
        >
          Reiniciar Mazo
        </button>
      </nav>

      {/* SECCIÓN CENTRAL: CARTA */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {currentQuestion && deckInfo && (
          <div style={{ 
            backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '360px',
            borderTop: `18px solid ${deckInfo.color}`, 
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            padding: '1.2rem', textAlign: 'center',
            height: '280px', 
            display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
            position: 'relative'
          }}>
             
             <span style={{
               position: 'absolute', top: '12px', right: '16px',
               fontSize: '0.65rem', fontWeight: 800, color: '#d1d1d1'
             }}>
               #{currentQuestion.id}
             </span>

             <h3 style={{ 
               fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', 
               fontWeight: 800, color: deckInfo.color, margin: '0 0 12px 0'
              }}>
               Turno de: {currentPlayerName}
             </h3>
             
             <div style={{
               flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center',
               justifyContent: 'center', padding: '0 5px'
             }}>
               <h2 style={{ 
                 color: '#222', fontSize: '1.15rem',
                 fontWeight: 700, lineHeight: '1.4', margin: '0'
                }}>
                 "{currentQuestion.text}"
               </h2>
             </div>

             <p style={{ fontSize: '0.7rem', color: '#bbb', margin: '12px 0 0 0' }}>
                Cartas restantes en esta sesión: {questionsQueue.length}
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