'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Link as LucideLink, 
  Info, 
  ChevronRight, 
  MoreVertical, 
  Building2, 
  HelpCircle, 
  MessageCircle, 
  ArrowLeft, 
  Bell,
  Send,
  X
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface EvidenceFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'link';
  time: string;
  url?: string;
  thumbnail?: string;
}

export default function EvidenceCenterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Chat de soporte
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'agent', text: '¡Hola! Soy Alex del equipo de soporte técnico. ¿Tienes algún problema al subir tus archivos o evidencias?' }
  ]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: 'agent', text: '¡Gracias! Un agente especializado revisará tu caso en los próximos minutos. ¿Hay algo más en lo que pueda ayudarte?' }]);
    }, 1200);
  };

  // Perfil del usuario (sincronizado)
  const [userName, setUserName] = useState<string>("Usuario");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Usuario");
    setUserAvatar(localStorage.getItem("userAvatar"));
  }, []);

  const [files, setFiles] = useState<EvidenceFile[]>([
    {
      id: '1',
      name: 'entrega_final_v1.pdf',
      size: '2.4 MB',
      type: 'pdf',
      time: 'Hace 5 min'
    },
    {
      id: '2',
      name: 'screenshot_resultado.png',
      size: '1.1 MB',
      type: 'image',
      time: 'Hace 10 min',
      thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: '3',
      name: 'Repositorio de Código',
      size: 'github.com/proyecto/main',
      type: 'link',
      time: 'Hace 1 hora'
    }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFile: EvidenceFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type.includes('image') ? 'image' : 'pdf',
        time: 'Recién subido',
        thumbnail: file.type.includes('image') ? URL.createObjectURL(file) : undefined
      };
      setFiles(prev => [newFile, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-20">
      {/* Navbar Minimalista */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/seguimiento-proyecto')}>
              <ArrowLeft className="text-slate-400 hover:text-slate-900 transition-colors" size={24} />
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/home-cliente')}>
              <div className="w-10 h-10 bg-[#0d1c2e] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">school</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#0d1c2e] tracking-tight">ClassMarket</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-[#0B2545] transition-colors relative p-2">
              <Bell size={24} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#C5A059] rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <p className="text-sm font-bold text-slate-900 hidden sm:block">{userName}</p>
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-slate-100 bg-slate-100">
                {userAvatar ? (
                  <Image src={userAvatar || ''} alt="Avatar" fill className="object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-slate-500 text-sm uppercase">{userName.charAt(0)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 pt-8 space-y-8">
        {/* Título de Sección */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Centro de Evidencias</h1>
          
          {/* Banner Informativo Superior */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Info size={20} />
            </div>
            <p className="text-blue-800 text-sm font-medium leading-relaxed">
              Tus evidencias garantizan la liberación de fondos. Sube capturas de pantalla, documentos o enlaces del progreso finalizado para que el cliente pueda validar tu trabajo.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna Izquierda: Zona de Carga y Archivos */}
          <div className="lg:w-[65%] space-y-8">
            
            {/* Zona de Carga (Drag & Drop) */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-[32px] p-12 border-2 border-dashed border-[#C5A059]/40 flex flex-col items-center justify-center text-center space-y-6 shadow-sm hover:border-[#0B2545] transition-colors"
            >
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-[#FAF8F5] border border-[#C5A059]/40 flex items-center justify-center text-[#0B2545] cursor-pointer hover:scale-110 transition-transform shadow-sm"
              >
                <Upload size={32} className="text-[#C5A059]" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-slate-900">Arrastra y suelta tus archivos aquí</p>
                <p className="text-sm text-slate-400 font-medium">JPG, PNG, PDF, ZIP (Máx. 25MB)</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-[#0B2545] hover:bg-[#134074] text-[#C5A059] font-bold rounded-full transition-all shadow-sm active:scale-95 border border-[#C5A059]/40"
              >
                Seleccionar Archivos
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </motion.div>

            {/* Sección de Archivos Subidos */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">Archivos subidos</h2>
                  <span className="bg-[#FAF8F5] border border-[#C5A059]/40 text-[#0B2545] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {files.length} ARCHIVOS
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {files.map((file) => (
                    <motion.div 
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow"
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                        file.type === 'pdf' ? 'bg-red-50 text-red-500' : 
                        file.type === 'image' ? 'bg-[#FAF8F5] text-[#0B2545]' : 'bg-slate-50 text-slate-500'
                      }`}>
                        {file.type === 'pdf' && <FileText size={24} />}
                        {file.type === 'image' && (
                          file.thumbnail ? (
                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                              <Image src={file.thumbnail || ''} alt={file.name} fill className="object-cover" />
                            </div>
                          ) : <ImageIcon size={24} />
                        )}
                        {file.type === 'link' && <LucideLink size={24} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400 font-medium">{file.size}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-400 font-medium">{file.time}</span>
                        </div>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Resumen y Soporte Técnico */}
          <div className="lg:w-[35%] space-y-6">
            
            {/* Tarjeta de Resumen del Proyecto */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-100 space-y-8"
            >
              <h2 className="text-xl font-bold text-slate-900">Resumen de la Tutoría</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-500">Contrato</span>
                  <span className="text-sm font-bold text-slate-900">#CTR-89231</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-500">Presupuesto</span>
                  <span className="text-sm font-bold text-[#0B2545]">$18.00 USD</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-500">Hito</span>
                  <span className="text-sm font-bold text-[#C5A059]">Entrega Final</span>
                </div>
              </div>

              {/* Caja de Información de la Asignatura */}
              <div className="bg-[#FAF8F5] rounded-2xl p-4 flex items-center gap-4 border border-[#C5A059]/30">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#0B2545] shadow-sm border border-[#C5A059]/20">
                  <Building2 size={24} className="text-[#C5A059]" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#5C6B73] uppercase tracking-widest">ASIGNATURA / SERVICIO</p>
                  <p className="text-sm font-bold text-[#0B2545]">Tutoría de Matemáticas & Álgebra</p>
                </div>
              </div>

              <button
                onClick={() => router.push('/liberacion-fondos')}
                className="w-full py-4 bg-[#0B2545] hover:bg-[#134074] text-[#C5A059] font-bold rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-[#C5A059]/40"
              >
                <span>Confirmar Pagos</span>
                <ChevronRight size={18} />
              </button>
            </motion.div>

            {/* Tarjeta de Ayuda Flotante */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50/30 rounded-[32px] p-8 border border-blue-50 space-y-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                <HelpCircle size={120} />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
                  <HelpCircle size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">¿Necesitas ayuda?</h3>
              </div>
              
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Si tienes problemas para subir tus archivos, contacta a nuestro equipo de soporte técnico disponible 24/7.
              </p>

              <button
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-3 text-sky-600 font-bold text-sm hover:gap-4 transition-all"
              >
                <MessageCircle size={20} />
                <span>Abrir Chat de Soporte</span>
              </button>
            </motion.div>

          </div>
        </div>
      </main>

      {/* Widget de Chat de Soporte Técnico */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-6 w-[340px] bg-white rounded-[28px] shadow-2xl border border-slate-100 z-[100] overflow-hidden"
          >
            {/* Cabecera */}
            <div className="bg-[#0d1c2e] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center font-black text-white text-xs">TL</div>
                <div>
                  <p className="font-bold text-sm text-white leading-tight">Soporte Técnico</p>
                  <p className="text-[10px] text-sky-400 font-semibold">● En línea · ClassMarket</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <X size={17} />
              </button>
            </div>

            {/* Mensajes */}
            <div className="h-[240px] bg-slate-50/70 px-4 py-4 overflow-y-auto flex flex-col gap-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium max-w-[82%] leading-snug ${
                    msg.from === 'user'
                      ? 'bg-[#0d1c2e] text-white rounded-br-none'
                      : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Escribe tu pregunta..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-12 text-sm font-medium focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all"
                />
                <button
                  onClick={handleSendChat}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0d1c2e] text-white rounded-xl flex items-center justify-center hover:bg-slate-700 active:scale-90 transition-all"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <button
        onClick={() => setIsChatOpen(prev => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#0d1c2e] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
      >
        {isChatOpen ? <X size={22} /> : <MessageCircle size={24} />}
      </button>

    </div>
  );
}

