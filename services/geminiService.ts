import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// Updated to use the requested high-quality model for better persona emulation
const MODEL_NAME = 'gemini-3-pro-preview';

export const generateHint = async (userQuery: string, factory: string): Promise<string> => {
  const prompt = `Eres Manuel, un jefe de taller experto. Un alumno te pide ayuda. Su pregunta es: '${userQuery}'. La estación es '${factory}'.
    
Tu tarea es decidir si la pregunta es 'Básica' (debería estar en sus apuntes de la presentación teórica) o 'Avanzada' (una duda práctica o compleja).

-   Considera 'Básica': Definiciones (¿qué es un capacitivo?), principios (¿cómo funciona un inductivo?), tipos (PNP/NPN), comparaciones directas (barrera vs difuso).
-   Considera 'Avanzada': Dificultades de aplicación (¿por qué falla con plástico negro brillante?), dudas muy específicas, o algo que no estaría en una introducción.

RESPONDE CON UNO DE ESTOS DOS FORMATOS EXACTOS:

1.  SI ES BÁSICA, escribe:
    Un momento... ¡esto me suena! Esta información es la base de la presentación teórica que os di. Consultar vuestros apuntes os ahorraría los puntos. Pero bueno, os ayudo...
    (Aquí tu pista de 1-2 frases)
    
2.  SI ES AVANZADA, escribe:
    Entendido. Es una buena pregunta. Aquí va la pista...
    (Aquí tu pista de 1-2 frases)
    
La pista debe guiarle, no darle la respuesta.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Lo siento, tengo problemas de conexión. Inténtalo de nuevo.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error al contactar con la IA. Inténtalo de nuevo.";
  }
};

export const chatWithBoss = async (
  userMessage: string,
  factory: string,
  currentQuestionText: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userMessage,
      config: {
        systemInstruction: `Eres Manuel, el Jefe de Taller de una fábrica industrial.
Estás supervisando a un grupo de estudiantes en prácticas en una simulación de chat.
Tu personalidad es: Experimentado, directo, profesional, obsesionado con la seguridad y la precisión, pero con un toque paternal 'duro' y un poco sarcástico a veces.
Estás "vivo", no eres un robot. Responde con naturalidad.

CONTEXTO ACTUAL:
- Estación de trabajo: ${factory}
- Pregunta actual del test que deben resolver: "${currentQuestionText}"

REGLAS DE INTERACCIÓN:
1. Responde a sus dudas o comentarios manteniendo tu personaje.
2. NO les des la respuesta correcta (A, B, C o D) directamente si te la piden. Diles que usen la cabeza o revisen los manuales.
3. Si su mensaje es un saludo o algo casual, responde acorde pero apremia a volver al trabajo.
4. Sé breve y conciso (máximo 2-3 frases).
5. IMPORTANTE: Si te piden explícitamente una "Pista", "Ayuda oficial" o dicen que están bloqueados, diles que escriban la palabra "PISTA" para activar el protocolo de ayuda (que les costará puntos). No les des la pista gratis en este chat.`,
      }
    });

    return response.text || "Mmm... no te he entendido. Vuelve al trabajo.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "La radio está fallando. Repite eso.";
  }
};

export const generateFinalReport = async (
  score: number,
  factory: string,
  summary: string
): Promise<string> => {
  const prompt = `Eres Manuel, jefe de taller, evaluando el informe final de un grupo. Sé directo, conciso y profesional. Habla en plural (vosotros).

DATOS FINALES DE LA SIMULACIÓN:
- PUNTUACIÓN FINAL (ya calculada): ${score} / 4
- Escenario: ${factory}
- Resumen de respuestas:
${summary}

TAREA: Genera un informe estructurado y bien redactado. Sigue estas reglas de formato AL PIE DE LA LETRA:
1.  Los títulos de sección DEBEN estar en mayúsculas y DEBEN incluir el emoji correspondiente (ej: "PUNTOS FUERTES 💪").
2.  El texto DENTRO de cada sección DEBE usar un caso de oración normal y profesional. Esto significa que la primera letra de cada frase (y después de un punto) debe empezar con mayúscula. El resto de la frase irá en minúsculas. NO escribas párrafos enteros en mayúsculas.
3.  Usa el siguiente formato OBLIGATORIO:
    PUNTUACIÓN FINAL: ${score} / 4
    PUNTOS FUERTES 💪: (Tu texto aquí, usando caso de oración normal. Menciona los aciertos)
    OPORTUNIDADES DE MEJORA 🛠️: (Tu texto aquí, usando caso de oración normal. Menciona los fallos)
    CONSEJO DEL JEFE 👨‍🔧: (Tu texto aquí, usando caso de oración normal)
4.  INCENTIVO: BASADO EN LA PUNTUACIÓN PROPORCIONADA, aplica ESTRICTAMENTE esta regla:
    - Si la puntuación es 4 (4 aciertos), añade: "Un trabajo impecable. Gracias a vuestra eficiencia, habéis ganado el bono. Os propondré para un ascenso. ¡Enhorabuena! 🚀".
    - Si la puntuación es 3 (3 aciertos), añade: "¡Muy buen trabajo! Casi perfecto. Habéis ganado un bono para el equipo. ¡Seguid así! 🏆".
    - Para cualquier otra puntuación, NO añadas ningún incentivo.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "No se pudo generar el informe final.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generando el informe.";
  }
};