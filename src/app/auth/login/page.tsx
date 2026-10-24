"use client";

import { useState, Suspense, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, User, Briefcase, Eye, EyeOff, Check, Phone, ArrowLeft, UserPlus, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import WaveBackground from "@/components/ui/WaveBackground";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialMode = (searchParams.get("mode") as "login" | "register") || "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [role, setRole] = useState<"client" | "pro">("client");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  // No necesitamos listener de OAuth aquí — Google redirige directo a /home-cliente

  // Sincronizar modo con query param
  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "register" || m === "login") {
      setMode(m);
    }
  }, [searchParams]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        // — REGISTRO con Supabase —
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nombre_completo: formData.username,
              telefono: formData.phone,
              rol: role,
            },
          },
        });

        if (signUpError) throw signUpError;

        const displayName = formData.username || data.user?.email?.split("@")[0] || "Usuario";
        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", displayName);
        localStorage.setItem("isLoggedIn", "true");
        if (role === "client") {
          router.push("/home-cliente");
        } else {
          router.push("/tutor/register");
        }

      } else {
        // — INICIO DE SESIÓN con Supabase —
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;

        const displayName =
          data.user?.user_metadata?.nombre_completo ||
          data.user?.user_metadata?.full_name ||
          formData.email.split("@")[0] ||
          "Usuario";

        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", displayName);
        localStorage.setItem("isLoggedIn", "true");

        if (role === "client") {
          router.push("/home-cliente");
        } else {
          router.push("/tutor/register");
        }
      }
    } catch (err: any) {
      console.warn("Supabase no disponible, entrando en modo demo:", err.message);

      // ── FALLBACK DEMO: si Supabase falla por red, igual entra ──
      const isFetchError =
        err.message?.includes("fetch") ||
        err.message?.includes("network") ||
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("NetworkError") ||
        !navigator.onLine;

      if (isFetchError) {
        // Sin conexión a Supabase → modo demo automático
        const displayName = formData.username || formData.email.split("@")[0] || "Usuario";
        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", displayName);
        localStorage.setItem("isLoggedIn", "true");
        if (role === "client") {
          router.push("/home-cliente");
        } else {
          router.push("/tutor/register");
        }
        return;
      }

      // Error real de Supabase (credenciales incorrectas, etc.)
      const msg = err.message || "";
      if (msg.includes("Email not confirmed")) {
        setError("Confirma tu correo electrónico antes de iniciar sesión.");
      } else if (msg.includes("Invalid login credentials") || msg.includes("invalid_credentials")) {
        setError("El correo o la contraseña son incorrectos.");
      } else if (msg.includes("User already registered")) {
        setError("Ya existe una cuenta con este correo. Intenta iniciar sesión.");
      } else {
        setError(msg || "Ocurrió un error. Inténtalo de nuevo.");
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      localStorage.setItem("userRole", role);
      sessionStorage.setItem("userRole", role);
      if (role === "pro") {
        localStorage.setItem("isProIntent", "true");
        localStorage.setItem("forceTutorRegister", "true");
      } else {
        localStorage.removeItem("isProIntent");
        localStorage.removeItem("forceTutorRegister");
      }

      // Dynamic origin — works in localhost AND any Vercel URL
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?role=${role}`,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) throw error;
      // Google will redirect — nothing else to do here
    } catch (err: any) {
      console.error("Google Auth failed:", err);
      setLoading(false);
      setError("No se pudo iniciar sesión con Google. Verificá tu conexión.");
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-white font-plus-jakarta overflow-hidden flex items-center justify-center p-3 sm:p-6 lg:p-8">
      {/* Moving Waves Background with soft ambient glow */}
      <WaveBackground />

      {/* Main Container - Full Split Card exactly like Reference */}
      <div className="relative z-10 w-full max-w-6xl min-h-[640px] flex flex-col lg:flex-row rounded-[32px] sm:rounded-[40px] overflow-hidden bg-white shadow-[0_25px_70px_-15px_rgba(11,37,69,0.12)] border border-gray-100">
        
        {/* Lado Izquierdo: Imagen Grande con bordes curvos y tarjeta glassmorphism */}
        <div className="hidden lg:flex w-1/2 p-5 items-center justify-center">
          <div className="relative w-full h-full min-h-[580px] rounded-[32px] overflow-hidden group shadow-md">
            <Image
              src="/students-study-group.jpg"
              alt="Estudiantes de secundaria colaborando en ClassMarket"
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {/* Soft Ambient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Bottom Glass Card Overlay (Identical to reference layout) */}
            <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/25 backdrop-blur-xl border border-white/40 rounded-[28px] text-white shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-white/40 flex items-center justify-center text-white">
                      <User size={13} />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-white flex items-center justify-center text-[10px] font-extrabold text-[#0B2545]">
                    +50k
                  </div>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold mb-1 tracking-tight">Más de 50,000 estudiantes e intercambios</h2>
              <p className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed">Aprende, colabora y crece con compañeros reales en un entorno seguro.</p>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Formulario limpio y espacioso */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-14">
          <div className="w-full max-w-md space-y-6">

            {/* Botón volver (solo en registro) */}
            {mode === "register" && (
              <button
                onClick={() => setMode("login")}
                className="flex items-center gap-2 text-sm font-bold text-[#5C6B73] hover:text-[#0B2545] transition-colors mb-2"
              >
                <ArrowLeft size={16} />
                Volver al inicio de sesión
              </button>
            )}

            {/* Header del Formulario */}
            <div className="text-center space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
                {mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
              </h1>
              <p className="text-[#5C6B73] font-medium text-sm sm:text-base">
                {mode === "login" ? "Accede a tu cuenta para continuar" : "Únete a la red de estudiantes de ClassMarket"}
              </p>
            </div>

            {/* Selector de Rol (Identical pill style to reference) */}
            <div className="bg-[#FAF8F5] p-1.5 rounded-[22px] flex relative border border-[#C5A059]/20">
              <motion.div
                className="absolute top-1.5 bottom-1.5 bg-[#E0F2FE] rounded-[18px] shadow-xs"
                initial={false}
                animate={{
                  x: role === "client" ? 0 : "100%",
                  left: role === "client" ? "4px" : "-4px",
                  width: "calc(50% - 0px)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                type="button"
                onClick={() => {
                  setRole("client");
                  localStorage.setItem("userRole", "client");
                  sessionStorage.setItem("userRole", "client");
                  localStorage.removeItem("isProIntent");
                  localStorage.removeItem("forceTutorRegister");
                }}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold transition-colors duration-300 ${role === "client" ? "text-[#0B2545]" : "text-[#5C6B73]"}`}
              >
                <User size={16} />
                Soy Estudiante
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("pro");
                  localStorage.setItem("userRole", "pro");
                  sessionStorage.setItem("userRole", "pro");
                  localStorage.setItem("isProIntent", "true");
                  localStorage.setItem("forceTutorRegister", "true");
                }}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold transition-colors duration-300 ${role === "pro" ? "text-[#0B2545]" : "text-[#5C6B73]"}`}
              >
                <Briefcase size={16} />
                Ofrezco Tutoría
              </button>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            {/* Formulario */}
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleAuth}
                className="space-y-5"
              >
                {/* Campos solo para registro */}
                {mode === "register" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-[#0d1c2e] ml-1">Nombre</label>
                      <div className="relative group">
                        <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0d1c2e] transition-colors" size={20} />
                        <input
                          type="text"
                          required
                          placeholder="Tu nombre completo"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30 transition-all text-[#0d1c2e] font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-[#0d1c2e] ml-1">Teléfono</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0d1c2e] transition-colors" size={20} />
                        <input
                          type="tel"
                          placeholder="+57 300 123 4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30 transition-all text-[#0d1c2e] font-medium"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Correo */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#0d1c2e] ml-1">Correo Electrónico</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0d1c2e] transition-colors" size={20} />
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30 transition-all text-[#0d1c2e] font-medium"
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-sm font-bold text-[#0d1c2e]">Contraseña</label>
                    {mode === "login" && (
                      <button type="button" className="text-xs font-bold text-[#5e6f79] hover:text-[#0d1c2e] transition-colors">
                        ¿Olvidaste tu clave?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0d1c2e] transition-colors" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FCE4EC] focus:ring-4 focus:ring-[#FCE4EC]/30 transition-all text-[#0d1c2e] font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0d1c2e] transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Recuérdame */}
                {mode === "login" && (
                  <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-5 h-5 border-2 border-gray-200 rounded-md peer-checked:bg-[#FCE4EC] peer-checked:border-[#FCE4EC] transition-all" />
                      <Check className="absolute text-[#0d1c2e] opacity-0 peer-checked:opacity-100 transition-opacity" size={14} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-bold text-[#5e6f79] group-hover:text-[#0d1c2e] transition-colors">Recuérdame</span>
                  </label>
                )}

                {/* Botón principal: Primary Navy (#0B2545) with white text */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#0B2545] hover:bg-[#12335d] text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-[#C5A059]/60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {mode === "login" ? "Iniciando sesión..." : "Creando cuenta..."}
                    </>
                  ) : (
                    mode === "login" ? "Iniciar Sesión" : "Registrarme"
                  )}
                </button>
              </motion.form>
            </AnimatePresence>

            {/* Divisor */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-[#5e6f79] tracking-wider text-xs font-bold">
                  O CONTINÚA CON
                </span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-gray-200 rounded-full hover:border-[#C5A059]/60 hover:shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 font-semibold text-sm text-[#3c4043] shadow-sm"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                </g>
              </svg>
              Continuar con Google
            </button>

            {/* Footer toggle */}
            <p className="text-center text-sm font-medium text-[#5e6f79]">
              {mode === "login" ? (
                <>
                  ¿No tienes una cuenta?{" "}
                  <button onClick={() => setMode("register")} className="font-bold text-[#0d1c2e] hover:underline transition-all">
                    Regístrate gratis
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tienes una cuenta?{" "}
                  <button onClick={() => setMode("login")} className="font-bold text-[#0d1c2e] hover:underline transition-all">
                    Inicia sesión
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-4 border-[#FCE4EC] border-t-[#0d1c2e] rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
