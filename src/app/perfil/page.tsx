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
  Menu,
  Briefcase,
  RefreshCw,
  ArrowLeft,
  Search,
  MessageCircle,
  Sparkles,
  BadgeCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/dashboard/BottomNav";

// Reusable Types
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

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&crop=face";

const AVATAR_PRESETS = [
  { name: "Sofía (Estudiante)", url: DEFAULT_AVATAR },
  { name: "Camila Torres (Matemáticas)", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&crop=face" },
  { name: "Mateo Valenzuela (Química)", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&crop=face" },
  { name: "Diego Morales (Informática)", url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400&crop=face" }
];

function PerfilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPublicView = searchParams.get("view") === "public";
  const publicId = searchParams.get("id");
  
  // 1. Core Profile States
  const [userName, setUserName] = useState<string>("Sofía");
  const [userAvatar, setUserAvatar] = useState<string>(DEFAULT_AVATAR);
  const [userLocation, setUserLocation] = useState<string>("Bucaramanga, Santander");
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [locationShared, setLocationShared] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerTab, setDrawerTab] = useState<"messages" | "notifications">("messages");
  
  // Form Edit States
  const [editName, setEditName] = useState<string>("");
  const [editLocation, setEditLocation] = useState<string>("");
  const [editPhoto, setEditPhoto] = useState<string>("");

  // 2. Interactive Navigation States
  const [activeTab, setActiveTab] = useState<"contratos" | "reseñas" | "escrow">("contratos");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  // Escrow Simulated Funds State
  const [escrowReleased, setEscrowReleased] = useState<boolean>(false);
  const [releasing, setReleasing] = useState<boolean>(false);
  
  // Toast State
  const [toastMessage, setToastMessage] = useState<{ title: string; body: string } | null>(null);

  // Geolocation and Reverse Geocoding via OpenStreetMap Nominatim API
  const publicProfiles: Record<string, any> = {
    "e1": { name: "Camila Torres", avatar: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=400&crop=face", location: "Bucaramanga, COL", role: "Estudiante de 11� � Tutor de Matem�ticas y F�sica", bio: "Me gusta explicar matem�ticas con ejemplos pr�cticos. Ayudo en �lgebra, trigonometr�a y preparaci�n para ex�menes con mucha paciencia." },
    "e2": { name: "Diego Morales", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&crop=face", location: "Bucaramanga, COL", role: "Estudiante de Ingenier�a � Tutor de Programaci�n", bio: "Aprendemos Python, JavaScript y l�gica desde cero con proyectos reales. Enfoque pr�ctico para iniciantes." },
    "e3": { name: "Luc�a Fern�ndez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&crop=face", location: "Floridablanca, COL", role: "Estudiante de Qu�mica � Tutor de Biolog�a y Qu�mica", bio: "Te ayudo a entender qu�mica y biolog�a con mapas mentales, res�menes claros y ejercicios guiados." },
    "e4": { name: "Mateo Valenzuela", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&crop=face", location: "Piedecuesta, COL", role: "Estudiante de 11� � Tutor de �lgebra y Geometr�a", bio: "Me gusta que mis compa�eros entiendan el porqu� de cada paso. Ejercicios resueltos juntos hasta dominar el tema." },
    "e5": { name: "Valentina R�os", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&crop=face", location: "Gir�n, COL", role: "Estudiante de Medicina Pregrado � Tutor de Biolog�a", bio: "Apoyo en biolog�a, anatom�a b�sica y t�cnicas de estudio efectivas para bachillerato y primeros semestres." },
    "e16": { name: "Mariana L�pez", avatar: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=400&crop=face", location: "Bucaramanga, COL", role: "Estudiante de 11� � Tutora de Matem�ticas", bio: "�lgebra, trigonometr�a y preparaci�n para ex�menes. Clases amables, claras y con ejercicios pr�cticos." },
    "e17": { name: "Juan Carlos P�rez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&crop=face", location: "Floridablanca, COL", role: "Estudiante de Sistemas � Tutor de Programaci�n", bio: "Aprende Python desde cero con l�gica, ejercicios y tus primeros proyectos web." },
    "e18": { name: "Laura Mart�nez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&crop=face", location: "Bucaramanga, COL", role: "Estudiante de Qu�mica � Tutora de Qu�mica y Biolog�a", bio: "Te ayudo con res�menes, mapas mentales y resoluci�n de ejercicios paso a paso." },
    "e19": { name: "Andr�s G�mez", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&crop=face", location: "Piedecuesta, COL", role: "Estudiante de Ingenier�a � Tutor de F�sica", bio: "F�sica mec�nica y electromagnetismo con enfoque pr�ctico y visual." },
    "e20": { name: "Sara Castillo", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&crop=face", location: "Gir�n, COL", role: "Estudiante de Idiomas � Tutora de Ingl�s", bio: "Ingl�s conversacional B1-B2, vocabulario pr�ctico y preparaci�n para ex�menes." },
    "e21": { name: "Miguel �ngel Torres", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&crop=face", location: "Bucaramanga, COL", role: "Estudiante de Matem�ticas � Tutor Universitario", bio: "�lgebra lineal y c�lculo diferencial con explicaciones claras y ejercicios guiados." },
    "e22": { name: "Daniela Ram�rez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&crop=face", location: "Bucaramanga, COL", role: "Estudiante de 11� � Tutora de Apoyo Escolar", bio: "Tareas, gu�as, res�menes y organizaci�n acad�mica para mejorar tu rendimiento." },
    "e23": { name: "Alejandra Vargas", avatar: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=400&crop=face", location: "Floridablanca, COL", role: "Estudiante de 11� � Tutora de Trigonometr�a", bio: "Trigonometr�a y geometr�a anal�tica con ejercicios paso a paso." },
    "e24": { name: "Sebasti�n Cardona", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&crop=face", location: "Bucaramanga, COL", role: "Estudiante de Ingenier�a � Tutor de Desarrollo Web", bio: "JavaScript, React y l�gica para crear tus primeros proyectos web." },
  };

  useEffect(() => {
    if (isPublicView && publicId && publicProfiles[publicId]) {
      const p = publicProfiles[publicId];
      setUserName(p.name);
      setUserAvatar(p.avatar);
      setUserLocation(p.location);
      setEditName(p.name);
      setEditLocation(p.location);
      setEditPhoto(p.avatar);
    }
  }, [isPublicView, publicId]);

  const detectUserLocation = (isForModal = false) => {
    if (typeof window === "undefined") return;
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
              {
                headers: {
                  "Accept-Language": "es"
                }
              }
            );
            if (res.ok) {
              const data = await res.json();
              const address = data.address;
              const city = address.city || address.town || address.village || address.suburb || address.county || address.state || "Bucaramanga";
              const country = address.country || "Colombia";
              const formattedLocation = `${city}, ${country}`;
              
              if (isForModal) {
                setEditLocation(formattedLocation);
              } else {
                setUserLocation(formattedLocation);
                localStorage.setItem("userLocation", formattedLocation);
                localStorage.setItem("locationShared", "true");
                setLocationShared(true);
              }
              
              triggerToast(
                "Ubicación Detectada", 
                `Hemos detectado tu ubicación actual: ${formattedLocation}`
              );
            }
          } catch (err) {
            console.error("Error reverse geocoding location:", err);
            if (isForModal) {
              alert("No se pudo obtener la ubicación. Por favor escríbela manualmente.");
            }
          }
        },
        (error) => {
          console.warn("Geolocation permission error: ", error);
          if (isForModal) {
            alert("No pudimos acceder a tu ubicación actual. Revisa los permisos de tu navegador.");
          }
        }
      );
    } else if (isForModal) {
      alert("La geolocalización no está soportada en tu navegador.");
    }
  };

  // Initialize and Seed Profile Data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("userName");
      const savedAvatar = localStorage.getItem("userAvatar");
      const savedLocation = localStorage.getItem("userLocation");
      const savedShared = localStorage.getItem("locationShared");

      if (savedName) setUserName(savedName);

      if (savedAvatar) setUserAvatar(savedAvatar);
      else localStorage.setItem("userAvatar", DEFAULT_AVATAR);

      if (savedShared === "true") {
        setLocationShared(true);
      }

      if (savedLocation) {
        setUserLocation(savedLocation);
        // If it is the default location AND the user already accepted geolocation, auto-detect
        if (savedLocation === "Ciudad de México (CDMX)" && savedShared === "true") {
          detectUserLocation(false);
        }
      } else {
        localStorage.setItem("userLocation", "Ciudad de México (CDMX)");
        if (savedShared === "true") {
          detectUserLocation(false);
        }
      }
    }
  }, []);

  // Show customized Toast notifications
  const triggerToast = (title: string, body: string) => {
    setToastMessage({ title, body });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle manual saving
  const handleSaveProfile = () => {
    if (!editName.trim()) {
      alert("Por favor introduce un nombre válido.");
      return;
    }
    setUserName(editName);
    setUserLocation(editLocation);
    setUserAvatar(editPhoto);
    
    localStorage.setItem("userName", editName);
    localStorage.setItem("userLocation", editLocation);
    localStorage.setItem("userAvatar", editPhoto);

    setIsEditOpen(false);
    triggerToast("Perfil Actualizado", "Tus datos personales y foto de avatar se han guardado con éxito.");
  };

  // Process Custom File uploads to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditPhoto(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Release Escrow payment
  const handleReleaseEscrow = () => {
    setReleasing(true);
    setTimeout(() => {
      setReleasing(false);
      setEscrowReleased(true);
      triggerToast(
        "Pago Autorizado", 
        "El saldo en garantía de $14.00 USD ha sido transferido de forma segura a la cuenta de Mateo Valenzuela."
      );
    }, 1500);
  };

  // Data mocks
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
    },
    {
      id: "CM-2026-04",
      proName: "Diego Morales",
      avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400&crop=face",
      category: "Proyectos en Python e Informática",
      date: "Febrero, 2026",
      amount: "$14.00 USD",
      status: "Completado",
      desc: "Tutoría para entrega de proyecto escolar de programación en Python. Se implementaron algoritmos de búsqueda y estructuras de datos básicas."
    }
  ];

  const reseñas: Review[] = [
    {
      id: 1,
      proName: "Camila Torres",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&crop=face",
      category: "Tutoría de Álgebra y Física",
      date: "May, 2026",
      stars: 5,
      comment: "Excelente compañera y tutora. Me explicó cálculo con muchísima paciencia y logré pasar el examen con 4.8. Súper recomendada.",
      publishDate: "20 de May, 2026"
    },
    {
      id: 2,
      proName: "Mateo Valenzuela",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&crop=face",
      category: "Guías de Química Orgánica",
      date: "Abr, 2026",
      stars: 5,
      comment: "El taller de química orgánica quedó impecable. Todos los pasos explicados y la entrega fue puntual antes de la clase.",
      publishDate: "15 de Abr, 2026"
    },
    {
      id: 3,
      proName: "Sofía Salazar",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&crop=face",
      category: "Clases de Inglés Saber 11",
      date: "Mar, 2026",
      stars: 4.9,
      comment: "Muy buena sesión de repaso para el Saber 11. Me ayudó a ganar confianza en las lecturas largas y resolver rápido.",
      publishDate: "28 de Mar, 2026"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#f8f9ff] font-sans pb-24 selection:bg-[#E0F2FE]">
      {/* Decorative Blob backgrounds */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-200/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-pink-100/10 rounded-full blur-[60px] pointer-events-none" />

      {/* 1. Header (Standardized styling with Home) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e6eeff] h-16 md:h-20 flex items-center">
        <div className="max-w-[1280px] mx-auto w-full px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#0B2545] p-2">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
              localStorage.setItem("userRole", "client");
              window.location.href = '/home-cliente';
            }}>
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
          
          {/* Header Location Prompt Widget (Replaces Desktop Navigation) */}
          {!locationShared ? (
            <div className="hidden md:flex items-center gap-4 bg-[#f0f9ff] border border-sky-100 px-4 py-2 rounded-full shadow-[0_4px_12px_rgba(2,136,209,0.04)] transition-all duration-300">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <span className="text-xs font-semibold text-[#0d1c2e] tracking-tight">¿Deseas compartir tu ubicación actual para tu perfil?</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    detectUserLocation(false);
                  }}
                  className="px-3 py-1 bg-[#0288D1] hover:bg-[#0277bd] text-white text-xs font-bold rounded-full transition-all active:scale-95 shadow-sm"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem("locationShared", "denied");
                    setLocationShared(true);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#5e6f79] text-xs font-bold rounded-full transition-all"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-slate-100/70">
              <MapPin size={14} className="text-sky-500 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Ubicación GPS</span>
                <span className="text-xs font-extrabold text-[#0d1c2e] leading-tight line-clamp-1 max-w-[160px]">{userLocation}</span>
              </div>
              <button
                onClick={() => detectUserLocation(false)}
                className="ml-2 p-1.5 bg-white hover:bg-sky-50 text-[#0288D1] rounded-full border border-slate-100 transition-all active:scale-95 flex items-center justify-center shadow-sm"
                title="Actualizar Ubicación automáticamente"
              >
                <RefreshCw size={10} className="text-[#0288D1]" />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <div 
              onClick={() => {
                setIsDrawerOpen(true);
                setDrawerTab("notifications");
              }}
              className="relative p-2 hover:bg-slate-100 rounded-full transition-all cursor-pointer hidden md:block"
            >
              <Bell size={22} className="text-[#5e6f79]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#e6eeff] bg-white flex items-center justify-center cursor-pointer shrink-0">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#0d1c2e] font-bold text-sm uppercase">{userName.charAt(0)}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Sticky Profile Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 h-fit">
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_15px_40px_rgba(13,28,46,0.03)] border border-[#e6eeff] flex flex-col items-center text-center">
              
              {/* Avatar Uploader Indicator */}
              <div className="relative mb-6">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full p-1.5 bg-gradient-to-tr from-sky-300 via-pink-300 to-indigo-300 relative group overflow-hidden">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white shadow-inner flex items-center justify-center">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Client avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#0d1c2e] font-bold text-4xl uppercase">{userName.charAt(0)}</span>
                    )}
                  </div>
                  
                  {/* Camera overlay */}
                  <button 
                    onClick={() => {
                      setEditName(userName);
                      setEditLocation(userLocation);
                      setEditPhoto(userAvatar);
                      setIsEditOpen(true);
                    }}
                    className="absolute inset-1.5 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-white"
                  >
                    <Camera size={20} />
                  </button>
                </div>
              </div>

              {/* User Bio */}
              <h2 className="text-xl font-bold text-[#0d1c2e] mb-1 line-clamp-1">{userName}</h2>
              
              <div className="flex items-center gap-1 text-[#5e6f79] text-xs font-semibold mb-4 bg-slate-50 px-3 py-1 rounded-full">
                <MapPin size={12} className="text-sky-500" />
                <span>{userLocation}</span>
              </div>

              <div className="w-full border-t border-slate-100 my-4"></div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4 w-full text-center mb-6">
                <div className="bg-[#f8f9ff] p-3 rounded-2xl border border-[#e6eeff]/60">
                  <span className="text-[10px] font-bold text-[#5e6f79] uppercase block tracking-wider mb-0.5">TRABAJOS</span>
                  <p className="text-lg font-black text-[#0d1c2e]">{trabajos.length}</p>
                </div>
                <div className="bg-[#f8f9ff] p-3 rounded-2xl border border-[#e6eeff]/60">
                  <span className="text-[10px] font-bold text-[#5e6f79] uppercase block tracking-wider mb-0.5">RESEÑAS</span>
                  <p className="text-lg font-black text-pink-600">{reseñas.length}</p>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button 
                onClick={() => {
                  setEditName(userName);
                  setEditLocation(userLocation);
                  setEditPhoto(userAvatar);
                  setIsEditOpen(true);
                }}
                className="w-full py-3.5 bg-[#0d1c2e] hover:bg-[#233144] text-white rounded-full font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Editar Perfil</span>
              </button>
            </div>
          </aside>

          {/* Right Column: Multi-tab Activity Dashboard */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            
            {/* Tab Controller */}
            <div className="bg-white rounded-full p-1.5 shadow-[0_8px_30px_rgba(13,28,46,0.02)] border border-[#e6eeff] flex w-full">
              <button 
                onClick={() => setActiveTab("contratos")}
                className={`flex-1 py-3 px-2 text-center rounded-full text-xs md:text-sm font-bold transition-all ${
                  activeTab === "contratos" 
                    ? "bg-[#E0F2FE] text-[#0288D1]" 
                    : "text-[#5e6f79] hover:text-[#0d1c2e]"
                }`}
              >
                Trabajos Contratados
              </button>
              <button 
                onClick={() => setActiveTab("reseñas")}
                className={`flex-1 py-3 px-2 text-center rounded-full text-xs md:text-sm font-bold transition-all ${
                  activeTab === "reseñas" 
                    ? "bg-[#FCE4EC] text-[#D81B60]" 
                    : "text-[#5e6f79] hover:text-[#0d1c2e]"
                }`}
              >
                Nuestras Reseñas
              </button>
              <button 
                onClick={() => setActiveTab("escrow")}
                className={`flex-1 py-3 px-2 text-center rounded-full text-xs md:text-sm font-bold transition-all ${
                  activeTab === "escrow" 
                    ? "bg-[#E8F5E9] text-[#2E7D32]" 
                    : "text-[#5e6f79] hover:text-[#0d1c2e]"
                }`}
              >
                Garantías y Escrow
              </button>
            </div>

            {/* Dynamic Content Panel */}
            <div className="min-h-[400px]">
              
              {/* Tab 1: Contracted Jobs */}
              {activeTab === "contratos" && (
                <div className="space-y-4">
                  {trabajos.map((trabajo) => (
                    <div 
                      key={trabajo.id} 
                      className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#e6eeff] hover:border-sky-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-inner">
                          <img src={trabajo.avatar} alt={trabajo.proName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[#0d1c2e] text-base group-hover:text-[#0288D1] transition-colors">{trabajo.proName}</h3>
                            <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{trabajo.status}</span>
                          </div>
                          <p className="text-xs text-[#5e6f79] font-medium mt-0.5">{trabajo.category} • {trabajo.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                        <div className="text-left md:text-right">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">MONTO</span>
                          <span className="text-sm font-extrabold text-[#0d1c2e]">{trabajo.amount}</span>
                        </div>
                        <button 
                          onClick={() => setSelectedContract(trabajo)}
                          className="px-6 py-2.5 bg-slate-50 hover:bg-[#E0F2FE] hover:text-[#0288D1] border border-slate-100 rounded-full font-bold text-xs text-[#0d1c2e] transition-colors shadow-sm active:scale-95"
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Reviews Written by User */}
              {activeTab === "reseñas" && (
                <div className="space-y-4">
                  {reseñas.map((reseña) => (
                    <div 
                      key={reseña.id} 
                      className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#e6eeff] hover:border-pink-200 transition-all"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 shrink-0">
                          <img src={reseña.avatar} alt={reseña.proName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <h4 className="font-bold text-[#0d1c2e] text-sm">Reseña para {reseña.proName}</h4>
                              <p className="text-[11px] text-[#5e6f79] font-medium">{reseña.category} • Contratado en {reseña.date}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                              <Star size={14} className="fill-[#C5A059] text-[#C5A059]" />
                              <span>{reseña.stars.toFixed(1)}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-600 mt-3 leading-relaxed bg-[#f8f9ff]/60 p-4 rounded-2xl border border-slate-50">
                            "{reseña.comment}"
                          </p>
                          
                          <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-[#5e6f79] uppercase tracking-wider">
                            <span>Publicado el {reseña.publishDate}</span>
                            <span className="text-[#0288D1] flex items-center gap-1">
                              <ShieldCheck size={14} /> Verificada por Escrow
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Guarantees and Custody (Escrow) */}
              {activeTab === "escrow" && (
                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-[#e6eeff]">
                  
                  {/* Card Header Info */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-inner">
                        <img 
                          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&crop=face" 
                          alt="Mateo Valenzuela" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest block mb-0.5">CONTRATO ACTIVO</span>
                        <h3 className="font-extrabold text-[#0B2545] text-lg leading-tight">Mateo Valenzuela</h3>
                        <p className="text-xs text-[#5C6B73] font-medium mt-0.5">Tutoría de Química y Biología</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#FAF8F5] border border-[#C5A059]/30 text-[#0B2545] px-4 py-2 rounded-2xl flex flex-col text-right">
                      <span className="text-[8px] font-bold uppercase tracking-wider block text-[#5C6B73]">FONDOS EN GARANTÍA</span>
                      <span className="text-lg font-black leading-none text-[#0B2545]">$14.00 USD</span>
                    </div>
                  </div>

                  {/* Escrow Steps Progression */}
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-[#0d1c2e] mb-4">Progreso del Fideicomiso Escrow</h4>
                    
                    <div className="relative">
                      {/* Grey Bar */}
                      <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 rounded-full z-0" />
                      {/* Filled Active Green Bar */}
                      <div 
                        className="absolute top-5 left-6 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-700" 
                        style={{ width: escrowReleased ? "100%" : "66%" }}
                      />

                      <div className="relative z-10 grid grid-cols-3 gap-2">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            ✓
                          </div>
                          <span className="text-[10px] font-extrabold text-[#0d1c2e] mt-2 block uppercase tracking-wider">Depositado</span>
                          <span className="text-[9px] text-[#5e6f79] mt-0.5">04 May, 2026</span>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            ✓
                          </div>
                          <span className="text-[10px] font-extrabold text-[#0d1c2e] mt-2 block uppercase tracking-wider">Entregado</span>
                          <span className="text-[9px] text-[#5e6f79] mt-0.5">14 May, 2026</span>
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-300 ${
                            escrowReleased ? "bg-emerald-500 text-white" : "bg-white text-emerald-500 border-2 border-emerald-500"
                          }`}>
                            {escrowReleased ? "✓" : "3"}
                          </div>
                          <span className="text-[10px] font-extrabold text-[#0d1c2e] mt-2 block uppercase tracking-wider">Liberado</span>
                          <span className="text-[9px] text-[#5e6f79] mt-0.5">
                            {escrowReleased ? "Hoy" : "Pendiente"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alert notification block */}
                  <div className="bg-[#f8f9ff] border border-[#e6eeff] p-5 rounded-2xl flex gap-3 items-start mb-6">
                    <Info className="text-sky-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-[#5e6f79] leading-relaxed">
                      El trabajo ha sido entregado en la plataforma. Por favor, revisa detalladamente que todos los entregables acordados funcionen de manera correcta antes de presionar el botón de liberación de fondos. Una vez liberados, los fondos se transferirán permanentemente al contratista.
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => router.push("/chat/f2")}
                      className="flex-1 min-w-[150px] py-3.5 border border-slate-200 hover:bg-slate-50 text-[#0d1c2e] rounded-full font-bold text-sm shadow-sm transition-all"
                    >
                      Hablar con Mateo
                    </button>
                    
                    <button 
                      onClick={handleReleaseEscrow}
                      disabled={escrowReleased || releasing}
                      className={`flex-2 min-w-[200px] py-3.5 rounded-full font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                        escrowReleased 
                          ? "bg-emerald-100 text-emerald-700 cursor-default" 
                          : "bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95"
                      }`}
                    >
                      {releasing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Liberando Fondos...</span>
                        </>
                      ) : escrowReleased ? (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Fondos Liberados</span>
                        </>
                      ) : (
                        <>
                          <Unlock size={16} />
                          <span>Autorizar y Liberar Pago</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* 2. Success Toast System */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 right-4 md:right-8 bg-white rounded-3xl p-5 shadow-[0_12px_40px_rgba(13,28,46,0.12)] border border-[#e6eeff] flex gap-4 max-w-sm w-full z-50 pointer-events-auto"
          >
            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 text-emerald-500">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-extrabold text-[#0d1c2e] text-sm">{toastMessage.title}</h4>
              <p className="text-xs text-[#5e6f79] mt-0.5 leading-relaxed">{toastMessage.body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Reusable Contract Details Modal */}
      <AnimatePresence>
        {selectedContract && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[2rem] p-6 md:p-8 max-w-xl w-full shadow-2xl border border-[#e6eeff] relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">RESUMEN DEL CONTRATO</span>
                  <h3 className="text-xl font-extrabold text-[#0B2545] tracking-tight">{selectedContract.proName}</h3>
                  <p className="text-xs text-[#5e6f79] font-medium mt-0.5">{selectedContract.category} • Habilitado el {selectedContract.date}</p>
                </div>
                <button 
                  onClick={() => setSelectedContract(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all text-[#5e6f79]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6">
                
                {/* Description */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">DESCRIPCIÓN DEL PROYECTO</label>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                    {selectedContract.desc}
                  </p>
                </div>

                {/* Amount and ID grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f8f9ff] border border-[#e6eeff]/60 p-4 rounded-2xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ID DEL CONTRATO</span>
                    <p className="text-sm font-bold text-[#0d1c2e] mt-0.5 font-mono">{selectedContract.id}</p>
                  </div>
                  <div className="bg-[#f8f9ff] border border-[#e6eeff]/60 p-4 rounded-2xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL PAGADO</span>
                    <p className="text-sm font-bold text-pink-600 mt-0.5">{selectedContract.amount}</p>
                  </div>
                </div>

                {/* Digital Verification seal */}
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex gap-3 items-center">
                  <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                  <div className="text-left">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">CUSTODIA ESCROW FIRMADA</span>
                    <p className="text-[10px] text-emerald-700 leading-none mt-0.5 font-semibold">
                      Transacción sellada digitalmente e inalterable bajo protocolo seguro de fideicomiso.
                    </p>
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="flex gap-4 mt-8 pt-5 border-t border-slate-100">
                <button 
                  onClick={() => setSelectedContract(null)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] rounded-full font-bold text-xs transition-colors shadow-sm"
                >
                  Cerrar Detalles
                </button>
                <button 
                  onClick={() => {
                    setSelectedContract(null);
                    triggerToast("Descarga de Contrato", "El comprobante de contrato digital se ha descargado correctamente en tu dispositivo.");
                  }}
                  className="flex-1 py-3.5 bg-sky-50 hover:bg-[#E0F2FE] text-[#0288D1] rounded-full font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <FileText size={14} />
                  <span>Descargar PDF</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Edit Profile Modal Dialog */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#e6eeff] relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-[#0B2545] tracking-tight">Editar Datos de Perfil</h3>
                  <p className="text-xs text-[#5e6f79] font-medium mt-0.5">Mantén tu información actualizada para la comunidad.</p>
                </div>
                <button 
                  onClick={() => setIsEditOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all text-[#5e6f79]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-5">
                
                {/* Photo Preview & Custom Selector */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative group cursor-pointer mb-3">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-50 shadow-md bg-slate-100 flex items-center justify-center">
                      {editPhoto ? (
                        <img src={editPhoto} alt="User Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[#0d1c2e] font-bold text-2xl uppercase">U</span>
                      )}
                    </div>
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer text-[10px] font-bold">
                      <Camera size={14} className="mb-0.5" />
                      <span>Cargar</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Foto de Perfil</span>
                </div>

                {/* Preset Avatars Selection */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Selecciona un Preset Profesional</label>
                  <div className="grid grid-cols-4 gap-3">
                    {AVATAR_PRESETS.map((preset, index) => (
                      <button 
                        key={index}
                        onClick={() => setEditPhoto(preset.url)}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-transform duration-200 hover:scale-105 shrink-0 bg-slate-50 ${
                          editPhoto === preset.url ? "border-[#0288D1] scale-105" : "border-slate-100"
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={`Preset ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name field */}
                <div>
                  <label className="text-[10px] font-bold text-[#0d1c2e] uppercase tracking-wider ml-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0288D1] focus:ring-2 focus:ring-[#E0F2FE] transition-all text-[#0d1c2e] font-medium"
                    placeholder="Introduce tu nombre..."
                  />
                </div>

                {/* Location field with GPS Autodetect */}
                <div>
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold text-[#0d1c2e] uppercase tracking-wider">Ubicación / Ciudad</label>
                    <button
                      type="button"
                      onClick={() => detectUserLocation(true)}
                      className="text-[10px] text-[#0288D1] hover:text-[#0277bd] font-bold flex items-center gap-0.5 cursor-pointer transition-colors"
                    >
                      <MapPin size={10} />
                      <span>Autodetectar GPS</span>
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0288D1] focus:ring-2 focus:ring-[#E0F2FE] transition-all text-[#0d1c2e] font-medium"
                    placeholder="Ej. Bucaramanga, Colombia"
                  />
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="flex gap-4 mt-8 pt-5 border-t border-slate-100">
                <button 
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] rounded-full font-bold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 py-3.5 bg-[#0288D1] hover:bg-[#0277bd] text-white rounded-full font-bold text-xs transition-colors shadow-md"
                >
                  Guardar Cambios
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sliding Messages & Notifications Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            key="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[999] pointer-events-auto"
          />
        )}
        
        {isDrawerOpen && (
          <motion.div
            key="drawer-body"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[1000] flex flex-col pointer-events-auto"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#e6eeff] flex justify-between items-center bg-[#f8f9ff]">
              <div>
                <h4 className="font-extrabold text-xl text-[#0d1c2e] tracking-tight">Centro de Actividad</h4>
                <p className="text-xs text-[#5e6f79] font-semibold mt-0.5">Mensajes y notificaciones recientes</p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center text-[#5e6f79]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="px-6 py-3 border-b border-[#e6eeff] flex gap-2">
              <button
                onClick={() => setDrawerTab("messages")}
                className={`flex-1 py-2 text-center rounded-full text-xs font-bold transition-all ${
                  drawerTab === "messages"
                    ? "bg-[#E0F2FE] text-[#0288D1]"
                    : "text-[#5e6f79] hover:text-[#0d1c2e]"
                }`}
              >
                Mensajes (1)
              </button>
              <button
                onClick={() => setDrawerTab("notifications")}
                className={`flex-1 py-2 text-center rounded-full text-xs font-bold transition-all ${
                  drawerTab === "notifications"
                    ? "bg-[#FCE4EC] text-[#D81B60]"
                    : "text-[#5e6f79] hover:text-[#0d1c2e]"
                }`}
              >
                Notificaciones (3)
              </button>
            </div>

            {/* Drawer Content Panel */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {drawerTab === "messages" ? (
                <div className="space-y-4">
                  {/* Msg 1 */}
                  <div 
                    onClick={() => {
                      setIsDrawerOpen(false);
                      router.push("/chat/f2");
                    }}
                    className="p-4 rounded-[2rem] bg-sky-50/40 border border-sky-100/50 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer relative"
                  >
                    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-inner">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr7PKkLTLkZtiZc6R7YN01A70SXNomxN6ykcs-mH7V-Et7rS5d8yUVZx3yoyrBqSMpxKTAkyrY2VbEGwTK22uFPObfQXfUYFY96AVlHZyh5uXL07hecOI0GHHGax9RsF3DbhyAX9WgawyfCvmK6MSsvVnY23Nxsl1SI_mEDl5mhVihCF1kWpizNBEyM4mD-hIX8Z3GrXPyjOy4CQi5BCaOfO87HR6pmsL6dDdrcsLoJpYeNHiokz6v-sJ2mzu72uQD0ToW9MT39g"
                        alt="Alex"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-sm text-[#0d1c2e]">Alex Martínez</span>
                        <span className="text-[10px] text-[#0288D1] font-bold">2 min</span>
                      </div>
                      <p className="text-xs text-[#5e6f79] line-clamp-2 font-medium">¡Hola Mariana! He subido los entregables de la Fase 1. Quedo atento a tu revisión...</p>
                    </div>
                    <span className="absolute top-4 right-4 w-2 h-2 bg-pink-500 rounded-full"></span>
                  </div>

                  {/* Msg 2 */}
                  <div 
                    onClick={() => {
                      setIsDrawerOpen(false);
                      router.push("/chat/f1");
                    }}
                    className="p-4 rounded-[2rem] bg-white border border-[#e6eeff] flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-inner">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWc_kFd0aemAFl39YK6A86WDQZy9EtY8k_kFwtYsbWZ1-6CjnBpIbAFWF1AM9ck39dCop7Gx73h9-BMcjHkseZNl2e5n-Sxjuhco-zmrwEBqHlyQ7mVNc8bx-t9xZ-XYy1wld7BikSYng8qybJcwiG-NKYgRA01V9O9ZmfTqyJdSDqBBYzpL1nX-w1hcBHwcywCWQ_Ssfyo2FZ8i4OxHoxNDY20FtUWLfr8DdkgJhLSgZoaVVRDbR84AAJ38WvAsjVpwlXSYxW0Q"
                        alt="Elena"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-sm text-[#0d1c2e]">Elena Varas</span>
                        <span className="text-[10px] text-[#5e6f79] font-medium">1 h</span>
                      </div>
                      <p className="text-xs text-[#5e6f79] line-clamp-2 font-medium">Perfecto, ya recibí el comprobante del depósito de garantía. Mañana iniciamos con el análisis.</p>
                    </div>
                  </div>

                  {/* Msg 3 */}
                  <div 
                    onClick={() => {
                      setIsDrawerOpen(false);
                      router.push("/chat/f10");
                    }}
                    className="p-4 rounded-[2rem] bg-white border border-[#e6eeff] flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-inner">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLfMkE0eIjiorpTX7KHrhhNVU5H8sfQ91m-dTGBkgScoChIpAdGqqpGqdOA2RA0zzp-r9S1Bf18i9sHg1DyFmGqFksmDeb9Q1R5aohsKkGi5-iedYVECItlTDvBs08zyOfFyWQU2xD52GIxwo9UMSkuyIdtJcux8Ifklbj-fWCB1QMgHCv-MEzegoUUbuAPiV29v3IArh25MXHCfkA9gvU6zPqRgZoW54o1_sA2utOEobe1PQEMh09AsXfWu4rUIcDiNWJBQg0Mg"
                        alt="Carlos"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-sm text-[#0d1c2e]">Carlos Mendoza</span>
                        <span className="text-[10px] text-[#5e6f79] font-medium">1 d</span>
                      </div>
                      <p className="text-xs text-[#5e6f79] line-clamp-2 font-medium">¡Muchas gracias por la excelente reseña, Mariana! Fue un placer remodelar tu espacio.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Notif 1 */}
                  <div className="p-4 rounded-[2rem] bg-emerald-50/70 border border-emerald-100 flex gap-3">
                    <Unlock className="text-emerald-500 shrink-0 mt-0.5 animate-pulse" size={16} />
                    <div>
                      <h5 className="font-bold text-sm text-emerald-900 leading-tight">Garantía Escrow Retenida</h5>
                      <p className="text-xs text-emerald-700 mt-1 font-medium leading-relaxed">
                        El depósito de $1,224.00 ha sido resguardado de forma segura en fideicomiso para el proyecto de Alex Martínez.
                      </p>
                      <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider block mt-2">5 MINUTOS</span>
                    </div>
                  </div>

                  {/* Notif 2 */}
                  <div className="p-4 rounded-[2rem] bg-sky-50/70 border border-sky-100 flex gap-3">
                    <FileText className="text-sky-500 shrink-0 mt-0.5" size={16} />
                    <div>
                      <h5 className="font-bold text-sm text-sky-900 leading-tight">Entregables Recibidos</h5>
                      <p className="text-xs text-sky-700 mt-1 font-medium leading-relaxed">
                        Alex Martínez ha subido los archivos fuente y documentación técnica de la Fase 1 a la sala de evidencias.
                      </p>
                      <span className="text-[9px] text-sky-600 font-bold uppercase tracking-wider block mt-2">2 HORAS</span>
                    </div>
                  </div>

                  {/* Notif 3 */}
                  <div className="p-4 rounded-[2rem] bg-pink-50/50 border border-pink-100 flex gap-3">
                    <Star className="text-pink-500 fill-pink-500 shrink-0 mt-0.5" size={16} />
                    <div>
                      <h5 className="font-bold text-sm text-pink-900 leading-tight">Nueva Calificación</h5>
                      <p className="text-xs text-pink-700 mt-1 font-medium leading-relaxed">
                        Carlos Mendoza te ha calificado con 5 estrellas por tu excelente comunicación y puntualidad en el pago.
                      </p>
                      <span className="text-[9px] text-pink-600 font-bold uppercase tracking-wider block mt-2">1 DÍA</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Mobile bottom nav bar */}
      <BottomNav />
    </div>
  );
}

 e x p o r t   d e f a u l t   f u n c t i o n   P e r f i l P a g e ( )   { 
     r e t u r n   ( 
         < S u s p e n s e   f a l l b a c k = { < d i v   c l a s s N a m e = ' m i n - h - s c r e e n   f l e x   i t e m s - c e n t e r   j u s t i f y - c e n t e r   b g - [ # F A F 8 F 5 ] ' > < d i v   c l a s s N a m e = ' w - 1 0   h - 1 0   b o r d e r - 4   b o r d e r - [ # 0 B 2 5 4 5 ] / 1 0   b o r d e r - t - [ # 0 B 2 5 4 5 ]   r o u n d e d - f u l l   a n i m a t e - s p i n '   / > < / d i v > } > 
             < P e r f i l C o n t e n t   / > 
         < / S u s p e n s e > 
     ) ; 
 } 
 
 
 
