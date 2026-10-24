"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  GraduationCap, 
  School, 
  Phone, 
  User, 
  DollarSign, 
  Image as ImageIcon, 
  X, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Wand2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface PortfolioItem {
  id: string;
  name: string;
  url: string;
  category: string;
}

const PRESET_SAMPLES: PortfolioItem[] = [
  {
    id: "sample-1",
    name: "Taller Resuelto de Álgebra",
    url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
    category: "Matemáticas"
  },
  {
    id: "sample-2",
    name: "Guía de Química & Balanceo",
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
    category: "Ciencias"
  },
  {
    id: "sample-3",
    name: "Mapas Mentales Saber 11",
    url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
    category: "Resumen"
  },
  {
    id: "sample-4",
    name: "Proyecto en Python Escolar",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
    category: "Programación"
  }
];

const POPULAR_SCHOOLS = [
  "Colegio La Salle Bucaramanga",
  "Colegio Panamericano",
  "Colegio San Pedro Claver",
  "Colegio La Presentación Piedecuesta",
  "Colegio Balbino García",
  "Universidad Industrial de Santander (UIS)",
  "Universidad Pontificia Bolivariana (UPB)"
];

const GRADES = [
  "9° Secundaria",
  "10° Bachillerato",
  "11° Bachillerato (Graduando)",
  "Universidad - 1° a 3° Semestre",
  "Universidad - Semestres Avanzados"
];

const SUBJECTS = [
  "Matemáticas & Álgebra",
  "Física Mecánica",
  "Química Orgánica",
  "Biología & Ciencias",
  "Inglés Conversacional",
  "Programación & Web",
  "Filosofía & Lenguaje",
  "Apoyo Escolar General"
];

export default function TutorRegisterPage() {
  const router = useRouter();

  // Form State
  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("11° Bachillerato (Graduando)");
  const [phone, setPhone] = useState("");
  const [tarifa, setTarifa] = useState("10.000");
  const [specialty, setSpecialty] = useState("Matemáticas & Álgebra");

  // Raw Notes & AI state
  const [rawNotes, setRawNotes] = useState("");
  const [enhancedBio, setEnhancedBio] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);

  // Portfolio State
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(PRESET_SAMPLES.slice(0, 2));

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill existing session / name if logged in
  useEffect(() => {
    const savedName = localStorage.getItem("userName") || localStorage.getItem("proName");
    if (savedName && savedName !== "Usuario" && savedName !== "Profesional") {
      setFullName(savedName);
    }

    const syncSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const meta = session.user.user_metadata;
          const name = meta?.nombre_completo || meta?.full_name || session.user.email?.split("@")[0];
          if (name && !fullName) setFullName(name);
          if (meta?.telefono && !phone) setPhone(meta.telefono);
        }
      } catch (err) {
        // Silent catch
      }
    };
    syncSession();
  }, []);

  // AI Bio Enhancement Handler
  const handleEnhanceWithAI = async () => {
    if (!rawNotes.trim()) {
      setError("Por favor escribe algunas notas sobre lo que puedes enseñar (ej: ayudo con cálculo de 11, física y tareas).");
      return;
    }

    setError(null);
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: rawNotes,
          name: fullName || "Estudiante Tutor",
          grade: grade,
          school: school || "Colegio de Santander"
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al mejorar con IA");
      }

      setEnhancedBio(data.enhancedBio);
      setAiSuccess(true);
      setTimeout(() => setAiSuccess(false), 4000);
    } catch (err: any) {
      console.error("AI Error:", err);
      // Local fallback in case of connection drop
      const fallback = `¡Hola! Soy ${fullName || "estudiante"}, curso ${grade} y me encanta explicar ${specialty} de forma práctica y sin enredos. Mi metodología incluye resolución paso a paso de guías escolares, ejercicios modelo y preparación para exámenes. ¡Escríbeme para coordinar tu próxima tutoría y sacar la mejor nota!`;
      setEnhancedBio(fallback);
      setAiSuccess(true);
    } finally {
      setIsAiLoading(false);
    }
  };

  // File Upload Handler (Dropzone)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target?.result as string;
        if (resultUrl) {
          setPortfolio((prev) => [
            {
              id: `upload-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              name: file.name.replace(/\.[^/.]+$/, ""),
              url: resultUrl,
              category: "Trabajo Subido"
            },
            ...prev
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add preset sample to portfolio
  const handleAddPreset = (sample: PortfolioItem) => {
    if (!portfolio.some((p) => p.id === sample.id)) {
      setPortfolio((prev) => [...prev, sample]);
    }
  };

  // Remove portfolio item
  const handleRemovePortfolio = (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
  };

  // Final Registration Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Por favor ingresa tu nombre completo.");
      return;
    }

    if (!phone.trim()) {
      setError("Por favor ingresa tu número de WhatsApp para que tus compañeros te contacten.");
      return;
    }

    const finalDescription = enhancedBio.trim() || rawNotes.trim() || `Tutorías académicas en ${specialty} para compañeros de colegio y bachillerato.`;

    setIsSubmitting(true);

    try {
      // 1. Save locally in localStorage for persistent instant state
      const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&crop=face";
      const existingAvatar = localStorage.getItem("userAvatar") || defaultAvatar;

      localStorage.setItem("userRole", "pro");
      localStorage.setItem("userName", fullName);
      localStorage.setItem("proName", fullName);
      localStorage.setItem("proAvatar", existingAvatar);
      localStorage.setItem("proSchool", school || "Colegio Santander");
      localStorage.setItem("proGrade", grade);
      localStorage.setItem("proPhone", phone);
      localStorage.setItem("proSpecialty", specialty);
      localStorage.setItem("proTarifa", `$${tarifa}/hr`);
      localStorage.setItem("proDescription", finalDescription);
      localStorage.setItem("proPortfolio", JSON.stringify(portfolio));
      localStorage.setItem("proRegistered", "true");
      localStorage.setItem("isProVerified", "true");
      localStorage.setItem("isLoggedIn", "true");

      // 2. Sync to Supabase if session exists
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase.from("perfiles_profesionales").upsert({
            id: session.user.id,
            nombre_completo: fullName,
            titulo_profesional: `Tutorías de ${specialty} (${grade})`,
            categoria: specialty,
            tarifa: `$${tarifa}/hr`,
            foto_perfil: existingAvatar,
            ciudad: "Piedecuesta, Santander",
            calificacion: 5.0,
          });
        }
      } catch (dbErr) {
        console.warn("Supabase background sync skipped (demo mode active)");
      }

      // 3. Smooth transition to Tutor Dashboard
      router.push("/dashboard-pro");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError("Ocurrió un error al guardar tu perfil. Inténtalo nuevamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#0B2545] pb-24">
      
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0B2545]/10 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/auth/login")}
              className="w-9 h-9 rounded-full bg-[#FAF8F5] hover:bg-[#0B2545]/10 border border-[#0B2545]/10 flex items-center justify-center text-[#0B2545] transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B2545] flex items-center justify-center border border-[#C5A059]/40 shadow-xs">
                <GraduationCap size={18} className="text-[#C5A059]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block leading-none">ClassMarket Tutor</span>
                <h1 className="text-base font-extrabold text-[#0B2545] leading-tight">Configura Tu Perfil de Tutor</h1>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs font-bold text-[#0B2545]">
            <Sparkles size={13} className="text-[#C5A059]" />
            <span>Paso 1 de 1: Perfil Inicial</span>
          </div>
        </div>
      </header>

      {/* ── Main Form Container ─────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        
        {/* Banner Hero */}
        <div className="mb-6 p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-[#0B2545] via-[#12335d] to-[#0B2545] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#C5A059]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/25 text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              Primera Vez Como Tutor
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              ¡Comienza a ofrecer tutorías y compartir tus habilidades!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Completa tu información básica, deja que nuestra <strong className="text-white">Inteligencia Artificial de Google</strong> redacte tu presentación académica y sube fotos de tus guías o apuntes para inspirar confianza a tus compañeros.
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-xs sm:text-sm font-semibold shadow-xs">
            <AlertCircle size={18} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* The Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ── SECTION 1: INFORMACIÓN BÁSICA ─────────────────────────────────── */}
          <section className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#0B2545]/10 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#0B2545]/10">
              <User size={20} className="text-[#C5A059]" />
              <div>
                <h3 className="text-lg font-bold text-[#0B2545]">1. Información Básica del Estudiante</h3>
                <p className="text-xs text-[#5C6B73]">Datos para que tus compañeros sepan quién eres y en qué nivel estás.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B2545] uppercase tracking-wider block">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C6B73]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Sofía Santos"
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#0B2545]/15 rounded-2xl focus:outline-none focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 text-sm font-semibold text-[#0B2545] transition-all"
                  />
                </div>
              </div>

              {/* WhatsApp Contact */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B2545] uppercase tracking-wider block">
                  Teléfono / WhatsApp de Contacto *
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C6B73]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. +57 314 892 4110"
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#0B2545]/15 rounded-2xl focus:outline-none focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 text-sm font-semibold text-[#0B2545] transition-all"
                  />
                </div>
              </div>

              {/* School / College */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B2545] uppercase tracking-wider block">
                  Colegio / Centro Educativo *
                </label>
                <div className="relative">
                  <School size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C6B73]" />
                  <input
                    type="text"
                    required
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Ej. Colegio La Salle o UIS"
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#0B2545]/15 rounded-2xl focus:outline-none focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 text-sm font-semibold text-[#0B2545] transition-all"
                  />
                </div>
                {/* Popular School suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {POPULAR_SCHOOLS.slice(0, 3).map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setSchool(item)}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#0B2545]/10 border border-[#0B2545]/10 text-[#5C6B73] transition-colors"
                    >
                      + {item.split(" ")[1] || item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B2545] uppercase tracking-wider block">
                  Grado al que perteneces *
                </label>
                <div className="relative">
                  <GraduationCap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C6B73]" />
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#0B2545]/15 rounded-2xl focus:outline-none focus:border-[#0B2545] focus:ring-2 focus:ring-[#0B2545]/10 text-sm font-semibold text-[#0B2545] transition-all appearance-none cursor-pointer"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main Subject / Specialty */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B2545] uppercase tracking-wider block">
                  Materia Principal *
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#0B2545]/15 rounded-2xl focus:outline-none focus:border-[#0B2545] text-sm font-semibold text-[#0B2545] transition-all cursor-pointer"
                >
                  {SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Hourly rate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B2545] uppercase tracking-wider block">
                  Tarifa sugerida (COP / Hora)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#0B2545] text-sm">$</span>
                  <input
                    type="text"
                    value={tarifa}
                    onChange={(e) => setTarifa(e.target.value)}
                    placeholder="10.000"
                    className="w-full pl-9 pr-14 py-3 bg-[#FAF8F5] border border-[#0B2545]/15 rounded-2xl focus:outline-none focus:border-[#0B2545] text-sm font-semibold text-[#0B2545] transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#5C6B73]">COP/hr</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 2: HABILIDADES & GEMINI AI BIO ENHANCER ───────────────── */}
          <section className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#0B2545]/10 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#0B2545]/10">
              <div className="flex items-center gap-2.5">
                <Wand2 size={20} className="text-[#C5A059]" />
                <div>
                  <h3 className="text-lg font-bold text-[#0B2545]">2. Habilidades y Descripción Académica</h3>
                  <p className="text-xs text-[#5C6B73]">Escribe notas sencillas y pulsa el botón para que Gemini AI redacte tu presentación.</p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#0B2545] border border-[#C5A059]/40 text-xs font-extrabold">
                <Sparkles size={12} className="text-[#C5A059]" />
                Gemini AI 1.5
              </span>
            </div>

            {/* Raw Notes Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0B2545] uppercase tracking-wider block">
                Tus Notas Breves / Qué temas dominas:
              </label>
              <textarea
                rows={3}
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                placeholder="Ejemplo: Ayudo con cálculo de 11, física mecánica, álgebra de Baldor y presentaciones en Canva para tareas de colegio..."
                className="w-full p-4 bg-[#FAF8F5] border border-[#0B2545]/15 rounded-2xl focus:outline-none focus:border-[#0B2545] text-sm text-[#0B2545] font-medium leading-relaxed transition-all resize-none"
              />
            </div>

            {/* AI Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#0B2545]/5 via-[#C5A059]/10 to-[#0B2545]/5 border border-[#C5A059]/30">
              <div className="flex items-center gap-2.5 text-xs text-[#0B2545]">
                <Sparkles size={18} className="text-[#C5A059] shrink-0" />
                <span>¿No sabes cómo describirte? Transforma tus notas en un texto profesional y cercano de 3 frases.</span>
              </div>

              <button
                type="button"
                onClick={handleEnhanceWithAI}
                disabled={isAiLoading || !rawNotes.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0B2545] to-[#12335d] hover:brightness-110 text-white font-extrabold text-xs shadow-md border border-[#C5A059]/50 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isAiLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Redactando con Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} className="text-[#C5A059]" />
                    <span>✨ Mejorar Presentación con IA</span>
                  </>
                )}
              </button>
            </div>

            {/* Enhanced Bio Display Box */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#0B2545] uppercase tracking-wider block">
                  Descripción Final del Perfil (visible para los estudiantes):
                </label>
                {aiSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={13} /> ¡Mejorado con éxito!
                  </span>
                )}
              </div>
              <textarea
                rows={4}
                value={enhancedBio}
                onChange={(e) => setEnhancedBio(e.target.value)}
                placeholder="Presiona el botón de IA o escribe aquí tu presentación personalizada..."
                className="w-full p-4 bg-white border-2 border-[#C5A059]/40 rounded-2xl focus:outline-none focus:border-[#0B2545] text-sm text-[#0B2545] font-medium leading-relaxed shadow-xs transition-all"
              />
              <p className="text-[11px] text-[#5C6B73]">
                Puedes editar directamente el texto generado por la IA en cualquier momento.
              </p>
            </div>
          </section>

          {/* ── SECTION 3: PORTAFOLIO / FOTOS DE TRABAJOS REALIZADOS ──────────── */}
          <section className="bg-white rounded-[28px] p-6 sm:p-8 border border-[#0B2545]/10 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#0B2545]/10">
              <div className="flex items-center gap-2.5">
                <ImageIcon size={20} className="text-[#C5A059]" />
                <div>
                  <h3 className="text-lg font-bold text-[#0B2545]">3. Portafolio & Fotos de Trabajos Realizados</h3>
                  <p className="text-xs text-[#5C6B73]">Sube fotos de tus talleres resueltos, guías o apuntes para validar tus capacidades.</p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-[#0B2545] px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#0B2545]/10">
                {portfolio.length} muestra{portfolio.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <label className="border-2 border-dashed border-[#C5A059]/40 hover:border-[#0B2545] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-[#FAF8F5] hover:bg-[#FAF8F5]/80 cursor-pointer transition-all group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-[#0B2545] group-hover:scale-110 transition-transform mb-3 border border-[#C5A059]/30">
                <Upload size={24} className="text-[#C5A059]" />
              </div>
              <h4 className="text-sm font-extrabold text-[#0B2545]">
                Haz clic o arrastra fotos de tus guías y talleres aquí
              </h4>
              <p className="text-xs text-[#5C6B73] mt-1 max-w-sm">
                Formatos permitidos: JPG, PNG, WebP. Puedes subir fotos tomadas con tu celular o capturas de pantalla de tus apuntes.
              </p>
            </label>

            {/* Current Portfolio Grid */}
            {portfolio.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-[#0B2545] uppercase tracking-wider block">
                  Fotos seleccionadas para tu perfil:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="relative group rounded-2xl overflow-hidden border border-[#0B2545]/15 aspect-square bg-slate-100 shadow-xs"
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/90 via-transparent to-transparent flex flex-col justify-end p-2.5">
                        <span className="text-white text-[11px] font-bold line-clamp-1">{item.name}</span>
                        <span className="text-[9px] text-[#C5A059] font-semibold">{item.category}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePortfolio(item.id)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center transition-colors shadow-sm"
                        title="Eliminar foto"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Preset Samples to Add */}
            <div className="pt-2 border-t border-gray-100">
              <span className="text-xs font-bold text-[#5C6B73] block mb-2">
                O agrega muestras académicas predeterminadas:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_SAMPLES.map((sample) => {
                  const alreadyAdded = portfolio.some((p) => p.id === sample.id);
                  return (
                    <button
                      type="button"
                      key={sample.id}
                      onClick={() => handleAddPreset(sample)}
                      disabled={alreadyAdded}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                        alreadyAdded
                          ? "bg-slate-100 text-slate-400 border-gray-200 cursor-default"
                          : "bg-[#FAF8F5] text-[#0B2545] border-[#C5A059]/40 hover:bg-[#0B2545] hover:text-white"
                      }`}
                    >
                      <CheckCircle2 size={13} className={alreadyAdded ? "text-emerald-500" : "text-[#C5A059]"} />
                      <span>{sample.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── SECTION 4: ACTIONS & SUBMIT ───────────────────────────────────── */}
          <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#0B2545]/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-[#5C6B73]">
              <ShieldCheck size={24} className="text-[#C5A059] shrink-0" />
              <p>
                Al guardar, tu perfil quedará activo en el mapa y en el buscador de ClassMarket. Podrás editar tus precios y horarios en cualquier momento.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#0B2545] hover:bg-[#12335d] text-white font-extrabold text-sm sm:text-base shadow-lg border border-[#C5A059]/40 flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-50 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Guardando tu perfil...</span>
                </>
              ) : (
                <>
                  <span>Guardar y Entrar al Dashboard</span>
                  <ArrowRight size={18} className="text-[#C5A059]" />
                </>
              )}
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}
