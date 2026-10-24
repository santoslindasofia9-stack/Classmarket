'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  HelpCircle, 
  MoreVertical, 
  PlusCircle, 
  Smile, 
  Send, 
  Download, 
  FileText,
  Calendar,
  ShieldCheck,
  Check,
  CheckCheck,
  Home,
  Inbox,
  ShoppingBag,
  User,
  Trash2,
  Wallet,
  Search,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  sender_id: string;
  text: string;
  created_at: string;
  is_expert: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ChatInterfaceProps {
  expertId: string;
  negotiationId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expertData?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentUser?: any;
}

interface Attachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export default function ChatInterface({ expertId: propExpertId, negotiationId, expertData, currentUser }: ChatInterfaceProps) {
  const router = useRouter();
  
  // Obtener el ID del experto de forma segura
  const expertId = propExpertId || (expertData?.id as string) || negotiationId?.replace('neg_', '') || '';

  const getInitialOffer = () => {
    if (expertId === "job1") {
      return {
        amount: 18.00,
        description: 'Tutoría de Matemáticas & Taller de Álgebra - Preparación para parcial.',
        duration: '2 días',
        status: 'pending'
      };
    }
    if (expertId === "job2") {
      return {
        amount: 15.00,
        description: 'Tutoría de Física y Cinemática - Resolución de 8 problemas de examen.',
        duration: '24 horas',
        status: 'pending'
      };
    }
    if (expertId === "job3") {
      return {
        amount: 14.00,
        description: 'Revisión y Estructuración de Ensayo Académico con Citas APA.',
        duration: '3 días',
        status: 'pending'
      };
    }
    return {
      amount: 18.00,
      description: 'Tutoría personalizada y resolución de guía académica con acompañamiento de dudas.',
      duration: '2 días',
      status: 'pending'
    };
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [offer, setOffer] = useState(getInitialOffer);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userRole, setUserRole] = useState('client');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole') || 'client');
  }, []);

  // Filter for phone numbers and emails
  const filterContactInfo = (text: string) => {
    const phoneRegex = /(\+?\d{1,4}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/g;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    
    let filtered = text;
    if (phoneRegex.test(text) || emailRegex.test(text)) {
      filtered = text.replace(phoneRegex, '[NÚMERO BLOQUEADO POR SEGURIDAD]');
      filtered = filtered.replace(emailRegex, '[CORREO BLOQUEADO POR SEGURIDAD]');
    }
    return filtered;
  };

  useEffect(() => {
    if (expertId) {
      localStorage.setItem('currentExpertId', expertId);
    }
    if (expertData) {
      localStorage.setItem('currentExpertName', (expertData.nombre_completo as string) || 'Profesional');
      localStorage.setItem('currentExpertAvatar', (expertData.foto_perfil as string) || '');
    }
  }, [expertId, expertData]);

  // PDF Generation & Download Helper
  const handleDownloadPdf = (fileName: string = 'Guia_Estudio_ClassMarket.pdf') => {
    const tutorName = (expertData?.nombre_completo as string) || 'Tutor Académico';
    const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    const docContent = `%PDF-1.4
%âãÏÓ
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [ 3 0 R ] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [ 0 0 595 842 ] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 380 >>
stream
BT
/F1 18 Tf
50 760 Td
(CLASSMARKET ESTUDIANTIL - GUIA ACADEMICA Y ACUERDO) Tj
/F1 11 Tf
0 -36 Td
(Documento oficial de entrega y guia de estudio) Tj
0 -22 Td
(Tutor: ${tutorName}) Tj
0 -20 Td
(Materia: Matematicas & Taller de Algebra) Tj
0 -20 Td
(Valor Acordado: $18.00 USD con Deposito en Garantia Escrow) Tj
0 -20 Td
(Ciudad: Bucaramanga, Santander) Tj
0 -25 Td
(Contenido verificado por la comunidad estudiantil de ClassMarket.) Tj
0 -20 Td
(Valido para constancia academica y garantia de satisfaccion.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000068 00000 n 
0000000130 00000 n 
0000000257 00000 n 
0000000329 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
750
%%EOF`;

    const blob = new Blob([docContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = cleanFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    // Initial messages (mock or fetch)
    let initialMessages: Message[] = [];

    if (expertId === "job1" || expertId === "f1" || expertId === "e1") {
      initialMessages = [
        {
          id: '1',
          sender_id: 'expert_id',
          text: '¡Hola! He aceptado tu solicitud para la "Tutoría de Matemáticas & Taller de Álgebra". ¿Cómo estás? Me gustaría saber qué temas específicos necesitas repasar para preparar el parcial.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_expert: true
        },
        {
          id: '2',
          sender_id: (currentUser?.id as string),
          text: '¡Hola! Excelente, muchas gracias. Necesito apoyo con 8 ejercicios de ecuaciones diferenciales y matrices. El presupuesto es de $18 USD. ¿Podemos incluir una guía con ejercicios resueltos?',
          created_at: new Date(Date.now() - 3000000).toISOString(),
          is_expert: false
        },
        {
          id: '3',
          sender_id: 'expert_id',
          text: '¡Claro que sí! Te preparo la guía en PDF con el paso a paso detallado y resolvemos todas las dudas en la sesión virtual. Te adjunto el borrador inicial de la guía para que lo revises.',
          created_at: new Date(Date.now() - 2400000).toISOString(),
          is_expert: true,
          attachment: {
            name: 'Guia_Matematicas_Algebra.pdf',
            size: '1.8 MB',
            type: 'PDF'
          }
        }
      ];
    } else if (expertId === "job2" || expertId === "f2" || expertId === "e2") {
      initialMessages = [
        {
          id: '1',
          sender_id: 'expert_id',
          text: '¡Hola! Gracias por contactarme para la preparación de Química Orgánica. Revisé tu temario sobre hidrocarburos y reacciones.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_expert: true
        },
        {
          id: '2',
          sender_id: (currentUser?.id as string),
          text: '¡Hola Mateo! Sí, el examen es el viernes y necesito asegurar esa materia. Acordamos $15 USD por la asesoría y resolución de dudas.',
          created_at: new Date(Date.now() - 3000000).toISOString(),
          is_expert: false
        },
        {
          id: '3',
          sender_id: 'expert_id',
          text: 'Perfecto, cuenta con eso. Te comparto un resumen de fórmulas y nomenclatura en PDF para que comencemos de inmediato.',
          created_at: new Date(Date.now() - 2400000).toISOString(),
          is_expert: true,
          attachment: {
            name: 'Resumen_Quimica_Organica.pdf',
            size: '1.2 MB',
            type: 'PDF'
          }
        }
      ];
    } else if (expertId === "job3" || expertId === "f3" || expertId === "e3") {
      initialMessages = [
        {
          id: '1',
          sender_id: 'expert_id',
          text: '¡Hola! Vi tu solicitud para la preparación de Inglés Saber 11 y redacción de textos. ¿En qué nivel te encuentras actualmente?',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_expert: true
        },
        {
          id: '2',
          sender_id: (currentUser?.id as string),
          text: '¡Hola Sofía! Necesito mejorar en lectura crítica y vocabulario técnico. El presupuesto acordado es de $14 USD.',
          created_at: new Date(Date.now() - 3000000).toISOString(),
          is_expert: false
        },
        {
          id: '3',
          sender_id: 'expert_id',
          text: 'Excelente, es un objetivo muy alcanzable. Te adjunto un simulacro de lectura con respuestas explicadas para practicar.',
          created_at: new Date(Date.now() - 2400000).toISOString(),
          is_expert: true,
          attachment: {
            name: 'Simulacro_Ingles_Saber11.pdf',
            size: '2.4 MB',
            type: 'PDF'
          }
        }
      ];
    } else {
      initialMessages = [
        {
          id: '1',
          sender_id: 'expert_id',
          text: '¡Hola! He revisado tu solicitud de tutoría y apoyo académico. El temario es claro y podemos organizar la sesión esta misma semana.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_expert: true
        },
        {
          id: '2',
          sender_id: (currentUser?.id as string),
          text: '¡Hola! Genial, el acompañamiento para el examen es clave para mí. ¿Cómo quedan los términos de la entrega y el soporte?',
          created_at: new Date(Date.now() - 3000000).toISOString(),
          is_expert: false
        },
        {
          id: '3',
          sender_id: 'expert_id',
          text: 'Podemos fijarlo en $18 USD incluyendo la sesión de 1.5h y el material de estudio resuelto. Te adjunto la propuesta académica detallada.',
          created_at: new Date(Date.now() - 2400000).toISOString(),
          is_expert: true,
          attachment: {
            name: 'Propuesta_Academica_Estudiantil.pdf',
            size: '2.1 MB',
            type: 'PDF'
          }
        }
      ];
    }

    // Check if navigated from project tracking page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('msg') === 'true' || localStorage.getItem('pendingTrackingMsg') === 'true') {
      initialMessages.push({
        id: 'tracking-msg',
        sender_id: 'expert_id',
        text: '¡Hola! Ya subí el avance de la guía de álgebra y los ejercicios resueltos. Por favor, revísalos cuando puedas...',
        created_at: new Date(Date.now() - 300000).toISOString(), // 5 mins ago
        is_expert: true
      });
      localStorage.removeItem('pendingTrackingMsg');
    }

    setMessages(initialMessages);

    // Supabase Realtime Subscription
    const channel = supabase
      .channel(`chat:${negotiationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'mensajes_chat',
        filter: `id_negociacion=eq.${negotiationId}`
      }, (payload) => {
        const newMessage = payload.new as Record<string, any>;
        setMessages((prev) => [...prev, {
          id: newMessage.id,
          sender_id: newMessage.id_emisor,
          text: newMessage.texto,
          created_at: newMessage.created_at,
          is_expert: newMessage.id_emisor !== currentUser?.id
        }]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [negotiationId, currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const filteredText = filterContactInfo(inputText);
    
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender_id: (currentUser?.id as string),
      text: filteredText,
      created_at: new Date().toISOString(),
      is_expert: false
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleAcceptProposal = () => {
    setIsGenerating(true);
    setTimeout(() => {
      router.push(`/confirmacion-contrato`);
    }, 3000);
  };

  const handleContraoferta = () => {
    router.push(`/chat/${expertId}/contraoferta`);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate sending a file message
    const newAttachment: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender_id: (currentUser?.id as string),
      text: `He enviado un archivo: ${file.name}`,
      created_at: new Date().toISOString(),
      is_expert: false,
      attachment: {
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        type: file.type.split('/')[1].toUpperCase()
      }
    };

    setMessages(prev => [...prev, newAttachment]);
    
    // Clear input
    e.target.value = '';
  };
  
  const handleDeleteMessage = (messageId: string, forEveryone: boolean) => {
    if (forEveryone) {
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } else {
      // Simulate "Delete for me" by just removing from local state as well
      setMessages(prev => prev.filter(m => m.id !== messageId));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8f9ff] overflow-hidden">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-sky-50 px-3 sm:px-4 md:px-8 py-3 md:py-4 flex justify-between items-center z-50 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Link href="/home-cliente" className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#5e6f79]" />
          </Link>
          <Link 
            href={`/expertos/${expertId}`}
            className="flex items-center gap-2 sm:gap-3 min-w-0 group cursor-pointer"
            title="Ver perfil completo del tutor"
          >
            <div className="relative flex-shrink-0">
              <img 
                src={expertData?.foto_perfil as string} 
                alt={expertData?.nombre_completo as string} 
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-[#C5A059]/40 shadow-sm group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="min-w-0">
              <h1 className="text-[#0B2545] font-bold text-sm sm:text-base md:text-lg leading-tight truncate max-w-[120px] sm:max-w-[200px] md:max-w-none group-hover:text-[#134074] transition-colors flex items-center gap-1.5">
                {expertData?.nombre_completo as string}
              </h1>
              <p className="text-[10px] sm:text-[12px] text-[#5e6f79] font-medium flex items-center gap-1">
                Tutor Estudiantil <span className="w-1 h-1 bg-gray-300 rounded-full"></span> <span className="text-green-600 font-bold">Online</span>
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Ver Perfil Button */}
          <Link
            href={`/expertos/${expertId}`}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-[#FAF8F5] hover:bg-[#C5A059]/15 text-[#0B2545] border border-[#C5A059]/40 rounded-full transition-all font-bold text-[11px] sm:text-xs shadow-sm active:scale-95"
          >
            <User className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Ver Perfil</span>
          </Link>

          {/* Botón Negociar */}
          <button 
            onClick={() => router.push(`/chat/${expertId}/negociacion`)}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-[#0B2545] text-[#C5A059] hover:bg-[#134074] rounded-full transition-all font-bold text-[11px] sm:text-xs shadow-sm active:scale-95 border border-[#C5A059]/30"
          >
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059]" />
            <span>Negociar</span>
          </button>
          
          <button 
            onClick={() => router.push('/centro-seguridad')}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-[#5e6f79] hover:bg-sky-50 rounded-full transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Ayuda</span>
          </button>
          <button className="p-1.5 sm:p-2 text-[#5e6f79] hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative min-h-0">
        {/* Chat Column — full width on mobile/tablet, 70% on desktop */}
        <div className="flex-1 flex flex-col relative min-w-0">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 scroll-smooth"
          >
            {/* Date Separator */}
            <div className="flex justify-center">
              <span className="bg-[#eff4ff] px-4 py-1 rounded-full text-[10px] font-bold tracking-widest text-[#5e6f79] uppercase">
                Hoy
              </span>
            </div>

            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 sm:gap-3 max-w-[88%] sm:max-w-[85%] md:max-w-[78%] lg:max-w-[75%] relative group ${msg.is_expert ? '' : 'ml-auto flex-row-reverse'}`}
                >
                  {msg.is_expert && (
                    <img 
                      src={expertData.foto_perfil} 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full self-end mb-1 shrink-0 shadow-sm"
                    />
                  )}
                  <div className={`relative p-3 sm:p-4 shadow-sm group ${
                    msg.is_expert 
                      ? 'bg-[#e0f2fe] text-[#0d1c2e] rounded-2xl rounded-bl-none' 
                      : 'bg-white border border-slate-200 text-[#0d1c2e] rounded-2xl rounded-br-none'
                  }`}>
                    <p className="text-[13px] sm:text-[15px] leading-relaxed">{msg.text}</p>
                    
                    {msg.attachment && (
                      <div 
                        onClick={() => handleDownloadPdf(msg.attachment?.name)}
                        className="mt-4 bg-white/90 backdrop-blur-sm p-3.5 sm:p-4 rounded-xl flex items-center gap-3 border border-[#0B2545]/15 hover:bg-white hover:border-[#C5A059] transition-all cursor-pointer group shadow-sm active:scale-[0.99]"
                        title="Haz clic para descargar este documento PDF"
                      >
                        <div className="w-10 h-10 bg-[#FAF8F5] border border-[#C5A059]/30 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-[#0B2545]" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-[13px] font-bold text-[#0B2545] group-hover:text-[#134074] transition-colors truncate">{msg.attachment.name}</span>
                          <span className="text-[11px] text-[#5e6f79]">{msg.attachment.size} • {msg.attachment.type} · Descargar</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-[#FAF8F5] text-[#C5A059] group-hover:bg-[#0B2545] group-hover:text-white transition-colors">
                          <Download className="w-4 h-4" />
                        </div>
                      </div>
                    )}

                    <div className={`flex items-center gap-1 mt-2 ${msg.is_expert ? '' : 'justify-end'}`}>
                      <span className="text-[10px] opacity-60 font-medium">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!msg.is_expert && (
                        <CheckCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                      )}
                    </div>

                    {/* Delete Message Context Menu */}
                    <div className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ${msg.is_expert ? '-right-12' : '-left-12'}`}>
                      <button 
                        onClick={() => {
                          if (confirm('¿Eliminar mensaje?')) {
                            handleDeleteMessage(msg.id, true);
                          }
                        }}
                        className="p-1.5 bg-white shadow-md rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Eliminar mensaje"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-sky-50 p-3 sm:p-4 md:p-5 flex-shrink-0">
            <input 
              id="chat-file-input"
              type="file" 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,.pdf,.doc,.docx"
            />
            <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3">
              <label 
                htmlFor="chat-file-input"
                className="text-[#5e6f79] hover:text-[#0B2545] transition-colors p-1.5 sm:p-2 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center border border-gray-100 flex-shrink-0"
              >
                <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </label>
              <div className="flex-1 relative min-w-0">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="w-full bg-[#f8f9ff] border border-[#e0f2fe] rounded-full px-4 sm:px-6 py-2.5 sm:py-3.5 pr-10 sm:pr-12 text-[13px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20 transition-all"
                />
                <button className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#5e6f79] hover:text-[#0B2545] transition-colors">
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <button 
                onClick={handleSendMessage}
                className="bg-[#0B2545] w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-[#C5A059] shadow-lg shadow-[#0B2545]/20 hover:bg-[#134074] hover:scale-105 active:scale-95 transition-all flex-shrink-0 border border-[#C5A059]/30"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>
            </div>
          </div>

          {/* ── MOBILE OFFER BAR (visible only on < lg screens) ── */}
          {userRole === 'client' && (
            <div className="lg:hidden bg-white border-t border-[#e0f2fe] px-4 py-3 shadow-[0_-6px_24px_rgba(13,28,46,0.08)]">
              {/* Offer summary row */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] font-bold text-[#5e6f79] uppercase tracking-widest">Oferta Actual</p>
                  <p className="text-xl font-black text-[#0d1c2e] leading-tight">
                    ${offer.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    <span className="text-xs font-medium text-[#5e6f79] ml-1">USD</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                  <span>Escrow Seguro</span>
                </div>
              </div>
              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleContraoferta}
                  className="flex-1 py-2.5 bg-white border-2 border-[#0B2545]/20 hover:bg-[#FAF8F5] text-[#0B2545] font-bold rounded-xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  Contraofertar
                </button>
                <button
                  onClick={handleAcceptProposal}
                  className="flex-1 py-2.5 bg-[#0B2545] hover:bg-[#134074] text-white font-bold rounded-xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md border border-[#C5A059]/40"
                >
                  <Check className="w-4 h-4 text-[#C5A059]" />
                  Aceptar Contrato
                </button>
              </div>
            </div>
          )}

          {/* Integrated Navigation Bar */}
          <div className="bg-white border-t border-sky-50 px-4 md:px-6 py-2.5 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
            <Link href="/home-cliente" className="flex flex-col items-center gap-1 text-[#5e6f79] hover:text-[#0B2545] transition-colors cursor-pointer min-w-[44px]">
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-bold">Home</span>
            </Link>
            <Link href="/resultados" className="flex flex-col items-center gap-1 text-[#5e6f79] hover:text-[#0B2545] transition-colors cursor-pointer min-w-[44px]">
              <Search className="w-5 h-5" />
              <span className="text-[10px] font-bold">Search</span>
            </Link>
            <Link href="/calificacion" className="flex flex-col items-center gap-1 text-[#5e6f79] hover:text-[#0B2545] transition-colors cursor-pointer min-w-[44px]">
              <Star className="w-5 h-5" />
              <span className="text-[10px] font-bold">Ratings</span>
            </Link>
            <Link href="/chat" className="flex flex-col items-center gap-1 text-[#0B2545] relative cursor-pointer min-w-[44px]">
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#C5A059] rounded-full border-2 border-white"></div>
              <Inbox className="w-5 h-5 text-[#0B2545]" />
              <span className="text-[10px] font-bold text-[#0B2545]">Inbox</span>
            </Link>
            <Link href="/perfil" className="flex flex-col items-center gap-1 text-[#5e6f79] hover:text-[#0B2545] transition-colors cursor-pointer min-w-[44px]">
              <User className="w-5 h-5" />
              <span className="text-[10px] font-bold">Profile</span>
            </Link>
          </div>
        </div>

        {/* Offer Panel — visible on lg+ (desktop). Tablet/mobile uses the bar above nav. */}
        <aside className="hidden lg:flex lg:w-[320px] xl:w-[360px] border-l border-sky-50 p-5 xl:p-8 overflow-y-auto flex-shrink-0 flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[28px] p-6 xl:p-8 shadow-[0_20px_40px_rgba(224,242,254,0.4)] border border-[#e0f2fe]"
          >
            <div className="flex flex-col mb-6">
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#5e6f79] mb-2 uppercase">Oferta Actual</span>
              <span className="text-3xl xl:text-4xl font-bold text-[#0B2545] tracking-tight">
                ${offer.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-[13px] xl:text-[14px] text-[#5e6f79] mt-3 leading-relaxed">
                {offer.description}
              </p>
            </div>

            <div className="pt-5 border-t border-sky-50">
              <h4 className="text-[11px] font-bold tracking-[0.2em] text-[#5e6f79] mb-4 uppercase">Detalles de la Tutoría</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#FAF8F5] border border-[#C5A059]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-[#0B2545]" />
                  </div>
                  <span className="text-sm font-medium text-[#0d1c2e]">Duración: {offer.duration}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#FAF8F5] border border-[#C5A059]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <span className="text-sm font-medium text-[#0d1c2e]">Garantía Escrow Estudiantil</span>
                </li>
              </ul>

              {userRole === 'client' && (
                <div className="mt-6 pt-5 border-t border-sky-50 flex flex-col gap-3">
                  <button
                    onClick={handleAcceptProposal}
                    className="w-full py-4 bg-[#0B2545] hover:bg-[#134074] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-[#C5A059]/40"
                  >
                    <Check className="w-5 h-5 text-[#C5A059]" />
                    <span>Aceptar Propuesta</span>
                  </button>
                  <button
                    onClick={handleContraoferta}
                    className="w-full py-3.5 bg-white border-2 border-[#0B2545]/20 hover:bg-[#FAF8F5] text-[#0B2545] font-bold rounded-2xl shadow-sm hover:shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Contraofertar</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </aside>
        
        {/* Overlay de Generación de IA */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full animate-ping opacity-25"></div>
                <div className="relative bg-[#0B2545] p-6 rounded-full shadow-2xl border border-[#C5A059]/40 flex items-center justify-center">
                  <div className="material-symbols-outlined text-4xl text-[#C5A059] animate-spin">hub</div>
                </div>
              </div>
              <h2 className="text-3xl font-black text-[#0B2545] mb-4">Generando Acuerdo Estudiantil...</h2>
              <p className="text-[#5C6B73] max-w-sm font-medium text-base sm:text-lg leading-relaxed">
                Nuestra plataforma está transformando los acuerdos del chat en un acuerdo académico seguro con garantía Escrow.
              </p>
              
              <div className="mt-12 flex gap-4">
                 <div className="w-3 h-3 bg-[#C5A059] rounded-full animate-bounce"></div>
                 <div className="w-3 h-3 bg-[#0B2545] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-3 h-3 bg-[#C5A059] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
