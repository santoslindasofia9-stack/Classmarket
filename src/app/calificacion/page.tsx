'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Star, ShieldCheck, Lock, CheckCircle2, Award, Camera, X, MessageSquare, Search, Home, User } from 'lucide-react';
import Image from 'next/image';
import BottomNav from '@/components/dashboard/BottomNav';

const quickTags = [
  "Explicación clara y paciente",
  "Puntual en la sesión",
  "Guía de ejercicios resuelta",
  "Excelente apoyo escolar",
  "100% Recomendado para exámenes"
];

const mockPhotos = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400"
];

export default function CalificacionPage() {
  const router = useRouter();
  
  // State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400"
  ]);
  const [comment, setComment] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [expertName, setExpertName] = useState<string>('Camila Torres');
  const [expertImage, setExpertImage] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&crop=face');
  const [expertRole, setExpertRole] = useState<string>('Tutoría de Matemáticas & Física');

  useEffect(() => {
    const savedName = localStorage.getItem("currentExpertName");
    const savedImage = localStorage.getItem("currentExpertAvatar") || localStorage.getItem("currentExpertImage");
    const savedRole = localStorage.getItem("currentExpertRole");
    
    const fallbackAvatars: Record<string, string> = {
      "Camila Torres": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&crop=face",
      "Mateo Valenzuela": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&crop=face",
      "Sofía Salazar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&crop=face",
      "Diego Morales": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400&crop=face",
      "Valentina Gómez": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&crop=face",
      "Sebastián Rincón": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&crop=face",
    };

    if (savedName) setExpertName(savedName);
    
    const finalImage = savedImage || (savedName ? fallbackAvatars[savedName] : null);
    if (finalImage) setExpertImage(finalImage);
    
    if (savedRole) setExpertRole(savedRole);
  }, []);

  const getFeedbackLabel = (stars: number) => {
    switch (stars) {
      case 1: return "Pésimo servicio";
      case 2: return "Regular / Aceptable";
      case 3: return "Buen servicio";
      case 4: return "Excelente calidad";
      case 5: return "¡Extraordinario!";
      default: return "SELECCIONA LAS ESTRELLAS";
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddPhoto = () => {
    if (photos.length >= 3) {
      alert("Puedes subir un máximo de 3 imágenes para tu reseña.");
      return;
    }
    const nextPhoto = mockPhotos[photos.length % mockPhotos.length];
    setPhotos([...photos, nextPhoto]);
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos(photos.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/50 via-slate-50 to-[#f8f9ff] text-[#0d1c2e] font-sans flex flex-col items-center justify-between pb-24 md:pb-8">
      
      {/* Decorative Blur Background Blobs */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-sky-200/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[350px] h-[350px] bg-pink-100/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-[#C5A059]/20 flex justify-between items-center px-4 md:px-10 py-4 h-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div onClick={() => router.push('/home-cliente')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#C5A059]/40 bg-white flex items-center justify-center p-1 shadow-sm">
              <img src="/classmarket-logo.png" alt="ClassMarket" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-extrabold text-[#0B2545] tracking-tight leading-none flex items-center gap-1.5">
                ClassMarket
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#0B2545] border border-[#C5A059]/30">Estudiantil</span>
              </span>
              <span className="text-[10px] font-semibold text-[#5C6B73]">Educación e Intercambio Real</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => router.push('/home-cliente')} className="text-sm font-semibold text-slate-500 hover:text-[#0B2545] transition-colors">Inicio</button>
          <button onClick={() => router.push('/resultados')} className="text-sm font-semibold text-slate-500 hover:text-[#0B2545] transition-colors">Buscar</button>
          <button onClick={() => router.push('/chat/f1')} className="text-sm font-semibold text-slate-500 hover:text-[#0B2545] transition-colors">Mensajes</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative p-2 hover:bg-slate-100 rounded-full transition-all cursor-pointer">
            <span className="material-symbols-outlined text-slate-600">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C5A059] rounded-full"></span>
          </div>
          <div onClick={() => router.push('/perfil')} className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C5A059]/40 shadow-md hover:scale-105 transition-transform cursor-pointer">
            <Image width={40} height={40} alt="Profile" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&crop=face"/>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto px-4 md:px-8 mt-24 pt-6 pb-12 flex flex-col items-center z-10 flex-grow">
        
        {/* Title Section */}
        <div className="text-center mb-8 max-w-2xl">
          <span className="text-[11px] font-extrabold text-[#C5A059] uppercase tracking-[0.2em] mb-2 block">Valoración de Compañero</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B2545] tracking-tight mb-3">¿Cómo calificarías la tutoría?</h2>
          <p className="text-[#5C6B73] text-sm md:text-base leading-relaxed">Tu valoración apoya la reputación académica de los estudiantes y garantiza la confianza de toda la comunidad escolar.</p>
        </div>

        {/* Asymmetric Layout Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
          {/* Left Sidebar: Professional Summary & Guarantee */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
              
            {/* Professional Summary Card */}
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-[2rem] border border-[#C5A059]/20 shadow-[0_20px_50px_rgba(11,37,69,0.04)] flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-[#5C6B73] uppercase tracking-widest mb-4">SERVICIO CONTRATADO</span>
              
              {/* Profile Image */}
              <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full blur-xl"></div>
                <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md">
                  <Image width={96} height={96} alt="Student Avatar" className="w-full h-full object-cover" src={expertImage} />
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-[#0B2545]">{expertName}</h3>
              <span className="text-xs text-[#0B2545] font-semibold bg-[#C5A059]/20 px-3 py-1 rounded-full mt-1 border border-[#C5A059]/30">{expertRole}</span>
              
              <div className="w-full border-t border-slate-100 my-4"></div>
              
              <div className="grid grid-cols-2 gap-4 w-full text-left">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">FECHA</span>
                  <p className="text-xs font-bold text-[#0B2545]">24 May, 2026</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL PAGADO</span>
                  <p className="text-xs font-bold text-[#0B2545]">$18.00 USD</p>
                </div>
              </div>
            </div>

            {/* Trust Indicator Card */}
            <div className="bg-gradient-to-br from-sky-50/50 to-white p-6 rounded-[2rem] border border-sky-100 flex gap-4 items-start shadow-sm">
              <ShieldCheck className="text-sky-500 shrink-0 bg-white p-2 w-11 h-11 rounded-2xl shadow-sm" />
              <div>
                <h4 className="text-sm font-bold text-[#0d1c2e]">Reseña 100% Protegida</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Tu calificación está respaldada por transacciones reales de fideicomiso escrow, garantizando honestidad e imparcialidad.</p>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Review Form */}
          <div className="lg:col-span-7 w-full bg-white/95 backdrop-blur-md p-6 md:p-10 rounded-[2rem] border border-sky-100/50 shadow-[0_20px_50px_rgba(2,132,199,0.05)]">
              
            {/* Step 1: Star Selection */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">TOCA PARA CALIFICAR</span>
              
              <div className="flex items-center gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <button 
                    key={idx}
                    type="button" 
                    className="p-1 active:scale-95 transition-transform"
                    onMouseEnter={() => setHoverRating(idx)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(idx)}
                  >
                    <Star 
                      size={44} 
                      className={`transition-all duration-200 ${
                        idx <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400 scale-110'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              <span className="font-bold text-xs text-sky-600 bg-sky-50 px-4 py-1.5 rounded-full tracking-wider mt-1 uppercase">
                {getFeedbackLabel(hoverRating || rating)}
              </span>
            </div>

            {/* Step 2: Selectable Quick Tags */}
            <div className="mb-6">
              <label className="block font-bold text-sm text-[#0d1c2e] uppercase tracking-wider mb-3">¿Qué destacó de su trabajo?</label>
              <div className="flex flex-wrap gap-2.5">
                {quickTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                        isSelected 
                          ? 'bg-sky-500 border-sky-500 text-white shadow-sm shadow-sky-400/20' 
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Detailed Feedback Comment */}
            <div className="mb-6">
              <label className="block font-bold text-sm text-[#0d1c2e] uppercase tracking-wider mb-3" htmlFor="review-comment">Tu comentario detallado</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-2xl border-sky-100 bg-slate-50/50 p-4 text-sm focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400 resize-none font-medium text-slate-800" 
                id="review-comment" 
                placeholder="Describe aquí tu experiencia, la calidad del servicio entregado..." 
                rows={4}
              />
            </div>

            {/* Step 4: Photos Mock Upload */}
            <div className="mb-8">
              <span className="block font-bold text-sm text-[#0d1c2e] uppercase tracking-wider mb-3">Compartir fotos (Opcional)</span>
              <div className="flex flex-wrap gap-3 items-center">
                <button 
                  type="button" 
                  onClick={handleAddPhoto}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-sky-100 hover:border-sky-500 flex flex-col items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50/30 transition-all group"
                >
                  <Camera size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-extrabold uppercase mt-1 tracking-wider">Añadir Foto</span>
                </button>
                
                {/* Dynamic Preview Container */}
                <div className="flex gap-3">
                  <AnimatePresence>
                    {photos.map((url, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden relative group shadow-sm border border-slate-100"
                      >
                        <Image width={96} height={96} alt="Preview" className="w-full h-full object-cover" src={url} />
                        <button 
                          type="button" 
                          onClick={() => handleRemovePhoto(idx)} 
                          className="absolute top-1.5 right-1.5 bg-white/90 text-slate-500 hover:text-pink-600 rounded-full p-1 shadow-sm transition-all"
                        >
                          <X size={12} className="stroke-[3px]" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Publicar Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-5 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                <Lock size={14} />
                <span>Envío seguro de opinión</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowSuccessModal(true)}
                className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#134074] text-[#C5A059] font-bold px-10 py-4 rounded-full text-base transition-all active:scale-95 shadow-sm hover:scale-[1.01] border border-[#C5A059]/40"
              >
                Publicar Reseña
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confetti/Success Modal Overlay */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Simple Dynamic Confetti Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2.5 h-2.5 rounded-sm opacity-80"
                  style={{
                    backgroundColor: ['#0284c7', '#db2777', '#f59e0b', '#10b981', '#6366f1'][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: `-10px`,
                    animation: `confetti-fall 3.5s linear infinite`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-sky-100 relative z-10"
            >
              <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-sky-400 rounded-full blur-lg opacity-25 animate-pulse"></div>
                <CheckCircle2 size={40} className="text-sky-500 z-10" />
              </div>
              
              <h3 className="text-2xl font-extrabold text-[#0d1c2e] tracking-tight mb-2">¡Reseña Publicada!</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Gracias por contribuir a la comunidad. Tu opinión ha sido publicada y el contrato se ha cerrado de manera definitiva.</p>
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left mb-6">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <span>Puntos de Reputación</span>
                  <span className="text-sky-600 font-bold">+50 XP</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-400 to-sky-500 h-full rounded-full w-4/5"></div>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push('/home-cliente');
                }}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-full shadow-md active:scale-95 transition-all text-sm uppercase tracking-wider"
              >
                Volver a Inicio
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS Inject for Confetti Animation */}
      <style jsx global>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {/* Shared Bottom Navigation (Mobile Only) */}
      <BottomNav />
    </div>
  );
}
