"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Search, 
  Bell, 
  Star, 
  MapPin, 
  ShieldCheck, 
  BookOpen, 
  Palette, 
  Repeat, 
  Laptop, 
  Sparkles,
  Menu,
  Code2,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/dashboard/BottomNav";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { id: "MatematicasCiencias", name: "Matemáticas & Ciencias", icon: BookOpen, color: "bg-[#0B2545]/10", textColor: "text-[#0B2545]" },
  { id: "TareasGuias", name: "Tareas & Guías", icon: FileText, color: "bg-[#C5A059]/15", textColor: "text-[#0B2545]" },
  { id: "TutoriasClases", name: "Tutorías & Clases", icon: Sparkles, color: "bg-[#0B2545]/15", textColor: "text-[#0B2545]" },
  { id: "ProgramacionTecnologias", name: "Programación & Tecnologías", icon: Code2, color: "bg-[#C5A059]/20", textColor: "text-[#0B2545]" },
];

const ADS = [
  { 
    id: 1, 
    title: "El Marketplace donde los Estudiantes Comparten, Intercambian y Crecen Juntos", 
    company: "ClassMarket Comunidad Escolar", 
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200", 
    link: "#"
  },
  { 
    id: 2, 
    title: "¿Tienes guías o necesitas tutoría? Conecta con compañeros de grado", 
    company: "Tutorías & Apoyo Entre Pares", 
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200", 
    link: "#"
  }
];

const FALLBACK_PROS = [
  {
    id: "f1",
    nombre_completo: "Camila Torres",
    titulo_profesional: "Tutorías de Matemáticas, Álgebra y Física de 10° y 11°",
    categoria: "MatematicasCiencias",
    precio: "$10 / h o Trueque de Guías",
    distancia_km: 0.8,
    calificacion: 5.0,
    foto_perfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&crop=face"
  },
  {
    id: "f2",
    nombre_completo: "Mateo Valenzuela",
    titulo_profesional: "Apoyo en Tareas de Química, Biología y Talleres Escolares",
    categoria: "TareasGuias",
    precio: "$7 por guía",
    distancia_km: 1.2,
    calificacion: 4.9,
    foto_perfil: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&crop=face"
  },
  {
    id: "f3",
    nombre_completo: "Sofía Salazar",
    titulo_profesional: "Clases de Inglés Conversacional & Preparación de Pruebas",
    categoria: "TutoriasClases",
    precio: "$12 / h o Intercambio",
    distancia_km: 0.4,
    calificacion: 5.0,
    foto_perfil: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&crop=face"
  },
  {
    id: "f4",
    nombre_completo: "Diego Morales",
    titulo_profesional: "Proyectos en Python, JavaScript, HTML y Scratch para Colegios",
    categoria: "ProgramacionTecnologias",
    precio: "$14 / h",
    distancia_km: 1.5,
    calificacion: 5.0,
    foto_perfil: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400&crop=face"
  },
];

export default function HomeCliente() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Usuario");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  
  // States for data
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Profile Dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editName, setEditName] = useState("");

  // Notifications state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, read: false, icon: "🎓", title: "¡Bienvenido a ClassMarket!", body: "Encuentra compañeros para tutorías, guías y trueque de libros cerca de ti.", time: "Ahora" },
    { id: 2, read: false, icon: "⭐", title: "Tutor destacado", body: "Camila Torres está disponible para asesorías de Matemáticas y Física.", time: "Hace 5 min" },
    { id: 3, read: true, icon: "🔒", title: "Custodia Segura Activa", body: "Tu saldo en garantía estudiantil está protegido hasta recibir tu tutoría.", time: "Hace 1 hora" },
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Ads carousel state
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    // ── MODO DEMO: carga inmediata sin Supabase ──
    const currentRole = localStorage.getItem("userRole");
    if (currentRole === "pro") {
      const isVerified = localStorage.getItem("isProVerified") === "true";
      window.location.replace(isVerified ? "/dashboard-pro" : "/auth/verificacion-pro");
      return;
    }

    const savedName = localStorage.getItem("userName") || "Usuario";
    const savedAvatar = localStorage.getItem("userAvatar") || null;
    setUserName(savedName);
    if (savedAvatar) setUserAvatar(savedAvatar);

    // Sync directly from Supabase session if logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        const realName = meta?.full_name || meta?.name || meta?.nombre_completo || session.user.email?.split("@")[0];
        const realAvatar = meta?.avatar_url || meta?.picture;
        if (realName) {
          setUserName(realName);
          localStorage.setItem("userName", realName);
        }
        if (realAvatar) {
          setUserAvatar(realAvatar);
          localStorage.setItem("userAvatar", realAvatar);
        }
      }
    }).catch(() => {});

    // Usar datos de demostración directamente
    setProfessionals(FALLBACK_PROS);
    setLoading(false);
  }, []);

  // Carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ADS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Filtering Logic
  const filteredProfessionals = professionals.filter((pro) => {
    const matchesSearch = 
      (pro.nombre_completo || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (pro.titulo_profesional || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory ? pro.categoria === activeCategory : true;

    return matchesSearch && matchesCategory;
  });

  // Notification Handlers
  const toggleNotif = () => {
    setIsNotifOpen(!isNotifOpen);
    setIsProfileOpen(false);
  };
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  // Profile Handlers
  const toggleProfile = () => {
    setEditName(userName);
    setIsProfileOpen(!isProfileOpen);
    setIsNotifOpen(false);
  };

  const handleSaveProfile = () => {
    setUserName(editName);
    localStorage.setItem("userName", editName);
    setIsProfileOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUserAvatar(base64String);
        localStorage.setItem("userAvatar", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9ff]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#0d1c2e]/10 border-t-[#0d1c2e] rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] font-sans pb-24 selection:bg-[#C5A059]/20 overflow-x-hidden">
      
      {/* 1. Header (ClassMarket Navbar) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#0B2545]/10 h-16 md:h-20 flex items-center">
        <div className="max-w-[1280px] mx-auto w-full px-3 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#0B2545] p-2">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/home-cliente')}>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#C5A059]/40 bg-white flex items-center justify-center p-1 shadow-sm">
                <img 
                  src="/classmarket-logo.png" 
                  alt="ClassMarket Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to stylized CM badge if file isn't loaded
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-[#0B2545] font-extrabold text-xs hidden">CM</span>
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
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/home-cliente" className="text-[#0B2545] font-bold border-b-2 border-[#C5A059] pb-1 text-sm tracking-wide">Inicio</Link>
            <Link href="/resultados?categoria=TutoriasClases" className="text-[#5C6B73] hover:text-[#0B2545] font-semibold text-sm transition-colors">Tutorías</Link>
          </nav>
          
          <div className="flex items-center gap-2 md:gap-4 relative">
            {/* Bell / Notifications */}
            <div className="relative hidden md:block">
              <button
                onClick={toggleNotif}
                className="p-2 text-[#5e6f79] hover:text-[#0B2545] transition-colors relative"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#C5A059] border-2 border-white rounded-full" />
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-12 right-0 w-80 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-center px-5 pt-5 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#0B2545]">Notificaciones</span>
                          {unreadCount > 0 && (
                            <span className="bg-[#FAF8F5] text-[#0B2545] border border-[#C5A059]/40 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs font-bold text-[#5e6f79] hover:text-[#0B2545] transition-colors">
                            Marcar todo leído
                          </button>
                        )}
                      </div>

                      {/* Notification list */}
                      <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                            className={`flex gap-3 px-5 py-4 cursor-pointer transition-colors ${
                              !notif.read ? 'bg-[#f8f9ff] hover:bg-[#FAF8F5]' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#C5A059]/20 flex items-center justify-center text-lg flex-shrink-0">
                              {notif.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm leading-tight ${!notif.read ? 'font-bold text-[#0B2545]' : 'font-medium text-[#5e6f79]'}`}>
                                  {notif.title}
                                </p>
                                {!notif.read && <span className="w-2 h-2 bg-[#C5A059] rounded-full flex-shrink-0 mt-1" />}
                              </div>
                              <p className="text-xs text-[#5e6f79] mt-0.5 line-clamp-2">{notif.body}</p>
                              <p className="text-[10px] text-gray-400 font-medium mt-1">{notif.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="px-5 py-3 border-t border-gray-100 text-center">
                        <button className="text-xs font-bold text-[#5e6f79] hover:text-[#0B2545] transition-colors">
                          Ver todas las notificaciones
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-1 text-right">
                <span className="text-xs sm:text-sm font-bold text-[#0B2545] leading-tight line-clamp-1 max-w-[120px] sm:max-w-[200px]">{userName}</span>
                <span className="text-[10px] font-bold text-[#C5A059]">Estudiante</span>
              </div>
              <div 
                onClick={toggleProfile}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C5A059]/40 cursor-pointer bg-white flex items-center justify-center relative z-50 hover:border-[#0B2545] transition-colors shadow-sm"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#0B2545] font-bold text-sm uppercase">{userName.charAt(0)}</span>
                )}
              </div>
            </div>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  {/* Invisible overlay to close dropdown when clicking outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-14 right-0 w-80 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-6 z-50 origin-top-right"
                  >
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative group cursor-pointer mb-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#FAF8F5] bg-gray-100 flex items-center justify-center shadow-sm">
                          {userAvatar ? (
                            <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[#0B2545] font-bold text-2xl uppercase">{userName.charAt(0)}</span>
                          )}
                        </div>
                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer">
                          <span className="text-xs font-bold">Cambiar</span>
                          <span className="text-[10px]">foto</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      </div>
                      <p className="text-xs font-bold text-[#5e6f79] uppercase tracking-wider mb-1">Perfil de Estudiante</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-[#0B2545] ml-1">Nombre de Usuario</label>
                        <input 
                          type="text" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full mt-1 px-4 py-3 bg-[#f8f9ff] border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/30 transition-all text-[#0B2545] font-medium"
                        />
                      </div>
                      <button 
                        onClick={handleSaveProfile}
                        className="w-full py-3 bg-[#0B2545] hover:bg-[#134074] text-[#C5A059] font-bold rounded-xl transition-all shadow-sm border border-[#C5A059]/40"
                      >
                        Guardar Cambios
                      </button>

                      <button 
                        onClick={() => router.push('/perfil')}
                        className="w-full py-3 bg-[#FAF8F5] hover:bg-[#C5A059]/15 text-[#0B2545] border border-[#C5A059]/30 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">person</span>
                        <span>Ver Perfil y Actividad</span>
                      </button>

                      <div className="border-t border-gray-100 pt-4 mt-2">
                        <button 
                          onClick={() => {
                            localStorage.removeItem("userRole");
                            localStorage.removeItem("isLoggedIn");
                            window.location.replace("/auth/login");
                          }}
                          className="w-full py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="pt-20 md:pt-32 pb-16">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          
          {/* 2. Hero Section - ClassMarket */}
          <section className="mb-8 md:mb-16 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#0B2545] text-xs md:text-sm font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
              Educación e Intercambio Real
            </div>

            <div className="relative max-w-4xl px-4">
              {/* Subtle well-distributed sparkles */}
              <Sparkles className="absolute -top-3 -left-2 text-[#C5A059] opacity-75 animate-bounce hidden sm:block" size={22} />
              <Sparkles className="absolute -top-6 right-6 text-[#C5A059] opacity-90 hidden sm:block" size={26} />
              <Sparkles className="absolute bottom-2 -right-4 text-[#D4AF37] opacity-60 hidden sm:block" size={18} />

              <h2 className="text-2xl sm:text-4xl md:text-[52px] font-extrabold text-[#0B2545] mb-4 md:mb-6 leading-tight tracking-tight">
                El Marketplace donde los Estudiantes{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B2545] via-[#C5A059] to-[#0B2545]">
                  Comparten, Intercambian y Crecen
                </span>{" "}
                Juntos
              </h2>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-[#5C6B73] font-medium mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Aprende tutorías, intercambia libros, ofrece tus talentos digitales y conecta con tus compañeros de clase en un entorno seguro.
            </p>

            {/* Hero Button: Single prominent CTA */}
            <div className="flex items-center justify-center mb-8">
              <Link 
                href="/resultados"
                className="px-8 py-3.5 rounded-full bg-[#0B2545] text-white font-bold text-sm md:text-base hover:bg-[#13335c] transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2.5 border border-[#C5A059]/40 group"
              >
                <span>Explorar Servicios Escolares</span>
                <span className="material-symbols-outlined text-base text-[#C5A059] group-hover:rotate-12 transition-transform">school</span>
              </Link>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/resultados${searchTerm.trim() ? `?q=${encodeURIComponent(searchTerm)}` : ''}`);
              }}
              className="relative w-full max-w-2xl mx-auto"
            >
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca clases de cálculo, edición de video, libros, programación..." 
                className="w-full h-12 md:h-16 pl-11 md:pl-14 pr-24 md:pr-32 rounded-full border border-[#C5A059]/30 bg-white shadow-sm focus:ring-4 focus:ring-[#C5A059]/20 focus:border-[#0B2545] transition-all text-sm md:text-base font-medium text-[#0B2545] placeholder:text-[#5C6B73]/70 outline-none"
              />
              <Search className="absolute left-3.5 md:left-5 top-1/2 -translate-y-1/2 text-[#5C6B73]" size={20} />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0B2545] text-white px-5 md:px-7 py-2 md:py-3 rounded-full font-bold text-xs md:text-sm hover:bg-[#13335c] transition-all flex items-center justify-center border border-[#C5A059]/30 cursor-pointer shadow-sm"
              >
                Buscar
              </button>
            </form>
          </section>

          {/* 3. Categories (Centered & Responsive) */}
          <section className="mb-12 md:mb-16">
            <div className="flex overflow-x-auto justify-center items-center gap-4 sm:gap-6 md:gap-8 pb-4 no-scrollbar px-4">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <Link
                    key={cat.id}
                    href={`/resultados?categoria=${cat.id}`}
                    className="flex-none flex flex-col items-center gap-3 cursor-pointer group min-w-[90px] sm:min-w-[110px]"
                  >
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] flex items-center justify-center transition-all duration-300 ${isActive ? cat.color + ' shadow-md scale-105 border-2 border-[#C5A059]' : 'bg-white shadow-sm border border-[#C5A059]/20 group-hover:' + cat.color + ' group-hover:border-[#C5A059]/50 group-hover:scale-105'}`}>
                      <Icon className={`w-8 h-8 ${isActive ? cat.textColor : 'text-[#0B2545]/70 group-hover:' + cat.textColor}`} />
                    </div>
                    <span className={`text-xs sm:text-sm font-bold text-center leading-tight transition-colors ${isActive ? 'text-[#0B2545]' : 'text-[#5C6B73] group-hover:text-[#0B2545]'}`}>
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 4. Featured Highlights Grid */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Hero Card (2 columns) */}
              <div className="lg:col-span-2 relative aspect-[16/10] md:aspect-[21/9] lg:aspect-auto lg:h-[400px] rounded-[24px] overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentAdIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={ADS[currentAdIndex].image} 
                      alt={ADS[currentAdIndex].title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c2e]/90 via-[#0d1c2e]/30 to-transparent p-6 md:p-10 flex flex-col justify-end">
                      <span className="text-xs font-bold text-[#E0F2FE] mb-2 uppercase tracking-widest">
                        {ADS[currentAdIndex].company}
                      </span>
                      <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-6 max-w-xl leading-tight">
                        {ADS[currentAdIndex].title}
                      </h2>
                      <Link 
                        href="/resultados"
                        className="bg-white text-[#0d1c2e] px-8 py-3.5 rounded-full font-bold w-fit hover:bg-gray-100 transition-colors shadow-lg"
                      >
                        Explorar Catálogo
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
                {/* Ad Indicators */}
                <div className="absolute bottom-6 right-8 flex gap-2">
                  {ADS.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentAdIndex ? 'bg-white w-6' : 'bg-white/50'}`} />
                  ))}
                </div>
              </div>

              {/* Secondary Info Card (1 column) */}
              <div className="bg-[#FAF8F5] border border-[#C5A059]/30 rounded-[24px] p-8 md:p-10 flex flex-col justify-center items-center text-center shadow-sm">
                <div className="w-20 h-20 bg-[#0B2545] rounded-full flex items-center justify-center mb-6 shadow-md border-2 border-[#C5A059]">
                  <ShieldCheck className="text-[#C5A059] w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B2545] mb-3">Comunidad Estudiantil Confiable</h3>
                <p className="text-[#5C6B73] text-sm md:text-base font-medium mb-6">
                  Perfiles estudiantiles validados, reseñas de compañeros reales e intercambios bajo custodia segura.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2545] bg-[#C5A059]/20 px-4 py-2 rounded-full border border-[#C5A059]/30">
                  <Sparkles size={14} className="text-[#C5A059]" />
                  <span>100% Sin Comisiones Ocultas</span>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Student Skills & Exchange Feed */}
          <section className="mb-16">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2545] mb-2">
                  {activeCategory ? `Estudiantes en ${activeCategory}` : "Habilidades y Trueques Disponibles"}
                </h2>
                <p className="text-[#5C6B73] font-medium text-sm md:text-base">Conecta con compañeros de tu colegio o universidad.</p>
              </div>
              <button className="text-[#0B2545] font-bold hover:text-[#C5A059] transition-colors hidden md:block">Ver Todos</button>
            </div>

            {filteredProfessionals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProfessionals.map((pro: any) => (
                  <Link 
                    key={pro.id} 
                    href={`/expertos/${pro.id}?foto=${encodeURIComponent(pro.foto_perfil || '')}&nombre=${encodeURIComponent(pro.nombre_completo || '')}&titulo=${encodeURIComponent(pro.titulo_profesional || '')}&tarifa=${encodeURIComponent(pro.precio || '')}&categoria=${encodeURIComponent(pro.categoria || '')}`}
                    className="group bg-white rounded-[24px] p-4 border border-[#C5A059]/20 hover:border-[#C5A059] hover:shadow-xl hover:shadow-[#0B2545]/5 transition-all duration-300 flex flex-col cursor-pointer"
                  >
                    <div className="relative aspect-square rounded-[18px] overflow-hidden mb-4 bg-gray-50">
                      <img 
                        src={pro.foto_perfil || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"} 
                        alt={pro.nombre_completo || "Estudiante"} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-[#C5A059]/30">
                        <Star size={14} className="fill-[#C5A059] text-[#C5A059]" />
                        <span className="text-xs font-bold text-[#0B2545]">{pro.calificacion || "5.0"}</span>
                      </div>
                      {/* Price / Trueque Badge */}
                      <div className="absolute bottom-3 left-3 bg-[#0B2545]/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-[#C5A059]/40">
                        <span className="text-[11px] font-bold text-white tracking-wide">
                          {pro.precio || "Trueque / Gratis"}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="text-base font-bold text-[#0B2545] line-clamp-1">{pro.nombre_completo}</h4>
                    <p className="text-[#5C6B73] font-medium text-xs mb-3 line-clamp-2 h-8">{pro.titulo_profesional}</p>
                    
                    <div className="flex items-center justify-between text-[#5C6B73] text-xs mb-4 mt-auto pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-[#C5A059]" />
                        <span>{pro.distancia_km ? `A ${pro.distancia_km} km` : 'Campus'}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#0B2545]">Responde rápido</span>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/chat/${pro.id}?nombre=${encodeURIComponent(pro.nombre_completo)}&servicio=${encodeURIComponent(pro.titulo_profesional)}`);
                      }}
                      className="w-full py-2.5 rounded-full bg-[#FAF8F5] text-[#0B2545] font-bold text-xs hover:bg-[#0B2545] hover:text-white transition-all border border-[#C5A059]/30 hover:border-transparent flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm text-[#C5A059]">chat</span>
                      <span>Conectar / Chatear</span>
                    </button>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
                <div className="w-16 h-16 bg-[#f8f9ff] rounded-full flex items-center justify-center mx-auto mb-4 text-[#5e6f79]">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-[#0d1c2e] mb-2">No se encontraron profesionales</h3>
                <p className="text-[#5e6f79]">Intenta buscar con otros términos o cambia la categoría.</p>
                <button 
                  onClick={() => { setSearchTerm(""); setActiveCategory(null); }}
                  className="mt-6 text-[#0d1c2e] font-bold underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
            
            <button className="w-full mt-8 py-4 bg-white border border-gray-200 rounded-full font-bold text-[#0d1c2e] md:hidden">
              Ver Todos los Profesionales
            </button>
          </section>

          {/* 6. Map CTA - Encuentra compañeros en tu campus o colegio */}
          <section className="relative rounded-[32px] overflow-hidden min-h-[340px] md:min-h-[400px] shadow-[0_20px_50px_rgba(11,37,69,0.06)] mb-12 border border-[#C5A059]/25 bg-gradient-to-br from-white via-[#FAF8F5] to-[#F5EFEB] flex items-center justify-center p-6 md:p-12">
            {/* Subtle aesthetic geometric grid */}
            <div 
              className="absolute inset-0 opacity-25 pointer-events-none" 
              style={{ 
                backgroundImage: "radial-gradient(#0B2545 1.5px, transparent 1.5px), radial-gradient(#C5A059 1.5px, transparent 1.5px)", 
                backgroundSize: "32px 32px",
                backgroundPosition: "0 0, 16px 16px"
              }} 
            />

            {/* Glowing ambient accents */}
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-[#0B2545]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[28px] shadow-[0_15px_40px_rgba(11,37,69,0.08)] text-center max-w-2xl w-full border border-white/90">
              <div className="w-16 h-16 bg-[#0B2545] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg border-2 border-[#C5A059] transform -rotate-3 hover:rotate-0 transition-transform">
                <MapPin className="text-[#C5A059] w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#0B2545] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C5A059]/30">
                <Sparkles size={13} className="text-[#C5A059]" />
                <span>Geolocalización Escolar y Universitaria</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#0B2545] mb-3 tracking-tight">
                Explora en tu Campus o Colegio
              </h3>
              <p className="text-[#5C6B73] font-medium text-sm md:text-base mb-8 max-w-lg mx-auto leading-relaxed">
                Descubre qué estudiantes ofrecen tutorías, ayuda en tareas e intercambios de guías cerca de tu colegio o barrio (Bucaramanga, Floridablanca, Piedecuesta y Girón).
              </p>
              <button
                onClick={() => router.push('/mapa-expertos')}
                className="bg-[#0B2545] text-white px-8 md:px-10 py-4 rounded-full font-bold text-sm md:text-base hover:bg-[#12335d] transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-[#C5A059] flex items-center justify-center gap-2.5 mx-auto group"
              >
                <span>Abrir Mapa de Estudiantes 📍</span>
                <span className="material-symbols-outlined text-base text-[#C5A059] group-hover:translate-x-1 transition-transform">near_me</span>
              </button>
            </div>
          </section>

        </div>
      </main>

      <BottomNav />

      {/* Global Styles for hiding scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

