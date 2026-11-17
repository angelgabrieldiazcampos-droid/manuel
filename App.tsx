import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender, MessageType, SimulationState } from './types';
import { FACTORY_DATA } from './data/factoryData';
import { EntryModal } from './components/EntryModal';
import { ChatBubble } from './components/ChatBubble';
import { MoodBar } from './components/MoodBar';
import { generateHint, generateFinalReport, chatWithBoss } from './services/geminiService';
import { sendRealTimeUpdate } from './services/formService';
import { uploadImageToDrive } from './services/uploadService';

const BOSS_AVATAR = "https://raw.githubusercontent.com/angelgabrieldiazcampos-droid/Classroom/main/Manuel.png";

export default function App() {
  const [state, setState] = useState<SimulationState>({
    isActive: false,
    group: "",
    factory: "",
    sessionId: "",
    mood: 3,
    stage: 0,
    userAnswers: [],
    answerCorrectness: [],
    isWaitingForAI: false,
    isWaitingForHintConfirmation: false,
    currentHintQuery: "",
    isFinished: false,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string | React.ReactNode, sender: Sender, type: MessageType = MessageType.Text) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random().toString(),
      sender,
      type,
      content,
      timestamp: Date.now()
    }]);
  };

  const handleStart = (group: string, factory: string) => {
    const sessionId = `${Date.now()}-${group.replace(/\s/g, '')}`;
    setState(prev => ({
      ...prev,
      isActive: true,
      group,
      factory,
      sessionId
    }));

    const station = FACTORY_DATA[factory];
    addMessage(station.introduction, Sender.Boss);

    setTimeout(() => {
      const firstQ = station.questions[0];
      addMessage(formatQuestion(firstQ), Sender.Boss);
    }, 2000);
  };

  const formatQuestion = (q: any) => {
    return `
      <div class="font-bold mb-2">${q.text}</div>
      <div class="ml-2 mb-1"><strong>A.</strong> ${q.options.A}</div>
      <div class="ml-2 mb-1"><strong>B.</strong> ${q.options.B}</div>
      <div class="ml-2 mb-1"><strong>C.</strong> ${q.options.C}</div>
      <div class="ml-2 mb-1"><strong>D.</strong> ${q.options.D}</div>
    `;
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Show loading indicator in boss chat
      setState(prev => ({ ...prev, isWaitingForAI: true }));
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        
        // 1. Show image in chat immediately
        addMessage(result, Sender.User, MessageType.Image);
        
        // 2. Upload to Drive (Real Evidence Storage)
        const filename = `${state.group}_${state.factory}_Q${state.stage + 1}_${Date.now()}.jpg`;
        let driveUrl = "No configurado";
        
        try {
           const uploadedUrl = await uploadImageToDrive(result, filename);
           if (uploadedUrl) {
             driveUrl = uploadedUrl;
             console.log("Imagen subida a Drive:", driveUrl);
           }
        } catch (err) {
           console.error("Error subiendo imagen", err);
        }

        // 3. Log to Google Form (Excel)
        // If upload worked, we send the URL. If not, we send [IMAGEN_LOCAL]
        const answerText = driveUrl.startsWith("http") ? `[FOTO: ${driveUrl}]` : `[IMAGEN_LOCAL_NO_SUBIDA]`;
        
        sendRealTimeUpdate({
          sessionId: state.sessionId,
          group: state.group,
          factory: state.factory,
          question: `Q${state.stage + 1}_EVIDENCE`,
          answer: answerText,
          score: '0' // Evidence doesn't score points directly usually, or maybe manual grading
        });

        // 4. Boss reaction
        setTimeout(() => {
           const bossMsg = driveUrl.startsWith("http") 
             ? "📸 Imagen recibida y archivada en el servidor central. Buen aporte." 
             : "📸 Imagen recibida. (Aviso: No se pudo subir a la nube, guardad copia local).";
             
           addMessage(bossMsg, Sender.Boss);
           setState(prev => ({ ...prev, isWaitingForAI: false }));
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || state.isWaitingForAI) return;
    
    const text = inputValue.trim();
    setInputValue("");
    addMessage(text, Sender.User);

    const normalizedAnswer = text.toUpperCase();

    // 1. Hint Confirmation Logic
    if (state.isWaitingForHintConfirmation) {
      if (['SI', 'SÍ', 'YES', 'S'].includes(normalizedAnswer)) {
        setState(prev => ({ ...prev, isWaitingForAI: true, isWaitingForHintConfirmation: false }));
        addMessage("Aceptado. Os costará 0,25 puntos. Déjame pensar...", Sender.Boss);
        
        sendRealTimeUpdate({
          sessionId: state.sessionId,
          group: state.group,
          factory: state.factory,
          question: `PISTA_Q${state.stage + 1}`,
          answer: 'Solicitó pista',
          score: '-0,25'
        });
        
        const newMood = Math.max(1, state.mood - 1);
        setState(prev => ({ ...prev, mood: newMood }));

        const hint = await generateHint(state.currentHintQuery, state.factory);
        addMessage(`👨‍🔧 <strong>Pista de Manuel:</strong> ${hint}`, Sender.Boss, MessageType.Hint);
        setState(prev => ({ ...prev, isWaitingForAI: false }));

      } else {
        setState(prev => ({ ...prev, isWaitingForHintConfirmation: false }));
        addMessage("Entendido. Continuad cuando estéis listos.", Sender.Boss);
      }
      return;
    }

    // 2. Answer Logic
    if (['A', 'B', 'C', 'D'].includes(normalizedAnswer)) {
       const currentQuestion = FACTORY_DATA[state.factory].questions[state.stage];
       const isCorrect = normalizedAnswer === currentQuestion.correct;
       const feedback = isCorrect ? currentQuestion.feedback_correct : currentQuestion.feedback_wrong;
       const score = isCorrect ? '1' : '0';

       const nextStage = state.stage + 1;
       const nextUserAnswers = [...state.userAnswers];
       nextUserAnswers[state.stage] = text;
       const nextCorrectness = [...state.answerCorrectness];
       nextCorrectness[state.stage] = isCorrect;
       
       const nextMood = isCorrect ? Math.min(5, state.mood + 1) : Math.max(1, state.mood - 1);

       setState(prev => ({
         ...prev,
         stage: nextStage,
         userAnswers: nextUserAnswers,
         answerCorrectness: nextCorrectness,
         mood: nextMood
       }));

       sendRealTimeUpdate({
         sessionId: state.sessionId,
         group: state.group,
         factory: state.factory,
         question: `Q${state.stage + 1}`,
         answer: text,
         score
       });

       addMessage(feedback, Sender.Boss);

       if (nextStage < 4) {
         setTimeout(() => {
            const nextQ = FACTORY_DATA[state.factory].questions[nextStage];
            addMessage(formatQuestion(nextQ), Sender.Boss);
         }, 2500);
       } else {
         setTimeout(() => {
           addMessage("Diagnóstico completo. Buen trabajo, equipo. Pulsa 'Finalizar y Enviar' para recibir el informe.", Sender.System);
           setState(prev => ({ ...prev, isFinished: true }));
         }, 1500);
       }
    } else {
      // 3. Conversational
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('pista') || lowerText.includes('ayuda') || lowerText.includes('socorro')) {
          setState(prev => ({ 
            ...prev, 
            isWaitingForHintConfirmation: true, 
            currentHintQuery: text 
          }));
          addMessage("Veo que pedís asistencia oficial. Puedo daros una pista, pero os costará **0,25 puntos** de la nota final. ¿Aceptáis? (Escribe 'Si' o 'No')", Sender.Boss);
      } else {
          setState(prev => ({ ...prev, isWaitingForAI: true }));
          try {
             const currentQ = FACTORY_DATA[state.factory].questions[state.stage];
             const response = await chatWithBoss(text, state.factory, currentQ.text);
             addMessage(response, Sender.Boss);
          } catch (e) {
             addMessage("Estoy ocupado supervisando otra línea. Inténtalo de nuevo.", Sender.System);
          } finally {
             setState(prev => ({ ...prev, isWaitingForAI: false }));
          }
      }
    }
  };

  const handleFinalize = async () => {
    setState(prev => ({ ...prev, isWaitingForAI: true }));
    
    const correctCount = state.answerCorrectness.filter(Boolean).length;
    
    let summary = "";
    const station = FACTORY_DATA[state.factory];
    station.questions.forEach((q, idx) => {
       summary += `Q${idx+1}: ${state.answerCorrectness[idx] ? 'Correcta' : 'Incorrecta'}. (Respuesta: '${state.userAnswers[idx] || 'N/A'}', Correcta: '${q.correct}')\n`;
    });

    const reportText = await generateFinalReport(correctCount, state.factory, summary);
    const reportHtml = formatFinalReport(reportText);
    addMessage(reportHtml, Sender.Boss, MessageType.Report);

    const workOrderHtml = generateWorkOrder(state.factory, state.group, correctCount, state.userAnswers, state.answerCorrectness);
    addMessage(workOrderHtml, Sender.System, MessageType.WorkOrder);

    await sendRealTimeUpdate({
      sessionId: state.sessionId,
      group: state.group,
      factory: state.factory,
      finalFeedback: reportText
    });

    addMessage("✅ Informe final registrado en servidor.", Sender.System);
    setState(prev => ({ ...prev, isWaitingForAI: false }));
  };

  // Generates a downloadable HTML file with the "Work Order" as legal evidence
  const downloadEvidence = () => {
    const correctCount = state.answerCorrectness.filter(Boolean).length;
    const workOrderContent = generateWorkOrder(state.factory, state.group, correctCount, state.userAnswers, state.answerCorrectness);
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Expediente - ${state.group}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; border: 1px solid #ccc; }
          .header { text-align: center; border-bottom: 2px solid #00897b; padding-bottom: 20px; margin-bottom: 20px; }
          .timestamp { color: #666; font-size: 0.9em; margin-bottom: 20px; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 8px; }
          .stamp { margin-top: 40px; text-align: center; border: 3px double #d32f2f; color: #d32f2f; display: inline-block; padding: 10px 20px; font-weight: bold; transform: rotate(-5deg); }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Expediente de Validación Técnica</h1>
          <h2>Simulador: Taller en Crisis</h2>
        </div>
        <div class="timestamp">
          <strong>Fecha:</strong> ${new Date().toLocaleString()}<br>
          <strong>ID Sesión:</strong> ${state.sessionId}
        </div>
        <div class="content">
          ${workOrderContent}
        </div>
        <div style="text-align:center;">
           <div class="stamp">DOCUMENTO DE EVIDENCIA<br>GENERADO AUTOMÁTICAMENTE</div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Evidencia_${state.group}_${new Date().toISOString().slice(0,10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFinalReport = (text: string) => {
    // ... (Existing formatting logic kept same)
    const parts = text.split(/PUNTOS FUERTES 💪:|OPORTUNIDADES DE MEJORA 🛠️:|CONSEJO DEL JEFE 👨‍🔧:/i);
    let html = `<div class="p-2"><h3 class="text-xl font-bold text-gray-800 mb-4 text-center border-b pb-2">INFORME DE EVALUACIÓN</h3>`;
    const scoreMatch = text.match(/PUNTUACIÓN FINAL: ([\d,.]+\s*\/\s*4)/i);
    if (scoreMatch) html += `<div class="text-center my-4"><p class="text-gray-600 text-sm font-medium">Puntuación Final</p><p class="text-5xl md:text-6xl font-bold text-teal-600">${scoreMatch[1].trim()}</p></div>`;
    if (parts.length > 1) {
       if (parts[1]?.trim()) html += `<div class="my-4"><h4 class="font-semibold text-lg text-green-700 flex items-center gap-2 mb-1">💪 PUNTOS FUERTES</h4><p class="text-gray-700 pl-2 border-l-2 border-green-200">${parts[1].trim().replace(/\n/g, '<br>')}</p></div>`;
       if (parts[2]?.trim()) html += `<div class="my-4"><h4 class="font-semibold text-lg text-orange-600 flex items-center gap-2 mb-1">🛠️ OPORTUNIDADES DE MEJORA</h4><p class="text-gray-700 pl-2 border-l-2 border-orange-200">${parts[2].trim().replace(/\n/g, '<br>')}</p></div>`;
       if (parts[3]?.trim()) html += `<div class="my-4"><h4 class="font-semibold text-lg text-blue-600 flex items-center gap-2 mb-1">👨‍🔧 CONSEJO DEL JEFE</h4><p class="text-gray-700 pl-2 border-l-2 border-blue-200">${parts[3].trim().replace(/\n/g, '<br>')}</p></div>`;
    } else {
        html += `<div class="whitespace-pre-wrap">${text}</div>`;
    }
    const incentiveMatch = text.match(/Un trabajo impecable.*|¡Muy buen trabajo!.*Casi perfecto.*/si);
    if (incentiveMatch) html += `<div class="mt-5 p-3 bg-amber-100 border-l-4 border-amber-500 rounded-r-lg shadow-inner"><p class="font-semibold text-amber-800">${incentiveMatch[0].trim()}</p></div>`;
    html += `</div>`;
    return html;
  };

  const generateWorkOrder = (factory: string, group: string, correctCount: number, answers: string[], correctness: boolean[]) => {
      const station = FACTORY_DATA[factory];
      let qHtml = "";
      station.questions.forEach((q, idx) => {
          const userAnswer = answers[idx] || "N/A";
          const isCorrect = correctness[idx];
          const icon = isCorrect ? '✅' : '❌';
          qHtml += `
            <div class="border-b pb-2 mb-2 last:border-0">
                <p class="font-semibold text-gray-800 text-sm">${q.text}</p>
                <p class="text-xs text-gray-600 mt-1">Tu respuesta: <span class="font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}">${icon} (${userAnswer})</span></p>
                <p class="text-xs text-blue-700">Respuesta Correcta: <span class="font-semibold">(${q.correct}) ${q.options[q.correct as keyof typeof q.options]}</span></p>
            </div>
          `;
      });
      return `
        <div class="p-2">
            <h3 class="text-xl font-bold text-gray-800 mb-2 text-center border-b pb-2">ORDEN DE TRABAJO</h3>
            <div class="text-sm mb-3 grid grid-cols-1 gap-1 bg-gray-50 p-2 rounded">
                <p><strong>Estación:</strong> ${factory}</p>
                <p><strong>Grupo:</strong> ${group}</p>
                <p><strong>Resultado:</strong> ${correctCount} de 4 respuestas correctas.</p>
            </div>
            <h4 class="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">Resumen de Verificación:</h4>
            ${qHtml}
            <div class="mt-4 text-center border-t pt-2">
                <p class="text-gray-700 font-semibold text-sm">Validado por:</p>
                <p class="text-teal-700 text-2xl font-bold italic" style="font-family: 'Brush Script MT', cursive;">Manuel</p>
                <p class="text-xs text-gray-500">(Jefe de Taller)</p>
            </div>
        </div>
      `;
  };

  if (!state.isActive) {
    return <EntryModal onStart={handleStart} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 md:p-6" style={{
        backgroundImage: `url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px'
    }}>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col h-[85vh] md:h-[800px] border border-gray-300 overflow-hidden backdrop-blur-sm bg-opacity-95">
        
        {/* Header */}
        <header className="bg-teal-700 text-white p-3 md:p-4 flex items-center gap-4 border-b border-teal-800 shadow-md z-10">
          <img src={BOSS_AVATAR} alt="Avatar Jefe" className="w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-sm" />
          <div>
            <h1 className="text-lg font-bold tracking-wide">Manuel Jefe</h1>
            <p className="text-xs text-teal-100 flex items-center gap-1">
               <span className={`w-2 h-2 rounded-full ${state.isWaitingForAI ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`}></span>
               {state.isWaitingForAI ? 'escribiendo...' : 'en línea'}
            </p>
          </div>
        </header>

        {/* Mood Bar */}
        <MoodBar mood={state.mood} />

        {/* Chat Window */}
        <main className="flex-1 p-4 overflow-y-auto flex flex-col gap-2 bg-[#e5ddd5] bg-opacity-30 relative scroll-smooth">
             {messages.map((msg) => (
               <ChatBubble key={msg.id} message={msg} />
             ))}
             <div ref={chatEndRef} />
        </main>

        {/* Input Area */}
        <footer className="bg-gray-100 p-3 md:p-4 border-t border-gray-200">
           {!state.isFinished ? (
               <div className="flex items-center gap-2">
                 
                 {/* Hidden Camera Input */}
                 <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                 />
                 
                 {/* Camera Button */}
                 <button 
                   onClick={handleImageClick}
                   disabled={state.isWaitingForAI}
                   className="text-gray-500 hover:text-teal-600 transition-colors p-2"
                   title="Enviar foto / evidencia"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                 </button>

                 <input 
                   type="text" 
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                   disabled={state.isWaitingForAI}
                   className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow shadow-inner"
                   placeholder="Escribe tu respuesta (A, B, C o D)..."
                 />
                 <button 
                   onClick={handleSendMessage}
                   disabled={state.isWaitingForAI || !inputValue.trim()}
                   className="bg-teal-600 text-white rounded-full p-3 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                 </button>
               </div>
           ) : (
               <div className="flex flex-col gap-2">
                 <button 
                   onClick={handleFinalize}
                   disabled={state.isWaitingForAI} 
                   className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 px-8 font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
                 >
                    {state.isWaitingForAI ? (
                        <>
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           <span>Evaluando...</span>
                        </>
                    ) : (
                        "Enviar Resultados"
                    )}
                 </button>

                 {!state.isWaitingForAI && (
                    <button 
                      onClick={downloadEvidence}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-8 font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Descargar Expediente (Justificante)
                    </button>
                 )}
               </div>
           )}
        </footer>
      </div>
    </div>
  );
}