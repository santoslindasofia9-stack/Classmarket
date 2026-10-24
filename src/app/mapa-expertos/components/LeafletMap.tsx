"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Minus, 
  X, 
  Check, 
  Loader2, 
  ShieldCheck, 
  Briefcase, 
  FileText, 
  AlertCircle,
  MapPin,
  CheckCircle2,
  MessageSquare
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import MiniCard from "./MiniCard";

interface Expert {
  id: string;
  nombre_completo: string;
  titulo_profesional: string;
  categoria: string;
  calificacion: number;
  distancia_km?: number;
  foto_perfil?: string;
  tarifa?: string;
  lat?: number;
  lng?: number;
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

interface LeafletMapProps {
  // Common Props
  userLocation: { lat: number; lng: number } | null;
  mapCenter?: { lat: number; lng: number } | null;
  
  // Experts mode props (Client)
  experts?: Expert[];
  selectedId?: string | null;
  onSelectExpert?: (id: string | null) => void;
  onVerPerfil?: (id: string) => void;

  // Jobs mode props (Professional)
  mode?: "experts" | "jobs";
  jobs?: JobOffer[];
  selectedJobId?: string | null;
  onSelectJob?: (id: string | null) => void;
  onAcceptJob?: (id: string) => void;
  onDeclineJob?: (id: string) => void;
}

const CATEGORIA_PIN_COLORS: Record<string, string> = {
  MatematicasCiencias: "#0B2545",
  TareasGuias: "#C5A059",
  TutoriasClases: "#0B2545",
  ProgramacionTecnologias: "#D4AF37",
  Tech: "#0B2545",
  Hogar: "#C5A059",
  Creativo: "#D4AF37",
  Eventos: "#0B2545",
  Salud: "#C5A059",
  "Educación": "#0B2545",
};

// Component to handle map center changes
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Custom zoom control
function CustomZoomControls() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handleZoom = () => setZoom(map.getZoom());
    map.on("zoomend", handleZoom);
    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map]);

  return (
    <>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            map.zoomIn();
          }}
          className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#5e6f79] hover:text-[#0d1c2e] hover:scale-110 active:scale-95 transition-all border border-white"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            map.zoomOut();
          }}
          className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#5e6f79] hover:text-[#0d1c2e] hover:scale-110 active:scale-95 transition-all border border-white"
        >
          <Minus size={18} />
        </button>
      </div>
      <div className="absolute bottom-4 right-4 z-[400] bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-bold text-[#5e6f79] shadow-sm border border-white pointer-events-none">
        Zoom {zoom}
      </div>
    </>
  );
}

export default function LeafletMap({
  experts = [],
  selectedId = null,
  onSelectExpert = () => {},
  onVerPerfil = () => {},
  userLocation,
  mapCenter,
  mode = "experts",
  jobs = [],
  selectedJobId = null,
  onSelectJob = () => {},
  onAcceptJob = () => {},
  onDeclineJob = () => {},
}: LeafletMapProps) {
  const router = useRouter();
  
  // Accept animation local states
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [acceptSuccessId, setAcceptSuccessId] = useState<string | null>(null);

  // Center coordinates calculation
  const centerLat = mapCenter?.lat || userLocation?.lat || (mode === "jobs" && jobs[0]?.lat) || (experts[0]?.lat ?? 7.1193);
  const centerLng = mapCenter?.lng || userLocation?.lng || (mode === "jobs" && jobs[0]?.lng) || (experts[0]?.lng ?? -73.1227);

  const selectedExpert = experts.find((e) => e.id === selectedId);
  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  // Custom Icon generation function for experts
  const createCustomIcon = (expert: Expert, isSelected: boolean) => {
    const pinColor = CATEGORIA_PIN_COLORS[expert.categoria] || "#0B2545";
    const avatar = expert.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.nombre_completo)}&background=0B2545&color=fff`;
    
    const html = `
      <div class="relative group cursor-pointer transition-transform duration-300 ${isSelected ? 'scale-110' : 'hover:scale-105'}" style="outline: none;">
        <div class="relative w-12 h-12 rounded-full border-4 shadow-lg overflow-hidden flex items-center justify-center bg-white ${isSelected ? 'ring-4 ring-[#C5A059]/40' : ''}" style="border-color: white;">
          <img src="${avatar}" class="w-full h-full object-cover" />\n            <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full border border-[#C5A059] flex items-center justify-center shadow-sm">\n              <svg width="10" height="10" viewBox="0 0 24 24" fill="#C5A059"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>\n            </div>
        </div>
        <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-white bg-white" style="z-index: -1;"></div>
        <div class="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#0B2545] text-white rounded-full px-2 py-0.5 shadow-md border border-[#C5A059]/60" style="white-space: nowrap;">
          <span class="text-[9px] font-extrabold">${expert.tarifa || "$10/hr"}</span>
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-leaflet-icon',
      html,
      iconSize: [48, 48],
      iconAnchor: [24, 54],
      popupAnchor: [0, -54],
    });
  };

  // Custom Icon for Job Offers (Student photo style with message)
  const createJobIcon = (job: JobOffer, isSelected: boolean) => {
    const avatar = job.cliente_avatar || "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=200&crop=face";
    const html = `
      <div class="relative group cursor-pointer transition-transform duration-300 ${isSelected ? 'scale-110' : 'hover:scale-105'}" style="outline: none;">
        <div class="relative w-12 h-12 rounded-full border-4 shadow-lg overflow-hidden flex items-center justify-center bg-white ${isSelected ? 'ring-4 ring-[#C5A059]/40' : ''}" style="border-color: white;">
          <img src="${avatar}" class="w-full h-full object-cover" />\n            <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full border border-[#C5A059] flex items-center justify-center shadow-sm">\n              <svg width="10" height="10" viewBox="0 0 24 24" fill="#C5A059"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>\n            </div>
        </div>
        <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-white bg-white" style="z-index: -1;"></div>
        <div class="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#0B2545] text-white rounded-full px-2 py-0.5 shadow-md border border-[#C5A059]/60" style="white-space: nowrap;">
          <span class="text-[9px] font-extrabold">$${job.pago}</span>
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-leaflet-job-icon',
      html,
      iconSize: [48, 48],
      iconAnchor: [24, 54],
      popupAnchor: [0, -54],
    });
  };

  // User location icon
  const userIcon = L.divIcon({
    className: 'custom-leaflet-user-icon',
    html: `
      <div class="relative w-5 h-5">
        <div class="absolute inset-0 rounded-full bg-[#0288D1]/30 animate-ping" style="transform: scale(2.5);"></div>
        <div class="relative w-5 h-5 rounded-full bg-[#0288D1] border-4 border-white shadow-lg"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const handleLocalAcceptJob = (jobId: string) => {
    setAcceptingId(jobId);
    // Simulate smart contract generation on blockchain
    setTimeout(() => {
      setAcceptingId(null);
      setAcceptSuccessId(jobId);
      // Store escrow data for the Agenda escrow notification
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        const escrowData = {
          amount: parseFloat(job.pago) || 0,
          client: job.cliente_nombre
        };
        localStorage.setItem("pendingEscrow", JSON.stringify(escrowData));
      }
      setTimeout(() => {
        setAcceptSuccessId(null);
        onAcceptJob(jobId);
        // Navigate to agenda to show the escrow deposit notification
        router.push("/agenda");
      }, 2000);
    }, 2500);
  };

  return (
    <div 
      className="relative flex-1 h-full w-full z-0" 
      onClick={() => {
        if (mode === "experts") onSelectExpert(null);
        else onSelectJob(null);
      }}
    >
      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={14} 
        zoomControl={false}
        className="w-full h-full"
      >
        <MapUpdater center={[centerLat, centerLng]} zoom={14} />
        
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <CustomZoomControls />

        {/* Render Experts Markers if in experts mode */}
        {mode === "experts" && experts.map((expert) => {
          if (!expert.lat || !expert.lng) return null;
          const isSelected = expert.id === selectedId;
          
          return (
            <Marker
              key={expert.id}
              position={[expert.lat, expert.lng]}
              icon={createCustomIcon(expert, isSelected)}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  onSelectExpert(isSelected ? null : expert.id);
                },
              }}
            />
          );
        })}

        {/* Render Jobs Markers if in jobs mode */}
        {mode === "jobs" && jobs.map((job) => {
          if (job.status !== "available") return null;
          const isSelected = job.id === selectedJobId;
          
          return (
            <Marker
              key={job.id}
              position={[job.lat, job.lng]}
              icon={createJobIcon(job, isSelected)}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  onSelectJob(isSelected ? null : job.id);
                },
              }}
            />
          );
        })}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        )}
      </MapContainer>

      {/* ── Desktop Mini Card Popup (Overlay over map) ── */}
      <AnimatePresence>
        {mode === "experts" && selectedExpert && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] z-[400] pointer-events-auto hidden lg:block">
             <MiniCard
              expert={selectedExpert}
              onClose={() => onSelectExpert(null)}
              onVerPerfil={onVerPerfil}
              position={{ top: "0", left: "0" }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── Mobile Selected Expert Card ── */}
      <AnimatePresence>
        {mode === "experts" && selectedExpert && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden absolute bottom-24 sm:bottom-28 left-4 right-4 z-[400] bg-white/98 backdrop-blur-xl rounded-[24px] shadow-[0_20px_60px_rgba(13,28,46,0.2)] border border-white p-4 flex items-center gap-3 sm:gap-4"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-[#E0F2FE] flex-shrink-0 border-2 border-white shadow-sm">
              {selectedExpert.foto_perfil ? (
                <img src={selectedExpert.foto_perfil} alt={selectedExpert.nombre_completo} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#0d1c2e] font-bold text-xl">
                  {selectedExpert.nombre_completo.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-[10px] font-extrabold text-[#D81B60] uppercase tracking-wider">{selectedExpert.categoria}</p>
              <h3 className="font-extrabold text-[#0d1c2e] text-sm sm:text-base leading-tight line-clamp-1">{selectedExpert.nombre_completo}</h3>
              <p className="text-xs text-[#5e6f79] font-medium line-clamp-1 mt-0.5">{selectedExpert.titulo_profesional}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs font-bold text-[#0d1c2e]">{selectedExpert.calificacion}</span>
                {selectedExpert.tarifa && <span className="text-xs text-[#0288D1] font-bold ml-2">{selectedExpert.tarifa}</span>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button 
                onClick={(e) => { e.stopPropagation(); onSelectExpert(null); }}
                className="w-6 h-6 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs transition-colors"
              >
                ✕
              </button>
              <button
                onClick={() => onVerPerfil(selectedExpert.id)}
                className="px-4 py-2 bg-[#0d1c2e] text-white font-bold rounded-full text-xs sm:text-sm hover:bg-[#1a2e44] transition-colors shadow-sm"
              >
                Chatear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Unified Floating Job Details Card (Desktop & Mobile) ── */}
      <AnimatePresence>
        {mode === "jobs" && selectedJob && (
          <motion.div
            initial={{ y: 150, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 150, opacity: 0, x: "-50%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] sm:w-[calc(100%-32px)] max-w-md z-[400] bg-white/98 backdrop-blur-xl rounded-[28px] border border-sky-100 shadow-[0_20px_60px_rgba(13,28,46,0.25)] p-5 sm:p-6 max-h-[65vh] overflow-y-auto no-scrollbar flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {acceptingId === selectedJob.id ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn my-auto">
                <Loader2 size={44} className="animate-spin text-[#C5A059] mb-4" />
                <h4 className="text-base font-extrabold text-[#0d1c2e]">Firmando Contrato en la Blockchain</h4>
                <p className="text-xs text-slate-400 font-semibold mt-1.5 max-w-xs mx-auto">
                  Generando billetera multifirma e inicializando custodia inteligente de TrustPay (Garantía Escrow).
                </p>
              </div>
            ) : acceptSuccessId === selectedJob.id ? (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-fadeIn my-auto">
                <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mb-4 text-emerald-500 animate-bounce mx-auto">
                  <CheckCircle2 size={36} className="fill-emerald-50" />
                </div>
                <h4 className="text-base font-extrabold text-emerald-700">¡Contrato Activado con Éxito!</h4>
                <p className="text-xs text-slate-500 font-semibold mt-1 mb-4">El trabajo ha sido añadido a tu Agenda.</p>
                <button
                  onClick={() => router.push(`/chat/${selectedJob.id}`)}
                  className="px-6 py-2.5 bg-[#0B2545] hover:bg-[#12335d] active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-[#0B2545]/20 flex items-center gap-1.5 justify-center mx-auto border border-[#C5A059]/30"
                >
                  <MessageSquare size={14} />
                  Chat de Negociación
                </button>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between">
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3.5 gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#0B2545]/10 text-[#0B2545] rounded-full flex items-center justify-center font-bold shadow-sm shrink-0 text-sm sm:text-base border border-[#C5A059]/30">
                        {selectedJob.cliente_nombre.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">CLIENTE</span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#0d1c2e] truncate">{selectedJob.cliente_nombre}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-amber-400 text-xs">★</span>
                          <span className="text-[10px] font-bold text-slate-600">{selectedJob.cliente_calificacion} / 5.0</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onSelectJob(null)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 shrink-0 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Job Title & Distance */}
                  <div className="mb-3.5">
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <h3 className="text-sm sm:text-base font-black text-[#0d1c2e] leading-snug line-clamp-2">{selectedJob.titulo_trabajo}</h3>
                      <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-sky-100/50 shrink-0 flex items-center gap-1">
                        <MapPin size={10} /> {selectedJob.distancia_km} km
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-4 sm:line-clamp-none">
                      {selectedJob.descripcion}
                    </p>
                  </div>

                  {/* Job Terms Box */}
                  <div className="bg-[#fcf8f2] border border-amber-100 rounded-2xl p-3 mb-4 flex gap-2.5 items-start">
                    <ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-widest block mb-0.5">TÉRMINOS Y GARANTÍA</span>
                      <p className="text-[11px] text-amber-700 font-bold leading-relaxed line-clamp-3 sm:line-clamp-none">{selectedJob.terminos}</p>
                    </div>
                  </div>
                </div>

                {/* Footer and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-auto">
                  <div className="flex items-center justify-between sm:flex-col sm:items-start">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">PRESUPUESTO</span>
                    <span className="text-base sm:text-lg font-black text-emerald-600">{selectedJob.pago} USD</span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => router.push(`/chat/${selectedJob.id}`)}
                      className="p-2.5 bg-[#FAF8F5] hover:bg-[#C5A059]/20 text-[#0B2545] font-bold rounded-xl text-xs transition-colors flex items-center justify-center shadow-sm shrink-0 border border-[#C5A059]/30"
                      title="Mensaje para negociar presupuesto"
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button 
                      onClick={() => onDeclineJob(selectedJob.id)}
                      className="px-3 sm:px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] font-bold rounded-xl text-xs transition-colors flex-1 sm:flex-none text-center"
                    >
                      Rechazar
                    </button>
                    <button 
                      onClick={() => handleLocalAcceptJob(selectedJob.id)}
                      className="px-4 sm:px-5 py-2.5 bg-[#0B2545] hover:bg-[#12335d] active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-[#0B2545]/20 flex items-center gap-1 justify-center flex-1 sm:flex-none border border-[#C5A059]/30"
                    >
                      <Briefcase size={12} className="shrink-0 text-[#C5A059]" />
                      <span className="truncate">Aceptar Trabajo</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
