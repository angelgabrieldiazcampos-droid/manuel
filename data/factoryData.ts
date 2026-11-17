import { FactoryDataMap } from '../types';

export const FACTORY_DATA: FactoryDataMap = {
  "Lácteos del Sur (Línea de Envasado)": {
    introduction: "De acuerdo, equipo. Estáis en Lácteos del Sur. La necesidad aquí es detectar el nivel de leche en los briks, que son de cartón, y también verificar las tapas. ¡Máxima concentración!",
    questions: [
      {
        text: "¿Para detectar el nivel de leche dentro de un brik de cartón desde el exterior, ¿cuál de estos sensores usarías preferentemente?",
        options: { A: "Sensor Óptico Detección de Color", B: "Sensor Inductivo", C: "Sensor Capacitivo", D: "Final de Carrera Mecánico" },
        correct: "C",
        feedback_correct: "¡Correcto! El sensor capacitivo es ideal para detectar niveles de líquidos o sólidos a través de paredes no metálicas como el cartón.",
        feedback_wrong: "Incorrecto. La respuesta era la C. El capacitivo es el único que puede 'ver' el nivel de líquido a través del cartón. Los inductivos solo ven metal y los ópticos se bloquearían por el envase."
      },
      {
        text: "Si el sensor Capacitivo se va a montar para detectar el nivel de leche, ¿qué afectaría más su detección?",
        options: { A: "La temperatura ambiente", B: "La humedad del aire", C: "El tipo de material del brik", D: "La luz ambiental" },
        correct: "C",
        feedback_correct: "¡Muy bien! El grosor y el material del brik (constante dieléctrica) son clave. Hay que ajustar la sensibilidad del sensor a ese material específico.",
        feedback_wrong: "No es correcto. Es la C. El sensor capacitivo debe calibrarse según el material que tiene que atravesar (el brik) para poder detectar el líquido que hay dentro."
      },
      {
        text: "El Sensor Óptico de Detección de Color se usa para verificar la correcta colocación de la tapa de color azul en el brik. ¿Qué ocurriría si la tapa es blanca?",
        options: { A: "No la detectaría en absoluto.", B: "La detectaría como un color diferente al azul.", C: "Su distancia de detección aumentaría.", D: "El sensor se averiaría." },
        correct: "B",
        feedback_correct: "¡Exacto! El sensor está calibrado para 'azul'. Si ve 'blanco', simplemente dará una señal de 'no azul', que es justo lo que queremos para detectar el error.",
        feedback_wrong: "Incorrecto, la respuesta es la B. El sensor de color está programado para un color específico. Si ve cualquier otro (como el blanco), informará que el color esperado (azul) no está."
      },
      {
        text: "¿Es necesario un reflector o un emisor/receptor separado para que el Sensor Óptico de Detección de Color funcione?",
        options: { A: "Sí, siempre.", B: "No, funciona por reflexión del propio objeto.", C: "Solo si el objeto es transparente.", D: "Depende de la distancia." },
        correct: "B",
        feedback_correct: "¡Perfecto! Es un sensor de tipo difuso. Emite luz y la 'lee' rebotada directamente en el objeto (la tapa) para analizar su color.",
        feedback_wrong: "Respuesta incorrecta. Es la B. Este tipo de sensor de color es difuso; la luz rebota en el propio objeto. No necesita un reflector (retrorreflectivo) ni un receptor separado (barrera)."
      }
    ]
  },
  "Motores A-Zul (Brazo Robótico)": {
    introduction: "Bien, equipo. Estamos en Motores A-Zul. Aquí el trabajo es de precisión. Necesitamos detectar carcasas metálicas y confirmar la posición de los brazos robóticos. ¡Vamos a ello!",
    questions: [
      {
        text: "Para detectar si la carcasa metálica del motor está en posición, ¿cuál es el principio de detección del Sensor Inductivo?",
        options: { A: "Cambio de luz.", B: "Variación de resistencia.", C: "Variación de campo magnético por metales.", D: "Cambio de capacidad eléctrica." },
        correct: "C",
        feedback_correct: "¡Correcto! El sensor inductivo crea un campo magnético. Cuando un metal se acerca, altera ese campo (corrientes de Foucault), y el sensor lo detecta.",
        feedback_wrong: "No. La respuesta es la C. Los sensores inductivos funcionan creando un campo magnético y detectando cómo los metales lo perturban."
      },
      {
        text: "Si el brazo robótico tiene un imán interno para indicar su posición final, ¿qué sensor de los dos es el adecuado?",
        options: { A: "Sensor Inductivo", B: "Sensor Efecto Hall", C: "RTD (Pt100)", D: "Final de Carrera Mecánico" },
        correct: "B",
        feedback_correct: "¡Eso es! El sensor de Efecto Hall está diseñado específicamente para detectar campos magnéticos, como los de un imán.",
        feedback_wrong: "Error. La respuesta es la B, Sensor Efecto Hall. Los inductivos detectan metal, pero el Efecto Hall detecta magnetismo, que es lo que tiene el imán."
      },
      {
        text: "El Sensor Inductivo, ¿puede detectar una pieza de plástico?",
        options: { A: "Sí, si está muy cerca.", B: "No, solo metales.", C: "Sí, si es de color oscuro.", D: "Sí, si el sensor tiene alta sensibilidad." },
        correct: "B",
        feedback_correct: "¡Exacto! Es su característica principal. Los inductivos solo detectan metales. Para plástico usaríamos un capacitivo o un óptico.",
        feedback_wrong: "Incorrecto. La respuesta es la B. Un sensor inductivo NUNCA detectará plástico, no importa lo cerca que esté o el color que tenga. Solo reacciona a los metales."
      },
      {
        text: "¿Cuál es una ventaja clave del Sensor Efecto Hall frente al Reed Switch para aplicaciones de alta velocidad?",
        options: { A: "Es más barato.", B: "Es más grande.", C: "No tiene partes móviles.", D: "Requiere menos alimentación." },
        correct: "C",
        feedback_correct: "¡Muy buena observación! Al ser de estado sólido (sin partes móviles), el Efecto Hall no sufre desgaste mecánico y puede conmutar millones de veces a gran velocidad.",
        feedback_wrong: "No, la clave es la C. El Reed Switch tiene una pequeña lámina metálica que se mueve. El Efecto Hall es electrónico, sin partes móviles, por lo que no se desgasta y es mucho más rápido."
      }
    ]
  },
  "Vinos Sierra Morena (Encapsuladora)": {
    introduction: "Estamos en Vinos Sierra Morena. Un cliente importante. Aquí la prioridad es la seguridad de las puertas de la maquinaria y el conteo fiable de botellas y cajas. ¡Al detalle!",
    questions: [
      {
        text: "Para asegurar que la puerta de la encajonadora está totalmente cerrada, ¿qué sensor actúa por contacto físico directo?",
        options: { A: "Sensor Óptico de Barrera", B: "Sensor Inductivo", C: "Final de Carrera Mecánico", D: "Sensor Capacitivo" },
        correct: "C",
        feedback_correct: "¡Correcto! El Final de Carrera Mecánico es el sensor de seguridad por excelencia para puertas. Requiere que la puerta lo 'pise' físicamente.",
        feedback_wrong: "No. La respuesta es la C. El Final de Carrera Mecánico es el único de la lista que requiere un contacto físico (una palanca, un pulsador) para activarse."
      },
      {
        text: "Si el Sensor Óptico de Barrera se usa para contar botellas, ¿qué elementos necesita para funcionar?",
        options: { A: "Un emisor y un espejo.", B: "Un reflector.", C: "Un solo cuerpo con emisor/receptor.", D: "Un emisor y un receptor separados." },
        correct: "D",
        feedback_correct: "¡Efectivamente! Un sensor de barrera consta de dos cuerpos: un emisor que lanza el haz de luz y un receptor que lo recoge al otro lado.",
        feedback_wrong: "Incorrecto. Es la D. Un sensor de 'barrera' necesita un emisor en un lado y un receptor en el otro. El que usa un espejo se llama 'retrorreflectivo'."
      },
      {
        text: "¿Es el Final de Carrera Mecánico un sensor de tipo activo que requiere alimentación constante para su funcionamiento básico?",
        options: { A: "Sí, siempre.", B: "No, actúa como un interruptor.", C: "Solo si es de corriente continua.", D: "Depende del modelo." },
        correct: "B",
        feedback_correct: "¡Muy bien! En esencia, un final de carrera es un interruptor pasivo. No necesita alimentación para 'funcionar', solo abre o cierra un contacto.",
        feedback_wrong: "Respuesta incorrecta. Es la B. Un final de carrera es un dispositivo pasivo, como un interruptor de la luz. No consume energía, solo abre o cierra un circuito."
      },
      {
        text: "En un ambiente con mucho polvo en suspensión, ¿qué sensor de los dos es menos propenso a dar falsas lecturas debido a la suciedad?",
        options: { A: "Sensor Óptico de Barrera", B: "Final de Carrera Mecánico", C: "Ambos por igual.", D: "Ninguno de los dos." },
        correct: "B",
        feedback_correct: "¡Lógica aplastante! Al Final de Carrera Mecánico le da igual el polvo, ya que funciona por contacto físico. El óptico podría fallar si el polvo bloquea el haz de luz.",
        feedback_wrong: "No... piénsalo bien. La respuesta es la B. El polvo puede ensuciar la lente del sensor óptico y bloquear el haz. Al final de carrera no le afecta el polvo."
      }
    ]
  },
  "PACSA (Línea de Pesado)": {
    introduction: "Vale, equipo, estamos en PACSA. Esto es crítico. Aquí pesan tornillería, por lo que necesitamos una medición de peso muy precisa y, además, detectar posibles metales. ¡Vamos allá!",
    questions: [
      {
        text: "El Transductor de Presión en la báscula, ¿convierte el peso en qué tipo de señal eléctrica?",
        options: { A: "Solo ON/OFF.", B: "Una señal analógica proporcional (ej. 4-20mA).", C: "Una señal de temperatura.", D: "Un pulso digital." },
        correct: "B",
        feedback_correct: "¡Perfecto! El Transductor o célula de carga da una señal analógica (como 4-20mA o 0-10V) que nos dice *cuánto* pesa, no solo si *hay* peso.",
        feedback_wrong: "Incorrecto. Es la B. Un transductor da una señal analógica (variable) proporcional al peso. Una señal ON/OFF solo diría 'hay peso' o 'no hay peso'."
      },
      {
        text: "Para detectar la caída de tornillos metálicos en la bolsa, ¿qué sensor de los dos es el adecuado?",
        options: { A: "Transductor de Presión", B: "Sensor Inductivo", C: "RTD (Pt100)", D: "Sensor Capacitivo" },
        correct: "B",
        feedback_correct: "¡Eso es! Para detectar metales (los tornillos), el Sensor Inductivo es la herramienta perfecta.",
        feedback_wrong: "Error. Es la B. El Sensor Inductivo es el especialista en detectar metales. El transductor mide el peso total, no los tornillos individuales."
      },
      {
        text: "¿Se vería afectada la detección del Sensor Inductivo si los tornillos fueran de plástico en lugar de metal?",
        options: { A: "No, los detecta igual.", B: "Sí, dejaría de detectarlos.", C: "Aumentaría su distancia de detección.", D: "Sólo si el plástico es de color oscuro." },
        correct: "B",
        feedback_correct: "¡Correcto! Un inductivo solo 've' metales. Si los tornillos fueran de plástico, el sensor no se enteraría.",
        feedback_wrong: "Incorrecto. La respuesta es la B. El principio de funcionamiento del sensor inductivo se basa en la alteración de un campo magnético por un metal. El plástico no le afecta."
      },
      {
        text: "¿Cuál es la función principal del Transductor de Presión en la báscula de PACSA?",
        options: { A: "Activar una alarma si la bolsa se cae.", B: "Detectar la presencia de la bolsa.", C: "Medir con precisión el peso de la tornillería.", D: "Calentar el contenido de la bolsa." },
        correct: "C",
        feedback_correct: "¡Exactamente! Su función es la de una báscula de precisión: medir el peso (fuerza/presión) para asegurar que la cantidad de tornillos es la correcta.",
        feedback_wrong: "Incorrecto. La C es la respuesta. El Transductor de Presión actúa como una célula de carga, su única misión es medir el peso con precisión."
      }
    ]
  },
  "Logística Sur-Ex (Transportador Almacenaje)": {
    introduction: "Última parada: Logística Sur-Ex. Aquí tenemos un gran transportador. Hay que vigilar la temperatura de los motores y detectar los paquetes que van por la cinta. ¡A por ello!",
    questions: [
      {
        text: "El RTD (Pt100) se usa para medir la temperatura del motor. ¿Es un sensor de tipo pasivo (no genera su propia señal)?",
        options: { A: "Sí, genera voltaje.", B: "No, es un sensor activo.", C: "Solo si es de 2 hilos.", D: "Verdadero, es pasivo." },
        correct: "D",
        feedback_correct: "¡Correcto! Es pasivo (D). Una RTD es una resistencia que varía con la temperatura. Necesita una fuente externa que mida esa variación.",
        feedback_wrong: "Incorrecto. La respuesta es la D. Un RTD o Pt100 es pasivo; es una resistencia variable. No genera voltaje por sí mismo (eso sería un termopar)."
      },
      {
        text: "El Sensor Óptico Difuso se utiliza para detectar paquetes en el transportador. ¿Necesita un reflector para su funcionamiento?",
        options: { A: "Sí, siempre.", B: "No, el propio paquete es el reflector.", C: "Solo si el paquete es transparente.", D: "Solo si la distancia es muy grande." },
        correct: "B",
        feedback_correct: "¡Eso es! Un sensor difuso emite luz y espera que rebote en el primer objeto que se cruce, en este caso, el paquete.",
        feedback_wrong: "No, la respuesta es la B. Se llama 'difuso' porque la luz se refleja de forma difusa en el propio objeto. No necesita un reflector (espejo)."
      },
      {
        text: "Si el RTD (Pt100) tiene una conexión de 4 hilos, ¿cuál es su principal ventaja?",
        options: { A: "Es más barato.", B: "Mayor precisión en la lectura de temperatura.", C: "Se puede conectar a más distancia.", D: "Consume menos energía." },
        correct: "B",
        feedback_correct: "¡Muy bien! Los 4 hilos permiten compensar totalmente la resistencia de los propios cables, dando la lectura de temperatura más precisa posible.",
        feedback_wrong: "La respuesta correcta es la B. Usar 4 hilos permite al medidor anular completamente la resistencia añadida por el cable, consiguiendo una precisión mucho mayor."
      },
      {
        text: "Si los paquetes en la cinta de Logística Sur-Ex son de plástico negro muy brillante, ¿podría el Sensor Óptico Difuso tener dificultades para detectarlos consistentemente?",
        options: { A: "No, los detecta sin problema.", B: "Sí, el brillo puede dispersar la luz y dificultar la detección.", C: "Solo si el sensor está muy sucio.", D: "Solo si el paquete es muy pequeño." },
        correct: "B",
        feedback_correct: "¡Excelente análisis! Es la B. El plástico negro absorbe luz y el brillo la refleja en ángulos extraños. Ambas cosas dificultan la detección para un sensor difuso.",
        feedback_wrong: "Es la B. Los sensores difusos sufren con objetos muy oscuros (absorben la luz) o muy brillantes (la reflejan en ángulos incorrectos). Sería un problema."
      }
    ]
  }
};
