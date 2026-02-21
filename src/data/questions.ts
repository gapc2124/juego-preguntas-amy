// src/data/questions.ts

// 1. Definimos la metadata de las barajas (Colores e Iconos) para reusarla
export const deckMetadata: Record<string, { title: string, color: string, icon: string }> = {
  '1': { title: 'Conocimiento', color: '#4285F4', icon: 'help' },
  '2': { title: 'Íntimo', color: '#EA4335', icon: 'favorite' },
  '3': { title: 'Bíblico', color: '#FBBC04', icon: 'menu_book' }, // Dorado para lo espiritual
  '4': { title: 'Familiar', color: '#34A853', icon: 'family_restroom' },
  '5': { title: 'Emocional', color: '#A142F4', icon: 'psychology' },
  '6': { title: 'Random', color: '#FF6D00', icon: 'casino' },
  '7': { title: 'Rápidas', color: '#00ACC1', icon: 'bolt' },
};

// 2. Definimos la estructura de una Pregunta
export interface Question {
  id: string;
  text: string;
  deckId: string; // ¡La clave! Esto une la pregunta con su color
}

// 3. El banco de preguntas unificado (He incluido ejemplos para todas las categorías)
export const allQuestions: Question[] = [
  // --- Bíblico (ID: 3) ---
  { id: 'b1', text: "¿Cuál es el texto bíblico que más te ha consolado en momentos difíciles?", deckId: '3' },
  { id: 'b2', text: "Cuéntame una experiencia en el ministerio que haya fortalecido tu fe.", deckId: '3' },
  { id: 'b3', text: "¿Qué cualidad espiritual admiras más en mí y por qué?", deckId: '3' },
  
  // --- Conocimiento (ID: 1) ---
  { id: 'c1', text: "¿Cuál es mi recuerdo favorito de nosotros dos?", deckId: '1' },
  { id: 'c2', text: "Si pudiera comer solo una cosa el resto de mi vida, ¿qué sería?", deckId: '1' },

  // --- Íntimo (ID: 2) ---
  { id: 'i1', text: "¿Qué es lo que más te hace sentir amado/a por mí?", deckId: '2' },
  { id: 'i2', text: "¿Hay algo que te preocupe de nuestra relación que no hayamos hablado?", deckId: '2' },

  // --- Familiar (ID: 4) ---
  { id: 'f1', text: "¿Qué es lo que más valoras de la educación que te dieron tus padres?", deckId: '4' },

  // --- Emocional (ID: 5) ---
  { id: 'e1', text: "¿Cuál es tu mayor miedo respecto al futuro?", deckId: '5' },
  { id: 'e2', text: "¿Cuándo fue la última vez que lloraste de felicidad?", deckId: '5' },

  // --- Random (ID: 6) ---
  { id: 'r1', text: "Si tuvieras que vivir en una película, ¿cuál elegirías?", deckId: '6' },

  // --- Rápidas (ID: 7) ---
  { id: 'qp1', text: "¿Playa o montaña?", deckId: '7' },
  { id: 'qp2', text: "¿Madrugar o trasnochar?", deckId: '7' },
];