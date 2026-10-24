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
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
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

// ─── Realistic Scatter Offsets for Street-Level Distribution (Photo 3) ────────
const SCATTER_OFFSETS = [
  { dLat: 0.0035, dLng: 0.0038, dist: 0.5 },
  { dLat: -0.0028, dLng: -0.0042, dist: 0.6 },
  { dLat: 0.0051, dLng: -0.0031, dist: 0.8 },
  { dLat: -0.0045, dLng: 0.0052, dist: 0.9 },
  { dLat: 0.0068, dLng: 0.0022, dist: 1.1 },
  { dLat: -0.0058, dLng: -0.0025, dist: 1.0 },
  { dLat: 0.0019, dLng: -0.0068, dist: 1.2 },
  { dLat: -0.0032, dLng: 0.0075, dist: 1.3 },
  { dLat: 0.0078, dLng: -0.0051, dist: 1.5 },
  { dLat: -0.0071, dLng: 0.0041, dist: 1.4 },
  { dLat: 0.0042, dLng: 0.0065, dist: 1.2 },
  { dLat: -0.0052, dLng: -0.0058, dist: 1.3 },
  { dLat: 0.0061, dLng: -0.0079, dist: 1.7 },
  { dLat: -0.0021, dLng: 0.0095, dist: 1.6 },
  { dLat: 0.0089, dLng: 0.0048, dist: 1.8 },
  { dLat: -0.0082, dLng: -0.0039, dist: 1.9 },
  { dLat: 0.0029, dLng: -0.0105, dist: 2.1 },
  { dLat: -0.0041, dLng: 0.0112, dist: 2.2 },
  { dLat: 0.0098, dLng: -0.0068, dist: 2.4 },
  { dLat: -0.0089, dLng: 0.0078, dist: 2.3 },
  { dLat: 0.0052, dLng: 0.0108, dist: 2.0 },
  { dLat: -0.0065, dLng: -0.0089, dist: 2.2 },
];

// ─── 22 Active Student Tutors (Academic Peer Marketplace) ─────────────────────
const INITIAL_STUDENT_EXPERTS: Expert[] = [
  {
    id: "e1",
    nombre_completo: "Camila Torres (17 años)",
    titulo_profesional: "Tutorías de Matemáticas, Álgebra y Física 10°-11°",
    categoria: "MatematicasCiencias",
    calificacion: 5.0,
    distancia_km: 0.5,
    tarifa: "$10/hr",
    foto_perfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e2",
    nombre_completo: "Mateo Valenzuela (18 años)",
    titulo_profesional: "Guías Resueltas & Apoyo en Química Orgánica y Biología",
    categoria: "TareasGuias",
    calificacion: 4.9,
    distancia_km: 0.6,
    tarifa: "$8/hr",
    foto_perfil: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e3",
    nombre_completo: "Sofía Salazar (16 años)",
    titulo_profesional: "Clases de Inglés Conversacional & Pruebas Saber 11",
    categoria: "TutoriasClases",
    calificacion: 5.0,
    distancia_km: 0.8,
    tarifa: "$12/hr",
    foto_perfil: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e4",
    nombre_completo: "Diego Morales (19 años)",
    titulo_profesional: "Proyectos en Python, JavaScript, HTML y Scratch",
    categoria: "ProgramacionTecnologias",
    calificacion: 5.0,
    distancia_km: 0.9,
    tarifa: "$14/hr",
    foto_perfil: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e5",
    nombre_completo: "Valentina Gómez (17 años)",
    titulo_profesional: "Intercambio de Libros de Cálculo & Apuntes de Filosofía",
    categoria: "TareasGuias",
    calificacion: 4.8,
    distancia_km: 1.1,
    tarifa: "$6/hr",
    foto_perfil: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e15",
    nombre_completo: "Marcela Fuentes (18 años)",
    titulo_profesional: "Apoyo Escolar Integral y Orientación Académica",
    categoria: "TutoriasClases",
    calificacion: 4.9,
    distancia_km: 1.0,
    tarifa: "$11/hr",
    foto_perfil: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e16",
    nombre_completo: "Mariana López (17 años)",
    titulo_profesional: "Matemáticas para Secundaria y Bachillerato",
    categoria: "MatematicasCiencias",
    calificacion: 5.0,
    distancia_km: 1.2,
    tarifa: "$12/hr",
    foto_perfil: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e17",
    nombre_completo: "Juan Carlos Pérez (19 años)",
    titulo_profesional: "Programación Python para Principiantes",
    categoria: "ProgramacionTecnologias",
    calificacion: 4.9,
    distancia_km: 1.3,
    tarifa: "$18/hr",
    foto_perfil: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e18",
    nombre_completo: "Laura Martínez (18 años)",
    titulo_profesional: "Química y Biología para Bachillerato",
    categoria: "MatematicasCiencias",
    calificacion: 5.0,
    distancia_km: 1.5,
    tarifa: "$14/hr",
    foto_perfil: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e19",
    nombre_completo: "Andrés Gómez (19 años)",
    titulo_profesional: "Física Mecánica y Electromagnetismo",
    categoria: "MatematicasCiencias",
    calificacion: 4.9,
    distancia_km: 1.4,
    tarifa: "$16/hr",
    foto_perfil: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e20",
    nombre_completo: "Sara Castillo (17 años)",
    titulo_profesional: "Inglés Conversacional B1-B2",
    categoria: "TutoriasClases",
    calificacion: 5.0,
    distancia_km: 1.2,
    tarifa: "$13/hr",
    foto_perfil: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e21",
    nombre_completo: "Miguel Ángel Torres (19 años)",
    titulo_profesional: "Álgebra Lineal y Cálculo Diferencial",
    categoria: "MatematicasCiencias",
    calificacion: 4.9,
    distancia_km: 1.3,
    tarifa: "$17/hr",
    foto_perfil: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e22",
    nombre_completo: "Daniela Ramírez (16 años)",
    titulo_profesional: "Tareas, Guías y Resúmenes de Lenguaje e Historia",
    categoria: "TareasGuias",
    calificacion: 5.0,
    distancia_km: 1.7,
    tarifa: "$9/hr",
    foto_perfil: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e23",
    nombre_completo: "Alejandra Vargas (17 años)",
    titulo_profesional: "Trigonometría y Geometría Analítica",
    categoria: "MatematicasCiencias",
    calificacion: 5.0,
    distancia_km: 1.6,
    tarifa: "$12/hr",
    foto_perfil: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e24",
    nombre_completo: "Sebastián Cardona (19 años)",
    titulo_profesional: "JavaScript, React y Lógica Web para Colegios",
    categoria: "ProgramacionTecnologias",
    calificacion: 4.9,
    distancia_km: 1.8,
    tarifa: "$19/hr",
    foto_perfil: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e25",
    nombre_completo: "Carlos Mendoza (18 años)",
    titulo_profesional: "Física Cuántica Básica & Examen Saber 11",
    categoria: "MatematicasCiencias",
    calificacion: 5.0,
    distancia_km: 1.9,
    tarifa: "$16/hr",
    foto_perfil: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e26",
    nombre_completo: "Paula Andrea Díaz (17 años)",
    titulo_profesional: "Biología y Ciencias Naturales",
    categoria: "MatematicasCiencias",
    calificacion: 4.9,
    distancia_km: 2.1,
    tarifa: "$10/hr",
    foto_perfil: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e27",
    nombre_completo: "Kevin Silva (18 años)",
    titulo_profesional: "Talleres de Dibujo Técnico y AutoCAD Básico",
    categoria: "ProgramacionTecnologias",
    calificacion: 5.0,
    distancia_km: 2.2,
    tarifa: "$15/hr",
    foto_perfil: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e28",
    nombre_completo: "Juliana Restrepo (17 años)",
    titulo_profesional: "Refuerzo en Francés Inicial A1-A2",
    categoria: "TutoriasClases",
    calificacion: 5.0,
    distancia_km: 2.4,
    tarifa: "$13/hr",
    foto_perfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e29",
    nombre_completo: "Nicolás Rueda (19 años)",
    titulo_profesional: "Estadística y Probabilidad para Bachillerato",
    categoria: "MatematicasCiencias",
    calificacion: 4.8,
    distancia_km: 2.3,
    tarifa: "$14/hr",
    foto_perfil: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e30",
    nombre_completo: "Lucía Bermúdez (16 años)",
    titulo_profesional: "Apuntes Ilustrados de Química & Resúmenes de Literatura",
    categoria: "TareasGuias",
    calificacion: 5.0,
    distancia_km: 2.0,
    tarifa: "$7/hr",
    foto_perfil: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  },
  {
    id: "e31",
    nombre_completo: "Felipe Jaimes (18 años)",
    titulo_profesional: "Tutorías de Filosofía y Comprensión Lectora ICFES",
    categoria: "TutoriasClases",
    calificacion: 4.9,
    distancia_km: 2.2,
    tarifa: "$11/hr",
    foto_perfil: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&crop=face",
    ciudad: "Piedecuesta",
  }
];

// ─── Fallback Job Offers (matching amounts from Photo 3) ──────────────────────
const MOCK_JOBS: JobOffer[] = [
  {
    id: "job1",
    cliente_nombre: "Elena Varas",
    cliente_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.9,
    titulo_trabajo: "Desarrollo de Landing Page Responsive",
    descripcion: "Requiero un estudiante para maquetar un diseño en Next.js con soporte completo.",
    terminos: "Pago en Garantía ClassMarket.",
    pago: "450",
    distancia_km: 0.5,
    lat: 6.9884,
    lng: -73.0512,
    status: "available"
  },
  {
    id: "job2",
    cliente_nombre: "Carlos Gómez",
    cliente_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.8,
    titulo_trabajo: "Resolución de Taller de Cálculo Integral",
    descripcion: "Taller de 15 ejercicios explicados con procedimiento detallado paso a paso.",
    terminos: "Entrega en 48 horas.",
    pago: "120",
    distancia_km: 0.6,
    lat: 6.9884,
    lng: -73.0512,
    status: "available"
  },
  {
    id: "job3",
    cliente_nombre: "Sofía Beltrán",
    cliente_avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.7,
    titulo_trabajo: "Tutoría Intensiva Pruebas Saber 11",
    descripcion: "3 sesiones de 2 horas para repasar física y matemáticas.",
    terminos: "Encuentro en biblioteca o virtual.",
    pago: "320",
    distancia_km: 0.8,
    lat: 6.9884,
    lng: -73.0512,
    status: "available"
  },
  {
    id: "job4",
    cliente_nombre: "Andrés Mora",
    cliente_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.6,
    titulo_trabajo: "Diseño de Presentación para Proyecto de Grado",
    descripcion: "Diapositivas atractivas y limpias en Canva o PowerPoint.",
    terminos: "Revisión incluida.",
    pago: "16",
    distancia_km: 0.9,
    lat: 6.9884,
    lng: -73.0512,
    status: "available"
  },
  {
    id: "job5",
    cliente_nombre: "Valentina Ríos",
    cliente_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 5.0,
    titulo_trabajo: "Guía Resuelta de Química Orgánica",
    descripcion: "Nomenclatura y reacciones de alcanos y alcoholes.",
    terminos: "Pago al confirmar entrega.",
    pago: "550",
    distancia_km: 1.1,
    lat: 6.9884,
    lng: -73.0512,
    status: "available"
  },
  {
    id: "job6",
    cliente_nombre: "Luis Pardo",
    cliente_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.5,
    titulo_trabajo: "Algoritmos en Python para Tarea Universitaria",
    descripcion: "Estructuras de datos y listas enlazadas explicadas.",
    terminos: "Código comentado.",
    pago: "200",
    distancia_km: 1.0,
    lat: 6.9884,
    lng: -73.0512,
    status: "available"
  },
  {
    id: "job7",
    cliente_nombre: "Marcela Fuentes",
    cliente_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.8,
    titulo_trabajo: "Acompañamiento Escolar en Inglés",
    descripcion: "Práctica de speaking y vocabulario para estudiante de 8°.",
    terminos: "Pago semanal.",
    pago: "380",
    distancia_km: 1.2,
    lat: 6.9884,
    lng: -73.0512,
    status: "available"
  },
  {
    id: "job8",
    cliente_nombre: "Ricardo Soto",
    cliente_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.7,
    titulo_trabajo: "Resumen Completo de Historia y Filosofía",
    descripcion: "Mapas mentales para examen final de grado 11.",
    terminos: "Entrega digital PDF.",
    pago: "90",
    distancia_km: 1.3,
    lat: 6.9884,
    lng: -73.0512,
    status: "available"
  },
  {
    id: "job9",
    cliente_nombre: "Camila Torres",
    cliente_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 5.0,
    titulo_trabajo: "Preparación Examen de Álgebra y Trigonometría",
    descripcion: "Refuerzo presencial en biblioteca de Piedecuesta.",
    terminos: "Pago liberado al finalizar.",
    pago: "17",
    distancia_km: 1.5,
    lat: 6.9884,
    lng: -73.0512,
    status: "available"
  },
  {
    id: "job10",
    cliente_nombre: "David Osorio",
    cliente_avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.9,
    titulo_trabajo: "Tutoría de Fórmulas y Gráficas en Excel",
    descripcion: "Tablas dinámicas y fórmulas para tarea de informática.",
    terminos: "1 hora virtual.",
    pago: "13",
    distancia_km: 1.4,
    lat: 6.9884,
    lng: -73.0512,
    status: "available"
  },
  {
    id: "job11",
    cliente_nombre: "Sara Mendoza",
    cliente_avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 4.8,
    titulo_trabajo: "Taller de Física - Leyes de Newton",
    descripcion: "Diagramas de fuerzas y problemas numéricos resueltos.",
    terminos: "Entrega antes de las 6:00 PM.",
    pago: "9",
    distancia_km: 1.2,
    lat: 6.9884,
    lng: -73.0512,
    status: "available"
  },
  {
    id: "job12",
    cliente_nombre: "Felipe Ardila",
    cliente_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&crop=face",
    cliente_calificacion: 5.0,
    titulo_trabajo: "Asesoría Completa en Proyecto de Ciencias",
    descripcion: "Revisión de hipótesis y redacción de conclusiones.",
    terminos: "Garantía de satisfacción.",
    pago: "12",
    distancia_km: 1.3,
    lat: 6.9884,
    lng: -73.0512,
    status: "available"
  }
];

export default function MapaExpertos() {
  const router = useRouter();

  // Mode state: dynamic segmented control in header
  const [mode, setMode] = useState<"experts" | "jobs">("experts");
  const [userRole, setUserRole] = useState<string>("client");

  // Default coordinates centered on Piedecuesta / Santander (Photo 3)
  const DEFAULT_CENTER = { lat: 6.9884, lng: -73.0512 };

  // Lists
  const [experts, setExperts] = useState<Expert[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  
  // Selections
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // UI states: isPanelOpen is false by default so map matches Photo 3 unobstructed!
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(DEFAULT_CENTER);

  // Floating search state (matching Photo 3)
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Profile metadata
  const [profileName, setProfileName] = useState("Estudiante");

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Shift & Distribute Experts across streets around center (Photo 3) ─────────
  const rebaseExperts = useCallback((center: { lat: number; lng: number }) => {
    const updated = INITIAL_STUDENT_EXPERTS.map((expert, idx) => {
      const off = SCATTER_OFFSETS[idx % SCATTER_OFFSETS.length];
      return {
        ...expert,
        lat: center.lat + off.dLat,
        lng: center.lng + off.dLng,
        distancia_km: off.dist,
      };
    });
    setExperts(updated);
  }, []);

  // ── Shift Job Offers relative to center coordinates ─────────────────────────
  const rebaseJobs = useCallback((center: { lat: number; lng: number }) => {
    const updated = MOCK_JOBS.map((job, idx) => {
      const off = SCATTER_OFFSETS[idx % SCATTER_OFFSETS.length];
      return {
        ...job,
        lat: center.lat + off.dLat,
        lng: center.lng + off.dLng,
        distancia_km: off.dist,
      };
    });
    setJobs(updated);
  }, []);

  // ── Rebase on mount around initial center ──────────────────────────────────
  useEffect(() => {
    rebaseExperts(DEFAULT_CENTER);
    rebaseJobs(DEFAULT_CENTER);
  }, [rebaseExperts, rebaseJobs]);

  // ── Sync user metadata and role on mount ───────────────────────────────────
  useEffect(() => {
    const role = localStorage.getItem("userRole") || "client";
    setUserRole(role);
    if (role === "pro") setMode("jobs");
    else setMode("experts");

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
        // Silent catch
      }
    };
    syncSession();
  }, []);

  // ── Geolocation Detection ──────────────────────────────────────────────────
  const handleMiUbicacion = useCallback(() => {
    if (!navigator.geolocation) {
      showToast("Tu navegador no soporta geolocalización.");
      return;
    }
    showToast("Detectando tu ubicación en tiempo real…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(loc);
        setMapCenter(loc);
        rebaseExperts(loc);
        rebaseJobs(loc);
        localStorage.setItem("userLastLocation", JSON.stringify(loc));
        showToast("✓ Ubicación detectada. Mostrando estudiantes cerca de ti.");
      },
      () => {
        // Fallback Piedecuesta / Bucaramanga center
        setUserLocation(DEFAULT_CENTER);
        setMapCenter(DEFAULT_CENTER);
        rebaseExperts(DEFAULT_CENTER);
        rebaseJobs(DEFAULT_CENTER);
        showToast("✓ Centrado en Piedecuesta (Santander)");
      }
    );
  }, [showToast, rebaseExperts, rebaseJobs]);

  // Request location on mount
  useEffect(() => {
    handleMiUbicacion();
  }, [handleMiUbicacion]);

  // ── Unified Floating Search (Photo 3: "Buscar por ciudad o dirección... [Ir]") ──
  const handleLocationSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);

    // Fast local matches for Santander towns
    const lower = query.toLowerCase();
    let localCenter: { lat: number; lng: number } | null = null;
    if (lower.includes("piedecuesta") || lower.includes("san carlos") || lower.includes("villanueva")) {
      localCenter = { lat: 6.9884, lng: -73.0512 };
    } else if (lower.includes("bucaramanga") || lower.includes("cabecera") || lower.includes("centro")) {
      localCenter = { lat: 7.1193, lng: -73.1227 };
    } else if (lower.includes("floridablanca") || lower.includes("cañaveral")) {
      localCenter = { lat: 7.0622, lng: -73.1073 };
    } else if (lower.includes("girón")) {
      localCenter = { lat: 7.0683, lng: -73.1698 };
    }

    if (localCenter) {
      setMapCenter(localCenter);
      rebaseExperts(localCenter);
      rebaseJobs(localCenter);
      showToast(`✓ Mostrando ofertas activas en: ${query}`);
      setIsSearching(false);
      return;
    }

    // Geocoding via OpenStreetMap Nominatim
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Colombia")}&limit=1`)
      .then(res => res.json())
      .then((data: Array<{ lat: string; lon: string; display_name: string }>) => {
        if (data && data.length > 0) {
          const newCenter = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
          setMapCenter(newCenter);
          rebaseExperts(newCenter);
          rebaseJobs(newCenter);
          showToast(`✓ Mostrando ofertas cerca de: ${data[0].display_name.split(',').slice(0, 2).join(',')}`);
        } else {
          showToast("No se encontró esa ubicación. Intenta con otra ciudad o barrio.");
        }
      })
      .catch(() => showToast("Error al buscar ubicación. Verifica tu conexión."))
      .finally(() => setIsSearching(false));
  }, [searchQuery, rebaseExperts, rebaseJobs, showToast]);

  // ── Profile Navigation: ALWAYS routes to /expertos/[id] and preserves exact initial photo ────
  const handleVerPerfil = (id: string) => {
    const expert = experts.find(e => e.id === id);
    if (expert) {
      router.push(`/expertos/${id}?foto=${encodeURIComponent(expert.foto_perfil || '')}&nombre=${encodeURIComponent(expert.nombre_completo || '')}&titulo=${encodeURIComponent(expert.titulo_profesional || '')}&tarifa=${encodeURIComponent(expert.tarifa || '')}&categoria=${encodeURIComponent(expert.categoria || '')}`);
    } else {
      router.push(`/expertos/${id}`);
    }
  };

  // ── Handlers for Job Accepting workflow ─────────────────────────────────────
  const handleAcceptJob = (jobId: string) => {
    const acceptedJob = jobs.find(j => j.id === jobId);
    if (!acceptedJob) return;
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "accepted" } : j));
    setSelectedJobId(null);
    showToast(`✓ Contrato aceptado con éxito.`);
  };

  const handleDeclineJob = (jobId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "declined" } : j));
    setSelectedJobId(null);
    showToast("Oferta descartada.");
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#FAF8F5] font-sans pb-28">

      {/* ── Top Header Navbar ────────────────────────────────────────────────── */}
      <header className="z-50 flex justify-between items-center w-full px-4 sm:px-6 py-3.5 bg-white border-b border-[#0B2545]/10 shadow-sm flex-shrink-0">
        
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => router.push("/home-cliente")}
          >
            <div className="w-8 h-8 bg-[#0B2545] rounded-lg flex items-center justify-center shadow-md border border-[#C5A059]/40">
              <span className="material-symbols-outlined text-[#C5A059] text-lg leading-none font-bold">hub</span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-[#0B2545] tracking-tight flex items-center gap-1.5">
              ClassMarket <span className="text-[#0B2545] font-bold text-xs px-2 py-0.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40">Mapa</span>
            </h1>
          </div>
        </div>

        {/* Center: Segmented Toggle Control */}
        <div className="bg-[#FAF8F5] p-1 rounded-full flex items-center shadow-inner border border-[#C5A059]/30">
          <button
            onClick={() => {
              setMode("experts");
              setSelectedJobId(null);
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === "experts"
                ? "bg-[#0B2545] text-white shadow-sm"
                : "text-[#5C6B73] hover:text-[#0B2545]"
            }`}
          >
            <UserCheck size={13} className={mode === "experts" ? "text-[#C5A059]" : ""} />
            <span>Tutorías & Ofertas de Estudiantes</span>
          </button>
          <button
            onClick={() => {
              setMode("jobs");
              setSelectedId(null);
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === "jobs"
                ? "bg-[#0B2545] text-white shadow-sm"
                : "text-[#5C6B73] hover:text-[#0B2545]"
            }`}
          >
            <Briefcase size={13} className={mode === "jobs" ? "text-[#C5A059]" : ""} />
            <span>Solicitudes de Ayuda</span>
          </button>
        </div>

        {/* Right: User Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => router.push("/notificaciones")}
            className="relative p-2 text-[#5C6B73] hover:text-[#0B2545] bg-[#FAF8F5] border border-[#0B2545]/10 rounded-full transition-all"
            title="Notificaciones"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C5A059] rounded-full animate-pulse" />
          </button>

          <div 
            onClick={() => router.push("/perfil")}
            className="flex items-center gap-2 bg-[#0B2545]/5 hover:bg-[#0B2545]/10 cursor-pointer border border-[#C5A059]/30 px-3 py-1.5 rounded-full transition-all"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-[#0B2545] text-[#C5A059] flex items-center justify-center font-bold text-xs border border-[#C5A059]">
              {profileName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-extrabold text-[#0B2545] hidden sm:inline">{profileName}</span>
          </div>
        </div>
      </header>

      {/* ── Main Canvas Map Layout ───────────────────────────────────────────── */}
      <main className="flex-1 relative flex overflow-hidden">

        {/* Left Drawer List (Can be toggled anytime, closed by default to show Photo 3) */}
        <PanelLateral
          isOpen={isPanelOpen}
          onToggle={() => setIsPanelOpen(p => !p)}
          isLoading={isLoading}
          mode={mode}
          experts={experts}
          selected={selectedId}
          onSelect={(id) => setSelectedId(prev => (prev === id ? null : id))}
          jobs={jobs}
          selectedJobId={selectedJobId}
          onSelectJob={(id) => setSelectedJobId(prev => (prev === id ? null : id))}
        />

        {/* Map Container Area */}
        <div className="relative flex-1 h-full w-full">

          {/* ── FLOATING SEARCH & LIVE BADGE (EXACTLY MATCHING PHOTO 3) ─────── */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4 pointer-events-auto">
            
            {/* Live Indicator Pill Badge */}
            <div className="flex justify-center mb-2">
              <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-[#0B2545]/10 shadow-lg flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C5A059]"></span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#5C6B73] uppercase tracking-wider">
                    {mode === "experts" ? "TUTORÍAS EN VIVO" : "EMPLEOS EN VIVO"}
                  </span>
                  <span className="text-xs font-extrabold text-[#0B2545]">
                    {mode === "experts" ? `${experts.length} ofertas activas cerca de ti` : `${jobs.filter(j => j.status === 'available').length} ofertas activas cerca de ti`}
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Search Pill Input (Photo 3) */}
            <form 
              onSubmit={handleLocationSearch}
              className="flex items-center gap-2 bg-white/98 backdrop-blur-md rounded-full border border-[#0B2545]/10 shadow-2xl px-4 py-2.5 transition-shadow hover:shadow-xl"
            >
              <MapPin className="text-[#C5A059] shrink-0" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por ciudad o dirección…"
                className="flex-1 text-sm font-semibold text-[#0B2545] placeholder:text-[#5C6B73]/70 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="px-4 py-1.5 bg-[#0B2545] hover:bg-[#12335d] text-white font-bold text-xs rounded-full active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 border border-[#C5A059]/40 shadow-sm"
              >
                {isSearching ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-[16px] text-[#C5A059] leading-none font-bold">search</span>
                )}
                <span>Ir</span>
              </button>
            </form>
          </div>

          {/* Toggle Sidebar Button (Left floating) */}
          <button
            onClick={() => setIsPanelOpen(p => !p)}
            className="absolute top-4 left-4 z-30 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#0B2545]/10 shadow-lg text-xs font-bold text-[#0B2545] flex items-center gap-2 hover:bg-[#FAF8F5] transition-all"
            title="Ver lista de ofertas"
          >
            <LayoutList size={16} className="text-[#C5A059]" />
            <span className="hidden sm:inline">
              {isPanelOpen ? "Ocultar Lista" : `Ver Lista (${mode === "experts" ? experts.length : jobs.length})`}
            </span>
          </button>

          {/* My Location Floating Pill (Left Bottom) */}
          <button
            onClick={handleMiUbicacion}
            className="absolute bottom-20 left-4 z-30 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#0B2545]/10 shadow-lg text-xs font-bold text-[#0B2545] flex items-center gap-2 hover:bg-[#FAF8F5] transition-all"
            title="Centrar en mi ubicación"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#0288D1] animate-ping" />
            <span>Mi ubicación</span>
          </button>

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
        </div>

      </main>

      {/* ── Bottom Navigation ────────────────────────────────────────────────── */}
      <BottomNav />

      {/* ── Toast Notifications ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
            className="fixed bottom-24 left-1/2 z-[500] bg-[#0B2545]/95 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-[#C5A059]/40"
          >
            <Sparkles size={14} className="text-[#C5A059]" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
      `}</style>
    </div>
  );
}
