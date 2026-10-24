"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  User, 
  Shield, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Star, 
  CheckCircle2, 
  Bell, 
  Settings, 
  LogOut, 
  FileText, 
  MessageSquare,
  ArrowUpRight,
  Zap,
  ChevronRight,
  Edit2,
  Camera,
  Loader2,
  X,
  MapPin,
  ThumbsUp,
  History,
  Check,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/dashboard/BottomNav";

export default function DashboardPro() {
  const [nombre, setNombre] = useState("Profesional");
  const [especialidad, setEspecialidad] = useState("Desarrollo de Software");
  const [avatar, setAvatar] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tarifa, setTarifa] = useState("35");
  const [experiencia, setExperiencia] = useState("3");
  const [ubicacion, setUbicacion] = useState("Medellín, Colombia");
  const [certificadosCount, setCertificadosCount] = useState("1");
  const [loading, setLoading] = useState(true);

  // States for Profile Edit Modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editNombre, setEditNombre] = useState("");
  const [editEspecialidad, setEditEspecialidad] = useState("");
  const [editTarifa, setEditTarifa] = useState("");
  const [editExperiencia, setEditExperiencia] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editUbicacion, setEditUbicacion] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  // GPS state variables
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "success" | "estimated">("idle");

  // States for Withdraw Funds Modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [withdrawAmount, setWithdrawAmount] = useState("4250.00");
  const [withdrawStatus, setWithdrawStatus] = useState<"idle" | "processing" | "success">("idle");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [walletPhone, setWalletPhone] = useState("");
  const [isFundsWithdrawn, setIsFundsWithdrawn] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Read details from localStorage set during verification
    const savedName = localStorage.getItem("userName") || localStorage.getItem("proName");
    const savedSpec = localStorage.getItem("proSpecialty");
    const savedAv = localStorage.getItem("proAvatar");
    const savedDesc = localStorage.getItem("proDescription");
    const savedTarifa = localStorage.getItem("proTarifa");
    const savedExp = localStorage.getItem("proExperiencia");
    const savedLocation = localStorage.getItem("proLocation");
    const savedCertCount = localStorage.getItem("proCertificadosCount");

    if (savedName) setNombre(savedName);
    if (savedSpec) setEspecialidad(savedSpec);
    if (savedAv) setAvatar(savedAv);
    if (savedDesc) setDescripcion(savedDesc);
    if (savedTarifa) setTarifa(savedTarifa);
    if (savedExp) setExperiencia(savedExp);
    if (savedLocation) setUbicacion(savedLocation);
    if (savedCertCount) setCertificadosCount(savedCertCount);

    // Sync from Supabase session directly for bulletproof accuracy
    const syncSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const meta = session.user.user_metadata;
          const regName = meta?.nombre_completo || meta?.full_name || session.user.email?.split("@")[0];
          if (regName) {
            setNombre(regName);
            localStorage.setItem("userName", regName);
            localStorage.setItem("proName", regName);
          }
        }
      } catch (err) {
        console.error("Error syncing session:", err);
      }
    };
    syncSession();
    
    setLoading(false);
  }, []);

  const handleOpenProfileModal = () => {
    setEditNombre(nombre);
    setEditEspecialidad(especialidad);
    setEditTarifa(tarifa);
    setEditExperiencia(experiencia);
    setEditDescripcion(descripcion);
    setEditUbicacion(ubicacion);
    setEditAvatar(avatar);
    setShowProfileModal(true);
  };

  const handleSaveProfile = () => {
    setNombre(editNombre);
    setEspecialidad(editEspecialidad);
    setTarifa(editTarifa);
    setExperiencia(editExperiencia);
    setDescripcion(editDescripcion);
    setUbicacion(editUbicacion);
    setAvatar(editAvatar);

    localStorage.setItem("proName", editNombre);
    localStorage.setItem("proSpecialty", editEspecialidad);
    localStorage.setItem("proTarifa", editTarifa);
    localStorage.setItem("proExperiencia", editExperiencia);
    localStorage.setItem("proDescription", editDescripcion);
    localStorage.setItem("proLocation", editUbicacion);
    localStorage.setItem("proAvatar", editAvatar);

    setShowProfileModal(false);
    triggerToast("✓ Perfil actualizado con éxito");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditAvatar(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGPS = () => {
    setGpsLoading(true);
    setGpsStatus("loading");

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
              { headers: { "Accept-Language": "es" } }
            );
            const data = await response.json();
            if (data && data.address) {
              const city = data.address.city || data.address.town || data.address.village || data.address.county || "";
              const country = data.address.country || "";
              if (city && country) {
                setEditUbicacion(`${city}, ${country}`);
              } else if (data.display_name) {
                const parts = data.display_name.split(",");
                setEditUbicacion(parts.slice(0, 2).join(",").trim());
              } else {
                setEditUbicacion(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
              }
            } else {
              setEditUbicacion(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
            }
          } catch (err) {
            setEditUbicacion(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
          }
          setGpsLoading(false);
          setGpsStatus("success");
          setTimeout(() => setGpsStatus("idle"), 2000);
        },
        (error) => {
          console.error("GPS Error:", error);
          const fallbackCities = [
            "Medellín, Colombia",
            "Bogotá, Colombia",
            "Ciudad de México, México",
            "Madrid, España",
            "Santiago, Chile",
            "Lima, Perú"
          ];
          const randomCity = fallbackCities[Math.floor(Math.random() * fallbackCities.length)];
          setTimeout(() => {
            setEditUbicacion(`${randomCity} (GPS Estimado)`);
            setGpsLoading(false);
            setGpsStatus("estimated");
            setTimeout(() => setGpsStatus("idle"), 2500);
          }, 1200);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert("Tu navegador no soporta geolocalización.");
      setGpsLoading(false);
      setGpsStatus("idle");
    }
  };

  const handleWithdrawSubmit = () => {
    setWithdrawStatus("processing");
    setTimeout(() => {
      setWithdrawStatus("success");
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawStatus("idle");
        setIsFundsWithdrawn(true);
        triggerToast(`✓ Retiro de $${withdrawAmount} USD procesado con éxito.`);
      }, 2000);
    }, 2500);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF8F5]">
        <div className="w-10 h-10 border-4 border-[#0B2545]/20 border-t-[#0B2545] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#FAF8F5] font-plus-jakarta pb-28 overflow-x-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 right-0 h-[280px] bg-gradient-to-b from-[#E0F2FE]/60 to-transparent -z-10" />
      
      {/* Top Navbar */}
      <nav className="w-full bg-white/90 backdrop-blur-md border-b border-[#0B2545]/10 py-3 px-4 md:px-6 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-[#0B2545] flex items-center justify-center text-[#C5A059] font-bold shadow-xs text-sm border border-[#C5A059]/40">T</span>
            <span className="text-base md:text-lg font-bold text-[#0B2545] tracking-tight">ClassMarket Pro</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative p-2 text-slate-400 hover:text-[#0B2545] bg-[#FAF8F5] rounded-full hover:scale-105 transition-all border border-[#0B2545]/10">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#C5A059] rounded-full border-2 border-white animate-pulse" />
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-[#FAF8F5] hover:bg-[#0B2545]/10 text-[#0B2545] font-bold text-xs rounded-full border border-[#0B2545]/15 transition-all hover:scale-[1.02]"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-8 grid lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Header Hero Area */}
        <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 backdrop-blur-md border border-white p-6 rounded-[28px] shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-sky-600 uppercase tracking-widest">Resumen de Cuenta</span>
              <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                <Shield size={10} className="fill-emerald-700 text-white" /> Perfil Verificado Nivel Premium
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0d1c2e] mt-1 tracking-tight">
              Tu Panel de Reputación
            </h1>
            <p className="text-sm text-slate-500 font-semibold mt-0.5">
              Administra tu confiabilidad, ganancias y contratos firmados con garantía ClassMarket.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-4.5 py-3 bg-[#0d1c2e] hover:bg-black text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-[0.98]">
              <Zap size={14} className="text-amber-300 fill-amber-300" />
              <span>Ver Ofertas Activas</span>
            </button>
          </div>
        </div>

        {/* Successful Withdrawal Alert Banner */}
        {isFundsWithdrawn && (
          <div className="lg:col-span-12 bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-[24px] shadow-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                <CheckCircle2 size={20} className="fill-emerald-100" />
              </div>
              <div>
                <h4 className="text-sm font-bold">¡Retiro Exitoso en tu Home!</h4>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                  El dinero por valor de <strong className="font-extrabold">${withdrawAmount} USD</strong> ya fue retirado de tu balance de ClassMarket y está siendo transferido a tu cuenta.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsFundsWithdrawn(false)}
              className="text-emerald-600 hover:text-emerald-800 text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Entendido
            </button>
          </div>
        )}

        {/* Left Side: Stats and Bento Grid */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Bento Grid Reputation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Reputación General (Featured Card, spans 2 columns on desktop) */}
            <div className="md:col-span-2 bg-white border border-slate-100 p-6 rounded-[28px] shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0d1c2e]">Reputación General</h3>
                  <p className="text-xs text-slate-400 font-medium">Basado en los últimos 124 contratos</p>
                </div>
                <div className="flex items-center gap-1 bg-[#FAF8F5] px-3 py-1.5 rounded-full border border-[#C5A059]/40">
                  <Star size={16} className="text-[#C5A059] fill-[#C5A059]" />
                  <span className="text-xs font-extrabold text-[#0B2545]">4.9 / 5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#0B2545]/10">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <ThumbsUp size={14} className="text-sky-500" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">CONFIANZA</span>
                  </div>
                  <span className="block text-xl font-black text-[#0B2545]">98%</span>
                  <span className="text-[9px] text-slate-400 font-semibold">Recomendado</span>
                </div>

                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#0B2545]/10">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Clock size={14} className="text-emerald-500" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">PUNTUALIDAD</span>
                  </div>
                  <span className="block text-xl font-black text-[#0B2545]">100%</span>
                  <span className="text-[9px] text-slate-400 font-semibold">Entregas a tiempo</span>
                </div>

                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#0B2545]/10">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <MessageSquare size={14} className="text-[#0284C7]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">COMUNICACIÓN</span>
                  </div>
                  <span className="block text-xl font-black text-[#0B2545]">4.8</span>
                  <span className="text-[9px] text-slate-400 font-semibold">Calidad de respuesta</span>
                </div>
              </div>
            </div>

            {/* Earnings Quick View - Navy & Gold Brand */}
            <div className="bg-gradient-to-br from-[#0B2545] via-[#12335d] to-[#0B2545] p-6 rounded-[28px] shadow-xl flex flex-col justify-between relative overflow-hidden text-white border border-[#C5A059]/40">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#C5A059]/20 rounded-full blur-2xl pointer-events-none" />
              <div>
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                  Ganancias Retirables
                </span>
                <p className="text-3xl font-black mt-2 tracking-tighter text-white">
                  {isFundsWithdrawn ? "$0.00 USD" : "$4,250.00 USD"}
                </p>
                <span className="text-[10px] bg-white/10 text-slate-200 px-2 py-0.5 rounded-full mt-1.5 inline-block border border-white/20 font-bold">Este Mes</span>
              </div>

              <button 
                onClick={() => !isFundsWithdrawn && setShowWithdrawModal(true)}
                disabled={isFundsWithdrawn}
                className={`w-full font-extrabold py-3 rounded-2xl shadow-md transition-all mt-6 text-sm cursor-pointer border ${
                  isFundsWithdrawn 
                    ? "text-slate-400 bg-slate-800/50 border-slate-700 cursor-not-allowed opacity-80" 
                    : "bg-[#FAF8F5] text-[#0B2545] hover:bg-white hover:text-[#0B2545] border-[#C5A059]/50 active:scale-[0.98]"
                }`}
              >
                {isFundsWithdrawn ? "Retiro Procesado" : "Retirar Fondos"}
              </button>
            </div>

          </div>

          {/* Realized Contracts Section */}
          <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#0d1c2e]">Contratos Realizados</h3>
                <p className="text-xs text-slate-400">Tus contratos completados y auditados satisfactoriamente</p>
              </div>
              <button className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
                <span>Ver todos</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Contract 1 */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-sky-100/55 transition-all gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold">
                    AR
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0d1c2e]">Alejandro Ruiz</h4>
                    <p className="text-xs text-slate-400 font-semibold">Consultoría de Negocios Digitales</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">FECHA</span>
                    <span className="text-xs font-bold text-[#0d1c2e]">12 Oct, 2023</span>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">MONTO</span>
                    <span className="text-xs font-extrabold text-emerald-600">$850.00 USD</span>
                  </div>

                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Completado
                  </span>
                </div>
              </div>

              {/* Contract 2 */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-sky-100/55 transition-all gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold">
                    TS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0d1c2e]">TechSolutions Inc.</h4>
                    <p className="text-xs text-slate-400 font-semibold">Diseño de Interfaz Ethereal</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">FECHA</span>
                    <span className="text-xs font-bold text-[#0d1c2e]">08 Oct, 2023</span>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">MONTO</span>
                    <span className="text-xs font-extrabold text-emerald-600">$1,200.00 USD</span>
                  </div>

                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Completado
                  </span>
                </div>
              </div>

              {/* Contract 3 */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-sky-100/55 transition-all gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold">
                    MG
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0d1c2e]">Mariana Gómez</h4>
                    <p className="text-xs text-slate-400 font-semibold">Auditoría de UX Boutique</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">FECHA</span>
                    <span className="text-xs font-bold text-[#0d1c2e]">02 Oct, 2023</span>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">MONTO</span>
                    <span className="text-xs font-extrabold text-emerald-600">$450.00 USD</span>
                  </div>

                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Completado
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Escrow Active Projects */}
          <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#0d1c2e]">Proyectos Escrow en Proceso</h3>
                <p className="text-xs text-slate-400">Fondos bloqueados de forma segura en garantía</p>
              </div>
              <button className="text-xs font-bold text-sky-600 hover:underline">Ver todo</button>
            </div>

            <div className="space-y-4">
              {/* Project 1 */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-[#f8f9ff] rounded-2xl border border-sky-50 hover:border-pink-100/50 transition-all gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center font-bold">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0d1c2e]">Desarrollo de Dashboard Corporativo</h4>
                    <span className="text-[10px] font-bold bg-[#E0F2FE] text-sky-700 px-2 py-0.5 rounded-full">Garantía Escrow Activa</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">FONDO</span>
                    <span className="text-xs font-extrabold text-[#0d1c2e]">$850.00 USD</span>
                  </div>
                  <button className="px-4 py-2 bg-[#0d1c2e] hover:bg-black text-white font-bold text-xs rounded-xl transition-all">
                    Detalles
                  </button>
                </div>
              </div>

              {/* Project 2 */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-[#f8f9ff] rounded-2xl border border-sky-50 hover:border-pink-100/50 transition-all gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center font-bold">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0d1c2e]">Optimización de Base de Datos</h4>
                    <span className="text-[10px] font-bold bg-[#E0F2FE] text-sky-700 px-2 py-0.5 rounded-full">Garantía Escrow Activa</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left md:text-right">
                    <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">FONDO</span>
                    <span className="text-xs font-extrabold text-[#0d1c2e]">$450.00 USD</span>
                  </div>
                  <button className="px-4 py-2 bg-[#0d1c2e] hover:bg-black text-white font-bold text-xs rounded-xl transition-all">
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Professional Identity Card */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Real-time Dynamic Profile Card */}
          <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#0B2545] uppercase tracking-wider">Tu Identidad en la Red</h3>
              <button 
                onClick={handleOpenProfileModal}
                className="text-xs font-bold text-[#0B2545] hover:text-[#0B2545] bg-[#FAF8F5] hover:bg-[#FAF8F5]/80 border border-[#C5A059]/40 px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Edit2 size={10} />
                <span>Editar</span>
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-[#FAF8F5] shadow-md bg-slate-100">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={36} />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <CheckCircle2 size={14} className="fill-emerald-500 text-white" />
                </div>
              </div>

              <h4 className="text-lg font-bold text-[#0B2545]">{nombre}</h4>
              <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mt-0.5 mb-1.5">
                <MapPin size={12} className="text-sky-500 shrink-0" />
                <span>{ubicacion}</span>
              </div>
              <span className="text-xs font-semibold text-[#0B2545] px-3 py-1 bg-[#FAF8F5] border border-[#C5A059]/40 rounded-full mt-1">
                {especialidad}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-4 text-center">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experiencia</span>
                <span className="text-base font-extrabold text-[#0B2545]">{experiencia} Años</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarifa por Hora</span>
                <span className="text-base font-extrabold text-emerald-600">
                  ${tarifa ? tarifa.replace(/\$/g, "").replace(/\/hr/g, "") : "10.000"}/hr
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biografía Comercial</span>
              <p className="text-xs text-[#5e6f79] font-medium leading-relaxed italic bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                {descripcion || "No has ingresado ninguna descripción sobre en qué trabajas."}
              </p>
            </div>

            {/* Checklist of Credentials */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estatus de Auditoría Técnica</span>
              
              <div className="space-y-2 text-xs font-medium">
                <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Identificación Oficial Aprobada</span>
                  </div>
                  <span className="text-[9px] font-bold">100%</span>
                </div>

                <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Hoja de Vida Validada con IA</span>
                  </div>
                  <span className="text-[9px] font-bold">100%</span>
                </div>

                <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>{certificadosCount} Certificado(s) Activo(s)</span>
                  </div>
                  <span className="text-[9px] font-bold">Verificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* FLOATING ACTION BUTTON */}
      <button 
        onClick={handleOpenProfileModal}
        className="fixed bottom-28 right-6 w-14 h-14 bg-[#0B2545] hover:bg-[#12335d] text-[#C5A059] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-40 border-2 border-[#C5A059]/60"
        title="Editar Perfil"
      >
        <Edit2 size={20} />
      </button>

      {/* FLOATING CENTERING BOTTOM NAVIGATION BAR (Matching Photo 4) */}
      <BottomNav />

      {/* INTERACTIVE WITHDRAW FUNDS MODAL */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-[32px] border border-slate-100 p-8 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>

              {withdrawStatus === "idle" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#0d1c2e] tracking-tight">Retirar Fondos</h3>
                    <p className="text-xs text-slate-400 mt-1">Envía tus ganancias acumuladas de forma segura a tu cuenta favorita.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#f8f9ff] p-5 rounded-2xl border border-sky-100 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">SALDO DISPONIBLE</span>
                        <span className="text-2xl font-black text-[#0d1c2e]">$4,250.00 USD</span>
                      </div>
                      <CreditCard size={28} className="text-pink-500" />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Método de Retiro</label>
                      <div className="space-y-3">
                        <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                          withdrawMethod === "bank" ? "border-pink-500 bg-pink-50/20" : "border-slate-200 bg-white"
                        }`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="method" 
                              value="bank" 
                              checked={withdrawMethod === "bank"} 
                              onChange={() => setWithdrawMethod("bank")}
                              className="text-pink-600 focus:ring-pink-500" 
                            />
                            <div>
                              <span className="block text-xs font-bold text-[#0d1c2e]">Transferencia Bancaria Directa</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Comisión: 0% • Tiempo: 24h hábiles</span>
                            </div>
                          </div>
                        </label>

                        {/* Conditional Fields for Bank */}
                        {withdrawMethod === "bank" && (
                          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100/80 animate-fadeIn">
                            <div>
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nombre del Banco</label>
                              <input 
                                type="text" 
                                placeholder="ej. Bancolombia, BBVA, Citibanamex" 
                                value={bankName}
                                onChange={e => setBankName(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#0d1c2e] focus:border-pink-300 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Número de Cuenta / CLABE (18 dígitos)</label>
                              <input 
                                type="text" 
                                placeholder="012 345 6789 0123 4567" 
                                value={bankAccount}
                                onChange={e => setBankAccount(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#0d1c2e] focus:border-pink-300 outline-none"
                              />
                            </div>
                          </div>
                        )}

                        <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                          withdrawMethod === "paypal" ? "border-pink-500 bg-pink-50/20" : "border-slate-200 bg-white"
                        }`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="method" 
                              value="paypal" 
                              checked={withdrawMethod === "paypal"} 
                              onChange={() => setWithdrawMethod("paypal")}
                              className="text-pink-600 focus:ring-pink-500" 
                            />
                            <div>
                              <span className="block text-xs font-bold text-[#0d1c2e]">PayPal Express</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Comisión: 1.5% • Tiempo: Instantáneo</span>
                            </div>
                          </div>
                        </label>

                        {/* Conditional Fields for PayPal */}
                        {withdrawMethod === "paypal" && (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 animate-fadeIn">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Correo Electrónico de PayPal</label>
                            <input 
                              type="email" 
                              placeholder="ejemplo@paypal.com" 
                              value={paypalEmail}
                              onChange={e => setPaypalEmail(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#0d1c2e] focus:border-pink-300 outline-none"
                            />
                          </div>
                        )}

                        <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                          withdrawMethod === "wallet" ? "border-pink-500 bg-pink-50/20" : "border-slate-200 bg-white"
                        }`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="method" 
                              value="wallet" 
                              checked={withdrawMethod === "wallet"} 
                              onChange={() => setWithdrawMethod("wallet")}
                              className="text-pink-600 focus:ring-pink-500" 
                            />
                            <div>
                              <span className="block text-xs font-bold text-[#0d1c2e]">TrustPay Escrow Wallet</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Comisión: 0% • Tiempo: Instantáneo</span>
                            </div>
                          </div>
                        </label>

                        {/* Conditional Fields for Wallet */}
                        {withdrawMethod === "wallet" && (
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 animate-fadeIn">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Número de Teléfono Registrado</label>
                            <input 
                              type="tel" 
                              placeholder="+57 300 123 4567" 
                              value={walletPhone}
                              onChange={e => setWalletPhone(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#0d1c2e] focus:border-pink-300 outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Monto a Retirar (USD)</label>
                      <input 
                        type="number" 
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        max="4250.00"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-[#0d1c2e] focus:bg-white focus:border-pink-300 outline-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowWithdrawModal(false)}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] font-bold rounded-2xl text-sm transition-colors active:scale-95"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleWithdrawSubmit}
                        disabled={
                          !(
                            (withdrawMethod === "bank" && bankName.trim() && bankAccount.trim()) ||
                            (withdrawMethod === "paypal" && paypalEmail.trim() && paypalEmail.includes("@")) ||
                            (withdrawMethod === "wallet" && walletPhone.trim())
                          )
                        }
                        className={`flex-1 py-3 font-bold rounded-2xl text-sm transition-all shadow-md ${
                          (
                            (withdrawMethod === "bank" && bankName.trim() && bankAccount.trim()) ||
                            (withdrawMethod === "paypal" && paypalEmail.trim() && paypalEmail.includes("@")) ||
                            (withdrawMethod === "wallet" && walletPhone.trim())
                          )
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 active:scale-95 text-white shadow-pink-100 cursor-pointer"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-80"
                        }`}
                      >
                        Confirmar Retiro
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {withdrawStatus === "processing" && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 size={48} className="animate-spin text-pink-500 mb-4" />
                  <h4 className="text-lg font-bold text-[#0d1c2e]">Procesando Transferencia</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">Estamos conectando con el nodo encriptado de TrustPay para liberar tus fondos de manera segura.</p>
                </div>
              )}

              {withdrawStatus === "success" && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mb-4 text-emerald-500 animate-bounce">
                    <Check size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-[#0d1c2e]">¡Retiro Completado!</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Los fondos se han transferido correctamente a tu cuenta.</p>
                  <p className="text-[10px] text-slate-400 mt-2">ID de Transacción: TR-98520-LX</p>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT PROFILE SIDEBAR MODAL */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-[32px] border border-slate-100 p-8 w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setShowProfileModal(false)}
                className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#0d1c2e] tracking-tight">Editar Datos Profesionales</h3>
                <p className="text-xs text-slate-400 mt-1">Mantén tu portafolio y reputación de confianza siempre al día.</p>
              </div>

              <div className="space-y-5">
                {/* Avatar uploader */}
                <div className="flex flex-col items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="relative group cursor-pointer w-20 h-20 rounded-2xl overflow-hidden border border-slate-200">
                    <img 
                      src={editAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256"} 
                      alt="Preview" 
                      className="w-full h-full object-cover group-hover:opacity-85 transition-opacity" 
                    />
                    <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                      <Camera size={16} className="mb-1" />
                      <span>Subir</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Foto Profesional</span>
                  
                  {/* Preset Row */}
                  <div className="flex gap-2.5 mt-3 pt-3 border-t border-slate-100 w-full justify-center">
                    {[
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256",
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
                      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256"
                    ].map((p, i) => (
                      <button 
                        key={i}
                        type="button"
                        onClick={() => setEditAvatar(p)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 active:scale-95 ${
                          editAvatar === p ? "border-pink-500 scale-105 ring-2 ring-pink-100" : "border-slate-100"
                        }`}
                      >
                        <img src={p} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      value={editNombre} 
                      onChange={e => setEditNombre(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0d1c2e] focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-50/50 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Especialidad</label>
                    <input 
                      type="text" 
                      value={editEspecialidad} 
                      onChange={e => setEditEspecialidad(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0d1c2e] focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-50/50 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tarifa (USD/hr)</label>
                    <input 
                      type="number" 
                      value={editTarifa} 
                      onChange={e => setEditTarifa(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0d1c2e] focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-50/50 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Años Experiencia</label>
                    <input 
                      type="number" 
                      value={editExperiencia} 
                      onChange={e => setEditExperiencia(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0d1c2e] focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-50/50 outline-none transition-all"
                    />
                  </div>

                  {/* Location with GPS */}
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Ubicación</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editUbicacion} 
                        onChange={e => setEditUbicacion(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#0d1c2e] focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-50/50 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleGPS}
                        disabled={gpsLoading}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[#0d1c2e] hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center justify-center"
                        title="Detectar ubicación por GPS"
                      >
                        {gpsStatus === "loading" ? (
                          <Loader2 size={16} className="animate-spin text-pink-500" />
                        ) : gpsStatus === "success" ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : gpsStatus === "estimated" ? (
                          <CheckCircle2 size={16} className="text-amber-500" />
                        ) : (
                          <MapPin size={16} className="text-[#0d1c2e]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Biografía Comercial</label>
                    <textarea 
                      value={editDescripcion} 
                      onChange={e => setEditDescripcion(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-[#0d1c2e] focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-50/50 outline-none transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] font-bold rounded-xl text-sm transition-colors active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow-md shadow-pink-100"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 24, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 24, x: "-50%" }}
            className="fixed bottom-24 left-1/2 z-[100] bg-[#0d1c2e] text-white px-6 py-3 rounded-full shadow-2xl text-xs font-bold border border-white/10 uppercase tracking-wider"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Material Symbols */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
      `}</style>
    </main>
  );
}

