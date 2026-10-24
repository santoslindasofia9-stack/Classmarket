"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("Verificando sesión con Google...");

  useEffect(() => {
    let isMounted = true;
    let redirected = false;

    const getResolvedRole = (explicitRole?: string | null): "pro" | "client" => {
      // 1. Si explícitamente se pasó en URL
      if (explicitRole === "pro") return "pro";
      if (explicitRole === "client") return "client";

      // 2. Cookie de intención
      if (typeof document !== "undefined") {
        if (document.cookie.includes("cm_role=pro") || document.cookie.includes("cm_pro_intent=true")) return "pro";
        if (document.cookie.includes("cm_role=client")) return "client";
      }

      // 3. Storage
      if (localStorage.getItem("isProIntent") === "true") return "pro";
      if (localStorage.getItem("userRole") === "pro" || sessionStorage.getItem("userRole") === "pro") return "pro";
      
      return "client";
    };

    const doRedirect = (session: any, roleArg?: string | null) => {
      if (redirected) return;
      redirected = true;

      const meta = session?.user?.user_metadata;
      const displayName =
        meta?.full_name ||
        meta?.name ||
        meta?.nombre_completo ||
        session?.user?.email?.split("@")[0] ||
        localStorage.getItem("userName") ||
        "Sofia";

      const avatar = meta?.avatar_url || meta?.picture || localStorage.getItem("userAvatar") || "";

      const finalRole = getResolvedRole(roleArg);
      const isPro = finalRole === "pro";

      localStorage.setItem("userRole", finalRole);
      sessionStorage.setItem("userRole", finalRole);
      localStorage.setItem("userName", displayName);
      if (avatar) {
        localStorage.setItem("userAvatar", avatar);
        localStorage.setItem("proAvatar", avatar);
      }
      localStorage.setItem("isLoggedIn", "true");
      localStorage.removeItem("pendingRole");

      if (isMounted) setStatus(`¡Bienvenido, ${displayName}! Configurando tu perfil...`);

      // REGLA OBLIGATORIA:
      // Si seleccionó "Ofrezco Tutoría" -> /tutor/register (primera vez ofreciendo tutorías)
      // Si seleccionó "Soy Estudiante" -> /home-cliente (dashboard de estudiantes)
      const target = isPro ? "/tutor/register" : "/home-cliente";
      window.location.replace(target);
    };

    // Fail-safe timer: si cualquier llamada a red o PKCE se demora más de 1.2 segundos, avanzar directamente
    const safetyTimer = setTimeout(() => {
      const role = getResolvedRole();
      doRedirect(null, role);
    }, 1200);

    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const roleFromUrl = urlParams.get("role");
        const role = getResolvedRole(roleFromUrl);

        // Escuchar el evento de autenticación automática de Supabase
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user && (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED")) {
            clearTimeout(safetyTimer);
            doRedirect(session, role);
          }
        });

        if (code) {
          if (isMounted) setStatus("Confirmando cuenta de Google...");
          const { data } = await supabase.auth.exchangeCodeForSession(code);
          if (data?.session?.user) {
            clearTimeout(safetyTimer);
            doRedirect(data.session, role);
            return;
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          clearTimeout(safetyTimer);
          doRedirect(session, role);
          return;
        }
      } catch (err) {
        console.error("Callback error:", err);
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white font-plus-jakarta">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner animado */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-[#FCE4EC]" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#0d1c2e] animate-spin" />
          {/* Icono de Google en el centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
              </g>
            </svg>
          </div>
        </div>

        <div className="text-center space-y-2 max-w-xs px-4">
          <h2 className="text-xl font-bold text-[#0d1c2e]">{status}</h2>
          <p className="text-sm text-[#5e6f79]">Conectando con Google de forma segura...</p>
        </div>
      </div>
    </div>
  );
}
