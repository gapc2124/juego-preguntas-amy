// src/components/Home.tsx
interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%', // Se adapta al 100dvh del padre
      width: '100%',
      padding: '1.5rem',
      boxSizing: 'border-box', // Evita que el padding sume ancho extra
      textAlign: 'center',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <h1 style={{ 
        // clamp(mínimo, ideal, máximo): El texto se adapta al ancho de la pantalla
        fontSize: 'clamp(3.5rem, 15vw, 6rem)', 
        fontWeight: 900, 
        color: 'white', 
        margin: '0 0 0.5rem 0',
        lineHeight: '1.1',
        textShadow: '0 4px 30px rgba(255, 179, 217, 0.6)'
      }}>
        Sintonía
      </h1>
      
      <h2 style={{ 
        fontSize: 'clamp(1rem, 5vw, 1.5rem)', 
        color: '#ffb3d9', 
        margin: '0 0 3.5rem 0',
        fontWeight: 500,
        maxWidth: '90%', // Evita que el subtítulo toque los bordes
        lineHeight: '1.4'
      }}>
        Juego de preguntas para conectar
      </h2>
      
      <button 
        onClick={onStart}
        style={{
          padding: '1.2rem 3.5rem',
          borderRadius: '50px',
          border: 'none',
          backgroundColor: '#ffb3d9',
          color: '#110107',
          fontSize: '1.3rem',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(255, 179, 217, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        ¡Comencemos! ✨
      </button>
    </div>
  );
}