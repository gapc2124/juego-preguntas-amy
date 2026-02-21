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
  { id: 'b4', text: "¿Qué fue lo que más te atrajo de la verdad cuando eras más pequeña?", deckId: '3' },
  { id: 'b5', text: "¿Qué es lo que más te gusta de tu congregación actual?", deckId: '3' },
  { id: 'b6', text: "¿Alguna vez sentiste que Jehová respondió una oración de forma muy específica?", deckId: '3' },
  { id: 'b7', text: "Si pudieras tomar un café con alguien de la Biblia, ¿con quién sería?", deckId: '3' },
  { id: 'b8', text: "¿Qué animal del nuevo mundo te mueres por acariciar?", deckId: '3' },
  { id: 'b9', text: "¿Qué cualidad cristiana sientes que has mejorado más este último año?", deckId: '3' },
  { id: 'b10', text: "¿Cuál es la cualidad que más te gustaría seguir puliendo?", deckId: '3' },
  { id: 'b11', text: "¿Cuál es la parte más difícil de prestar atención en una reunión?", deckId: '3' },
  { id: 'b12', text: "¿Cuál es tu libro de la Biblia favorito?", deckId: '3' },
  { id: 'b13', text: "¿Cuál es el libro de la Biblia que más te cuesta leer?", deckId: '3' },
  { id: 'b14', text: "¿Has tenido que dejar algo atrás por ser cristiana?", deckId: '3' },
  { id: 'b15', text: "¿Qué parte de la reunión te parece más entretenida?", deckId: '3' },
  { id: 'b16', text: "¿Qué personaje bíblico crees que se sorprenderá más al ver todo lo que pasó hasta el paraíso?", deckId: '3' },
  { id: 'b17', text: "¿Qué personaje bíblico te sorprendería que resucitara?", deckId: '3' },
  { id: 'b18', text: "¿Qué es lo que más te enorgullece de ser testigo de Jehová?", deckId: '3' },
  { id: 'b19', text: "¿Qué consejo bíblico sobre el amor es el que más te gusta aplicar con nosotros?", deckId: '3' },

  // --- Conocimiento (ID: 1) ---
  { id: 'c1', text: "¿Cuál es su recuerdo favorito de nosotros dos?", deckId: '1' },
  { id: 'c2', text: "Si pudiera comer solo una cosa el resto de su vida, ¿qué sería?", deckId: '1' },
  { id: 'c3', text: "¿Cuál es su sabor de helado 'infalible' (el que siempre pide)?", deckId: '1' },
  { id: 'c4', text: "¿Tu pareja prefiere un café bien cargado o un té relajante?", deckId: '1' },
  { id: 'c5', text: "¿Cuál es la comida que tu pareja detesta con todo su ser?", deckId: '1' },
  { id: 'c6', text: "¿Quién es más probable que pierda las llaves de la casa?", deckId: '1' },
  { id: 'c7', text: "¿Quién es más propenso a llorar viendo una película romántica?", deckId: '1' },
  { id: 'c8', text: "¿Quién es más 'renegón/renegona' cuando tiene hambre?", deckId: '1' },
  { id: 'c9', text: "¿Quién es más sociable?", deckId: '1' },
  { id: 'c10', text: "¿Quién es más fiester@?", deckId: '1' },
  { id: 'c11', text: "¿Quién es más miedoso con los insectos?", deckId: '1' },
  { id: 'c12', text: "¿Quién es más propenso a quedarse dormido mientras ven una serie?", deckId: '1' },
  { id: 'c13', text: "¿Quién de los dos es más impaciente cuando hay tráfico?", deckId: '1' },
  { id: 'c14', text: "¿A qué hora se despierta normalmente tu pareja si no pone alarma?", deckId: '1' },
  { id: 'c15', text: "¿Cuál es la red social en la que tu pareja pasa más tiempo?", deckId: '1' },
  { id: 'c16', text: "¿Qué parte de una casa tu pareja diseñaría primero?", deckId: '1' },
  { id: 'c17', text: "¿Quién es el más interesad@ en el matrimonio?", deckId: '1' },
  { id: 'c18', text: "¿Cuál es el tipo de beso que más hace feliz a tu pareja?", deckId: '1' },
  { id: 'c19', text: "¿Qué parte de tu cuerpo es la que tu pareja considera más atractiva?", deckId: '1' },
  { id: 'c20', text: "¿Cuál es el 'lenguaje del amor' predominante de tu pareja?", deckId: '1' },
  { id: 'c21', text: "¿Cuál es el tipo de abrazo que más feliz hace a tu pareja?", deckId: '1' },
  { id: 'c22', text: "¿Qué caricia tuya es la que más relaja a tu pareja después de un día estresante?", deckId: '1' },
  { id: 'c23', text: "¿Cuál es el 'topping' de pizza que tu pareja siempre pide y el que jamás aceptaría?", deckId: '1' },
  { id: 'c24', text: "¿Cuál es el videojuego favorito de tu pareja?", deckId: '1' },
  { id: 'c25', text: "¿Cuál es la serie favorita de tu pareja?", deckId: '1' },
  { id: 'c26', text: "¿Cuál es la película favorita de tu pareja?", deckId: '1' },
  { id: 'c27', text: "¿Tu pareja prefiere cine o peli en casa?", deckId: '1' },
  { id: 'c28', text: "¿Cuál es el miedo más 'absurdo' o gracioso que tiene tu pareja?", deckId: '1' },
  { id: 'c29', text: "¿Quién es más probable que olvide dónde dejó el celular?", deckId: '1' },
  { id: 'c30', text: "¿Quién es más ahorrador?", deckId: '1' },
  { id: 'c31', text: "¿Quien es más propenso a endeudarse?", deckId: '1' },
  { id: 'c32', text: "¿Quién es más probable que se ponga a cantar en medio de la sala?", deckId: '1' },
  { id: 'c33', text: "¿Cuál es la frase que tu pareja repite cuando está bromeando?", deckId: '1' },
  { id: 'c34', text: "¿Qué es lo que más le asusta a tu pareja de vivir juntos después de casarnos?", deckId: '1' },
  { id: 'c35', text: "¿Quién es más capaz de tirarse un gas en público?", deckId: '1' },
  { id: 'c36', text: "¿Quién es más asquient@?", deckId: '1' },
  { id: 'c37', text: "¿A que país le gustaría ir a vivir a tu pareja?", deckId: '1' },
  { id: 'c38', text: "¿Qué es lo que tu pareja encuentra más 'tierno' de tu forma de ser?", deckId: '1' },
  { id: 'c39', text: "¿A Quién le gusta dar más afecto en público?", deckId: '1' },

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