"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import WaveBackground from "@/components/ui/WaveBackground";

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  // Simulación de carga y verificación de sesión
  useEffect(() => {
    // Si Supabase devuelve el token en el hash (#access_token=... o #error=...)
    if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
      window.location.replace("/auth/callback" + window.location.hash);
      return;
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const savedRole = localStorage.getItem("userRole");

    if (isLoggedIn && savedRole) {
      let target = savedRole === "client" ? "/home-cliente" : "/dashboard-pro";
      if (savedRole === "pro") {
        const isRegistered = localStorage.getItem("proRegistered") === "true";
        target = isRegistered ? "/dashboard-pro" : "/tutor/register";
      }
      window.location.replace(target);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [router]);

  const handleContinue = () => {
    window.location.href = "/onboarding";
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center items-center font-plus-jakarta py-12 px-5 sm:px-6">
      {/* Moving Waves in Celestes & Beiges */}
      <WaveBackground />

      {/* Main Glassmorphic Card Container: Centered, solid & harmonious */}
      <div className="relative z-10 w-full max-w-lg mx-auto bg-white/70 backdrop-blur-xl border border-white/80 rounded-[36px] shadow-[0_20px_60px_-15px_rgba(11,37,69,0.08)] p-8 sm:p-10 flex flex-col items-center text-center">
        
        {/* Logo Container: Perfectly centered with seamless warm glow */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-[#C5A059]/25 blur-2xl opacity-50 rounded-full scale-125" />
          
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden flex items-center justify-center p-1 transition-transform duration-500 group-hover:scale-105">
            <Image
              src="/classmarket-logo.png"
              alt="ClassMarket Logo"
              fill
              className="object-contain drop-shadow-md"
              sizes="(max-width: 640px) 112px, 128px"
              priority
            />
          </div>
        </div>

        {/* Branding Text: Contundente, armónica y equilibrada */}
        <div className="space-y-3 mb-8 max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B2545]/5 border border-[#C5A059]/30 text-[#0B2545] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
            CLASSMARKET • Educación e Intercambio Real
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] tracking-tight leading-tight">
            El Marketplace donde los estudiantes comparten, intercambian y crecen juntos.
          </h1>
          
          <p className="text-sm sm:text-base text-[#5C6B73] font-medium leading-relaxed max-w-sm mx-auto">
            Aprende con tutorías, intercambia libros, ofrece tus talentos digitales y conecta con tus compañeros en un entorno seguro.
          </p>
        </div>

        {/* Loading Indicator & Action Button */}
        <div className="w-full max-w-[280px] flex flex-col items-center mb-6">
          <div className="w-full h-1.5 bg-[#0B2545]/10 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-gradient-to-r from-[#0B2545] to-[#C5A059] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <button
            onClick={handleContinue}
            className="group relative w-full bg-[#0B2545] hover:bg-[#12335d] text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-[#C5A059]/40"
          >
            <span className="relative z-10 text-base font-semibold">Continuar →</span>
            <div className="absolute inset-0 bg-[#C5A059]/15 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          </button>
        </div>

        {/* Security Footer */}
        <div className="flex items-center gap-1.5 text-[#5C6B73] opacity-80 pt-2 border-t border-gray-100/60 w-full justify-center">
          <span className="material-symbols-outlined text-sm text-[#C5A059]">verified_user</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B2545]">Comunidad Estudiantil Protegida</span>
        </div>
      </div>
    </main>
  );
}
