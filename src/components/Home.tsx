// src/components/Home.tsx
interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  return (
    <div className="landing-container">
      <h1 className="title">Sintonía</h1>
      <h2 className="subtitle">Juego de preguntas para parejas, amigos y familia</h2>
      <button className="btn-start" onClick={onStart}>
        ¡Comencemos!
      </button>
    </div>
  )
}