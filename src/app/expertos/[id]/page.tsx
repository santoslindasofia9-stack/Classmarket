"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Share2, 
  Sparkles,
  ShieldCheck,
  FileCheck
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/dashboard/BottomNav";

interface CompletedJob {
  titulo: string;
  materia: string;
  cliente: string;
  fecha: string;
  calificacion: number;
  comentario: string;
}

interface PortfolioSample {
  titulo: string;
  descripcion: string;
  imagen: string;
  categoria: string;
}

interface StudentProfileData {
  id: string;
  nombre_completo: string;
  edad: string;
  institucion: string;
  titulo_profesional: string;
  categoria: string;
  calificacion: number;
  total_resenas: number;
  tarifa: string;
  tarifa_hora: string;
  foto_perfil: string;
  ciudad: string;
  barrio: string;
  distancia_km: string;
  modalidad: string;
  bio: string;
  telefono: string;
  whatsapp: string;
  email: string;
  horario: string;
  habilidades: string[];
  trabajos_realizados: CompletedJob[];
  muestras_trabajo: PortfolioSample[];
}

// ─── Exhaustive Directory of All Students & Jobs in ClassMarket ───────────────
const COMPREHENSIVE_STUDENTS: Record<string, StudentProfileData> = {
  // Camila Torres (e1 & f1)
  "e1": {
    id: "e1",
    nombre_completo: "Camila Torres",
    edad: "17 años",
    institucion: "Colegio La Salle / Aspirante UIS",
    titulo_profesional: "Tutorías de Matemáticas, Álgebra y Física para 10° y 11°",
    categoria: "Matemáticas & Ciencias",
    calificacion: 5.0,
    total_resenas: 48,
    tarifa: "$10/hr o Trueque de Guías",
    tarifa_hora: "$10.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio San Carlos (a 5 min del Parque Principal)",
    distancia_km: "0.8 km de tu ubicación",
    modalidad: "Presencial a domicilio o virtual por Google Meet",
    bio: "¡Hola! Soy Camila. Me encanta enseñar matemáticas con métodos prácticos y visuales, sin enredos. Ayudo a estudiantes de secundaria y bachillerato a entender álgebra, trigonometría, cálculo básico y física mecánica. Mi objetivo es que no solo apruebes tus parciales y exámenes Saber 11, sino que le pierdas el miedo a los números con paciencia y ejercicios paso a paso.",
    telefono: "+57 314 892 4110",
    whatsapp: "573148924110",
    email: "camila.torres.tutor@classmarket.edu.co",
    horario: "Lunes a Viernes de 2:30 PM a 6:30 PM | Sábados 9:00 AM a 1:00 PM",
    habilidades: ["Álgebra de Baldor", "Trigonometría Analítica", "Física Mecánica", "Preparación Saber 11", "Resolución de Guías"],
    trabajos_realizados: [
      {
        titulo: "Taller Completo de Álgebra Lineal y Factorización",
        materia: "Matemáticas 10°",
        cliente: "Andrés R. (Colegio Balbino García)",
        fecha: "Hace 2 días",
        calificacion: 5.0,
        comentario: "Excelente explicando. Tenía que entregar un taller de 25 puntos y me ayudó a resolverlo entendiendo cada paso. Saqué 4.9 en la sustentación."
      },
      {
        titulo: "Simulacro Intensivo Pruebas Saber 11 - Razonamiento Cuantitativo",
        materia: "Pre-ICFES",
        cliente: "Valentina P. (Colegio Normal Superior)",
        fecha: "Hace 1 semana",
        calificacion: 5.0,
        comentario: "Súper puntual y paciente. Las guías de atajos matemáticos que me pasó me ahorraron muchísimo tiempo en el examen."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Guía Resuelta: Métodos de Factorización",
        descripcion: "Paso a paso con fórmulas simplificadas y ejercicios modelo explicados.",
        imagen: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
        categoria: "Guía de Estudio"
      },
      {
        titulo: "Formulario Gráfico de Física Mecánica",
        descripcion: "Diagramas de cuerpo libre, fórmulas de MRU y MRUA esquematizadas.",
        imagen: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
        categoria: "Apuntes Académicos"
      }
    ]
  },
  "f1": {
    id: "f1",
    nombre_completo: "Camila Torres",
    edad: "17 años",
    institucion: "Colegio La Salle / Aspirante UIS",
    titulo_profesional: "Tutorías de Matemáticas, Álgebra y Física para 10° y 11°",
    categoria: "Matemáticas & Ciencias",
    calificacion: 5.0,
    total_resenas: 48,
    tarifa: "$10/hr o Trueque de Guías",
    tarifa_hora: "$10.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio San Carlos (a 5 min del Parque Principal)",
    distancia_km: "0.8 km de tu ubicación",
    modalidad: "Presencial a domicilio o virtual por Google Meet",
    bio: "¡Hola! Soy Camila. Me encanta enseñar matemáticas con métodos prácticos y visuales, sin enredos. Ayudo a estudiantes de secundaria y bachillerato a entender álgebra, trigonometría, cálculo básico y física mecánica.",
    telefono: "+57 314 892 4110",
    whatsapp: "573148924110",
    email: "camila.torres.tutor@classmarket.edu.co",
    horario: "Lunes a Viernes de 2:30 PM a 6:30 PM",
    habilidades: ["Álgebra", "Física Mecánica", "Preparación Saber 11"],
    trabajos_realizados: [
      {
        titulo: "Taller Completo de Álgebra Lineal y Factorización",
        materia: "Matemáticas 10°",
        cliente: "Andrés R.",
        fecha: "Hace 2 días",
        calificacion: 5.0,
        comentario: "Excelente explicando. Saqué 4.9 en la sustentación."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Guía Resuelta de Factorización",
        descripcion: "Ejercicios paso a paso con fórmulas simplificadas.",
        imagen: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
        categoria: "Guía de Estudio"
      }
    ]
  },
  // Mateo Valenzuela (e2 & f2)
  "e2": {
    id: "e2",
    nombre_completo: "Mateo Valenzuela",
    edad: "18 años",
    institucion: "Pregrado Química UIS / Egresado Colegio San Pedro",
    titulo_profesional: "Guías Resueltas & Apoyo en Química Orgánica y Biología Escolar",
    categoria: "Tareas & Guías",
    calificacion: 4.9,
    total_resenas: 39,
    tarifa: "$8 por guía o $11/hr",
    tarifa_hora: "$11.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta / Floridablanca",
    barrio: "Barrio Villanueva del Campo / Cañaveral",
    distancia_km: "1.2 km de tu ubicación",
    modalidad: "Presencial o Virtual",
    bio: "Estudiante de ciencias exactas con pasión por la enseñanza. Ayudo a resolver guías escolares de química orgánica, inorgánica, estequiometría y biología celular.",
    telefono: "+57 316 712 5590",
    whatsapp: "573167125590",
    email: "mateo.valenzuela@classmarket.edu.co",
    horario: "Lunes a Viernes de 3:00 PM a 7:30 PM",
    habilidades: ["Química Orgánica", "Estequiometría", "Biología Celular"],
    trabajos_realizados: [
      {
        titulo: "Taller de Balanceo por Tanteo y Redox",
        materia: "Química 10°",
        cliente: "Sara M.",
        fecha: "Hace 1 día",
        calificacion: 5.0,
        comentario: "Mateo es un crack para explicar química. Todo muy ordenado."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Resumen Ilustrado de Enlaces Químicos",
        descripcion: "Diagramas de Lewis y tabla periódica simplificada.",
        imagen: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
        categoria: "Resumen Escolar"
      }
    ]
  },
  "f2": {
    id: "f2",
    nombre_completo: "Mateo Valenzuela",
    edad: "18 años",
    institucion: "Pregrado Química UIS",
    titulo_profesional: "Apoyo en Tareas de Química, Biología y Talleres Escolares",
    categoria: "Tareas & Guías",
    calificacion: 4.9,
    total_resenas: 39,
    tarifa: "$7 por guía",
    tarifa_hora: "$11.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio Villanueva del Campo",
    distancia_km: "1.2 km de tu ubicación",
    modalidad: "Presencial o Virtual",
    bio: "Explicaciones claras y guías resueltas paso a paso para que saques la mejor nota.",
    telefono: "+57 316 712 5590",
    whatsapp: "573167125590",
    email: "mateo.valenzuela@classmarket.edu.co",
    horario: "Tardes de 3:00 PM a 7:00 PM",
    habilidades: ["Química", "Biología", "Guías"],
    trabajos_realizados: [
      {
        titulo: "Guía de Grupos Funcionales",
        materia: "Química 11°",
        cliente: "Carlos D.",
        fecha: "Hace 4 días",
        calificacion: 4.9,
        comentario: "Excelente material de apoyo."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Apuntes de Química",
        descripcion: "Esquemas y ejercicios modelo.",
        imagen: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
        categoria: "Apuntes"
      }
    ]
  },
  // Sofía Salazar (e3 & f3)
  "e3": {
    id: "e3",
    nombre_completo: "Sofía Salazar",
    edad: "16 años",
    institucion: "Colegio Bilingüe de Santander (Grado 11°)",
    titulo_profesional: "Clases de Inglés Conversacional & Preparación Pruebas Saber 11",
    categoria: "Tutorías & Clases",
    calificacion: 5.0,
    total_resenas: 52,
    tarifa: "$12/hr o Trueque de Apuntes",
    tarifa_hora: "$12.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Cabecera del Llano / Centro",
    distancia_km: "1.5 km de tu ubicación",
    modalidad: "Virtual por Meet / Presencial en Biblioteca",
    bio: "Nivel de inglés certificado C1. Te ayudo a perder el miedo a hablar, mejorar tu pronunciación, vocabulario cotidiano y dominar la sección de inglés del examen ICFES Saber 11 con trucos de lectura rápida.",
    telefono: "+57 312 905 4488",
    whatsapp: "573129054488",
    email: "sofia.salazar@classmarket.edu.co",
    horario: "Tardes y Fines de Semana",
    habilidades: ["Inglés Conversacional", "Gramática B1-B2", "Lectura Crítica ICFES"],
    trabajos_realizados: [
      {
        titulo: "Preparación Módulo Inglés Saber 11",
        materia: "Inglés Grado 11°",
        cliente: "Juliana V.",
        fecha: "Hace 4 días",
        calificacion: 5.0,
        comentario: "Logré subir más de 15 puntos en mis simulacros gracias a sus tips de lectura."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Plantillas de Vocabulario Clave ICFES",
        descripcion: "Conectores lógicos y preguntas frecuentes resueltas.",
        imagen: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
        categoria: "Material Didáctico"
      }
    ]
  },
  "f3": {
    id: "f3",
    nombre_completo: "Sofía Salazar",
    edad: "16 años",
    institucion: "Colegio Bilingüe",
    titulo_profesional: "Clases de Inglés Conversacional & Preparación de Pruebas",
    categoria: "Tutorías & Clases",
    calificacion: 5.0,
    total_resenas: 52,
    tarifa: "$12 / h o Intercambio",
    tarifa_hora: "$12.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Cabecera del Llano",
    distancia_km: "0.4 km de tu ubicación",
    modalidad: "Virtual / Presencial",
    bio: "Clases dinámicas y prácticas para mejorar tu inglés sin miedo.",
    telefono: "+57 312 905 4488",
    whatsapp: "573129054488",
    email: "sofia.salazar@classmarket.edu.co",
    horario: "Tardes de 2:00 PM a 6:00 PM",
    habilidades: ["Inglés Conversacional", "Pruebas Saber 11"],
    trabajos_realizados: [
      {
        titulo: "Asesoría en Lectura Crítica",
        materia: "Inglés 11°",
        cliente: "David G.",
        fecha: "Hace 1 semana",
        calificacion: 5.0,
        comentario: "Súper buena tutora."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Guía de Gramática Práctica",
        descripcion: "Tiempos verbales resumidos.",
        imagen: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
        categoria: "Guía"
      }
    ]
  },
  // Diego Morales (e4 & f4)
  "e4": {
    id: "e4",
    nombre_completo: "Diego Morales",
    edad: "19 años",
    institucion: "Estudiante de Ingeniería de Sistemas UIS",
    titulo_profesional: "Proyectos en Python, JavaScript, HTML y Scratch Escolar",
    categoria: "Programación & Tecnologías",
    calificacion: 5.0,
    total_resenas: 44,
    tarifa: "$14/hr",
    tarifa_hora: "$14.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Bucaramanga / Piedecuesta",
    barrio: "Barrio San Carlos / La Argentina",
    distancia_km: "0.9 km de tu ubicación",
    modalidad: "Virtual por Discord o Google Meet",
    bio: "Enseño desarrollo web y programación desde cero sin frustraciones. Ayudo a estudiantes de colegio y universidad con tareas de informática, algoritmos en Python, páginas web en HTML/CSS/JS y lógica de programación.",
    telefono: "+57 318 630 2211",
    whatsapp: "573186302211",
    email: "diego.morales@classmarket.edu.co",
    horario: "Lunes a Sábado de 1:00 PM a 8:00 PM",
    habilidades: ["Python Básico & Medio", "HTML5 & CSS3", "JavaScript", "Scratch"],
    trabajos_realizados: [
      {
        titulo: "Proyecto Final de Informática en Python",
        materia: "Tecnología e Informática 11°",
        cliente: "Kevin S.",
        fecha: "Hace 3 días",
        calificacion: 5.0,
        comentario: "Excelente tutor, me explicó el código línea por línea."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Código Documentado de Algoritmos Básicos",
        descripcion: "Ejemplos comentados de bucles, condicionales y funciones.",
        imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
        categoria: "Código Fuente"
      }
    ]
  },
  "f4": {
    id: "f4",
    nombre_completo: "Diego Morales",
    edad: "19 años",
    institucion: "Ingeniería de Sistemas UIS",
    titulo_profesional: "Proyectos en Python, JavaScript, HTML y Scratch para Colegios",
    categoria: "Programación & Tecnologías",
    calificacion: 5.0,
    total_resenas: 44,
    tarifa: "$14 / h",
    tarifa_hora: "$14.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta / Bucaramanga",
    barrio: "Barrio San Carlos",
    distancia_km: "1.5 km de tu ubicación",
    modalidad: "Virtual por Discord o Meet",
    bio: "Aprende a programar proyectos reales para tus clases de colegio o universidad.",
    telefono: "+57 318 630 2211",
    whatsapp: "573186302211",
    email: "diego.morales@classmarket.edu.co",
    horario: "Tardes de 1:00 PM a 7:00 PM",
    habilidades: ["Python", "JavaScript", "HTML/CSS"],
    trabajos_realizados: [
      {
        titulo: "Juego en Scratch y Algoritmos",
        materia: "Informática 9°",
        cliente: "Pablo M.",
        fecha: "Hace 5 días",
        calificacion: 5.0,
        comentario: "Quedó genial el proyecto."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Guía de Scratch",
        descripcion: "Variables y eventos explicados.",
        imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
        categoria: "Tutorial"
      }
    ]
  },
  // Valentina Gómez (e5 & f5)
  "e5": {
    id: "e5",
    nombre_completo: "Valentina Gómez",
    edad: "17 años",
    institucion: "Colegio La Presentación Piedecuesta",
    titulo_profesional: "Intercambio de Libros de Cálculo & Apuntes de Filosofía e Historia",
    categoria: "Tareas & Guías",
    calificacion: 4.8,
    total_resenas: 31,
    tarifa: "Trueque de Libros / $6/hr",
    tarifa_hora: "$6.000 COP / guía",
    foto_perfil: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio Villanueva / Cabecera",
    distancia_km: "1.1 km de tu ubicación",
    modalidad: "Presencial o Entrega de Apuntes en PDF",
    bio: "Amante de la lectura, historia y filosofía. Tengo resúmenes estructurados y libros escolares de cálculo y ciencias listos para trueque o préstamo escolar.",
    telefono: "+57 310 554 9912",
    whatsapp: "573105549912",
    email: "valentina.gomez@classmarket.edu.co",
    horario: "Tardes de 2:00 PM a 6:00 PM",
    habilidades: ["Filosofía Bachillerato", "Historia de Colombia", "Ensayos Académicos"],
    trabajos_realizados: [
      {
        titulo: "Ensayo Crítico sobre Filosofía Moderna",
        materia: "Filosofía 11°",
        cliente: "María José T.",
        fecha: "Hace 1 semana",
        calificacion: 5.0,
        comentario: "Me ayudó a estructurar la tesis del ensayo y redactarlo con normas APA."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Cuaderno de Mapas Mentales de Historia",
        descripcion: "Líneas de tiempo ilustradas con los hitos más evaluados en el ICFES.",
        imagen: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
        categoria: "Apuntes"
      }
    ]
  },
  "f5": {
    id: "f5",
    nombre_completo: "Valentina Gómez",
    edad: "17 años",
    institucion: "Colegio La Presentación",
    titulo_profesional: "Trueque de Libros de Cálculo, resúmenes de Historia y Filosofía",
    categoria: "Tareas & Guías",
    calificacion: 4.8,
    total_resenas: 31,
    tarifa: "$5 / guía o Trueque",
    tarifa_hora: "$5.000 COP / guía",
    foto_perfil: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio Villanueva",
    distancia_km: "1.1 km de tu ubicación",
    modalidad: "Presencial o Digital",
    bio: "Resúmenes estructurados y libros escolares para préstamo o trueque.",
    telefono: "+57 310 554 9912",
    whatsapp: "573105549912",
    email: "valentina.gomez@classmarket.edu.co",
    horario: "Tardes de 2:00 PM a 6:00 PM",
    habilidades: ["Filosofía", "Historia", "Trueque"],
    trabajos_realizados: [
      {
        titulo: "Resumen de Historia Universal",
        materia: "Sociales 10°",
        cliente: "Daniel F.",
        fecha: "Hace 3 días",
        calificacion: 5.0,
        comentario: "Muy buenos apuntes."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Mapas Mentales",
        descripcion: "Esquemas visuales claros.",
        imagen: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
        categoria: "Apuntes"
      }
    ]
  },
  // Marcela Fuentes (e15)
  "e15": {
    id: "e15",
    nombre_completo: "Marcela Fuentes",
    edad: "18 años",
    institucion: "Licenciatura en Educación Infantil UIS",
    titulo_profesional: "Apoyo Escolar Integral y Orientación Académica Primaria y Secundaria",
    categoria: "Tutorías & Clases",
    calificacion: 4.9,
    total_resenas: 36,
    tarifa: "$11/hr",
    tarifa_hora: "$11.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta / Bucaramanga",
    barrio: "Barrio San Carlos / Paseo del Puente",
    distancia_km: "1.0 km de tu ubicación",
    modalidad: "Presencial a domicilio o virtual",
    bio: "Paciencia, pedagogía y técnicas de estudio activas para que niños y jóvenes organicen sus horarios, comprendan sus tareas escolares y mejoren su rendimiento en todas las materias básicas.",
    telefono: "+57 315 220 8914",
    whatsapp: "573152208914",
    email: "marcela.fuentes@classmarket.edu.co",
    horario: "Lunes a Viernes 3:00 PM a 7:00 PM",
    habilidades: ["Técnicas de Estudio", "Comprensión Lectora", "Aritmética Básica"],
    trabajos_realizados: [
      {
        titulo: "Acompañamiento en Guías Escolares Integradas",
        materia: "Apoyo General 8°",
        cliente: "Lucía P.",
        fecha: "Hace 3 días",
        calificacion: 5.0,
        comentario: "Súper paciente con mi hermanito, mejoró mucho sus notas este periodo."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Planificador Semanal de Estudio",
        descripcion: "Método Pomodoro adaptado a tareas de secundaria.",
        imagen: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
        categoria: "Método de Estudio"
      }
    ]
  },
  // Mariana López (e16)
  "e16": {
    id: "e16",
    nombre_completo: "Mariana López",
    edad: "17 años",
    institucion: "Colegio Panamericano",
    titulo_profesional: "Matemáticas para Secundaria y Bachillerato",
    categoria: "Matemáticas & Ciencias",
    calificacion: 5.0,
    total_resenas: 27,
    tarifa: "$12/hr",
    tarifa_hora: "$12.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta / Floridablanca",
    barrio: "Barrio San Carlos / Cabecera",
    distancia_km: "1.2 km de tu ubicación",
    modalidad: "Presencial o Virtual",
    bio: "Especialista en geometría analítica, trigonometría y álgebra. Clases didácticas con ejercicios guiados paso a paso.",
    telefono: "+57 317 400 1199",
    whatsapp: "573174001199",
    email: "mariana.lopez@classmarket.edu.co",
    horario: "Lunes a Viernes 2:00 PM a 6:00 PM",
    habilidades: ["Geometría Analítica", "Trigonometría", "Álgebra"],
    trabajos_realizados: [
      {
        titulo: "Taller de Circunferencia y Parábola",
        materia: "Geometría 10°",
        cliente: "Santiago R.",
        fecha: "Hace 4 días",
        calificacion: 5.0,
        comentario: "Me salvó el periodo con sus explicaciones de geometría analítica."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Ejercicios Resueltos de Secciones Cónicas",
        descripcion: "Fórmulas canónicas y generales con gráficas detalladas.",
        imagen: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
        categoria: "Taller Práctico"
      }
    ]
  },
  // Juan Carlos Pérez (e17)
  "e17": {
    id: "e17",
    nombre_completo: "Juan Carlos Pérez",
    edad: "19 años",
    institucion: "Ingeniería de Sistemas UIS",
    titulo_profesional: "Programación Python para Principiantes",
    categoria: "Programación & Tecnologías",
    calificacion: 4.9,
    total_resenas: 33,
    tarifa: "$18/hr",
    tarifa_hora: "$18.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio San Carlos / Cabecera",
    distancia_km: "1.3 km de tu ubicación",
    modalidad: "Virtual por Discord o Meet",
    bio: "Enseño programación desde cero. Te acompaño en tus primeros programas en Python, ejercicios de lógica, bucles y estructuras de datos sin complicaciones.",
    telefono: "+57 311 829 3344",
    whatsapp: "573118293344",
    email: "juancarlos.perez@classmarket.edu.co",
    horario: "Lunes a Viernes 3:00 PM a 8:00 PM",
    habilidades: ["Python", "Algoritmos", "Lógica de Programación"],
    trabajos_realizados: [
      {
        titulo: "Taller de Funciones y Matrices en Python",
        materia: "Programación 1",
        cliente: "Esteban M.",
        fecha: "Hace 3 días",
        calificacion: 5.0,
        comentario: "Muy claro y paciente para enseñar programación."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Guía de Sintaxis Python",
        descripcion: "Ejemplos comentados paso a paso.",
        imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
        categoria: "Código"
      }
    ]
  },
  // Laura Martínez (e18)
  "e18": {
    id: "e18",
    nombre_completo: "Laura Martínez",
    edad: "18 años",
    institucion: "Licenciatura en Biología y Química UIS",
    titulo_profesional: "Química y Biología para Bachillerato",
    categoria: "Matemáticas & Ciencias",
    calificacion: 5.0,
    total_resenas: 29,
    tarifa: "$14/hr",
    tarifa_hora: "$14.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio Villanueva del Campo",
    distancia_km: "1.5 km de tu ubicación",
    modalidad: "Presencial o Virtual",
    bio: "Te ayudo con resúmenes, mapas mentales y resolución de ejercicios paso a paso en química general, orgánica y biología para mejorar tus calificaciones escolares.",
    telefono: "+57 313 774 2210",
    whatsapp: "573137742210",
    email: "laura.martinez@classmarket.edu.co",
    horario: "Lunes a Sábado 2:00 PM a 6:00 PM",
    habilidades: ["Química General", "Biología", "Mapas Conceptuales"],
    trabajos_realizados: [
      {
        titulo: "Preparación Examen de Estequiometría",
        materia: "Química 10°",
        cliente: "Gabriela T.",
        fecha: "Hace 2 días",
        calificacion: 5.0,
        comentario: "Excelente profesora, todo muy entendible."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Esquema de Célula y Metabolismo",
        descripcion: "Ilustraciones claras con resúmenes.",
        imagen: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
        categoria: "Esquema"
      }
    ]
  },
  // Andrés Gómez (e19)
  "e19": {
    id: "e19",
    nombre_completo: "Andrés Gómez",
    edad: "19 años",
    institucion: "Ingeniería Mecánica UIS",
    titulo_profesional: "Física Mecánica y Electromagnetismo",
    categoria: "Matemáticas & Ciencias",
    calificacion: 4.9,
    total_resenas: 38,
    tarifa: "$16/hr",
    tarifa_hora: "$16.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Cabecera del Llano",
    distancia_km: "1.4 km de tu ubicación",
    modalidad: "Presencial o Virtual",
    bio: "Física explicada de forma intuitiva: leyes de Newton, trabajo y energía, hidrostática y circuitos eléctricos con resolución guiada de problemas.",
    telefono: "+57 315 889 1120",
    whatsapp: "573158891120",
    email: "andres.gomez@classmarket.edu.co",
    horario: "Tardes de 3:00 PM a 7:30 PM",
    habilidades: ["Física Mecánica", "Electromagnetismo", "Cálculo Vectorial"],
    trabajos_realizados: [
      {
        titulo: "Taller de Leyes de Newton y Fricción",
        materia: "Física 10°",
        cliente: "Alejandro C.",
        fecha: "Hace 4 días",
        calificacion: 5.0,
        comentario: "Explica con calma y mucha claridad."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Diagramas de Cuerpo Libre",
        descripcion: "Ejemplos resueltos con fórmulas vectoriales.",
        imagen: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
        categoria: "Física"
      }
    ]
  },
  // Sara Castillo (e20)
  "e20": {
    id: "e20",
    nombre_completo: "Sara Castillo",
    edad: "17 años",
    institucion: "Colegio Bilingüe de Santander",
    titulo_profesional: "Inglés Conversacional B1-B2",
    categoria: "Tutorías & Clases",
    calificacion: 5.0,
    total_resenas: 41,
    tarifa: "$13/hr",
    tarifa_hora: "$13.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio San Carlos",
    distancia_km: "1.2 km de tu ubicación",
    modalidad: "Virtual por Meet / Presencial",
    bio: "Aprende a hablar inglés con fluidez y confianza. Prácticas de conversación, gramática cotidiana y simulacros Saber 11.",
    telefono: "+57 312 665 4433",
    whatsapp: "573126654433",
    email: "sara.castillo@classmarket.edu.co",
    horario: "Lunes a Viernes 2:00 PM a 6:00 PM",
    habilidades: ["Inglés Conversacional", "Listening", "Vocabulario"],
    trabajos_realizados: [
      {
        titulo: "Práctica de Conversación B1",
        materia: "Inglés",
        cliente: "Mariana R.",
        fecha: "Hace 2 días",
        calificacion: 5.0,
        comentario: "Súper chéveres las clases, perdí el miedo a hablar."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Guía de Conectores en Inglés",
        descripcion: "Frases útiles para exámenes y redacción.",
        imagen: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
        categoria: "Guía"
      }
    ]
  },
  // Miguel Ángel Torres (e21)
  "e21": {
    id: "e21",
    nombre_completo: "Miguel Ángel Torres",
    edad: "19 años",
    institucion: "Matemáticas Puras UIS",
    titulo_profesional: "Álgebra Lineal y Cálculo Diferencial",
    categoria: "Matemáticas & Ciencias",
    calificacion: 4.9,
    total_resenas: 35,
    tarifa: "$17/hr",
    tarifa_hora: "$17.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio San Carlos / La Colina",
    distancia_km: "1.3 km de tu ubicación",
    modalidad: "Presencial o Virtual",
    bio: "Derivadas, límites, integrales y álgebra lineal con demostraciones comprensibles y métodos prácticos para aprobar tus parciales.",
    telefono: "+57 316 445 9922",
    whatsapp: "573164459922",
    email: "miguel.torres@classmarket.edu.co",
    horario: "Lunes a Sábado 3:00 PM a 8:00 PM",
    habilidades: ["Cálculo Diferencial", "Límites", "Álgebra Lineal"],
    trabajos_realizados: [
      {
        titulo: "Taller de Regla de la Cadena y Derivadas",
        materia: "Cálculo 11°",
        cliente: "Fabián G.",
        fecha: "Hace 3 días",
        calificacion: 5.0,
        comentario: "Me explicó exactamente lo que salió en el parcial."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Tabla de Derivadas e Integrales",
        descripcion: "Formulario limpio con ejemplos.",
        imagen: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
        categoria: "Formulario"
      }
    ]
  },
  // Daniela Ramírez (e22)
  "e22": {
    id: "e22",
    nombre_completo: "Daniela Ramírez",
    edad: "16 años",
    institucion: "Colegio La Presentación",
    titulo_profesional: "Tareas, Guías y Resúmenes de Lenguaje e Historia",
    categoria: "Tareas & Guías",
    calificacion: 5.0,
    total_resenas: 26,
    tarifa: "$9/hr",
    tarifa_hora: "$9.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio Villanueva",
    distancia_km: "1.7 km de tu ubicación",
    modalidad: "Presencial o Digital",
    bio: "Te ayudo a resolver guías escolares, redactar ensayos con buena ortografía y sintetizar lecturas complejas.",
    telefono: "+57 314 332 1199",
    whatsapp: "573143321199",
    email: "daniela.ramirez@classmarket.edu.co",
    horario: "Tardes de 2:00 PM a 6:00 PM",
    habilidades: ["Comprensión Lectora", "Ensayos", "Ortografía"],
    trabajos_realizados: [
      {
        titulo: "Ensayo Argumentativo de Lenguaje",
        materia: "Español 10°",
        cliente: "Paula M.",
        fecha: "Hace 4 días",
        calificacion: 5.0,
        comentario: "Muy buena redacción y estructura."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Guía de Estructura de Ensayos",
        descripcion: "Paso a paso para redactar tesis y argumentos.",
        imagen: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
        categoria: "Guía"
      }
    ]
  },
  // Alejandra Vargas (e23)
  "e23": {
    id: "e23",
    nombre_completo: "Alejandra Vargas",
    edad: "17 años",
    institucion: "Colegio Panamericano",
    titulo_profesional: "Trigonometría y Geometría Analítica",
    categoria: "Matemáticas & Ciencias",
    calificacion: 5.0,
    total_resenas: 30,
    tarifa: "$12/hr",
    tarifa_hora: "$12.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Cabecera del Llano",
    distancia_km: "1.6 km de tu ubicación",
    modalidad: "Presencial o Virtual",
    bio: "Explicaciones de identidades trigonométricas, funciones senoidales, elipses y parábolas con gráficos paso a paso.",
    telefono: "+57 317 554 8811",
    whatsapp: "573175548811",
    email: "alejandra.vargas@classmarket.edu.co",
    horario: "Lunes a Viernes 3:00 PM a 7:00 PM",
    habilidades: ["Trigonometría", "Geometría Analítica", "Cálculo Gráfico"],
    trabajos_realizados: [
      {
        titulo: "Resolución de Triángulos Oblicuángulos",
        materia: "Trigonometría 10°",
        cliente: "Mateo S.",
        fecha: "Hace 5 días",
        calificacion: 5.0,
        comentario: "Entendí todo super rápido."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Formulario de Identidades",
        descripcion: "Fórmulas trigonométricas explicadas.",
        imagen: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
        categoria: "Formulario"
      }
    ]
  },
  // Sebastián Cardona (e24)
  "e24": {
    id: "e24",
    nombre_completo: "Sebastián Cardona",
    edad: "19 años",
    institucion: "Ingeniería de Sistemas UIS",
    titulo_profesional: "JavaScript, React y Lógica Web para Colegios",
    categoria: "Programación & Tecnologías",
    calificacion: 4.9,
    total_resenas: 34,
    tarifa: "$19/hr",
    tarifa_hora: "$19.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio San Carlos",
    distancia_km: "1.8 km de tu ubicación",
    modalidad: "Virtual por Discord o Meet",
    bio: "Aprende a crear tus primeras páginas web con HTML, CSS y JavaScript. Enfoque 100% práctico con proyectos reales.",
    telefono: "+57 318 221 4455",
    whatsapp: "573182214455",
    email: "sebastian.cardona@classmarket.edu.co",
    horario: "Lunes a Sábado 2:00 PM a 8:00 PM",
    habilidades: ["JavaScript", "HTML/CSS", "React"],
    trabajos_realizados: [
      {
        titulo: "Página Web para Proyecto Escolar",
        materia: "Tecnología 11°",
        cliente: "Camilo B.",
        fecha: "Hace 3 días",
        calificacion: 5.0,
        comentario: "Nos ayudó a ganar el concurso de ciencias del colegio."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Proyecto Web Interactivo",
        descripcion: "Código limpio y comentado.",
        imagen: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
        categoria: "Código"
      }
    ]
  },
  // Carlos Mendoza (e25)
  "e25": {
    id: "e25",
    nombre_completo: "Carlos Mendoza",
    edad: "18 años",
    institucion: "Física UIS",
    titulo_profesional: "Física Cuántica Básica & Examen Saber 11",
    categoria: "Matemáticas & Ciencias",
    calificacion: 5.0,
    total_resenas: 28,
    tarifa: "$16/hr",
    tarifa_hora: "$16.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio San Carlos",
    distancia_km: "1.9 km de tu ubicación",
    modalidad: "Presencial o Virtual",
    bio: "Te ayudo a dominar cinemática, dinámica, ondas y óptica para tus parciales y el examen del ICFES.",
    telefono: "+57 315 990 2233",
    whatsapp: "573159902233",
    email: "carlos.mendoza@classmarket.edu.co",
    horario: "Tardes de 3:00 PM a 7:00 PM",
    habilidades: ["Física", "Óptica", "Ondas"],
    trabajos_realizados: [
      {
        titulo: "Taller de Óptica Geométrica",
        materia: "Física 11°",
        cliente: "Valeria N.",
        fecha: "Hace 4 días",
        calificacion: 5.0,
        comentario: "Excelente explicando los diagramas de rayos."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Resumen de Ondas y Sonido",
        descripcion: "Fórmulas clave explicadas.",
        imagen: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
        categoria: "Física"
      }
    ]
  },
  // Sebastián Rincón (f6)
  "f6": {
    id: "f6",
    nombre_completo: "Sebastián Rincón",
    edad: "18 años",
    institucion: "Colegio San Pedro / UIS",
    titulo_profesional: "Preparación de exámenes de Trigonometría, Geometría y Aritmética",
    categoria: "Matemáticas & Ciencias",
    calificacion: 5.0,
    total_resenas: 32,
    tarifa: "$9/hr",
    tarifa_hora: "$9.000 COP / hora",
    foto_perfil: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&crop=face",
    ciudad: "Piedecuesta, Santander",
    barrio: "Barrio San Carlos",
    distancia_km: "1.0 km de tu ubicación",
    modalidad: "Presencial o Virtual",
    bio: "Explicaciones paso a paso de matemáticas básicas y avanzadas para secundaria.",
    telefono: "+57 316 223 8810",
    whatsapp: "573162238810",
    email: "sebastian.rincon@classmarket.edu.co",
    horario: "Lunes a Viernes 2:00 PM a 6:00 PM",
    habilidades: ["Trigonometría", "Aritmética", "Geometría"],
    trabajos_realizados: [
      {
        titulo: "Taller de Aritmética y Razonamiento",
        materia: "Matemáticas 9°",
        cliente: "Lucas R.",
        fecha: "Hace 2 días",
        calificacion: 5.0,
        comentario: "Muy buen tutor, paciente y puntual."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Ejercicios Resueltos de Geometría",
        descripcion: "Áreas y volúmenes paso a paso.",
        imagen: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
        categoria: "Taller"
      }
    ]
  }
};

// Universal generator that ALWAYS uses the passed query photo or consistent photo
function getStudentById(id: string, queryFoto?: string | null, queryNombre?: string | null): StudentProfileData {
  if (COMPREHENSIVE_STUDENTS[id]) {
    const base = { ...COMPREHENSIVE_STUDENTS[id] };
    if (queryFoto) base.foto_perfil = queryFoto;
    if (queryNombre) base.nombre_completo = queryNombre;
    return base;
  }

  // Consistent fallback for any other dynamic ID
  const names = [
    "Juan Carlos Pérez", "Laura Martínez", "Andrés Gómez", "Sara Castillo", 
    "Miguel Ángel Torres", "Daniela Ramírez", "Alejandra Vargas", "Sebastián Cardona"
  ];
  const photos = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&crop=face",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&crop=face"
  ];

  const index = Math.abs(id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % names.length;
  const name = queryNombre || names[index];
  const photo = queryFoto || photos[index % photos.length];

  return {
    id,
    nombre_completo: name,
    edad: "17 años",
    institucion: "Colegio Departamental de Santander",
    titulo_profesional: "Tutorías Académicas & Apoyo Escolar en Tareas",
    categoria: "Matemáticas & Ciencias",
    calificacion: 5.0,
    total_resenas: 30,
    tarifa: "$10/hr o Trueque de Guías",
    tarifa_hora: "$10.000 COP / hora",
    foto_perfil: photo,
    ciudad: "Piedecuesta / Bucaramanga, Santander",
    barrio: "Barrio San Carlos / Villanueva",
    distancia_km: "1.0 km de tu ubicación",
    modalidad: "Presencial a domicilio o virtual por Meet",
    bio: `¡Hola! Soy ${name}. Como estudiante, entiendo lo difícil que pueden llegar a ser algunas materias cuando el profesor va muy rápido. Te explico con calma, resolvemos ejercicios juntos y te paso resúmenes prácticos para que te vaya excelente en tus entregas y exámenes.`,
    telefono: "+57 315 780 4321",
    whatsapp: "573157804321",
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@classmarket.edu.co`,
    horario: "Lunes a Viernes de 2:00 PM a 6:30 PM",
    habilidades: ["Explicación Paso a Paso", "Resolución de Talleres", "Preparación de Exámenes", "Resúmenes Claros"],
    trabajos_realizados: [
      {
        titulo: "Taller Resuelto con Procedimiento Completo",
        materia: "Área Académica Principal",
        cliente: "Compañero de 10°",
        fecha: "Hace 3 días",
        calificacion: 5.0,
        comentario: "Súper recomendado, me ayudó a entregar a tiempo y todo estaba correcto."
      },
      {
        titulo: "Sesión de Repaso para Evaluación Final",
        materia: "Refuerzo Escolar",
        cliente: "Estudiante de Secundaria",
        fecha: "Hace 1 semana",
        calificacion: 4.9,
        comentario: "Explica con mucha paciencia y resuelve todas las dudas."
      }
    ],
    muestras_trabajo: [
      {
        titulo: "Guía Resuelta y Comentada",
        descripcion: "Ejercicios resueltos a mano con notas marginales para estudiar.",
        imagen: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
        categoria: "Guía Escolar"
      },
      {
        titulo: "Fórmulas y Conceptos Clave",
        descripcion: "Esquema sintético de repaso rápido antes del parcial.",
        imagen: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
        categoria: "Apuntes"
      }
    ]
  };
}

function ExpertProfileContent() {
  const router = useRouter();
  const routeParams = useParams();
  const searchParams = useSearchParams();
  
  const rawId = (routeParams?.id as string) || "e1";
  
  // Query parameters passed from the map pin, card or listing
  const queryFoto = searchParams.get("foto");
  const queryNombre = searchParams.get("nombre");
  const queryTitulo = searchParams.get("titulo");
  const queryTarifa = searchParams.get("tarifa");
  const queryCategoria = searchParams.get("categoria");

  // Synchronous initial state: ALWAYS retains the photo from the query or directory
  const [student, setStudent] = useState<StudentProfileData>(() => {
    const s = getStudentById(rawId, queryFoto, queryNombre);
    if (queryFoto) s.foto_perfil = queryFoto;
    if (queryNombre) s.nombre_completo = queryNombre;
    if (queryTitulo) s.titulo_profesional = queryTitulo;
    if (queryTarifa) s.tarifa = queryTarifa;
    if (queryCategoria) s.categoria = queryCategoria;
    return s;
  });

  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    // Whenever ID or query parameters change, strictly update
    const resolved = getStudentById(rawId, queryFoto, queryNombre);
    if (queryFoto) resolved.foto_perfil = queryFoto;
    if (queryNombre) resolved.nombre_completo = queryNombre;
    if (queryTitulo) resolved.titulo_profesional = queryTitulo;
    if (queryTarifa) resolved.tarifa = queryTarifa;
    if (queryCategoria) resolved.categoria = queryCategoria;
    
    setStudent(resolved);

    // Optional background sync with Supabase perfiles_profesionales
    const fetchFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from("perfiles_profesionales")
          .select("*")
          .eq("id", rawId)
          .maybeSingle();

        if (data && !error) {
          setStudent(prev => ({
            ...prev,
            nombre_completo: queryNombre || data.nombre_completo || prev.nombre_completo,
            titulo_profesional: queryTitulo || data.titulo_profesional || prev.titulo_profesional,
            // STRICT REQUIREMENT: Keep initial photo if provided via query, otherwise use DB or fallback
            foto_perfil: queryFoto || prev.foto_perfil || data.foto_perfil,
            tarifa: queryTarifa || data.tarifa || prev.tarifa,
            calificacion: data.calificacion || prev.calificacion,
            ciudad: data.ciudad || prev.ciudad,
          }));
        }
      } catch (err) {
        // Silent catch
      }
    };

    fetchFromSupabase();
  }, [rawId, queryFoto, queryNombre, queryTitulo, queryTarifa, queryCategoria]);

  const handleCopyPhone = () => {
    if (student.telefono) {
      navigator.clipboard.writeText(student.telefono);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hola ${student.nombre_completo}, vi tu perfil en ClassMarket y me interesa tu servicio de ${student.titulo_profesional}. ¿Podríamos coordinar una tutoría?`);
    window.open(`https://wa.me/${student.whatsapp}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B2545] font-sans pb-32">
      
      {/* ── Top Header Navigation ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0B2545]/10 px-4 md:px-8 py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-[#FAF8F5] hover:bg-[#0B2545]/10 border border-[#0B2545]/10 flex items-center justify-center text-[#0B2545] transition-all"
              title="Volver atrás"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider block">Perfil Estudiantil</span>
              <h1 className="text-base md:text-lg font-extrabold text-[#0B2545] leading-tight">
                {student.nombre_completo}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Perfil de ${student.nombre_completo} en ClassMarket`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Enlace copiado al portapapeles");
                }
              }}
              className="p-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#0B2545]/10 border border-[#0B2545]/10 text-[#0B2545] transition-all"
              title="Compartir perfil"
            >
              <Share2 size={18} />
            </button>
            <Link
              href="/mapa-expertos"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0B2545] text-white text-xs font-bold hover:bg-[#12335d] transition-all"
            >
              <MapPin size={14} className="text-[#C5A059]" />
              Ver en Mapa
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Container ─────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-6 space-y-6">
        
        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#0B2545]/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#C5A059]/10 via-[#0B2545]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
            {/* Avatar & Badges - MAINTAINS THE EXACT INITIAL IMAGE */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                <img
                  src={student.foto_perfil}
                  alt={student.nombre_completo}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 bg-[#0B2545] text-[#C5A059] p-2 rounded-full border-2 border-white shadow-md" title="Estudiante Verificado">
                <ShieldCheck size={18} />
              </div>
            </div>

            {/* Core Info */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0B2545] text-white">
                  {student.categoria}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C5A059]/20 text-[#0B2545] border border-[#C5A059]/40 flex items-center gap-1">
                  <Sparkles size={13} className="text-[#C5A059]" />
                  {student.edad}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  Perfil Verificado
                </span>
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B2545] tracking-tight">
                  {student.nombre_completo}
                </h1>
                <p className="text-sm font-semibold text-[#5C6B73] mt-0.5">
                  {student.institucion}
                </p>
                <p className="text-base font-medium text-[#0B2545] mt-1.5 leading-relaxed">
                  {student.titulo_profesional}
                </p>
              </div>

              {/* Location & Rating quick tags */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-sm text-[#5C6B73]">
                <div className="flex items-center gap-1.5 font-bold text-[#0B2545]">
                  <Star size={16} className="text-[#C5A059] fill-[#C5A059]" />
                  <span>{student.calificacion.toFixed(1)}</span>
                  <span className="text-[#5C6B73] font-normal">({student.total_resenas} reseñas)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-[#0B2545]" />
                  <span>{student.ciudad} • {student.distancia_km}</span>
                </div>
              </div>

              {/* Price / Exchange badge */}
              <div className="pt-2">
                <span className="inline-block px-4 py-2 rounded-2xl bg-[#FAF8F5] border border-[#C5A059]/30 text-sm font-extrabold text-[#0B2545]">
                  Tarifa: <span className="text-[#C5A059]">{student.tarifa}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick CTA Actions Row */}
          <div className="mt-8 pt-6 border-t border-[#0B2545]/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => router.push(`/chat/${student.id}?nombre=${encodeURIComponent(student.nombre_completo)}&servicio=${encodeURIComponent(student.titulo_profesional)}`)}
              className="w-full py-3 px-5 rounded-2xl bg-[#0B2545] hover:bg-[#12335d] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <MessageCircle size={18} className="text-[#C5A059]" />
              <span>Chatear en ClassMarket</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="w-full py-3 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <Phone size={18} />
              <span>Contactar por WhatsApp</span>
            </button>

            <button
              onClick={handleCopyPhone}
              className="w-full py-3 px-5 rounded-2xl bg-[#FAF8F5] hover:bg-slate-100 text-[#0B2545] border border-[#0B2545]/15 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Phone size={16} className="text-[#C5A059]" />
              <span>{copiedPhone ? "¡Número Copiado!" : student.telefono}</span>
            </button>
          </div>
        </div>

        {/* ── 2 Columns Grid: Left Details & Right Contact Card ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2 spans): Breve descripción, Dónde se encuentra, Trabajos realizados */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Breve Descripción */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#0B2545]/10 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#0B2545]/10">
                <BookOpen size={20} className="text-[#C5A059]" />
                <h2 className="text-lg md:text-xl font-bold text-[#0B2545]">Breve Descripción & Metodología</h2>
              </div>
              <p className="text-sm md:text-base text-[#5C6B73] leading-relaxed font-normal">
                {student.bio}
              </p>
              
              <div className="pt-2">
                <h3 className="text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-2">Habilidades & Temas que domina:</h3>
                <div className="flex flex-wrap gap-2">
                  {student.habilidades.map((hab, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] text-[#0B2545] border border-[#C5A059]/30 text-xs font-bold flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={13} className="text-[#C5A059]" />
                      {hab}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Dónde se encuentra (Ubicación detallada) */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#0B2545]/10 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#0B2545]/10">
                <MapPin size={20} className="text-[#0B2545]" />
                <h2 className="text-lg md:text-xl font-bold text-[#0B2545]">Dónde Se Encuentra</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#0B2545]/10">
                  <span className="text-xs font-bold text-[#5C6B73] uppercase tracking-wider block">Ciudad & Barrio</span>
                  <p className="text-sm font-extrabold text-[#0B2545] mt-1">{student.ciudad}</p>
                  <p className="text-xs text-[#5C6B73] mt-0.5">{student.barrio}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#0B2545]/10">
                  <span className="text-xs font-bold text-[#5C6B73] uppercase tracking-wider block">Modalidad de Enseñanza</span>
                  <p className="text-sm font-extrabold text-[#0B2545] mt-1">{student.modalidad}</p>
                  <p className="text-xs text-[#5C6B73] mt-0.5">Distancia aproximada: {student.distancia_km}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0B2545]/5 border border-[#C5A059]/30 text-xs text-[#0B2545]">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#C5A059] shrink-0" />
                  <span>Disponible para puntos de encuentro en colegios, bibliotecas públicas o domicilios en Santander.</span>
                </div>
                <Link 
                  href="/mapa-expertos" 
                  className="font-bold underline text-[#0B2545] hover:text-[#C5A059] shrink-0 ml-3"
                >
                  Abrir Mapa
                </Link>
              </div>
            </section>

            {/* 3. Qué Trabajos Han Realizado (Historial Académico) */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#0B2545]/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#0B2545]/10">
                <div className="flex items-center gap-2.5">
                  <FileCheck size={20} className="text-[#C5A059]" />
                  <h2 className="text-lg md:text-xl font-bold text-[#0B2545]">Qué Trabajos Han Realizado</h2>
                </div>
                <span className="text-xs font-extrabold text-[#0B2545] px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#0B2545]/10">
                  {student.trabajos_realizados.length} tutorías verificadas
                </span>
              </div>

              <div className="space-y-4 pt-1">
                {student.trabajos_realizados.map((trabajo, index) => (
                  <div 
                    key={index} 
                    className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#0B2545]/10 hover:border-[#C5A059]/40 transition-colors space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-extrabold text-[#0B2545] text-sm md:text-base">
                        {trabajo.titulo}
                      </h4>
                      <div className="flex items-center gap-1 text-[#C5A059]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-[#C5A059]" />
                        ))}
                        <span className="text-xs font-bold text-[#0B2545] ml-1">5.0</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#5C6B73]">
                      <span className="font-bold text-[#0B2545]">{trabajo.materia}</span>
                      <span>•</span>
                      <span>{trabajo.cliente}</span>
                      <span>•</span>
                      <span>{trabajo.fecha}</span>
                    </div>

                    <p className="text-xs md:text-sm text-[#5C6B73] italic bg-white p-3 rounded-xl border border-gray-100">
                      "{trabajo.comentario}"
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Muestras de Guías & Portafolio */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#0B2545]/10 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#0B2545]/10">
                <Award size={20} className="text-[#C5A059]" />
                <h2 className="text-lg md:text-xl font-bold text-[#0B2545]">Muestras de Trabajos & Material Académico</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {student.muestras_trabajo.map((sample, idx) => (
                  <div 
                    key={idx} 
                    className="group rounded-2xl overflow-hidden border border-[#0B2545]/10 bg-[#FAF8F5] flex flex-col hover:shadow-md transition-all"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img 
                        src={sample.imagen} 
                        alt={sample.titulo} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0B2545]/90 text-white backdrop-blur-sm">
                        {sample.categoria}
                      </span>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-[#0B2545] leading-snug line-clamp-1">{sample.titulo}</h4>
                        <p className="text-xs text-[#5C6B73] mt-1 line-clamp-2">{sample.descripcion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column (1 span): Contact Card & Guarantee */}
          <div className="space-y-6">
            
            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#0B2545]/10 shadow-sm space-y-5 sticky top-24">
              <div className="pb-3 border-b border-[#0B2545]/10">
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider block">Contacto Directo</span>
                <h3 className="text-lg font-extrabold text-[#0B2545]">Cómo Contactarlo</h3>
              </div>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#0B2545]/10">
                  <Phone size={18} className="text-[#0B2545] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-[#5C6B73] block">WhatsApp / Teléfono</span>
                    <span className="font-bold text-[#0B2545] select-all">{student.telefono}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#0B2545]/10">
                  <Mail size={18} className="text-[#0B2545] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-[#5C6B73] block">Correo Estudiantil</span>
                    <span className="font-bold text-[#0B2545] text-xs break-all">{student.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#0B2545]/10">
                  <Clock size={18} className="text-[#0B2545] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-[#5C6B73] block">Horarios de Disponibilidad</span>
                    <span className="text-xs font-medium text-[#0B2545]">{student.horario}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => router.push(`/chat/${student.id}?nombre=${encodeURIComponent(student.nombre_completo)}&servicio=${encodeURIComponent(student.titulo_profesional)}`)}
                  className="w-full py-3 px-4 rounded-2xl bg-[#0B2545] hover:bg-[#12335d] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle size={16} className="text-[#C5A059]" />
                  <span>Enviar Mensaje Interno</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Phone size={16} />
                  <span>Abrir Chat de WhatsApp</span>
                </button>
              </div>

              {/* Safety badge */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#C5A059]/30 flex items-start gap-3 text-xs text-[#5C6B73]">
                <ShieldCheck size={20} className="text-[#C5A059] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-[#0B2545]">Garantía ClassMarket:</strong> El pago o trueque solo se libera cuando confirmes que la guía o tutoría fue completada con éxito.
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>

      <BottomNav />
    </div>
  );
}

export default function ExpertProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0B2545]/20 border-t-[#0B2545] rounded-full animate-spin" />
      </div>
    }>
      <ExpertProfileContent />
    </Suspense>
  );
}
