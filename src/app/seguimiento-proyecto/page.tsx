'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  ChevronRight, 
  Camera, 
  Check, 
  MessageCircle, 
  Headphones,
  CheckSquare
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProjectTrackingPage() {
  const router = useRouter();

  // Estados de Usuario (cargados desde localStorage)
  const [userName, setUserName] = useState<string>("Usuario");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("CLIENTE PREMIUM");

  // Estados del Profesional Actual
  const [expertId, setExpertId] = useState<string>("e1");
  const [expertName, setExpertName] = useState<string>("Diseñadora: Ana Valery");
  const [expertAvatar, setExpertAvatar] = useState<string>("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100");

  // Estados de Notificaciones
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, read: false, text: "Nueva actualización de Ana Valery.", time: "Hace 5 min" },
    { id: 2, read: false, text: "Materiales aprobados.", time: "Hace 1 hora" }
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Estados de Evidencias (con carga funcional)
  const [evidences, setEvidences] = useState([
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400",
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedAvatar = localStorage.getItem("userAvatar");
    const savedRole = localStorage.getItem("userRole");
    
    if (savedName) setUserName(savedName);
    if (savedAvatar) setUserAvatar(savedAvatar);
    if (savedRole) setUserRole(savedRole === 'client' ? 'CLIENTE PREMIUM' : savedRole.toUpperCase());

    const savedExpertId = localStorage.getItem("currentExpertId");
    const savedExpertName = localStorage.getItem("currentExpertName");
    const savedExpertAvatar = localStorage.getItem("currentExpertAvatar");
    if (savedExpertId) setExpertId(savedExpertId);
    if (savedExpertName) setExpertName(savedExpertName);
    if (savedExpertAvatar) setExpertAvatar(savedExpertAvatar);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEvidences(prev => [...prev, base64String]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-32">
      {/* Navbar Superior Integrado */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-12">
            {/* Logo Actualizado de ClassMarket */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/home-cliente')}>
              <div className="w-10 h-10 bg-[#0d1c2e] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">school</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0d1c2e] tracking-tight">ClassMarket</h1>
            </div>
            
            {/* Enlaces de Navegación Limpiados (Solo Proyectos) */}
            <div className="hidden md:flex items-center gap-8">
              <span className="text-sky-500 font-semibold border-b-2 border-sky-500 py-7">Proyectos</span>
            </div>
          </div>

          <div className="flex items-center gap-6 relative">
            {/* Campanita Funcional */}
            <div>
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="text-slate-400 hover:text-[#0B2545] transition-colors relative p-2">
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#C5A059] rounded-full border-2 border-white"></span>
                )}
              </button>
              
              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-12 right-0 md:right-12 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <span className="font-bold text-slate-900">Notificaciones</span>
                        {unreadCount > 0 && (
                          <button onClick={() => setNotifications(n => n.map(x => ({...x, read: true})))} className="text-xs text-[#0B2545] font-bold hover:underline">
                            Marcar leídas
                          </button>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b border-slate-50 text-sm ${n.read ? 'bg-white' : 'bg-[#FAF8F5]'}`}>
                            <p className={`text-slate-800 ${n.read ? '' : 'font-semibold'}`}>{n.text}</p>
                            <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                          </div>
                        ))}
                        {notifications.length === 0 && (
                          <div className="p-4 text-center text-slate-500 text-sm">No hay notificaciones</div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Perfil del Usuario Logueado */}
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#0B2545]">{userName}</p>
                <p className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">{userRole}</p>
              </div>
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#C5A059]/40 shadow-sm ring-2 ring-slate-100 bg-slate-100">
                {userAvatar ? (
                  <Image 
                    src={userAvatar || ''} 
                    alt="Avatar de Usuario" 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-[#0B2545] text-sm uppercase">
                    {userName.charAt(0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 pt-8 space-y-8">
        
        {/* Banner de Estado del Proyecto */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse"></span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tutoría Activa</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B2545] tracking-tight">
              Tutoría de Matemáticas & Taller de Álgebra
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Siguiente hito: <span className="text-slate-800 font-semibold">Revisión de Ejercicios y Guía Resuelta</span>
            </p>
          </div>

          <div className="flex items-center gap-6 bg-[#FAF8F5] rounded-2xl p-6 border border-[#C5A059]/20">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-[#C5A059]"
                  strokeDasharray="75, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-[#0B2545]">75%</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estado Actual</p>
              <p className="text-[#0B2545] font-bold bg-[#FAF8F5] border border-[#C5A059]/30 px-3 py-1 rounded-lg inline-block text-sm">En Progreso</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Columna Izquierda: Galería de Evidencias */}
          <div className="lg:w-[65%] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Evidencias del Proyecto</h2>
              <button className="text-sky-500 hover:text-sky-600 font-bold text-sm flex items-center gap-1 transition-colors">
                VER TODO <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <AnimatePresence>
                {evidences.map((src, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={i} 
                    className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-200"
                  >
                    <Image 
                      src={src}
                      alt={`Evidencia ${i+1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors"></div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 hover:bg-sky-50 hover:border-sky-300 transition-all flex flex-col items-center justify-center gap-3 text-sky-600 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <span className="font-bold text-sm">Añadir Nueva</span>
              </button>
              
              {/* Input de archivo oculto para la subida */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </div>
          </div>

          {/* Columna Derecha: Línea de Tiempo */}
          <div className="lg:w-[35%]">
            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 sticky top-28">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700">
                  <CheckSquare size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Seguimiento</h2>
              </div>

              <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
                
                {/* Completed Hito 1 */}
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#0B2545] flex items-center justify-center ring-4 ring-white">
                    <Check size={12} className="text-[#C5A059]" strokeWidth={3} />
                  </div>
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">Diagnóstico & Consulta Inicial</h3>
                    <span className="text-[10px] font-bold text-slate-400">12 OCT, 2023</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">Definición de objetivos de examen y dudas principales de álgebra.</p>
                </div>

                {/* Completed Hito 2 */}
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#0B2545] flex items-center justify-center ring-4 ring-white">
                    <Check size={12} className="text-[#C5A059]" strokeWidth={3} />
                  </div>
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">Guía de Ejercicios Resueltos</h3>
                    <span className="text-[10px] font-bold text-slate-400">15 OCT, 2023</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">Desarrollo paso a paso de los 10 problemas del taller en PDF.</p>
                </div>

                {/* Active Hito */}
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-2 border-[#C5A059] flex items-center justify-center ring-4 ring-white">
                    <div className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></div>
                  </div>
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="font-bold text-[#0B2545] text-base">Sesión Virtual de Repaso</h3>
                    <span className="text-[9px] font-black bg-[#FAF8F5] border border-[#C5A059]/40 text-[#0B2545] px-2 py-0.5 rounded uppercase tracking-wider">En Curso</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">Clase en vivo de 1.5 horas para resolver ejercicios tipo parcial.</p>
                  <button 
                    onClick={() => router.push('/centro-evidencias')}
                    className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#C5A059]/20 text-[#0B2545] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border border-[#C5A059]/40 shadow-sm"
                  >
                    Centro de Evidencias
                  </button>
                </div>

                {/* Pending Hito 1 */}
                <div className="relative pl-8 opacity-50">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-slate-200 ring-4 ring-white"></div>
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="font-bold text-slate-400 text-sm">Simulacro de Examen & Evaluación</h3>
                    <span className="text-[9px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded uppercase tracking-wider">Pendiente</span>
                  </div>
                </div>

                {/* Pending Hito 2 */}
                <div className="relative pl-8 opacity-50">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-slate-200 ring-4 ring-white"></div>
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="font-bold text-slate-400 text-sm">Entrega Final & Liberación de Fondos</h3>
                    <span className="text-[9px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded uppercase tracking-wider">Pendiente</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer Flotante: Caja de Mensaje Rápido */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-4 z-40 transition-transform hover:-translate-y-1">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-100 flex items-center justify-center">
            {expertAvatar ? (
              <Image 
                src={expertAvatar} 
                alt="Avatar Profesional" 
                fill
                className="object-cover"
              />
            ) : (
              <span className="font-bold text-slate-400 text-lg uppercase">{expertName.charAt(0)}</span>
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10"></div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-slate-900 text-sm">{expertName}</span>
              <span className="text-xs text-slate-400 font-medium">hace 5 min</span>
            </div>
            <p className="text-sm text-slate-600 italic line-clamp-1">
              "¡Hola! Ya subí el avance de la guía de álgebra y los ejercicios resueltos. Por favor, revísalos cuando puedas..."
            </p>
          </div>
        </div>
        <button 
          onClick={() => {
            localStorage.setItem('pendingTrackingMsg', 'true');
            router.push(`/chat/${expertId}?msg=true`);
          }}
          className="shrink-0 px-6 py-3 bg-[#FAF8F5] hover:bg-[#C5A059]/20 text-[#0B2545] font-bold rounded-2xl transition-colors flex items-center gap-2 text-sm border border-[#C5A059]/40 shadow-sm active:scale-95"
        >
          <MessageCircle size={18} className="text-[#C5A059]" />
          <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Responder en el Chat</span>
        </button>
      </div>

      <button 
        onClick={() => router.push('/centro-seguridad')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#0B2545] hover:bg-[#134074] text-[#C5A059] rounded-full shadow-lg shadow-[#0B2545]/20 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50 border border-[#C5A059]/40"
      >
        <Headphones size={24} />
      </button>

    </div>
  );
}

