// src/components/Home.tsx
interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  return (
    // Usamos la clase landing-container que ya tiene el flexbox y el Zero Scroll centrado
    <div className="landing-container">
      
      {/* Hereda el degradado blanco a celeste y la fuente Outfit en tamaño clamp() */}
      <h1 className="title">
        Sintonía
      </h1>
      
      {/* Subtítulo minimalista adaptativo */}
      <h2 className="subtitle">
        Juego de preguntas para conectar
      </h2>
      
      {/* Botón con el degradado azul premium, sombras y sin emojis */}
      <button 
        onClick={onStart}
        className="btn-start"
      >
        COMENZAR
      </button>
      
    </div>
  );
}