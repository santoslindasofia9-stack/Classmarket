'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Wallet, 
  ChevronRight, 
  MoreVertical, 
  Pencil, 
  FileText, 
  Send,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Deliverable {
  id: string;
  text: string;
}

interface Message {
  id: string;
  sender: 'client' | 'pro';
  text: string;
  time: string;
  type?: 'text' | 'event';
  eventData?: {
    title: string;
    amount: string;
  };
}

interface AdvancedNegotiationViewProps {
  expertData: {
    nombre_completo: string;
    foto_perfil: string;
    proyecto?: string;
  };
}

export default function AdvancedNegotiationView({ expertData }: AdvancedNegotiationViewProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [budget, setBudget] = useState(15.00);
  const [totalAgreed, setTotalAgreed] = useState(18.00);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'client',
      text: '¡Hola! Vi tu perfil de tutorías de Matemáticas. Necesito apoyo con 5 ejercicios de cálculo diferencial y preparación para el parcial del viernes.',
      time: '10:42 AM'
    },
    {
      id: '2',
      sender: 'pro',
      text: '¡Hola! Claro que sí, con gusto te ayudo. Te propongo una sesión virtual de 1 hora y media más el PDF con los ejercicios resueltos paso a paso por $18. ¿Te parece bien?',
      time: '10:45 AM'
    },
    {
      id: '3',
      sender: 'client',
      text: 'Entiendo perfectamente. El 15% adicional me parece justo si incluimos también las plantillas para Instagram Stories. ¿Podemos cerrar el trato con esos términos?',
      time: '11:05 AM'
    },
    {
      id: '4',
      sender: 'pro',
      text: '¡Claro que sí! Incluiré 3 plantillas editables para Stories. Voy a actualizar los términos ahora mismo para que los revises.',
      time: '11:10 AM'
    },
    {
      id: '5',
      sender: 'client',
      text: 'Genial, quedo a la espera de la propuesta formal para proceder con el pago.',
      time: '11:12 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [activeMessageMenu, setActiveMessageMenu] = useState<string | null>(null);

  const deliverables: Deliverable[] = [
    { id: '1', text: '3 Propuestas iniciales' },
    { id: '2', text: 'Manual de marca (PDF)' },
    { id: '3', text: '5 Assets para Social Media' }
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'client',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleDeleteMessage = (id: string, type: 'me' | 'all') => {
    if (type === 'all') {
      setMessages(messages.map(m => m.id === id ? { ...m, text: '🚫 Este mensaje fue eliminado', type: 'text' } : m));
    } else {
      setMessages(messages.filter(m => m.id !== id));
    }
    setActiveMessageMenu(null);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Columna Izquierda: Panel de Control de Contrato (30%) */}
      <aside className="hidden lg:flex w-[30%] flex-col border-r border-gray-100 bg-white p-6 overflow-y-auto">
        {/* Header de Perfil */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <img 
              src={expertData.foto_perfil} 
              alt={expertData.nombre_completo} 
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-50"
            />
            <div>
              <h2 className="font-bold text-gray-900 text-sm">{expertData.nombre_completo}</h2>
              <p className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider">
                {expertData.proyecto || 'Proyecto: Identidad Visual'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tarjeta de Presupuesto Propuesto */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Wallet className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Presupuesto Propuesto</span>
            </div>
            
            {isEditing ? (
              <input 
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="text-3xl font-bold text-gray-900 w-full border-b border-blue-200 focus:outline-none bg-transparent"
                autoFocus
              />
            ) : (
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                ${budget.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm font-medium text-gray-400">USD</span>
              </h3>
            )}

            <div className="mt-6 flex items-center justify-between">
              <span className="px-3 py-1 bg-[#E1F5FE] text-[#01579B] text-[10px] font-bold rounded-full">
                EN NEGOCIACIÓN
              </span>
              <span className="text-[10px] text-gray-400 font-medium">hace 12 min</span>
            </div>
          </motion.div>

          {/* Sección Detalles del Contrato */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Detalles del Contrato</h4>
            
            {/* Bloque de Servicio Principal */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 transition-colors cursor-pointer">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Servicio Principal</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-800">Diseño de Logotipo & Identidad</p>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>

            {/* Bloque de Entregables */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-3">Entregables</p>
              <ul className="space-y-3">
                {deliverables.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                    <span className="text-xs text-gray-600 font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tarjeta de Total Acordado (Navy & Gold) */}
          <motion.div 
            layout
            className="mt-auto bg-[#FAF8F5] border border-[#C5A059]/40 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-[#0B2545] uppercase tracking-widest">Total Acordado</span>
              <Info className="w-4 h-4 text-[#C5A059]" />
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0B2545]">
                ${totalAgreed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-semibold text-[#5C6B73]">USD</span>
            </div>
            <p className="text-[10px] text-[#5C6B73] font-medium italic mt-1">
              Incluye garantía y soporte académico
            </p>
          </motion.div>
        </div>
      </aside>

      {/* Columna Derecha: Flujo de Mensajes y Barra de Acciones (70%) */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#F8FAFC]">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="font-bold text-sm">{expertData.nombre_completo}</h1>
          </div>
          <button className="text-blue-600 font-bold text-xs uppercase">Detalles</button>
        </div>

        {/* Área de Mensajes */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-20 py-8 space-y-8 scrollbar-hide">
          {/* Separador Hoy */}
          <div className="flex justify-center sticky top-0 z-10 pb-4">
            <span className="bg-white/80 backdrop-blur-md px-5 py-1.5 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] shadow-sm border border-gray-50">
              Hoy
            </span>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.type === 'event' ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-center my-10"
                    >
                      <div className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl px-10 py-6 text-center shadow-sm max-w-lg">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2">
                          {msg.eventData?.title}
                        </p>
                        <p className="text-xs font-semibold text-gray-600 italic mb-4">
                          {msg.text}
                        </p>
                        <div className="flex items-center justify-center gap-4">
                          <div className="h-[1px] w-12 bg-gray-100" />
                          <span className="text-xl font-black text-blue-600">{msg.eventData?.amount}</span>
                          <div className="h-[1px] w-12 bg-gray-100" />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, x: msg.sender === 'client' ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.sender === 'client' ? 'justify-start' : 'justify-end'} group`}
                    >
                      <div className={`max-w-[85%] lg:max-w-[70%] p-5 rounded-2xl shadow-sm relative group/msg ${
                        msg.sender === 'client' 
                          ? 'bg-[#E3F2FD]/80 text-gray-800 rounded-bl-none border border-[#BBDEFB]/30' 
                          : 'bg-white text-gray-800 rounded-br-none border border-slate-200 ring-1 ring-slate-100'
                      }`}>
                        <p className={`text-sm lg:text-[15px] leading-relaxed font-medium ${msg.text.includes('eliminado') ? 'opacity-40 italic' : ''}`}>
                          {msg.text}
                        </p>
                        <div className={`flex items-center gap-1 mt-3 opacity-40 text-[10px] font-bold ${msg.sender === 'client' ? '' : 'justify-end'}`}>
                          <span>{msg.time}</span>
                          {msg.sender === 'pro' && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                        </div>

                        {/* Menu de eliminación */}
                        <div className={`absolute top-2 ${msg.sender === 'client' ? '-right-10' : '-left-10'} opacity-0 group-hover/msg:opacity-100 transition-opacity`}>
                          <button 
                            onClick={() => setActiveMessageMenu(activeMessageMenu === msg.id ? null : msg.id)}
                            className="p-1.5 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-gray-600 shadow-sm"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <AnimatePresence>
                          {activeMessageMenu === msg.id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: -10 }}
                              className={`absolute z-50 top-10 ${msg.sender === 'client' ? 'right-0' : 'left-0'} bg-white border border-gray-100 rounded-xl shadow-xl p-1 min-w-[140px]`}
                            >
                              <button 
                                onClick={() => handleDeleteMessage(msg.id, 'me')}
                                className="w-full text-left px-3 py-2 text-[11px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                Eliminar para mí
                              </button>
                              <button 
                                onClick={() => handleDeleteMessage(msg.id, 'all')}
                                className="w-full text-left px-3 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                Eliminar para todos
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Barra de Herramientas de Oferta (Flotante Abajo) */}
        <div className="absolute bottom-24 left-0 right-0 px-6 lg:px-20 pointer-events-none">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-2xl mx-auto bg-white/95 backdrop-blur-xl border border-gray-100 rounded-full p-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.08)] flex items-center gap-2 pointer-events-auto"
          >
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-full font-bold text-xs transition-all ${
                isEditing ? 'bg-[#0B2545] text-[#C5A059]' : 'bg-[#FAF8F5] text-[#0B2545] border border-[#C5A059]/40 hover:bg-[#C5A059]/15'
              }`}
            >
              <Pencil className="w-4 h-4 text-[#C5A059]" />
              <span>{isEditing ? 'GUARDAR CAMBIOS' : 'AJUSTAR PRESUPUESTO'}</span>
            </button>
            
            <Link 
              href="/confirmacion-contrato"
              className={`flex-[3] flex items-center justify-center gap-3 bg-[#0B2545] text-white h-12 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#134074] shadow-lg shadow-[#0B2545]/15 transition-all active:scale-95 border border-[#C5A059]/40`}
            >
              <FileText className="w-4 h-4 text-[#C5A059]" />
              <span>Enviar Términos y Condiciones</span>
            </Link>
          </motion.div>
        </div>

        {/* Input de Mensaje (Fijo en el fondo inferior) */}
        <div className="bg-white border-t border-gray-50 p-4 lg:p-6 pb-8 lg:pb-10">
          <input type="file" id="advanced-attach" className="hidden" />
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className="flex-1 relative">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe una contraoferta o mensaje..."
                className="w-full bg-[#F8FAFC] border border-gray-100 rounded-full px-8 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#0B2545]/10 focus:border-[#0B2545]/20 transition-all placeholder:text-gray-400 shadow-inner"
              />
            </div>
            <button 
              onClick={handleSendMessage}
              className="bg-[#0B2545] w-14 h-14 rounded-full flex items-center justify-center text-[#C5A059] shadow-lg shadow-[#0B2545]/20 hover:bg-[#134074] hover:scale-105 active:scale-95 transition-all border border-[#C5A059]/30"
            >
              <Send className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
        

        {/* Overlay de Generación de IA */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
                <div className="relative bg-white p-5 rounded-full shadow-lg border border-blue-50 flex items-center justify-center">
                  <div className="material-symbols-outlined text-3xl text-blue-500 animate-spin">hub</div>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Redactando Contrato Legal con IA</h2>
              <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
                Estamos procesando los acuerdos de esta conversación para generar un contrato inteligente vinculante.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
