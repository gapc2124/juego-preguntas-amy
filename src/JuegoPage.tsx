// src/JuegoPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import Dice3D from './components/Dice3D';
import { allQuestions, deckMetadata, type Question } from './data/questions'; // Nota: "type Question" para evitar errores de TS

export default function JuegoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ==========================================
  // 1. CONFIGURACIÓN INICIAL Y ESTADOS
  // Obtenemos las barajas que Amy y tú eligieron
  // ==========================================
  const selectedDeckIds: string[] = location.state?.selectedDecks || [];

  const [isRolling, setIsRolling] = useState(false); // Controla si el dado está girando
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null); // Pregunta actual en pantalla

  // ==========================================
  // 2. LÓGICA DE SELECCIÓN ALEATORIA
  // Esta función elige 100% al azar una baraja y luego una pregunta
  // ==========================================
  const pickRandomQuestion = useCallback(() => {
    if (selectedDeckIds.length === 0) return;
    
    // Elige un ID de categoría al azar de los seleccionados
    const randomDeckId = selectedDeckIds[Math.floor(Math.random() * selectedDeckIds.length)];
    
    // Filtra el banco de datos para obtener solo preguntas de esa categoría
    const possibleQuestions = allQuestions.filter(q => q.deckId === randomDeckId);
    
    // Elige la pregunta final
    const randomQ = possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)];
    
    setCurrentQuestion(randomQ);
  }, [selectedDeckIds]);

  // Ejecutar al cargar la página por primera vez
  useEffect(() => {
    if (selectedDeckIds.length > 0) {
      pickRandomQuestion();
    }
  }, [selectedDeckIds, pickRandomQuestion]);

  // ==========================================
  // 3. MANEJADOR DEL LANZAMIENTO
  // Controla el tiempo de giro (600ms) y el cambio de estado
  // ==========================================
  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Tiempo de giro optimizado para ser ágil
    setTimeout(() => {
      pickRandomQuestion(); // Cambia la pregunta al terminar el giro
      setIsRolling(false);
    }, 600); 
  };

  // ==========================================
  // 4. SEGURIDAD Y DATOS DE DISEÑO
  // ==========================================
  if (selectedDeckIds.length === 0) {
    return (
      <div style={{ backgroundColor: '#0a192f', height: '100dvh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={() => navigate('/preparacion')} style={{ color: 'white', background: 'none', border: '1px solid white', padding: '10px 20px', borderRadius: '20px' }}>
          Regresar a selección
        </button>
      </div>
    );
  }

  // Obtenemos los colores e iconos de la categoría actual (ej. dorado para lo Bíblico)
  const deckInfo = currentQuestion ? deckMetadata[currentQuestion.deckId] : null;

  return (
    <div style={{ 
      backgroundColor: '#0a192f', // Fondo azul oscuro para máximo contraste
      minHeight: '100dvh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', // Centrado vertical total
      alignItems: 'center', 
      padding: '1.5rem',
      fontFamily: "'Outfit', sans-serif",
      overflow: 'hidden'
    }}>
      
      {/* ==========================================
          5. CONTENEDOR PRINCIPAL (RESPONSIVE)
          ========================================== */}
      <div style={{ 
        width: '100%', 
        maxWidth: '450px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '1.5rem' 
      }}>
        
        {/* LA CARTA DE PREGUNTA (Arriba) */}
        {currentQuestion && deckInfo && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '28px', 
            width: '100%', 
            borderTop: `14px solid ${deckInfo.color}`,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            padding: '40px 24px',
            textAlign: 'center',
            opacity: isRolling ? 0.3 : 1, // Se atenúa mientras el dado gira
            transform: isRolling ? 'scale(0.95)' : 'scale(1)'
          }}>
              {/* Icono gigante de la categoría */}
              <span className="material-symbols-outlined" style={{ 
                color: deckInfo.color, 
                fontSize: '55px', 
                marginBottom: '5px'
              }}>
                {deckInfo.icon}
              </span>
              
              <h3 style={{ fontSize: '0.85rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
                {deckInfo.title}
              </h3>

              <h2 style={{ 
                color: '#222', 
                fontSize: '1.8rem', 
                fontWeight: 800, 
                lineHeight: '1.4',
                marginTop: '1.5rem',
                marginContent: 0
              }}>
                "{currentQuestion.text}"
              </h2>
          </div>
        )}

        {/* EL DADO 3D (Debajo de la carta) */}
        <div style={{ width: '280px', height: '280px', cursor: 'pointer', touchAction: 'none' }}>
          <Canvas camera={{ position: [0, 2, 4], fov: 40 }}>
            <Dice3D 
              isRolling={isRolling} 
              onRoll={handleRoll} // Se activa al tocar el dado
              resultIcon={deckInfo?.icon} // Dibuja el icono ganador al detenerse
              resultColor={deckInfo?.color}
            />
          </Canvas>
        </div>

        {/* TEXTO DE AYUDA */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '1px' }}>
            {isRolling ? "SORTEANDO CATEGORÍA..." : "TOCA EL DADO PARA LANZAR 🎲"}
          </p>
        </div>

        {/* BOTÓN DE RETORNO */}
        <button 
          onClick={() => navigate('/preparacion')} 
          style={{ 
            marginTop: '1rem',
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            padding: '0.8rem 2rem', 
            borderRadius: '30px', 
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontFamily: "'Outfit', sans-serif"
          }}
        >
          Cambiar barajas
        </button>
      </div>
    </div>
  );
}