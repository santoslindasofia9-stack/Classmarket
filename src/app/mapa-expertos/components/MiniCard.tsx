"use client";

import { Star, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Expert {
  id: string;
  nombre_completo: string;
  titulo_profesional: string;
  categoria: string;
  calificacion: number;
  distancia_km?: number;
  foto_perfil?: string;
  lat?: number;
  lng?: number;
  tarifa?: string;
}

interface MiniCardProps {
  expert: Expert;
  onClose: () => void;
  onVerPerfil: (id: string) => void;
  position: { top: string; left: string };
}

const CATEGORIA_COLORS: Record<string, string> = {
  MatematicasCiencias: "text-[#0B2545] bg-[#E8EEF5]",
  TareasGuias: "text-[#0B2545] bg-[#FAF8F5]",
  TutoriasClases: "text-[#0B2545] bg-[#C5A059]/15",
  ProgramacionTecnologias: "text-[#0B2545] bg-[#D4AF37]/20",
  Tech: "text-[#0B2545] bg-[#E8EEF5]",
  Hogar: "text-[#0B2545] bg-[#C5A059]/15",
  Creativo: "text-[#0B2545] bg-[#D4AF37]/20",
  Eventos: "text-[#0B2545] bg-[#E8EEF5]",
  Salud: "text-[#0B2545] bg-[#C5A059]/15",
  "Educación": "text-[#0B2545] bg-[#E8EEF5]",
};

export default function MiniCard({ expert, onClose, onVerPerfil, position }: MiniCardProps) {
  const catColor = CATEGORIA_COLORS[expert.categoria] || "text-[#5e6f79] bg-gray-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      style={{ position: "absolute", top: position.top, left: position.left, zIndex: 60 }}
      className="w-72 bg-white/98 backdrop-blur-xl rounded-[20px] shadow-2xl border border-white overflow-hidden"
    >
      {/* Close hint */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-[#5e6f79] z-10 transition-colors"
      >
        <span className="text-xs font-bold">✕</span>
      </button>

      {/* Profile section */}
      <div className="p-5">
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#E0F2FE] flex-shrink-0 border-2 border-white shadow-sm">
            {expert.foto_perfil ? (
              <img
                src={expert.foto_perfil}
                alt={expert.nombre_completo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#0d1c2e] font-bold text-xl">
                {expert.nombre_completo.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${catColor}`}>
              {expert.categoria}
            </span>
            <h3 className="text-base font-bold text-[#0d1c2e] mt-1 leading-tight line-clamp-1">
              {expert.nombre_completo}
            </h3>
            <p className="text-xs text-[#5e6f79] font-medium line-clamp-1 mt-0.5">
              {expert.titulo_profesional}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(expert.calificacion) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
              />
            ))}
            <span className="text-sm font-bold text-[#0d1c2e] ml-1">{expert.calificacion}</span>
          </div>

          {expert.distancia_km && (
            <div className="flex items-center gap-1 text-[#5e6f79]">
              <MapPin size={13} />
              <span className="text-xs font-medium">{expert.distancia_km} km</span>
            </div>
          )}
        </div>

        {expert.tarifa && (
          <p className="text-xs font-bold text-[#0B2545] bg-[#C5A059]/15 px-2.5 py-1 rounded-md mt-2 inline-block">
            {expert.tarifa}
          </p>
        )}
      </div>

      {/* Action Buttons: Chatear & Ver Perfil */}
      <div className="px-5 pb-5 flex gap-2">
        <button
          onClick={() => {
            window.location.href = `/chat/${expert.id}?nombre=${encodeURIComponent(expert.nombre_completo)}&servicio=${encodeURIComponent(expert.titulo_profesional)}`;
          }}
          className="flex-1 py-2.5 bg-[#C5A059] hover:bg-[#b08d47] text-[#0B2545] font-bold text-xs rounded-full transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
        >
          <span>Chatear</span>
        </button>
        <button
          onClick={() => {
            if (onVerPerfil) {
              onVerPerfil(expert.id);
            } else {
              window.location.href = `/expertos/${expert.id}?foto=${encodeURIComponent(expert.foto_perfil || '')}&nombre=${encodeURIComponent(expert.nombre_completo || '')}&titulo=${encodeURIComponent(expert.titulo_profesional || '')}&tarifa=${encodeURIComponent(expert.tarifa || '')}&categoria=${encodeURIComponent(expert.categoria || '')}`;
            }
          }}
          className="flex-1 py-2 bg-white text-[#0B2545] border border-[#C5A059]/40 rounded-full text-xs font-bold hover:bg-[#FAF8F5] transition-all flex items-center justify-center gap-1"
        >
          <span>Ver Perfil</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
