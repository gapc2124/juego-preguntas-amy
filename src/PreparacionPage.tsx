// src/PreparacionPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ==========================================
// 1. DEFINICIÓN DE DATOS (BARAJAS)
// Aquí puedes agregar o quitar categorías en el futuro
// ==========================================
interface Deck {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
}

const decks: Deck[] = [
  { id: '1', title: 'Conocimiento', desc: '¿Cuánto sabes realmente del otro? Pon a prueba tu memoria.', icon: 'help', color: '#4285F4' },
  { id: '2', title: 'Íntimo', desc: 'Esas cosas que necesitan ser dichas pero a veces no nos atrevemos.', icon: 'favorite', color: '#EA4335' },
  { id: '3', title: 'Bíblico', desc: 'Opiniones o experiencias espirituales basadas en nuestra fe.', icon: 'menu_book', color: '#FBBC04' }, // Dorado para resaltar lo espiritual
  { id: '4', title: 'Familiar', desc: 'Explora la relación familiar para entender mejor al otro.', icon: 'family_restroom', color: '#34A853' },
  { id: '5', title: 'Emocional', desc: 'Sobre tus anhelos, deseos, miedos y enojos más profundos.', icon: 'psychology', color: '#A142F4' },
  { id: '6', title: 'Random', desc: 'Preguntas sin sentido que pueden esconder una opinión oculta.', icon: 'casino', color: '#FF6D00' },
  { id: '7', title: 'Rápidas', desc: 'Preguntas básicas de sí o no o de solo una palabra como respuesta.', icon: 'bolt', color: '#00ACC1' }
];

export default function PreparacionPage() {
  const navigate = useNavigate();

  // ==========================================
  // 2. ESTADOS DE LA PÁGINA
  // ==========================================
  const [expanded, setExpanded] = useState<string | null>(null); // Controla cuál descripción está abierta
  const [selectedDecks, setSelectedDecks] = useState<string[]>([]); // Controla las barajas elegidas (Checklist)

  // ==========================================
  // 3. LÓGICA DE INTERACCIÓN
  // ==========================================
  const toggleSelection = (id: string) => {
    setSelectedDecks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    // Navega al juego pasando las barajas seleccionadas como estado
    navigate('/juego', { state: { selectedDecks } });
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      minHeight: '100dvh', 
      color: '#333', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: "'Outfit', sans-serif" 
    }}>
      
      {/* ==========================================
          4. CABECERA (HEADER)
          ========================================== */}
      <header style={{ padding: '3.5rem 1.5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, color: '#1a1a1a' }}>
          Escoge tus barajas
        </h2>
        <p style={{ color: '#666', marginTop: '12px', fontSize: '1.1rem' }}>
          Selecciona las categorías para jugar con Amy 
        </p>
      </header>

      {/* ==========================================
          5. LISTA DE BARAJAS (RESPONSIVE)
          ========================================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {decks.map((deck) => {
          const isSelected = selectedDecks.includes(deck.id);
          const isExpanded = expanded === deck.id;

          return (
            <div key={deck.id} style={{ borderBottom: '1px solid #f2f2f2', width: '100%' }}>
              
              {/* FILA DE LA BARAJA */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1.4rem 1.5rem', // Padding generoso para móviles
                backgroundColor: isSelected ? `${deck.color}08` : 'transparent',
                transition: 'background-color 0.3s ease'
              }}>
                
                {/* CHECKBOX PERSONALIZADO */}
                <div 
                  onClick={() => toggleSelection(deck.id)}
                  style={{
                    width: '28px', height: '28px',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? deck.color : '#d0d0d0'}`,
                    backgroundColor: isSelected ? deck.color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', marginRight: '18px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSelected && <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>check</span>}
                </div>

                {/* ICONO Y TÍTULO (Iconos grandes) */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ 
                    color: deck.color, 
                    fontSize: '40px', // Tamaño de icono aumentado
                    marginRight: '18px' 
                  }}>
                    {deck.icon}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                    {deck.title}
                  </span>
                </div>

                {/* BOTÓN DESPLEGAR (FLECHA) */}
                <span 
                  className="material-symbols-outlined"
                  onClick={() => setExpanded(isExpanded ? null : deck.id)}
                  style={{ 
                    cursor: 'pointer', 
                    color: '#ccc', 
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: '10px'
                  }}
                >
                  expand_more
                </span>
              </div>

              {/* DESCRIPCIÓN CON ANIMACIÓN SUAVE */}
              <div style={{
                maxHeight: isExpanded ? '180px' : '0',
                opacity: isExpanded ? 1 : 0,
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: '#fafafa'
              }}>
                <p style={{ 
                  padding: '1rem 1.5rem 1.8rem 4.5rem', 
                  margin: 0, 
                  fontSize: '1rem', 
                  color: '#666', 
                  lineHeight: '1.6'
                }}>
                  {deck.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==========================================
          6. BOTÓN CONTINUAR (FIJO AL FINAL)
          ========================================== */}
      <footer style={{ padding: '2.5rem 1.5rem', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
        <button 
          onClick={handleContinue}
          disabled={selectedDecks.length === 0}
          style={{
            width: '100%',
            padding: '1.4rem',
            borderRadius: '50px',
            border: 'none',
            backgroundColor: selectedDecks.length > 0 ? '#0072ff' : '#ddd',
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: 800,
            boxShadow: selectedDecks.length > 0 ? '0 12px 28px rgba(0, 114, 255, 0.3)' : 'none',
            transition: 'all 0.3s ease',
            cursor: selectedDecks.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          {selectedDecks.length > 0 ? `JUGAR (${selectedDecks.length} BARAJAS)` : 'ELIGE UNA BARAJA'}
        </button>
      </footer>
    </div>
  );
}