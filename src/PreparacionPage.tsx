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
  
  // Lista de jugadores vacía por defecto
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');

  const toggleSelection = (id: string) => {
    setSelectedDecks(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedDecks.length === decks.length) {
      setSelectedDecks([]);
    } else {
      setSelectedDecks(decks.map(deck => deck.id));
    }
  };

  const handleAddPlayer = () => {
    if (newPlayerName.trim() !== '') {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const isAllSelected = selectedDecks.length === decks.length;

  const handleContinue = () => {
    navigate('/juego', { state: { selectedDecks, players } });
  };

  return (
    <div style={{ backgroundColor: 'white', width: '100%', height: '100dvh', color: '#333', display: 'flex', flexDirection: 'column', fontFamily: "'Outfit', sans-serif", overflow: 'hidden', margin: 0, padding: 0 }}>
      
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <header style={{ padding: '2rem 1.5rem 1rem', textAlign: 'center', flexShrink: 0, backgroundColor: 'white', zIndex: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: 900, margin: 0, color: '#1a1a1a', letterSpacing: '-1px' }}>Configuración</h2>
        <p style={{ color: '#666', marginTop: '8px', fontSize: '0.95rem' }}>Ajusta las opciones para jugar</p>
      </header>

      <div className="hide-scroll" style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', width: '100%', maxWidth: '500px', margin: '0 auto', paddingBottom: '1rem' }}>
        
        {/* SECCIÓN JUGADORES */}
        <div style={{ padding: '1.5rem', backgroundColor: '#fafafa', borderBottom: '1px solid #eaeaea' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#1a1a1a' }}>
            Jugadores ({players.length})
          </h3>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {players.length === 0 && (
              <span style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>Añade al menos un jugador para empezar.</span>
            )}
            {players.map((player, index) => (
              <div key={index} style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
                {player}
                <span onClick={() => handleRemovePlayer(index)} className="material-symbols-outlined" style={{ fontSize: '16px', cursor: 'pointer', opacity: 0.7 }}>close</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              value={newPlayerName} 
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
              placeholder="Añadir jugador..." 
              style={{ flex: 1, padding: '12px 15px', borderRadius: '12px', border: '1px solid #ddd', fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', outline: 'none' }} 
            />
            <button 
              onClick={handleAddPlayer} 
              style={{ backgroundColor: '#0072ff', color: 'white', border: 'none', borderRadius: '12px', padding: '0 20px', fontWeight: 800, cursor: 'pointer' }}
            >
              +
            </button>
          </div>
        </div>

        {/* BOTÓN SELECCIONAR TODAS */}
        <div onClick={handleSelectAll} style={{ display: 'flex', alignItems: 'center', padding: '1.2rem 1.5rem', backgroundColor: 'white', borderBottom: '1px solid #f2f2f2', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', userSelect: 'none' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0, border: `2px solid ${isAllSelected ? '#1a1a1a' : '#d0d0d0'}`, backgroundColor: isAllSelected ? '#1a1a1a' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', transition: 'all 0.2s ease' }}>
            {isAllSelected && <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>done_all</span>}
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a1a1a' }}>Seleccionar todas las barajas</span>
        </div>

        {/* LISTA DE BARAJAS */}
        {decks.map((deck) => {
          const isSelected = selectedDecks.includes(deck.id);
          const isExpanded = expanded === deck.id;

          return (
            <div key={deck.id} style={{ borderBottom: '1px solid #f2f2f2' }}>
              <div onClick={() => toggleSelection(deck.id)} style={{ display: 'flex', alignItems: 'center', padding: '1.2rem 1.5rem', backgroundColor: isSelected ? `${deck.color}08` : 'transparent', transition: 'background-color 0.3s ease', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', userSelect: 'none' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0, border: `2px solid ${isSelected ? deck.color : '#d0d0d0'}`, backgroundColor: isSelected ? deck.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', transition: 'all 0.2s ease' }}>
                  {isSelected && <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>check</span>}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                  <span className="material-symbols-outlined" style={{ color: deck.color, fontSize: '32px', marginRight: '15px', flexShrink: 0 }}>{deck.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{deck.title}</span>
                </div>
                <span className="material-symbols-outlined" onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : deck.id); }} style={{ cursor: 'pointer', color: '#ccc', padding: '10px', flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', WebkitTapHighlightColor: 'transparent' }}>
                  expand_more
                </span>
              </div>
              <div style={{ maxHeight: isExpanded ? '150px' : '0', opacity: isExpanded ? 1 : 0, overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', backgroundColor: '#fafafa' }}>
                <p style={{ padding: '0.8rem 1.5rem 1.2rem 4rem', margin: 0, fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>{deck.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <footer style={{ padding: '1.5rem', width: '100%', maxWidth: '500px', margin: '0 auto', flexShrink: 0, backgroundColor: 'white', zIndex: 10 }}>
        <button 
          onClick={handleContinue}
          disabled={selectedDecks.length === 0 || players.length === 0}
          style={{ width: '100%', padding: '1.2rem', borderRadius: '50px', border: 'none', backgroundColor: (selectedDecks.length > 0 && players.length > 0) ? '#0072ff' : '#ddd', color: 'white', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.5px', boxShadow: (selectedDecks.length > 0 && players.length > 0) ? '0 8px 20px rgba(0, 114, 255, 0.25)' : 'none', transition: 'all 0.3s ease', cursor: (selectedDecks.length > 0 && players.length > 0) ? 'pointer' : 'not-allowed', WebkitTapHighlightColor: 'transparent' }}
        >
          {selectedDecks.length > 0 ? `JUGAR (${selectedDecks.length})` : 'ELIGE UNA BARAJA'}
        </button>
      </footer>
    </div>
  );
}