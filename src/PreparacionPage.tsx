// src/PreparacionPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  // Mantengo el dorado y el libro para la sección espiritual
  { id: '3', title: 'Bíblico', desc: 'Opiniones o experiencias espirituales basadas en nuestra fe.', icon: 'menu_book', color: '#FBBC04' },
  { id: '4', title: 'Familiar', desc: 'Explora la relación familiar para entender mejor al otro.', icon: 'family_restroom', color: '#34A853' },
  { id: '5', title: 'Emocional', desc: 'Sobre tus anhelos, deseos, miedos y enojos más profundos.', icon: 'psychology', color: '#A142F4' },
  { id: '6', title: 'Random', desc: 'Preguntas sin sentido que pueden esconder una opinión oculta.', icon: 'casino', color: '#FF6D00' },
  { id: '7', title: 'Rápidas', desc: 'Preguntas básicas de sí o no o de solo una palabra como respuesta.', icon: 'bolt', color: '#00ACC1' }
];

export default function PreparacionPage() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedDecks, setSelectedDecks] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedDecks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    navigate('/juego', { state: { selectedDecks } });
  };

  return (
    // 1. EL CONTENEDOR MAESTRO (Bloqueado al tamaño exacto de la pantalla)
    <div style={{ 
      backgroundColor: 'white', 
      width: '100vw',
      height: '100dvh', // Altura dinámica móvil
      color: '#333', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: "'Outfit', sans-serif",
      overflow: 'hidden', // Prohíbe absolutamente el scroll en toda la página
      margin: 0,
      padding: 0
    }}>
      
      {/* Estilo inyectado para ocultar la barra de scroll de la lista interior */}
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 2. CABECERA FIJA (Flex-shrink: 0 evita que se aplaste) */}
      <header style={{ 
        padding: '2rem 1.5rem 1rem', 
        textAlign: 'center',
        flexShrink: 0,
        backgroundColor: 'white',
        zIndex: 10,
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
      }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: 900, margin: 0, color: '#1a1a1a', letterSpacing: '-1px' }}>
          Escoge tus barajas
        </h2>
        <p style={{ color: '#666', marginTop: '8px', fontSize: '0.95rem' }}>
          Selecciona las categorías para jugar hoy
        </p>
      </header>

      {/* 3. LISTA DESLIZABLE (Ocupa el espacio sobrante, con scroll invisible) */}
      <div className="hide-scroll" style={{ 
        flexGrow: 1, 
        overflowY: 'auto', // Permite scroll vertical interno
        overflowX: 'hidden', // Bloquea scroll horizontal interno
        width: '100%',
        maxWidth: '500px', // Centrado en pantallas grandes
        margin: '0 auto',
        paddingBottom: '1rem' // Espacio al final de la lista
      }}>
        {decks.map((deck) => {
          const isSelected = selectedDecks.includes(deck.id);
          const isExpanded = expanded === deck.id;

          return (
            <div key={deck.id} style={{ borderBottom: '1px solid #f2f2f2' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', padding: '1.2rem 1.5rem',
                backgroundColor: isSelected ? `${deck.color}08` : 'transparent',
                transition: 'background-color 0.3s ease'
              }}>
                <div 
                  onClick={() => toggleSelection(deck.id)}
                  style={{
                    width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0,
                    border: `2px solid ${isSelected ? deck.color : '#d0d0d0'}`,
                    backgroundColor: isSelected ? deck.color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', marginRight: '15px', transition: 'all 0.2s ease'
                  }}
                >
                  {isSelected && <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>check</span>}
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                  <span className="material-symbols-outlined" style={{ color: deck.color, fontSize: '32px', marginRight: '15px', flexShrink: 0 }}>
                    {deck.icon}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {deck.title}
                  </span>
                </div>

                <span 
                  className="material-symbols-outlined"
                  onClick={() => setExpanded(isExpanded ? null : deck.id)}
                  style={{ 
                    cursor: 'pointer', color: '#ccc', padding: '10px', flexShrink: 0,
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  expand_more
                </span>
              </div>

              <div style={{
                maxHeight: isExpanded ? '150px' : '0', opacity: isExpanded ? 1 : 0,
                overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: '#fafafa'
              }}>
                <p style={{ padding: '0.8rem 1.5rem 1.2rem 4rem', margin: 0, fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>
                  {deck.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. BOTÓN FIJO EN LA BASE */}
      <footer style={{ 
        padding: '1.5rem', 
        width: '100%', 
        maxWidth: '500px', 
        margin: '0 auto',
        flexShrink: 0,
        backgroundColor: 'white', // Fondo para tapar las cartas que pasan por debajo
        zIndex: 10
      }}>
        <button 
          onClick={handleContinue}
          disabled={selectedDecks.length === 0}
          style={{
            width: '100%', padding: '1.2rem', borderRadius: '50px', border: 'none',
            backgroundColor: selectedDecks.length > 0 ? '#0072ff' : '#ddd',
            color: 'white', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.5px',
            boxShadow: selectedDecks.length > 0 ? '0 8px 20px rgba(0, 114, 255, 0.25)' : 'none',
            transition: 'all 0.3s ease', cursor: selectedDecks.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          {selectedDecks.length > 0 ? `JUGAR (${selectedDecks.length})` : 'ELIGE UNA BARAJA'}
        </button>
      </footer>
    </div>
  );
}