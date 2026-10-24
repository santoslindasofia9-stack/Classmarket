"use client";

import { Star, MapPin, ChevronRight, X, Briefcase, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Expert {
  id: string;
  nombre_completo: string;
  titulo_profesional: string;
  categoria: string;
  calificacion: number;
  distancia_km?: number;
  foto_perfil?: string;
  tarifa?: string;
}

interface JobOffer {
  id: string;
  cliente_nombre: string;
  cliente_avatar?: string;
  cliente_calificacion: number;
  titulo_trabajo: string;
  descripcion: string;
  terminos: string;
  pago: string;
  distancia_km: number;
  lat: number;
  lng: number;
  status: "available" | "accepted" | "declined";
}

interface PanelLateralProps {
  isOpen: boolean;
  onToggle: () => void;
  isLoading: boolean;
  
  // Experts mode
  experts?: Expert[];
  selected?: string | null;
  onSelect?: (id: string) => void;

  // Jobs mode
  mode?: "experts" | "jobs";
  jobs?: JobOffer[];
  selectedJobId?: string | null;
  onSelectJob?: (id: string) => void;
}

const CATEGORIA_COLORS: Record<string, string> = {
  Tech: "text-[#0288D1] bg-[#E0F2FE]",
  Hogar: "text-[#F57F17] bg-[#FFFDE7]",
  Creativo: "text-[#0B2545] bg-[#FAF8F5] border border-[#C5A059]/40",
  Eventos: "text-[#2E7D32] bg-[#E8F5E9]",
  Salud: "text-[#0B2545] bg-[#FAF8F5] border border-[#0B2545]/20",
  "Educación": "text-[#50616B] bg-[#E6EEFF]",
};

function SkeletonCard() {
  return (
    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 animate-pulse">
      <div className="flex gap-3">
        <div className="w-14 h-14 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 bg-gray-200 rounded-full w-2/3" />
          <div className="h-4 bg-gray-200 rounded-full w-full" />
          <div className="h-3 bg-gray-200 rounded-full w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function PanelLateral({
  isOpen,
  onToggle,
  isLoading,
  experts = [],
  selected = null,
  onSelect = () => {},
  mode = "experts",
  jobs = [],
  selectedJobId = null,
  onSelectJob = () => {},
}: PanelLateralProps) {
  
  const availableJobs = jobs.filter(j => j.status === "available");

  return (
    <>
      {/* Desktop side panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -380, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="hidden lg:flex flex-col w-[380px] bg-white/95 backdrop-blur-xl border-r border-gray-100 z-20 h-full overflow-hidden shadow-xl"
          >
            {/* Panel Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              {mode === "experts" ? (
                <div>
                  <h2 className="text-lg font-bold text-[#0B2545]">Tutorías & Ofertas Cercanas</h2>
                  <p className="text-xs font-medium text-[#C5A059] mt-0.5">
                    {isLoading ? "Cargando ofertas..." : `${experts.length} estudiante${experts.length !== 1 ? "s" : ""} disponible${experts.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-bold text-[#0B2545]">Solicitudes de Ayuda</h2>
                  <p className="text-xs font-medium text-[#C5A059] mt-0.5">
                    {isLoading ? "Cargando solicitudes..." : `${availableJobs.length} solicitud${availableJobs.length !== 1 ? "es" : ""} activa${availableJobs.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
              )}
              <button
                onClick={onToggle}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-[#5e6f79] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              ) : mode === "experts" ? (
                // ── Experts Mode Render ──
                experts.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-[#f8f9ff] rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin size={28} className="text-[#5e6f79]" />
                    </div>
                    <p className="text-[#0d1c2e] font-bold mb-1">Sin resultados</p>
                    <p className="text-sm text-[#5e6f79]">Prueba ajustando los filtros o mueve el mapa.</p>
                  </div>
                ) : (
                  experts.map((expert) => {
                    const isSelected = selected === expert.id;
                    const catColor = CATEGORIA_COLORS[expert.categoria] || "text-[#5e6f79] bg-gray-100";
                    return (
                      <motion.div
                        key={expert.id}
                        layout
                        onClick={() => onSelect(expert.id)}
                        className={`group p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#E0F2FE]/40 border-[#E0F2FE] shadow-md"
                            : "bg-white border-gray-100 hover:border-[#E0F2FE] hover:shadow-sm"
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#E0F2FE] flex-shrink-0 border-2 border-white shadow-sm">
                            {expert.foto_perfil ? (
                              <img src={expert.foto_perfil} alt={expert.nombre_completo} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#0d1c2e] font-bold text-xl">{expert.nombre_completo.charAt(0)}</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${catColor}`}>{expert.categoria}</span>
                            <h3 className="font-bold text-[#0d1c2e] text-sm leading-tight mt-1 line-clamp-1">{expert.nombre_completo}</h3>
                            <p className="text-xs text-[#5e6f79] font-medium line-clamp-1">{expert.titulo_profesional}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center gap-1">
                                <Star size={11} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold text-[#0d1c2e]">{expert.calificacion}</span>
                              </div>
                              {expert.distancia_km && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <div className="flex items-center gap-0.5 text-[#5e6f79]">
                                    <MapPin size={10} /><span className="text-xs">{expert.distancia_km} km</span>
                                  </div>
                                </>
                              )}
                              {expert.tarifa && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-xs font-bold text-[#0288D1]">{expert.tarifa}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <ChevronRight size={16} className={`text-gray-300 transition-all flex-shrink-0 ${isSelected ? "text-[#0288D1] translate-x-1" : "group-hover:text-[#0288D1] group-hover:translate-x-0.5"}`} />
                        </div>
                      </motion.div>
                    );
                  })
                )
              ) : (
                // ── Jobs Mode Render ──
                availableJobs.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-[#fce4ec] rounded-full flex items-center justify-center mx-auto mb-4 text-[#D81B60]">
                      <Briefcase size={28} />
                    </div>
                    <p className="text-[#0d1c2e] font-bold mb-1">Sin trabajos activos</p>
                    <p className="text-sm text-[#5e6f79]">Todos los contratos a tu alrededor han sido tomados.</p>
                  </div>
                ) : (
                  availableJobs.map((job) => {
                    const isSelected = selectedJobId === job.id;
                    return (
                      <motion.div
                        key={job.id}
                        layout
                        onClick={() => onSelectJob(job.id)}
                        className={`group p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FCE4EC]/40 border-pink-200 shadow-md"
                            : "bg-white border-gray-100 hover:border-pink-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex-shrink-0 flex items-center justify-center font-bold shadow-sm">
                            {job.cliente_nombre.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CLIENTE: {job.cliente_nombre}</span>
                            <h3 className="font-extrabold text-[#0d1c2e] text-xs leading-tight mt-0.5 line-clamp-1">{job.titulo_trabajo}</h3>
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">{job.descripcion}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center gap-0.5 text-emerald-600 font-extrabold text-xs">
                                <span>{job.pago} USD</span>
                              </div>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center gap-0.5 text-[#5e6f79]">
                                <MapPin size={10} /><span className="text-[10px] font-semibold">{job.distancia_km} km</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight size={16} className={`text-gray-300 transition-all flex-shrink-0 ${isSelected ? "text-pink-600 translate-x-1" : "group-hover:text-pink-600 group-hover:translate-x-0.5"}`} />
                        </div>
                      </motion.div>
                    );
                  })
                )
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile float pill */}
      <div className="lg:hidden absolute bottom-24 left-4 z-40">
        {!isOpen && (
          <button
            onClick={onToggle}
            className="flex items-center gap-2 px-4 py-3 bg-white/95 backdrop-blur-xl rounded-full shadow-xl border border-white text-[#0d1c2e] font-bold text-sm"
          >
            {mode === "experts" ? (
              <>
                <MapPin size={16} className="text-[#0288D1]" />
                <span>{experts.length} expertos</span>
              </>
            ) : (
              <>
                <Briefcase size={16} className="text-pink-500" />
                <span>{availableJobs.length} empleos</span>
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
