"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  User, 
  MapPin, 
  Calendar, 
  Star, 
  ShieldCheck, 
  ChevronRight, 
  Camera, 
  X, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight, 
  Unlock, 
  Bell, 
  Info,
  Briefcase,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  BadgeCheck,
  BookOpen,
  GraduationCap,
  Award,
  Upload,
  Plus,
  ExternalLink,
  MessageSquare,
  School
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/dashboard/BottomNav";

interface Contract {
  id: string;
  proName: string;
  avatar: string;
  category: string;
  date: string;
  amount: string;
  status: "Completado" | "En progreso" | "En revisión";
  desc: string;
}

interface Review {
  id: number;
  proName: string;
  avatar: string;
  category: string;
  date: string;
  stars: number;
  comment: string;
  publishDate: string;
}

interface EvidenceItem {
  id: string;
  title: string;
  subject: string;
  url: string;
  date: string;
  rating: number;
}

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&crop=face";

const AVATAR_PRESETS = [
  { name: "Sofía (Estudiante)", url: DEFAULT_AVATAR },
  { name: "Camila Torres (Matemáticas)", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&crop=face" },
  { name: "Mateo Valenzuela (Química)", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&crop=face" },
  { name: "Diego Morales (Informática)", url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400&crop=face" }
];

const INITIAL_SUBJECTS = [
  "Cálculo & Álgebra 11°",
  "Física Mecánica",
  "Química Orgánica",
  "Inglés Saber 11",
  "Programación Web"
];

function PerfilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPublicView = searchParams.get("view") === "public";
  
  // ── Core States ─────────────────────────────────────────────────────────────
  const [userName, setUserName] = useState<string>("Sofía");
  const [userAvatar, setUserAvatar] = useState<string>(DEFAULT_AVATAR);
  const [userLocation, setUserLocation] = useState<string>("Bucaramanga, Santander");
  const [school, setSchool] = useState<string>("Colegio La Salle");
  const [grade, setGrade] = useState<string>("11° Bachillerato");
  const [bio, setBio] = useState<string>("Estudiante apasionada por la ciencia y tecnología. Preparando las pruebas Saber 11 con meta de ingresar a Ingeniería en la UIS.");
  const [subjects, setSubjects] = useState<string[]>(INITIAL_SUBJECTS);
  const [newSubject, setNewSubject] = useState<string>("");
  const [isAddingSubject, setIsAddingSubject] = useState<boolean>(false);
  
  // Modal States
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [editLocation, setEditLocation] = useState<string>("");
  const [editPhoto, setEditPhoto] = useState<string>("");
  const [editBio, setEditBio] = useState<string>("");
  const [editSchool, setEditSchool] = useState<string>("");
  const [editGrade, setEditGrade] = useState<string>("");
  
  // Active Tab
  const [activeTab, setActiveTab] = useState<"contratos" | "resenas" | "evidencias" | "escrow">("contratos");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  
  // Escrow Simulated State
  const [escrowReleased, setEscrowReleased] = useState<boolean>(false);
  const [releasing, setReleasing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; body: string } | null>(null);

  // Sync with localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedAvatar = localStorage.getItem("userAvatar") || localStorage.getItem("proAvatar");
    const savedLocation = localStorage.getItem("userLocation");
    const savedSchool = localStorage.getItem("proSchool");
    const savedGrade = localStorage.getItem("proGrade");
    const savedBio = localStorage.getItem("proDescription");

    if (savedName) setUserName(savedName);
    if (savedAvatar) setUserAvatar(savedAvatar);
    if (savedLocation) setUserLocation(savedLocation);
    if (savedSchool) setSchool(savedSchool);
    if (savedGrade) setGrade(savedGrade);
    if (savedBio) setBio(savedBio);
  }, []);

  const triggerToast = (title: string, body: string) => {
    setToastMessage({ title, body });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      alert("Por favor introduce un nombre válido.");
      return;
    }
    setUserName(editName);
    setUserLocation(editLocation);
    setUserAvatar(editPhoto);
    setBio(editBio);
    setSchool(editSchool);
    setGrade(editGrade);

    localStorage.setItem("userName", editName);
    localStorage.setItem("userLocation", editLocation);
    localStorage.setItem("userAvatar", editPhoto);
    localStorage.setItem("proSchool", editSchool);
    localStorage.setItem("proGrade", editGrade);
    localStorage.setItem("proDescription", editBio);

    setIsEditOpen(false);
    triggerToast("Perfil Actualizado", "Tus cambios se han guardado con éxito.");
  };

  const handleAddSubject = () => {
    if (!newSubject.trim()) return;
    if (!subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
    }
    setNewSubject("");
    setIsAddingSubject(false);
    triggerToast("Materia Añadida", "Se actualizó tu lista de intereses académicos.");
  };

  const handleRemoveSubject = (sub: string) => {
    setSubjects(subjects.filter(s => s !== sub));
  };

  const handleReleaseEscrow = () => {
    setReleasing(true);
    setTimeout(() => {
      setReleasing(false);
      setEscrowReleased(true);
      triggerToast(
        "Pago Autorizado", 
        "El saldo en garantía de $14.00 USD ha sido transferido de forma segura al tutor Mateo Valenzuela."
      );
    }, 1200);
  };

  // Mock Data
  const trabajos: Contract[] = [
    {
      id: "CM-2026-01",
      proName: "Camila Torres",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&crop=face",
      category: "Tutoría de Álgebra y Física",
      date: "Mayo, 2026",
      amount: "$15.00 USD",
      status: "Completado",
      desc: "Sesión intensiva de preparación para el examen bimestral de cálculo y física 11°. Incluye resolución de guía de 10 ejercicios paso a paso y apuntes en PDF."
    },
    {
      id: "CM-2026-02",
      proName: "Mateo Valenzuela",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&crop=face",
      category: "Guías de Química Orgánica",
      date: "Abril, 2026",
      amount: "$12.00 USD",
      status: "Completado",
      desc: "Resolución y explicación del taller de hidrocarburos, enlaces moleculares y compuestos de carbono con diagramas de Lewis detallados."
    },
    {
      id: "CM-2026-03",
      proName: "Sofía Salazar",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&crop=face",
      category: "Clases de Inglés Saber 11",
      date: "Marzo, 2026",
      amount: "$18.00 USD",
      status: "Completado",
      desc: "Preparación especializada para la prueba de inglés del Icfes Saber 11. Enfoque en lectura crítica, conectores textuales y simulacro comentado."
    }
  ];

  const resenas: Review[] = [
    {
      id: 1,
      proName: "Camila Torres",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&crop=face",
      category: "Tutoría de Cálculo 11°",
      date: "Mayo, 2026",
      stars: 5.0,
      comment: "Excelente tutora, me explicó límites y derivadas de una forma super visual y sencilla. Saqué 4.8 en el examen.",
      publishDate: "20 Mayo, 2026"
    },
    {
      id: 2,
      proName: "Mateo Valenzuela",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&crop=face",
      category: "Química Orgánica",
      date: "Abril, 2026",
      stars: 5.0,
      comment: "Muy puntual y entregó los ejercicios con mapas conceptuales que me sirvieron para estudiar toda la semana.",
      publishDate: "15 Abril, 2026"
    }
  ];

  const evidencias: EvidenceItem[] = [
    {
      id: "ev-1",
      title: "Guía Resuelta de Límites & Continuidad",
      subject: "Cálculo 11°",
      url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
      date: "12 Mayo, 2026",
      rating: 5.0
    },
    {
      id: "ev-2",
      title: "Diagramas de Enlaces y Reacciones",
      subject: "Química Orgánica",
      url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
      date: "28 Abril, 2026",
      rating: 4.9
    },
    {
      id: "ev-3",
      title: "Simulacro Saber 11 - Lectura Crítica",
      subject: "Lenguaje e Inglés",
      url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
      date: "10 Abril, 2026",
      rating: 5.0
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#0B2545] pb-28">
      
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#0B2545]/10 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-[#FAF8F5] hover:bg-[#0B2545]/10 border border-[#0B2545]/10 flex items-center justify-center text-[#0B2545] transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block leading-none">ClassMarket Estudiante</span>
              <h1 className="text-base font-extrabold text-[#0B2545] leading-tight">Mi Perfil y Aprendizaje</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard-pro"
              className="px-3.5 py-1.5 rounded-full bg-[#0B2545] text-white hover:bg-[#12335d] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 border border-[#C5A059]/40"
            >
              <GraduationCap size={14} className="text-[#C5A059]" />
              <span className="hidden sm:inline">Portal de Tutor</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Layout ──────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* ── Left Column: Profile Card & Quick Stats (4 cols) ──────────────── */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#0B2545]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Avatar & Online status */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4 group">
                <div className="w-28 h-28 rounded-full border-4 border-[#0B2545] p-1 bg-white shadow-md relative overflow-hidden">
                  <img src={userAvatar} alt={userName} className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
                  <CheckCircle2 size={12} />
                </div>
                <button
                  onClick={() => {
                    setEditName(userName);
                    setEditLocation(userLocation);
                    setEditPhoto(userAvatar);
                    setEditBio(bio);
                    setEditSchool(school);
                    setEditGrade(grade);
                    setIsEditOpen(true);
                  }}
                  className="absolute inset-1 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                >
                  <Camera size={18} />
                </button>
              </div>

              <div className="flex items-center gap-1.5 mb-1">
                <h2 className="text-xl font-extrabold text-[#0B2545]">{userName}</h2>
                <BadgeCheck size={18} className="text-[#C5A059]" />
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5C6B73] mb-2">
                <MapPin size={13} className="text-[#0284C7]" />
                <span>{userLocation}</span>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#C5A059]/30 text-[11px] font-bold text-[#0B2545] mb-4">
                <School size={12} className="text-[#C5A059]" />
                <span>{school} • {grade}</span>
              </div>

              <p className="text-xs text-[#5C6B73] leading-relaxed italic bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#0B2545]/5 mb-5 w-full text-left">
                "{bio}"
              </p>

              {/* Edit button */}
              <button
                onClick={() => {
                  setEditName(userName);
                  setEditLocation(userLocation);
                  setEditPhoto(userAvatar);
                  setEditBio(bio);
                  setEditSchool(school);
                  setEditGrade(grade);
                  setIsEditOpen(true);
                }}
                className="w-full py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#0B2545] text-[#0B2545] hover:text-white border border-[#0B2545]/20 hover:border-[#0B2545] font-bold text-xs transition-all shadow-xs"
              >
                Editar Información
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-[#0B2545]/10 text-center">
              <div className="bg-[#FAF8F5] p-2.5 rounded-2xl border border-[#0B2545]/5">
                <span className="block text-[9px] font-bold text-[#5C6B73] uppercase tracking-wider">TUTORÍAS</span>
                <span className="text-base font-black text-[#0B2545]">{trabajos.length}</span>
              </div>
              <div className="bg-[#FAF8F5] p-2.5 rounded-2xl border border-[#0B2545]/5">
                <span className="block text-[9px] font-bold text-[#5C6B73] uppercase tracking-wider">RESEÑAS</span>
                <span className="text-base font-black text-[#C5A059]">{resenas.length}</span>
              </div>
              <div className="bg-[#FAF8F5] p-2.5 rounded-2xl border border-[#0B2545]/5">
                <span className="block text-[9px] font-bold text-[#5C6B73] uppercase tracking-wider">PROMEDIO</span>
                <span className="text-base font-black text-emerald-600">5.0</span>
              </div>
            </div>
          </div>

          {/* ── Academic Interests / Subjects ─────────────────────────────────── */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#0B2545]/10">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#C5A059]" />
                <h3 className="text-xs font-extrabold text-[#0B2545] uppercase tracking-wider">Materias de Interés</h3>
              </div>
              <button
                onClick={() => setIsAddingSubject(!isAddingSubject)}
                className="text-[11px] font-bold text-[#0B2545] hover:text-[#C5A059] flex items-center gap-0.5"
              >
                <Plus size={13} />
                <span>Añadir</span>
              </button>
            </div>

            {isAddingSubject && (
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Ej: Biología Celular..."
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#0B2545]/15 rounded-xl font-semibold text-[#0B2545] focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleAddSubject}
                  className="px-3 py-1.5 bg-[#0B2545] text-white text-xs font-bold rounded-xl hover:bg-[#12335d]"
                >
                  Ok
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {subjects.map(sub => (
                <span
                  key={sub}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#0B2545]/10 text-xs font-semibold text-[#0B2545]"
                >
                  <span>{sub}</span>
                  <button
                    onClick={() => handleRemoveSubject(sub)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Right Column: Interactive Tabs (8 cols) ───────────────────────── */}
        <section className="lg:col-span-8 space-y-6">
          
          {/* Tabs bar */}
          <div className="bg-white p-1.5 rounded-[24px] border border-[#0B2545]/10 shadow-xs flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab("contratos")}
              className={`flex-1 py-2.5 px-3 rounded-[18px] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "contratos"
                  ? "bg-[#0B2545] text-white shadow-xs"
                  : "text-[#5C6B73] hover:text-[#0B2545]"
              }`}
            >
              <Briefcase size={14} className={activeTab === "contratos" ? "text-[#C5A059]" : ""} />
              <span>Tutorías ({trabajos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("evidencias")}
              className={`flex-1 py-2.5 px-3 rounded-[18px] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "evidencias"
                  ? "bg-[#0B2545] text-white shadow-xs"
                  : "text-[#5C6B73] hover:text-[#0B2545]"
              }`}
            >
              <Award size={14} className={activeTab === "evidencias" ? "text-[#C5A059]" : ""} />
              <span>Evidencias & Guías ({evidencias.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("resenas")}
              className={`flex-1 py-2.5 px-3 rounded-[18px] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "resenas"
                  ? "bg-[#0B2545] text-white shadow-xs"
                  : "text-[#5C6B73] hover:text-[#0B2545]"
              }`}
            >
              <Star size={14} className={activeTab === "resenas" ? "text-[#C5A059] fill-[#C5A059]" : ""} />
              <span>Reseñas ({resenas.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("escrow")}
              className={`flex-1 py-2.5 px-3 rounded-[18px] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "escrow"
                  ? "bg-[#0B2545] text-white shadow-xs"
                  : "text-[#5C6B73] hover:text-[#0B2545]"
              }`}
            >
              <ShieldCheck size={14} className={activeTab === "escrow" ? "text-[#C5A059]" : ""} />
              <span>Garantía Escrow</span>
            </button>
          </div>

          {/* ── Tab 1: Contratos Realizados ──────────────────────────────────── */}
          {activeTab === "contratos" && (
            <div className="space-y-3.5">
              {trabajos.map(trabajo => (
                <div
                  key={trabajo.id}
                  className="p-5 bg-white rounded-[26px] border border-[#0B2545]/10 shadow-xs hover:border-[#C5A059]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#0B2545]/10 shrink-0">
                      <img src={trabajo.avatar} alt={trabajo.proName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-[#0B2545]">{trabajo.proName}</h4>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          {trabajo.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#5C6B73] mt-0.5">{trabajo.category}</p>
                      <span className="text-[11px] text-slate-400 font-medium">{trabajo.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-none pt-3 sm:pt-0">
                    <span className="text-sm font-black text-[#0B2545]">{trabajo.amount}</span>
                    <button
                      onClick={() => setSelectedContract(trabajo)}
                      className="px-4 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#0B2545] hover:text-white text-xs font-bold text-[#0B2545] border border-[#0B2545]/15 transition-all"
                    >
                      Ver Detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Tab 2: Evidencias y Trabajos ─────────────────────────────────── */}
          {activeTab === "evidencias" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {evidencias.map(ev => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvidence(ev)}
                  className="bg-white rounded-[26px] border border-[#0B2545]/10 overflow-hidden shadow-xs hover:shadow-md hover:border-[#C5A059]/50 transition-all cursor-pointer group"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={ev.url}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#0B2545]/85 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1 border border-[#C5A059]/40">
                      <Star size={11} className="text-[#C5A059] fill-[#C5A059]" />
                      <span>{ev.rating}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block">{ev.subject}</span>
                    <h4 className="text-xs font-extrabold text-[#0B2545] line-clamp-1">{ev.title}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Adjuntado el {ev.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Tab 3: Reseñas ───────────────────────────────────────────────── */}
          {activeTab === "resenas" && (
            <div className="space-y-4">
              {resenas.map(rev => (
                <div
                  key={rev.id}
                  className="p-5 bg-white rounded-[26px] border border-[#0B2545]/10 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#0B2545]/10">
                        <img src={rev.avatar} alt={rev.proName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#0B2545]">{rev.proName}</h4>
                        <span className="text-[10px] font-semibold text-[#5C6B73]">{rev.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#C5A059]/30 text-xs font-bold text-[#0B2545]">
                      <Star size={12} className="text-[#C5A059] fill-[#C5A059]" />
                      <span>{rev.stars.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#5C6B73] leading-relaxed bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#0B2545]/5">
                    "{rev.comment}"
                  </p>
                  <span className="text-[10px] font-semibold text-slate-400 block text-right">{rev.publishDate}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Tab 4: Garantías y Escrow ────────────────────────────────────── */}
          {activeTab === "escrow" && (
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#0B2545]/10 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#0B2545]/10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#0B2545] text-[#C5A059] flex items-center justify-center border border-[#C5A059]/40">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-wider block">Custodia Activa</span>
                    <h3 className="text-base font-extrabold text-[#0B2545]">Tutoría con Mateo Valenzuela</h3>
                    <p className="text-xs text-[#5C6B73] font-medium">Monto asegurado: $14.00 USD</p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  escrowReleased 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-[#FAF8F5] text-[#0B2545] border border-[#C5A059]/40"
                }`}>
                  {escrowReleased ? "Fondos Liberados" : "En Custodia Escrow"}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#5C6B73] leading-relaxed">
                <p>
                  Tus fondos se mantienen protegidos en la cuenta de custodia ClassMarket. Solo se transfieren al tutor una vez que recibes la clase o guía a total satisfacción.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReleaseEscrow}
                  disabled={escrowReleased || releasing}
                  className={`w-full py-3.5 rounded-full font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    escrowReleased
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : "bg-[#0B2545] hover:bg-[#12335d] text-white border border-[#C5A059]/40 active:scale-95"
                  }`}
                >
                  {releasing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : escrowReleased ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span>Pago Liberado Satisfactoriamente</span>
                    </>
                  ) : (
                    <>
                      <Unlock size={16} className="text-[#C5A059]" />
                      <span>Confirmar Entrega y Liberar $14.00 USD</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </section>
      </main>

      {/* ── Modal: Editar Perfil ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full border border-[#0B2545]/10 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#0B2545]/10">
                <h3 className="text-base font-extrabold text-[#0B2545]">Editar Perfil</h3>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-slate-200 flex items-center justify-center text-[#0B2545]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Avatar presets */}
              <div>
                <label className="text-xs font-bold text-[#0B2545] block mb-2">Escoge un Avatar:</label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {AVATAR_PRESETS.map(pre => (
                    <button
                      key={pre.name}
                      type="button"
                      onClick={() => setEditPhoto(pre.url)}
                      className={`relative w-14 h-14 rounded-full overflow-hidden border-2 shrink-0 transition-transform ${
                        editPhoto === pre.url ? "border-[#0B2545] scale-105 ring-2 ring-[#C5A059]" : "border-slate-200 opacity-70"
                      }`}
                    >
                      <img src={pre.url} alt={pre.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#0B2545] block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#0B2545]/15 text-xs font-semibold text-[#0B2545] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#0B2545] block mb-1">Colegio / Instituto</label>
                    <input
                      type="text"
                      value={editSchool}
                      onChange={e => setEditSchool(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#0B2545]/15 text-xs font-semibold text-[#0B2545] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#0B2545] block mb-1">Grado</label>
                    <input
                      type="text"
                      value={editGrade}
                      onChange={e => setEditGrade(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#0B2545]/15 text-xs font-semibold text-[#0B2545] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B2545] block mb-1">Ciudad / Ubicación</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#0B2545]/15 text-xs font-semibold text-[#0B2545] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0B2545] block mb-1">Biografía Académica</label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#0B2545]/15 text-xs font-semibold text-[#0B2545] focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#0B2545]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="flex-1 py-3 rounded-full bg-[#0B2545] hover:bg-[#12335d] text-xs font-bold text-white border border-[#C5A059]/40 shadow-xs"
                >
                  Guardar Cambios
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Detalle de Contrato ───────────────────────────────────────── */}
      <AnimatePresence>
        {selectedContract && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full border border-[#0B2545]/10 shadow-2xl relative space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#0B2545]/10">
                <h3 className="text-base font-extrabold text-[#0B2545]">Detalle de Tutoría</h3>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-slate-200 flex items-center justify-center text-[#0B2545]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#0B2545]/10">
                  <img src={selectedContract.avatar} alt={selectedContract.proName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0B2545]">{selectedContract.proName}</h4>
                  <p className="text-xs text-[#5C6B73]">{selectedContract.category}</p>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#0B2545]/5 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-[#0B2545]">
                  <span>Monto Acordado:</span>
                  <span>{selectedContract.amount}</span>
                </div>
                <div className="flex justify-between font-semibold text-[#5C6B73]">
                  <span>Fecha:</span>
                  <span>{selectedContract.date}</span>
                </div>
                <div className="flex justify-between font-semibold text-emerald-700">
                  <span>Estado:</span>
                  <span>{selectedContract.status}</span>
                </div>
              </div>

              <p className="text-xs text-[#5C6B73] leading-relaxed">
                {selectedContract.desc}
              </p>

              <button
                onClick={() => setSelectedContract(null)}
                className="w-full py-3 rounded-full bg-[#0B2545] text-white text-xs font-bold hover:bg-[#12335d] border border-[#C5A059]/40"
              >
                Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Zoom de Evidencia ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedEvidence && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-lg w-full border border-white/20 shadow-2xl relative space-y-4"
            >
              <div className="relative h-72 w-full bg-slate-900">
                <img src={selectedEvidence.url} alt={selectedEvidence.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => setSelectedEvidence(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block">{selectedEvidence.subject}</span>
                <h3 className="text-sm font-extrabold text-[#0B2545]">{selectedEvidence.title}</h3>
                <p className="text-xs text-slate-500 font-medium">Material verificado por ClassMarket • {selectedEvidence.date}</p>
                
                <button
                  onClick={() => setSelectedEvidence(null)}
                  className="w-full py-2.5 rounded-full bg-[#0B2545] text-white text-xs font-bold hover:bg-[#12335d] mt-2 border border-[#C5A059]/40"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
            className="fixed bottom-24 left-1/2 z-50 bg-[#0B2545] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#C5A059]/40 flex items-center gap-3 text-xs font-semibold"
          >
            <Sparkles size={16} className="text-[#C5A059] shrink-0" />
            <div>
              <p className="font-bold text-white">{toastMessage.title}</p>
              <p className="text-slate-300 text-[11px] font-normal">{toastMessage.body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Navigation Bar (Matching Photo 4) ────────────────────────── */}
      <BottomNav />
    </div>
  );
}

export default function PerfilPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#0B2545]/20 border-t-[#0B2545] rounded-full animate-spin" />
        </div>
      }
    >
      <PerfilContent />
    </Suspense>
  );
}
