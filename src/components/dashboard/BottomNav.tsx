"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// ─── Pro / Tutor Tabs (Matching Photo 4) ──────────────────────────────────────
const PRO_NAV_ITEMS = [
  { icon: "account_circle", label: "Perfil", href: "/perfil-y-editor-de-servicios-2" },
  { icon: "analytics", label: "Dashboard", href: "/dashboard-pro" },
  { icon: "map", label: "Mapa", href: "/mapa-expertos" },
  { icon: "calendar_today", label: "Agenda", href: "/agenda" },
  { icon: "chat_bubble", label: "Mensajes", href: "/chat" },
];

// ─── Student / Client Tabs ────────────────────────────────────────────────────
const CLIENT_NAV_ITEMS = [
  { icon: "home", label: "Inicio", href: "/home-cliente" },
  { icon: "search", label: "Buscar", href: "/resultados" },
  { icon: "map", label: "Mapa", href: "/mapa-expertos" },
  { icon: "chat_bubble", label: "Mensajes", href: "/chat" },
  { icon: "person", label: "Mi Perfil", href: "/perfil" },
];

export default function BottomNav({ onMessagesClick }: { onMessagesClick?: (e: React.MouseEvent) => void }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>("client");
  const [currentExpertId, setCurrentExpertId] = useState<string>("f1");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "client";
    setUserRole(role);
    const savedId = localStorage.getItem("currentExpertId") || "f1";
    setCurrentExpertId(savedId);
  }, [pathname]);

  // Determine whether to use Pro tabs (Photo 4) or Client tabs
  const isProPage = 
    pathname.startsWith("/dashboard-pro") || 
    pathname.startsWith("/agenda") || 
    pathname.startsWith("/perfil-y-editor-de-servicios-2") || 
    pathname.startsWith("/tutor");

  const useProNav = userRole === "pro" || isProPage || pathname === "/mapa-expertos";
  const items = useProNav ? PRO_NAV_ITEMS : CLIENT_NAV_ITEMS;

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[560px] z-[500] bg-white/95 backdrop-blur-xl border border-[#0B2545]/10 shadow-[0_12px_40px_rgba(11,37,69,0.12)] rounded-3xl transition-all">
      <div className="flex justify-around items-center px-3 py-2 w-full">
        {items.map((item) => {
          // Precise active match
          const isActive = 
            pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href + "/")) ||
            (item.href === "/perfil-y-editor-de-servicios-2" && pathname === "/perfil" && userRole === "pro");

          const isMessages = item.label === "Mensajes";
          const targetHref = isMessages && !useProNav 
            ? (onMessagesClick ? "#" : `/chat/${currentExpertId}`) 
            : item.href;

          return (
            <Link
              key={item.label}
              href={targetHref}
              onClick={(e) => {
                if (isMessages && onMessagesClick && !useProNav) {
                  e.preventDefault();
                  onMessagesClick(e);
                }
              }}
              className={`flex flex-col items-center justify-center rounded-2xl px-3 sm:px-4 py-1.5 transition-all duration-200 active:scale-95 cursor-pointer relative ${
                isActive
                  ? "bg-[#0B2545] text-white shadow-md border border-[#C5A059]/40"
                  : "text-[#5C6B73] hover:text-[#0B2545] hover:bg-slate-50"
              }`}
            >
              <span 
                className="material-symbols-outlined text-[22px] transition-all" 
                style={{ 
                  color: isActive ? "#C5A059" : "inherit",
                  fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400"
                }}
              >
                {item.icon}
              </span>
              
              <span className={`text-[10px] sm:text-[11px] font-bold mt-0.5 tracking-tight ${
                isActive ? "text-white" : "text-[#5C6B73]"
              }`}>
                {item.label}
              </span>

              {/* Notification dot for Mensajes */}
              {isMessages && !isActive && (
                <div className="absolute top-1.5 right-2 w-2 h-2 bg-[#C5A059] rounded-full animate-pulse shadow-xs" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
