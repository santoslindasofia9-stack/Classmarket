"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LayoutList,
  X,
  Bell,
  Briefcase,
  UserCheck,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import FiltrosUbicacion from "./components/FiltrosUbicacion";
import MapaBase from "./components/MapaBase";
import PanelLateral from "./components/PanelLateral";
import BottomNav from "@/components/dashboard/BottomNav";

// ─── Interfaces ──────────────────────────────────────────────────────────────
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
  ciudad?: string;
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

// ─── Fallback Experts Data (Student Peer Tutors & Academic Offers) ─────────────
const FALLBACK_EXPERTS: Expert[] = [
  {
    id: "e1",
    nombre_completo: "Camila Torres (17 años)",
    titulo_profesional: "Tutorías de Matemáticas, Álgebra y Física 10°-11°",
    categoria: "MatematicasCiencias",
    calificacion: 5.0,
    distancia_km: 0.8,
    tarifa: "$10/hr o Trueque de Guías",
    foto_perfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.1193,
    lng: -73.1227,
    ciudad: "Bucaramanga",
  },
  {
    id: "e2",
    nombre_completo: "Mateo Valenzuela (18 años)",
    titulo_profesional: "Guías Resueltas & Apoyo en Química Orgánica y Biología",
    categoria: "TareasGuias",
    calificacion: 4.9,
    distancia_km: 1.6,
    tarifa: "$8 por guía",
    foto_perfil: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.0622,
    lng: -73.1073,
    ciudad: "Floridablanca",
  },
  {
    id: "e3",
    nombre_completo: "Sofía Salazar (16 años)",
    titulo_profesional: "Clases de Inglés Conversacional & Pruebas Saber 11",
    categoria: "TutoriasClases",
    calificacion: 5.0,
    distancia_km: 2.3,
    tarifa: "$12/hr",
    foto_perfil: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 6.9884,
    lng: -73.0512,
    ciudad: "Piedecuesta",
  },
  {
    id: "e4",
    nombre_completo: "Diego Morales (19 años)",
    titulo_profesional: "Proyectos en Python, JavaScript, HTML y Scratch",
    categoria: "ProgramacionTecnologias",
    calificacion: 5.0,
    distancia_km: 3.1,
    tarifa: "$14/hr",
    foto_perfil: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.0683,
    lng: -73.1698,
    ciudad: "Girón",
  },
  {
    id: "e5",
    nombre_completo: "Valentina Gómez (17 años)",
    titulo_profesional: "Intercambio de Libros de Cálculo & Apuntes de Filosofía",
    categoria: "TareasGuias",
    calificacion: 4.8,
    distancia_km: 1.1,
    tarifa: "Trueque de Libros / Gratis",
    foto_perfil: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.0012,
    lng: -73.0485,
    ciudad: "Piedecuesta",
  },
  {
    id: "e15",
    nombre_completo: "Marcela Fuentes",
    titulo_profesional: "Apoyo Escolar Integral y Orientación Académica",
    categoria: "TutoriasClases",
    calificacion: 4.9,
    distancia_km: 1.1,
    tarifa: "$11/hr",
    foto_perfil: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.113,
    lng: -73.127,
  },
  {
    id: "e16",
    nombre_completo: "Mariana López",
    titulo_profesional: "Matemáticas para Secundaria y Bachillerato",
    categoria: "MatematicasCiencias",
    calificacion: 5.0,
    distancia_km: 1.0,
    tarifa: "$12/hr",
    foto_perfil: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.122,
    lng: -73.118,
  },
  {
    id: "e17",
    nombre_completo: "Juan Carlos Pérez",
    titulo_profesional: "Programación Python para Principiantes",
    categoria: "ProgramacionTecnologias",
    calificacion: 4.9,
    distancia_km: 1.4,
    tarifa: "$18/hr",
    foto_perfil: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.115,
    lng: -73.131,
  },
  {
    id: "e18",
    nombre_completo: "Laura Martínez",
    titulo_profesional: "Química y Biología para Bachillerato",
    categoria: "MatematicasCiencias",
    calificacion: 5.0,
    distancia_km: 1.2,
    tarifa: "$14/hr",
    foto_perfil: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.129,
    lng: -73.123,
  },
  {
    id: "e19",
    nombre_completo: "Andrés Gómez",
    titulo_profesional: "Física Mecánica y Electromagnetismo",
    categoria: "MatematicasCiencias",
    calificacion: 4.9,
    distancia_km: 1.7,
    tarifa: "$16/hr",
    foto_perfil: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.108,
    lng: -73.141,
  },
  {
    id: "e20",
    nombre_completo: "Sara Castillo",
    titulo_profesional: "Inglés Conversacional B1-B2",
    categoria: "TutoriasClases",
    calificacion: 5.0,
    distancia_km: 1.5,
    tarifa: "$13/hr",
    foto_perfil: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.134,
    lng: -73.109,
  },
  {
    id: "e21",
    nombre_completo: "Miguel Ángel Torres",
    titulo_profesional: "Álgebra Lineal y Cálculo Diferencial",
    categoria: "MatematicasCiencias",
    calificacion: 4.9,
    distancia_km: 1.9,
    tarifa: "$17/hr",
    foto_perfil: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.102,
    lng: -73.126,
  },
  {
    id: "e22",
    nombre_completo: "Daniela Ramírez",
    titulo_profesional: "Tareas, Guías y Resúmenes",
    categoria: "TareasGuias",
    calificacion: 5.0,
    distancia_km: 0.9,
    tarifa: "$9/hr",
    foto_perfil: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.126,
    lng: -73.121,
  },
  {
    id: "e23",
    nombre_completo: "Alejandra Vargas",
    titulo_profesional: "Trigonometría y Geometría Analítica",
    categoria: "MatematicasCiencias",
    calificacion: 5.0,
    distancia_km: 1.1,
    tarifa: "$12/hr",
    foto_perfil: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.119,
    lng: -73.137,
  },
  {
    id: "e24",
    nombre_completo: "Sebastián Cardona",
    titulo_profesional: "JavaScript, React y Desarrollo Web",
    categoria: "ProgramacionTecnologias",
    calificacion: 4.9,
    distancia_km: 1.6,
    tarifa: "$19/hr",
    foto_perfil: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&crop=face",
    lat: 7.111,
    lng: -73.114,
  },
];

// ─── Fallback Job Offers ─────────────────────────────────────────────────────
const MOCK_JOBS: JobOffer[] = [
  {
    id: "job1",
    cliente_nombre: "Elena Varas",
    cliente_avatar: "",
    cliente_calificacion: 4.9,
    titulo_trabajo: "Desarrollo de Landing Page Responsive",
    descripcion: "Requiero un frontend developer experto para maquetar un diseño de Figma en Next.js. Debe incluir soporte completo de SEO y desplegarlo en Vercel.",
    terminos: "Pago retenido de forma segura en Garantía ClassMarket. Plazo de entrega: 5 días.",
    pago: "450",
    distancia_km: 0.8,
    lat: 7.125,
    lng: -73.125,
    status: "available"
  },
  {
    id: "job2",
    cliente_nombre: "Carlos Gómez",
    cliente_avatar: "",
    cliente_calificacion: 4.8,
    titulo_trabajo: "Asistencia Técnica Express en AWS",
    descripcion: "Configuración urgente de grupo de escalamiento automático (ASG) y balanceador de carga en AWS para ecommerce.",
    terminos: "Revisión técnica de 24 horas y liberación inmediata al confirmar despliegue.",
    pago: "120",
    distancia_km: 1.2,
    lat: 7.115,
    lng: -73.118,
    status: "available"
  },
  {
    id: "job3",
    cliente_nombre: "Sofía Beltrán",
    cliente_avatar: "",
    cliente_calificacion: 4.7,
    titulo_trabajo: "Optimización SEO y Performance",
    descripcion: "Optimizar el rendimiento web (Core Web Vitals) de un blog de viajes en WordPress. Busco elevar la calificación en Lighthouse a +95.",
    terminos: "50% anticipo liberado en escrow, 50% al entregar auditoría aprobada.",
    pago: "320",
    distancia_km: 1.9,
    lat: 7.121,
    lng: -73.131,
    status: "available"
  },
  {
    id: "job4",
    cliente_nombre: "Andrés Mora",
    cliente_avatar: "",
    cliente_calificacion: 4.6,
    titulo_trabajo: "Diseño de Logo y Manual de Marca",
    descripcion: "Startup de tecnología necesita identidad visual completa: logo, paleta de colores, tipografías y guía de estilo. Entrega en 7 días.",
    terminos: "Escrow activo. 3 rondas de revisión incluidas.",
    pago: "280",
    distancia_km: 2.3,
    lat: 7.132,
    lng: -73.112,
    status: "available"
  },
  {
    id: "job5",
    cliente_nombre: "Valentina Ríos",
    cliente_avatar: "",
    cliente_calificacion: 5.0,
    titulo_trabajo: "Edición de Video Corporativo",
    descripcion: "Necesito editar 3 videos corporativos (5-8 min c/u), con animaciones de texto, color grading profesional y música de fondo.",
    terminos: "Pago total en escrow. Entrega en 10 días hábiles.",
    pago: "550",
    distancia_km: 0.6,
    lat: 7.109,
    lng: -73.135,
    status: "available"
  },
  {
    id: "job6",
    cliente_nombre: "Luis Pardo",
    cliente_avatar: "",
    cliente_calificacion: 4.5,
    titulo_trabajo: "Automatización con Python y Selenium",
    descripcion: "Automatizar proceso de scraping y reporte diario de precios en 15 sitios de e-commerce usando Python.",
    terminos: "Pago al entregar código funcional y documentado en GitHub.",
    pago: "200",
    distancia_km: 3.1,
    lat: 7.140,
    lng: -73.120,
    status: "available"
  },
  {
    id: "job7",
    cliente_nombre: "Marcela Fuentes",
    cliente_avatar: "",
    cliente_calificacion: 4.8,
    titulo_trabajo: "Community Manager (3 meses)",
    descripcion: "Gestión de Instagram y TikTok para restaurante gourmet. Mínimo 15 publicaciones semanales, stories diarios, respuesta de comentarios.",
    terminos: "Contrato mensual con pago quincernal en escrow.",
    pago: "380",
    distancia_km: 1.5,
    lat: 7.113,
    lng: -73.127,
    status: "available"
  },
  {
    id: "job8",
    cliente_nombre: "Ricardo Soto",
    cliente_avatar: "",
    cliente_calificacion: 4.7,
    titulo_trabajo: "Instalación Sistema de CCTV",
    descripcion: "Instalación de 8 cámaras IP en local comercial de 2 pisos. Incluye DVR, cableado estructurado y configuración de acceso remoto.",
    terminos: "Pago 50% inicio, 50% al finalizar instalación verificada.",
    pago: "650",
    distancia_km: 2.8,
    lat: 7.128,
    lng: -73.140,
    status: "available"
  },
  {
    id: "job9",
    cliente_nombre: "Daniela Cruz",
    cliente_avatar: "",
    cliente_calificacion: 4.9,
    titulo_trabajo: "Traducción de Manual Técnico (EN→ES)",
    descripcion: "Traducción y adaptación de manual técnico de maquinaria industrial, 80 páginas, terminología especializada.",
    terminos: "Precio por página. Escrow activado al inicio.",
    pago: "160",
    distancia_km: 0.4,
    lat: 7.119,
    lng: -73.109,
    status: "available"
  },
  {
    id: "job10",
    cliente_nombre: "Felipe Torres",
    cliente_avatar: "",
    cliente_calificacion: 4.6,
    titulo_trabajo: "Desarrollo de App Móvil en Flutter",
    descripcion: "MVP de app de delivery local para Android e iOS. Módulos: catálogo, carrito, pagos con PayU y seguimiento en tiempo real.",
    terminos: "Por sprints de 2 semanas. Pago por entrega aprobada.",
    pago: "1200",
    distancia_km: 4.0,
    lat: 7.103,
    lng: -73.145,
    status: "available"
  },
  {
    id: "job11",
    cliente_nombre: "Gabriela Mendez",
    cliente_avatar: "",
    cliente_calificacion: 4.8,
    titulo_trabajo: "Consultoría Financiera Startup",
    descripcion: "Asesoría para modelo financiero, proyecciones a 3 años, pitch deck para inversionistas y estructura societaria.",
    terminos: "Pago por sesión (3 sesiones). Garantía ClassMarket.",
    pago: "420",
    distancia_km: 1.7,
    lat: 7.136,
    lng: -73.105,
    status: "available"
  },
  {
    id: "job12",
    cliente_nombre: "Camilo Herrera",
    cliente_avatar: "",
    cliente_calificacion: 4.5,
    titulo_trabajo: "Clase Particular de Inglés B2",
    descripcion: "10 clases de inglés de conversación avanzada (B2-C1) para ejecutivo. Enfoque en vocabulario de negocios y presentaciones.",
    terminos: "Pago por paquete completo en escrow. Horario flexible.",
    pago: "90",
    distancia_km: 0.9,
    lat: 7.124,
    lng: -73.117,
    status: "available"
  },
  {
    id: "job13",
    cliente_nombre: "Natalia Ospina",
    cliente_avatar: "",
    cliente_calificacion: 4.9,
    titulo_trabajo: "Rediseño de Tienda WooCommerce",
    descripcion: "Actualización de plantilla, optimización de velocidad, pasarela de pago con MercadoPago y configuración de envíos automáticos.",
    terminos: "Anticipo 40% en escrow, resto al go-live.",
    pago: "380",
    distancia_km: 2.2,
    lat: 7.107,
    lng: -73.122,
    status: "available"
  },
  {
    id: "job14",
    cliente_nombre: "Santiago Ruiz",
    cliente_avatar: "",
    cliente_calificacion: 4.7,
    titulo_trabajo: "Fotografía de Producto eCommerce",
    descripcion: "Sesión fotográfica para 40 productos de joyería artesanal. Fondo blanco, sombra suave, retoque profesional y formato webp optimizado.",
    terminos: "Sesión en estudio. Pago 100% en escrow al confirmar trabajo.",
    pago: "340",
    distancia_km: 3.5,
    lat: 7.096,
    lng: -73.132,
    status: "available"
  },
  {
    id: "job15",
    cliente_nombre: "Isabela Guerrero",
    cliente_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.8,
    titulo_trabajo: "Apoyo Escolar Integral",
    descripcion: "Ayudo con tareas, guías, preparación para exámenes y organización de estudio.",
    terminos: "Presencial o virtual. Pago por hora acordado.",
    pago: "10",
    distancia_km: 1.1,
    lat: 7.117,
    lng: -73.098,
    status: "available"
  },
  {
    id: "job16",
    cliente_nombre: "Mariana López",
    cliente_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 5.0,
    titulo_trabajo: "Tutoría de Matemáticas para Secundaria",
    descripcion: "Álgebra, trigonometría, ejercicios prácticos y refuerzo para exámenes parciales.",
    terminos: "Clases presenciales en Floridablanca. Horarios flexibles.",
    pago: "12",
    distancia_km: 1.3,
    lat: 7.068,
    lng: -73.098,
    status: "available"
  },
  {
    id: "job17",
    cliente_nombre: "Juan Carlos Pérez",
    cliente_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.9,
    titulo_trabajo: "Programación Python para Principiantes",
    descripcion: "Aprende lógica, estructuras de datos básicas y crea tus primeros proyectos.",
    terminos: "Clases online o presenciales. Material incluido.",
    pago: "18",
    distancia_km: 1.6,
    lat: 7.134,
    lng: -73.141,
    status: "available"
  },
  {
    id: "job18",
    cliente_nombre: "Laura Martínez",
    cliente_avatar: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 5.0,
    titulo_trabajo: "Química y Biología para Bachillerato",
    descripcion: "Refuerzo teórico-práctico, laboratorios virtuales y preparación para exámenes.",
    terminos: "Presencial en Bucaramanga. Pago por hora.",
    pago: "14",
    distancia_km: 1.0,
    lat: 7.127,
    lng: -73.113,
    status: "available"
  },
  {
    id: "job19",
    cliente_nombre: "Andrés Gómez",
    cliente_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.8,
    titulo_trabajo: "Física Mecánica y Electromagnetismo",
    descripcion: "Resolución de ejercicios, teoría y preparación para parciales universitarios.",
    terminos: "Clases en Piedecuesta o virtuales.",
    pago: "16",
    distancia_km: 2.0,
    lat: 7.077,
    lng: -73.062,
    status: "available"
  },
  {
    id: "job20",
    cliente_nombre: "Sara Castillo",
    cliente_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 5.0,
    titulo_trabajo: "Inglés Conversacional B1-B2",
    descripcion: "Conversación, gramática práctica, vocabulario para exámenes y presentación oral.",
    terminos: "Online o presencial en Girón.",
    pago: "13",
    distancia_km: 1.8,
    lat: 7.068,
    lng: -73.169,
    status: "available"
  },
  {
    id: "job21",
    cliente_nombre: "Miguel Ángel Torres",
    cliente_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.9,
    titulo_trabajo: "Álgebra Lineal y Cálculo Diferencial",
    descripcion: "Apoyo para universitarios, ejercicios paso a paso y preparación para exámenes.",
    terminos: "Presencial o virtual. Material digital incluido.",
    pago: "17",
    distancia_km: 1.7,
    lat: 7.142,
    lng: -73.106,
    status: "available"
  },
  {
    id: "job22",
    cliente_nombre: "Daniela Ramírez",
    cliente_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 5.0,
    titulo_trabajo: "Tareas, Guías y Resúmenes",
    descripcion: "Te ayudo con tus guías, resúmenes, mapas mentales y organización académica.",
    terminos: "Rápido, claro y efectivo. Presencial en Bucaramanga.",
    pago: "9",
    distancia_km: 0.9,
    lat: 7.122,
    lng: -73.124,
    status: "available"
  }
];

export default function MapaExpertos() {
  const router = useRouter();

  // Mode state: dynamic segmented control in header
  const [mode, setMode] = useState<"experts" | "jobs">("experts");
  const [userRole, setUserRole] = useState<string>("client");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "client";
    setUserRole(role);
    if (role === "pro") {
      setMode("jobs");
    } else {
      setMode("experts");
    }
  }, []);
  
  // Lists
  const [experts, setExperts] = useState<Expert[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>(MOCK_JOBS);
  
  // Selections
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Filters (for experts mode)
  const [busqueda, setBusqueda] = useState("");
  const [pais, setPais] = useState("Colombia");
  const [departamento, setDepartamento] = useState("Santander");
  const [ciudad, setCiudad] = useState("Bucaramanga");
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number} | null>(null);

  // Jobs-mode location search
  const [jobSearch, setJobSearch] = useState("");
  const [jobSearchLoading, setJobSearchLoading] = useState(false);

  // Profile metadata
  const [profileName, setProfileName] = useState("Profesional");

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Sync user metadata and role on mount ───────────────────────────────────
  useEffect(() => {
    // Sync registered name
    const savedName = localStorage.getItem("userName") || localStorage.getItem("proName");
    if (savedName) setProfileName(savedName);

    const syncSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const meta = session.user.user_metadata;
          const regName = meta?.nombre_completo || meta?.full_name || session.user.email?.split("@")[0];
          if (regName) {
            setProfileName(regName);
            localStorage.setItem("userName", regName);
          }
        }
      } catch (err) {
        console.error("Session sync failed:", err);
      }
    };
    syncSession();
  }, []);

  // ── Geolocation ────────────────────────────────────────────────────────────
  const handleMiUbicacion = useCallback(() => {
    if (!navigator.geolocation) {
      showToast("Tu navegador no soporta geolocalización.");
      return;
    }
    showToast("Obteniendo tu ubicación en tiempo real…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(loc);
        setMapCenter(loc);
        localStorage.setItem("userLastLocation", JSON.stringify(loc));
        showToast("✓ Ubicación en tiempo real detectada con éxito.");
      },
      () => {
        // Fallback Bucaramanga center
        const fallback = { lat: 7.1193, lng: -73.1227 };
        setUserLocation(fallback);
        setMapCenter(fallback);
        showToast("✓ Centrado en ubicación predeterminada (Santander)");
      }
    );
  }, [showToast]);

  // Request location on mount
  useEffect(() => {
    handleMiUbicacion();
  }, [handleMiUbicacion]);

  // ── Shift Job Offers relative to user/search coordinates ───────────────────
  const rebaseJobs = useCallback((center: { lat: number; lng: number }) => {
    const offsets = [
      { dLat: 0.005, dLng: 0.005, dist: 0.8 },
      { dLat: -0.004, dLng: -0.004, dist: 1.2 },
      { dLat: 0.002, dLng: -0.007, dist: 1.9 },
      { dLat: 0.009, dLng: 0.003, dist: 2.3 },
      { dLat: -0.008, dLng: 0.006, dist: 0.6 },
      { dLat: 0.006, dLng: -0.011, dist: 3.1 },
      { dLat: -0.003, dLng: -0.009, dist: 1.5 },
      { dLat: 0.012, dLng: 0.008, dist: 2.8 },
      { dLat: -0.001, dLng: 0.011, dist: 0.4 },
      { dLat: -0.014, dLng: -0.002, dist: 4.0 },
      { dLat: 0.011, dLng: -0.005, dist: 1.7 },
      { dLat: -0.006, dLng: 0.014, dist: 0.9 },
      { dLat: 0.003, dLng: -0.015, dist: 2.2 },
      { dLat: -0.016, dLng: -0.008, dist: 3.5 },
      { dLat: 0.007, dLng: 0.016, dist: 1.1 },
    ];
    const updated = MOCK_JOBS.map((job, idx) => {
      const off = offsets[idx] || { dLat: (Math.random() - 0.5) * 0.02, dLng: (Math.random() - 0.5) * 0.02, dist: 2.0 };
      return { ...job, lat: center.lat + off.dLat, lng: center.lng + off.dLng, distancia_km: off.dist };
    });
    setJobs(updated);
  }, []);

  useEffect(() => {
    if (userLocation) {
      rebaseJobs(userLocation);
    }
  }, [userLocation, rebaseJobs]);

  // ── Jobs-mode: geocode search query ────────────────────────────────────────
  const handleJobSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!jobSearch.trim()) return;
    setJobSearchLoading(true);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(jobSearch)}&limit=1`)
      .then(res => res.json())
      .then((data: Array<{ lat: string; lon: string; display_name: string }>) => {
        if (data && data.length > 0) {
          const newCenter = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
          setMapCenter(newCenter);
          rebaseJobs(newCenter);
          showToast(`✓ Mostrando ofertas cerca de: ${data[0].display_name.split(',').slice(0, 2).join(',')}`);
        } else {
          showToast("No se encontró esa ubicación. Intenta con otra ciudad.");
        }
      })
      .catch(() => showToast("Error al buscar. Verifica tu conexión."))
      .finally(() => setJobSearchLoading(false));
  }, [jobSearch, rebaseJobs, showToast]);

  // ── Fetch experts / student offers ──────────────────────────
  const fetchExperts = useCallback(async () => {
    if (mode !== "experts") return;
    
    // Iniciar con las ofertas estudiantiles locales de inmediato
    const q = busqueda.toLowerCase().trim();
    const cityFilter = ciudad.toLowerCase().trim();

    const filtered = FALLBACK_EXPERTS.filter((e) => {
      const matchSearch =
        !q ||
        e.nombre_completo.toLowerCase().includes(q) ||
        e.titulo_profesional.toLowerCase().includes(q) ||
        e.categoria.toLowerCase().includes(q);

      const matchCity =
        !cityFilter ||
        (e.ciudad || "").toLowerCase().includes(cityFilter) ||
        cityFilter.includes((e.ciudad || "").toLowerCase());

      return matchSearch && matchCity;
    });

    setExperts(filtered.length > 0 ? filtered : FALLBACK_EXPERTS);
    setIsLoading(false);

    // Complementar con Supabase en segundo plano si está disponible
    try {
      let query = supabase
        .from("perfiles_profesionales")
        .select("id, nombre_completo, titulo_profesional, categoria, calificacion, distancia_km, foto_perfil, lat, lng, tarifa");

      if (ciudad) query = query.ilike("ciudad", `%${ciudad}%`);
      const { data } = await query.limit(20);
      if (data && data.length > 0) {
        setExperts(data);
      }
    } catch {
      // Usar las ofertas estudiantiles sin bloquear la UI
    }
  }, [busqueda, ciudad, mode]);

  useEffect(() => {
    if (mode === "experts") {
      const timer = setTimeout(fetchExperts, 300);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [fetchExperts, mode]);

  // Geocode filter queries to map center
  useEffect(() => {
    if (mode === "experts" && (ciudad || busqueda)) {
      const query = busqueda ? busqueda : `${ciudad} Santander Colombia`;
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setMapCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
          }
        })
        .catch(() => {});
    }
  }, [ciudad, busqueda, mode]);

  // ── Handlers for Job Accepting workflow ─────────────────────────────────────
  const handleAcceptJob = (jobId: string) => {
    const acceptedJob = jobs.find(j => j.id === jobId);
    if (!acceptedJob) return;
    
    // Update local jobs list state to accepted
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "accepted" } : j));
    setSelectedJobId(null);
    showToast(`✓ Contrato inteligente firmado. ¡Has aceptado el trabajo de ${acceptedJob.cliente_nombre}!`);
  };

  const handleDeclineJob = (jobId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "declined" } : j));
    setSelectedJobId(null);
    showToast("Oferta de trabajo rechazada.");
  };

  const handleVerPerfil = (id: string) => router.push(`/expertos/${id}`);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#f8f9ff] font-plus-jakarta pb-28">

      {/* ── Top Header Navbar ────────────────────────────────────────────────── */}
      <header
        className="z-50 flex justify-between items-center w-full px-6 py-4 bg-white border-b border-sky-50 shadow-sm flex-shrink-0"
      >
        {/* Left: Tool link Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => router.push("/dashboard-pro")}
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-[#0B2545] to-[#12335d] rounded-lg flex items-center justify-center shadow-md border border-[#C5A059]/30">
              <span className="material-symbols-outlined text-white text-lg leading-none font-bold">hub</span>
            </div>
            <h1 className="text-lg font-black text-[#0B2545] tracking-tight flex items-center gap-1.5">
              ClassMarket <span className="text-[#C5A059] font-bold text-xs px-2 py-0.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30">Mapa</span>
            </h1>
          </div>
        </div>

        {/* Center Segmented Toggle control: for Students show Ofertas Estudiantiles */}
        <div className="bg-[#FAF8F5] p-1 rounded-full flex items-center shadow-inner border border-[#C5A059]/30">
          <button
            onClick={() => {
              setMode("experts");
              setSelectedJobId(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === "experts"
                ? "bg-[#0B2545] text-white shadow-sm"
                : "text-[#5C6B73] hover:text-[#0B2545]"
            }`}
          >
            <UserCheck size={13} className="text-[#C5A059]" />
            <span>Tutorías & Ofertas de Estudiantes</span>
          </button>
          <button
            onClick={() => {
              setMode("jobs");
              setSelectedId(null);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === "jobs"
                ? "bg-[#0B2545] text-white shadow-sm"
                : "text-[#5C6B73] hover:text-[#0B2545]"
            }`}
          >
            <Briefcase size={13} />
            <span>Solicitudes de Ayuda</span>
          </button>
        </div>

        {/* Right: Notifications & profile avatar */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-[#5C6B73] hover:text-[#0B2545] bg-[#FAF8F5] border border-gray-100 rounded-full hover:scale-105 transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C5A059] rounded-full animate-pulse" />
          </button>

          {/* User profile pill */}
          <div className="flex items-center gap-2 bg-[#0B2545]/5 border border-[#C5A059]/30 px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs border border-[#C5A059]">
              {profileName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-extrabold text-[#0B2545] hidden sm:inline">{profileName}</span>
          </div>
        </div>
      </header>

      {/* ── Main Leaflet Canvas Layout ────────────────────────────────────────── */}
      <main className="flex-1 relative flex overflow-hidden">

        {/* Left Drawer list */}
        <PanelLateral
          isOpen={isPanelOpen}
          onToggle={() => setIsPanelOpen((p) => !p)}
          isLoading={isLoading}
          mode={mode}
          experts={experts}
          selected={selectedId}
          onSelect={(id) => setSelectedId(prev => (prev === id ? null : id))}
          jobs={jobs}
          selectedJobId={selectedJobId}
          onSelectJob={(id) => setSelectedJobId(prev => (prev === id ? null : id))}
        />

        {/* Map Layer */}
        <div className="relative flex-1 h-full">

          {/* Floating filters ONLY shown on client mode */}
          {mode === "experts" && (
            <FiltrosUbicacion
              busqueda={busqueda}
              onBusquedaChange={setBusqueda}
              pais={pais}
              onPaisChange={setPais}
              departamento={departamento}
              onDepartamentoChange={setDepartamento}
              ciudad={ciudad}
              onCiudadChange={setCiudad}
              onMiUbicacion={handleMiUbicacion}
            />
          )}

          {/* Floating Live Indicator + search bar shown on Jobs mode */}
          {mode === "jobs" && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
              {/* Live pill */}
              <div className="flex justify-center mb-2">
                <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-sky-100 shadow-lg flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </span>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">EMPLEOS EN VIVO</span>
                    <span className="text-xs font-extrabold text-[#0d1c2e]">{jobs.filter(j => j.status === 'available').length} ofertas activas cerca de ti</span>
                  </div>
                </div>
              </div>

              {/* Search bar */}
              <form onSubmit={handleJobSearch} className="flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-2xl border border-sky-100 shadow-xl px-4 py-3">
                <span className="material-symbols-outlined text-[#D81B60] text-[20px] shrink-0">location_on</span>
                <input
                  type="text"
                  value={jobSearch}
                  onChange={e => setJobSearch(e.target.value)}
                  placeholder="Buscar por ciudad o dirección…"
                  className="flex-1 text-sm font-medium text-[#0d1c2e] placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={jobSearchLoading || !jobSearch.trim()}
                  className="px-4 py-1.5 bg-[#0B2545] hover:bg-[#12335d] text-white font-bold text-xs rounded-xl hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 border border-[#C5A059]/30"
                >
                  {jobSearchLoading ? (
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-[16px] leading-none">search</span>
                  )}
                  Ir
                </button>
              </form>
            </div>
          )}

          {/* Interactive Dynamic Leaflet Map Component */}
          <MapaBase
            mode={mode}
            experts={experts}
            selectedId={selectedId}
            onSelectExpert={setSelectedId}
            onVerPerfil={handleVerPerfil}
            userLocation={userLocation}
            mapCenter={mapCenter}
            jobs={jobs}
            selectedJobId={selectedJobId}
            onSelectJob={setSelectedJobId}
            onAcceptJob={handleAcceptJob}
            onDeclineJob={handleDeclineJob}
          />

          {/* Loading status overlay pill */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-xl rounded-full px-5 py-2.5 shadow-lg flex items-center gap-3 border border-white"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full"
                />
                <span className="text-xs font-bold text-[#0d1c2e]">
                  Escaneando coordenadas de confianza…
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile: list toggle drawer trigger */}
          <div className="lg:hidden absolute top-6 right-6 z-40">
            <button
              onClick={() => setIsPanelOpen((p) => !p)}
              className="w-11 h-11 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#0d1c2e] border border-sky-100 hover:scale-105 transition-all"
            >
              {isPanelOpen ? <X size={18} /> : <LayoutList size={18} />}
            </button>
          </div>
        </div>

      </main>

      {/* ── Navigation Bottom Bar ────────────────────────────────────────────── */}
      {userRole === "client" ? (
        <BottomNav />
      ) : (
        <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-8 bg-white/90 backdrop-blur-xl border-t border-sky-50 shadow-[0_-10px_40px_rgba(13,28,46,0.06)] rounded-t-[32px] z-50">
          <div className="flex justify-around items-center w-full max-w-lg mx-auto">
            {/* Perfil */}
            <a 
              href="/perfil-y-editor-de-servicios-2" 
              className="flex flex-col items-center justify-center text-slate-400 hover:text-[#0d1c2e] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">account_circle</span>
              <span className="text-[10px] font-semibold mt-1">Perfil</span>
            </a>

            {/* Dashboard */}
            <a 
              href="/dashboard-pro" 
              className="flex flex-col items-center justify-center text-slate-400 hover:text-[#0d1c2e] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">analytics</span>
              <span className="text-[10px] font-semibold mt-1">Dashboard</span>
            </a>

            {/* Mapa (Active - Pink style matching requested bottom nav layout) */}
            <a 
              href="#" 
              className="flex flex-col items-center justify-center text-[#0B2545] bg-[#C5A059]/20 rounded-2xl px-5 py-2 cursor-pointer transition-all border border-[#C5A059]/40"
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
              <span className="text-[10px] font-bold mt-1">Mapa</span>
            </a>

            {/* Agenda */}
            <a 
              href="/agenda" 
              className="flex flex-col items-center justify-center text-slate-400 hover:text-[#0d1c2e] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">calendar_today</span>
              <span className="text-[10px] font-semibold mt-1">Agenda</span>
            </a>

            {/* Mensajes */}
            <a 
              href="/chat" 
              className="flex flex-col items-center justify-center text-slate-400 hover:text-[#0d1c2e] transition-colors cursor-pointer relative"
            >
              <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
              <span className="text-[10px] font-semibold mt-1">Mensajes</span>
              <div className="absolute top-0 right-3 w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-pulse" />
            </a>
          </div>
        </nav>
      )}

      {/* ── Toast Notifications ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
            className="fixed bottom-28 left-1/2 z-[500] bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-800"
          >
            <Sparkles size={14} className="text-[#C5A059]" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
      `}</style>
    </div>
  );
}

